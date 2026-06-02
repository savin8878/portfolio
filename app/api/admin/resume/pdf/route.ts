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

    // A4 at 96dpi: 210mm = 794px, 297mm = 1123px. deviceScaleFactor 2 -> crisp text.
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 })

    const css = [
      "*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }",
      // PAGE GEOMETRY: horizontal margin 0 so full-bleed sidebars/headers reach
      // the paper edge; vertical margin gives CONTINUATION pages breathing room.
      // The FIRST page has zero margins on all sides so its printable area is the
      // full 297mm — this matches the .resume-page min-height floor exactly, so a
      // one-page resume fills exactly one sheet instead of spilling ~12mm onto a
      // near-empty second page. (Templates supply their own top padding.)
      "@page { size: 210mm 297mm; margin: 12mm 0 12mm 0; }",
      "@page :first { margin: 0; }",
      "html, body {",
      "  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;",
      "  background: #ffffff;",
      "  width: 210mm;",
      "  -webkit-print-color-adjust: exact !important;",
      "  print-color-adjust: exact !important;",
      "  color-adjust: exact !important;",
      "  -webkit-font-smoothing: antialiased;",
      "  -moz-osx-font-smoothing: grayscale;",
      "  text-rendering: geometricPrecision;",
      "}",
      "body { font-size: 12px; line-height: 1.5; color: #333; }",
      // Never strand a heading at the bottom of a page.
      "h1, h2, h3, h4, h5, h6 {",
      "  font-weight: 700;",
      "  break-after: avoid-page; page-break-after: avoid;",
      "  break-inside: avoid; page-break-inside: avoid;",
      "}",
      "h1 { font-size: 28px; } h2 { font-size: 14px; } h3 { font-size: 12px; }",
      "p { margin: 0; orphans: 3; widows: 3; }",
      "ul, ol { margin: 0; padding-left: 1.5em; }",
      // Individual bullet points must never split across pages.
      "li { margin: 0.25em 0; break-inside: avoid; page-break-inside: avoid; }",
      "a { text-decoration: none; color: inherit; }",
      // Resume page wrapper. Keep the 297mm floor so a one-page resume fills the
      // whole A4 sheet and sidebar backgrounds reach the bottom edge. This does
      // NOT force a blank second page - that was the old page-break-after rule.
      ".resume-page {",
      "  width: 210mm !important;",
      "  min-height: 297mm;",
      "  box-shadow: none !important;",
      "  border-radius: 0 !important;",
      "  margin: 0 !important;",
      "  overflow: visible !important;",
      "  padding: 0;",
      "}",
      // Print fidelity for colored / gradient / svg blocks.
      "svg, svg *, img, [style*='gradient'], [style*='background'] {",
      "  -webkit-print-color-adjust: exact !important;",
      "  print-color-adjust: exact !important;",
      "}",
      "img { image-rendering: -webkit-optimize-contrast; max-width: 100%; height: auto; }",
      "table { width: 100%; border-collapse: collapse; }",
      "td, th { padding: 0.25em 0.5em; text-align: left; }",
      // Local fallbacks for system fonts used by some templates.
      "@font-face { font-family: 'Courier New'; src: local('Courier New'); font-weight: normal; }",
      "@font-face { font-family: 'Calibri'; src: local('Calibri'); font-weight: normal; }",
      "@font-face { font-family: 'Georgia'; src: local('Georgia'); font-weight: normal; }",
    ].join("\n")

    const fontLink =
      "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Georgia:wght@400;700&family=Calibri:wght@400;700&family=Monaco&family=Courier+New:wght@400;700&display=swap"

    const fullHtml =
      "<!DOCTYPE html><html><head>" +
      '<meta charset="utf-8" />' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
      '<link rel="preconnect" href="https://fonts.googleapis.com" />' +
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />' +
      '<link href="' + fontLink + '" rel="stylesheet" />' +
      "<style>" + css + "</style>" +
      "</head><body>" + html + "</body></html>"

    await page.setContent(fullHtml, {
      waitUntil: "networkidle0",
      timeout: 30000,
    })

    // Make sure web fonts are fully loaded before measuring / painting.
    await page.evaluateHandle("document.fonts.ready")
    await new Promise((r) => setTimeout(r, 350))

    // DETERMINISTIC PAGE-BREAK PROTECTION
    // Instead of guessing break offsets and injecting spacers, we tell the
    // browser which blocks must stay whole. Any reasonably-sized block (an
    // experience entry, a project card, an education row, a skill group) is
    // kept intact, while large containers (whole sections, sidebars) are left
    // free to flow across pages - which is what prevents the big blank gaps.
    // Chrome's native paginator then does the rest, cleanly.
    await page.evaluate(() => {
      const PAGE_H = 1123 // 297mm @ 96dpi
      const MAX_ATOMIC = PAGE_H * 0.45 // a block that comfortably fits a page alone

      const candidates = document.querySelectorAll(
        ".resume-page div, .resume-page li, .resume-page tr, .resume-page section, .resume-page article"
      )

      candidates.forEach((node) => {
        const el = node as HTMLElement
        const h = el.getBoundingClientRect().height
        if (h > 0 && h <= MAX_ATOMIC) {
          el.style.breakInside = "avoid"
          el.style.pageBreakInside = "avoid"
        }
      })
    })

    await new Promise((r) => setTimeout(r, 150))

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      // Margins are governed entirely by the @page CSS rules above.
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
