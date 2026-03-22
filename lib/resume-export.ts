import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  TabStopPosition,
  TabStopType,
  Tab,
  ExternalHyperlink,
} from "docx"
import { saveAs } from "file-saver"
import type { ResumeConfig } from "@/components/admin/resume-builder"

/* ═══════════════════════════════════════════════
   SHARED HELPERS
   ═══════════════════════════════════════════════ */

function fmtDate(dateStr: string): string {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

function hexStr(hex: string): string {
  return hex.replace("#", "").padEnd(6, "0")
}

/* ═══════════════════════════════════════════════
   PDF EXPORT — Server-side Puppeteer rendering
   Sends HTML to API → Puppeteer renders exact CSS →
   Returns real PDF with selectable text.
   Direct download, no print dialog, pixel-perfect.
   ═══════════════════════════════════════════════ */

export async function downloadPDF(
  element: HTMLElement,
  fileName: string,
  _config?: ResumeConfig
): Promise<void> {
  const html = element.innerHTML

  const res = await fetch("/api/admin/resume/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html, fileName }),
  })

  if (!res.ok) {
    throw new Error(`PDF generation failed: ${res.statusText}`)
  }

  const blob = await res.blob()
  saveAs(blob, `${fileName}.pdf`)
}

/* ═══════════════════════════════════════════════
   DOCX EXPORT — structured Word document
   ═══════════════════════════════════════════════ */

