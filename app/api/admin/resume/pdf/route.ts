import { NextResponse } from "next/server"
import puppeteer from "puppeteer"

export async function POST(request: Request) {
  let browser = null
  try {
    const { html, fileName } = await request.json()

    if (!html) {
      return NextResponse.json({ error: "HTML content is required" }, { status: 400 })
    }

    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=none",
      ],
    })

    const page = await browser.newPage()

    // A4 at 96dpi: 210mm=794px, 297mm=1123px
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 })

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Georgia&display=swap" rel="stylesheet" />
<style>
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

@page {
  size: 210mm 297mm;
  margin: 0;
}

html, body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: white;
  margin: 0;
  padding: 0;
  width: 210mm;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}

.resume-page {
  width: 210mm !important;
  min-height: 297mm;
  box-shadow: none !important;
  border-radius: 0 !important;
  margin: 0 !important;
  overflow: visible !important;
}

/* ── MULTI-PAGE ── */
.resume-page div[style*="marginBottom"] {
  page-break-inside: avoid;
  break-inside: avoid;
}

h1, h2, h3, h4, h5, h6 {
  page-break-after: avoid;
  break-after: avoid;
}

li {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* ── SIDEBAR FIXES ── */
.resume-page > div[style*="display: flex"],
.resume-page > div[style*="display:flex"] {
  min-height: auto !important;
  height: auto !important;
}

.resume-page > div[style*="display: flex"] > div:first-child,
.resume-page > div[style*="display:flex"] > div:first-child {
  min-height: auto !important;
  height: auto !important;
}

.resume-page > div[style*="display: flex"] > div:last-child,
.resume-page > div[style*="display:flex"] > div:last-child {
  break-inside: auto;
  min-height: auto !important;
}

/* ── PAGE-TOP SPACER (injected by JS at page-break boundaries) ── */
.pdf-page-spacer {
  height: 12mm;
  width: 100%;
  page-break-before: always;
  break-before: always;
}

/* ── VISUAL ── */
svg {
  print-color-adjust: exact !important;
  -webkit-print-color-adjust: exact !important;
}

img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
</head>
<body>${html}</body>
</html>`

    await page.setContent(fullHtml, {
      waitUntil: "networkidle0",
      timeout: 30000,
    })

    await page.evaluateHandle("document.fonts.ready")
    await new Promise((r) => setTimeout(r, 500))

    // Inject spacer divs at page-break boundaries.
    // This finds all direct children of the main content area
    // and inserts a spacer + page-break before elements that
    // would cross a page boundary (every 297mm = 1123px).
    await page.evaluate(() => {
      const PAGE_H = 1123 // 297mm in px at 96dpi
      const SPACER_H = 45 // ~12mm padding

      // Find the main content container (inside .resume-page)
      const resumePage = document.querySelector('.resume-page')
      if (!resumePage) return

      // For single-column templates: direct children of resume-page's padding div
      // For sidebar templates: children of the main (last) flex column
      let contentContainer: Element | null = null

      const flexContainer = resumePage.querySelector('[style*="display: flex"], [style*="display:flex"]')
      if (flexContainer) {
        // Sidebar template — get the main content column (last child)
        contentContainer = flexContainer.lastElementChild
      } else {
        // Single-column — direct child div of resume-page
        contentContainer = resumePage
      }

      if (!contentContainer) return

      // Walk through all section-level children and find ones crossing page boundaries
      const children = Array.from(contentContainer.children) as HTMLElement[]
      let inserted = 0

      for (let i = 1; i < children.length; i++) {
        const child = children[i]
        const rect = child.getBoundingClientRect()
        const topOnPage = (rect.top + inserted * SPACER_H) % PAGE_H

        // If this element starts in the last 60px of a page or wraps around,
        // insert a page-break spacer before it
        if (topOnPage > PAGE_H - 60 || (topOnPage < SPACER_H && rect.top > PAGE_H)) {
          const spacer = document.createElement('div')
          spacer.className = 'pdf-page-spacer'
          child.parentNode?.insertBefore(spacer, child)
          inserted++
        }
      }

      // Simpler approach if no good break points found:
      // Just ensure there's a consistent spacer after the first page of content
      if (inserted === 0 && resumePage.scrollHeight > PAGE_H) {
        // Find the child that crosses the page boundary
        const allBlocks = Array.from(contentContainer.querySelectorAll(':scope > div')) as HTMLElement[]
        for (const block of allBlocks) {
          const rect = block.getBoundingClientRect()
          if (rect.bottom > PAGE_H && rect.top < PAGE_H) {
            // This block crosses the page boundary
            // Insert spacer before the next sibling
            const next = block.nextElementSibling
            if (next) {
              const spacer = document.createElement('div')
              spacer.className = 'pdf-page-spacer'
              next.parentNode?.insertBefore(spacer, next)
            }
            break
          }
        }
      }
    })

    // Small wait after DOM modification
    await new Promise((r) => setTimeout(r, 300))

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
      preferCSSPageSize: true,
      tagged: true,
    })

    await browser.close()
    browser = null

    const safeName = (fileName || "resume").replace(/[^a-zA-Z0-9_\- ]/g, "")

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}.pdf"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    if (browser) {
      try { await browser.close() } catch {}
    }
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    )
  }
}