export async function downloadDOCX(
  config: ResumeConfig,
  fileName: string
): Promise<void> {
  const accent = hexStr(config.accentColor)
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((p) => p.enabled)
  const pr = config.profile

  function heading(text: string): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({ text: text.toUpperCase(), bold: true, size: 22, color: accent, font: "Calibri" }),
      ],
      spacing: { before: 280, after: 80 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: accent } },
    })
  }

  function bullet(text: string): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({ text: "•  ", size: 20, font: "Calibri", color: accent }),
        new TextRun({ text, size: 20, font: "Calibri", color: "4b5563" }),
      ],
      spacing: { before: 30, after: 30 },
      indent: { left: 280 },
    })
  }

  function titleDateRow(leftRuns: TextRun[], dateText: string): Paragraph {
    const runs = [...leftRuns]
    if (dateText) {
      runs.push(
        new TextRun({ children: [new Tab()], font: "Calibri" }),
        new TextRun({ text: dateText, size: 18, font: "Calibri", color: "9ca3af" }),
      )
    }
    return new Paragraph({
      children: runs,
      spacing: { before: 140, after: 20 },
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    })
  }

  const children: Paragraph[] = []

  // Header
  children.push(new Paragraph({
    children: [new TextRun({ text: pr.fullName || "Your Name", bold: true, size: 40, font: "Calibri", color: "111827" })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 },
  }))

  if (pr.title) {
    children.push(new Paragraph({
      children: [new TextRun({ text: pr.title, size: 22, font: "Calibri", color: accent })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    }))
  }

  const contacts = [pr.email, pr.phone, pr.location, pr.website, pr.linkedin, pr.github].filter(Boolean)
  if (contacts.length > 0) {
    children.push(new Paragraph({
      children: contacts.flatMap((c, i) => {
        const runs: TextRun[] = [new TextRun({ text: c, size: 17, font: "Calibri", color: "6b7280" })]
        if (i < contacts.length - 1) runs.push(new TextRun({ text: "  •  ", size: 17, font: "Calibri", color: "d1d5db" }))
        return runs
      }),
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: accent } },
    }))
  }

  // Summary
  if (pr.summary) {
    children.push(heading("Professional Summary"))
    children.push(new Paragraph({
      children: [new TextRun({ text: pr.summary, size: 20, font: "Calibri", color: "374151" })],
      spacing: { after: 80 },
    }))
  }

  // Experience
  if (enabledExp.length > 0) {
    children.push(heading("Work Experience"))
    for (const exp of enabledExp) {
      const dateStr = `${fmtDate(exp.startDate)}${(exp.endDate || exp.isCurrent) ? ` – ${exp.isCurrent ? "Present" : fmtDate(exp.endDate)}` : ""}`
      children.push(titleDateRow([
        new TextRun({ text: exp.title, bold: true, size: 21, font: "Calibri", color: "111827" }),
        ...(exp.company ? [new TextRun({ text: ` — ${exp.company}`, size: 21, font: "Calibri", color: accent })] : []),
      ], dateStr))
      if (exp.location) {
        children.push(new Paragraph({
          children: [new TextRun({ text: exp.location, size: 17, font: "Calibri", color: "9ca3af", italics: true })],
          spacing: { after: 30 },
        }))
      }
      if (exp.description) {
        children.push(new Paragraph({
          children: [new TextRun({ text: exp.description, size: 20, font: "Calibri", color: "4b5563" })],
          spacing: { after: 30 },
        }))
      }
      for (const a of exp.achievements) children.push(bullet(a))
    }
  }

  // Education
  if (enabledEdu.length > 0) {
    children.push(heading("Education"))
    for (const edu of enabledEdu) {
      const dateStr = `${fmtDate(edu.startDate)}${edu.endDate ? ` – ${fmtDate(edu.endDate)}` : ""}`
      children.push(titleDateRow([
        new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`, bold: true, size: 21, font: "Calibri", color: "111827" }),
      ], dateStr))
      children.push(new Paragraph({
        children: [new TextRun({ text: edu.institution, size: 19, font: "Calibri", color: accent })],
        spacing: { after: 30 },
      }))
      if (edu.achievements) for (const a of edu.achievements) children.push(bullet(a))
    }
  }

  // Skills
  if (config.skillCategories.length > 0) {
    children.push(heading("Skills"))
    for (const cat of config.skillCategories) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `${cat.name}: `, bold: true, size: 20, font: "Calibri", color: "111827" }),
          new TextRun({ text: cat.skills.join(", "), size: 20, font: "Calibri", color: "4b5563" }),
        ],
        spacing: { before: 40, after: 40 },
      }))
    }
  }

  // Projects
  if (enabledProjects.length > 0) {
    children.push(heading("Projects"))
    for (const proj of enabledProjects) {
      const projTitleChildren: (TextRun | ExternalHyperlink)[] = [
        new TextRun({ text: proj.title, bold: true, size: 21, font: "Calibri", color: "111827" }),
      ]
      if (proj.url) {
        const href = proj.url.startsWith("http") ? proj.url : `https://${proj.url}`
        projTitleChildren.push(
          new TextRun({ text: "  ", size: 17, font: "Calibri" }),
          new ExternalHyperlink({ children: [new TextRun({ text: proj.url.replace(/^https?:\/\//, ""), size: 17, font: "Calibri", color: accent, underline: {} })], link: href })
        )
      }
      children.push(new Paragraph({
        children: projTitleChildren,
        spacing: { before: 100, after: 20 },
      }))
      if (proj.description) {
        children.push(new Paragraph({
          children: [new TextRun({ text: proj.description, size: 20, font: "Calibri", color: "4b5563" })],
          spacing: { after: 20 },
        }))
      }
      if (proj.techStack.length > 0) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: "Tech: ", bold: true, size: 17, font: "Calibri", color: accent }),
            new TextRun({ text: proj.techStack.join(" · "), size: 17, font: "Calibri", color: "6b7280" }),
          ],
          spacing: { after: 40 },
        }))
      }
    }
  }

  // Certifications
  if (enabledCerts.length > 0) {
    children.push(heading("Certifications"))
    for (const cert of enabledCerts) {
      children.push(titleDateRow([
        new TextRun({ text: cert.name, bold: true, size: 20, font: "Calibri", color: "111827" }),
        ...(cert.issuer ? [new TextRun({ text: ` — ${cert.issuer}`, size: 20, font: "Calibri", color: "6b7280" })] : []),
      ], cert.date ? fmtDate(cert.date) : ""))
    }
  }

  // Custom Sections
  for (const cs of config.customSections) {
    children.push(heading(cs.title))
    for (const item of cs.items) children.push(bullet(item.content))
  }

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 20 } },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 680, right: 800, bottom: 680, left: 800 },
        },
      },
      children,
    }],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `${fileName}.docx`)
}
