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
   ATS-OPTIMIZED PDF EXPORT
   A separate, deliberately plain rendering for job-board
   Applicant Tracking Systems. Built directly from `config`
   (NOT from the styled preview DOM) so parsers extract 100%
   of the text in the right order:
     • single column (no multi-column / grid)
     • standard section headings (Work Experience, Skills, …)
     • real <ul>/<li> bullets, no drop caps, no icons
     • no masthead / running header / footer
     • all user content HTML-escaped so &, <, > can't break it
   Reuses the same Puppeteer route → real selectable text.
   ═══════════════════════════════════════════════ */

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

export function buildAtsResumeHtml(config: ResumeConfig): string {
  const pr = config.profile
  const accent = config.accentColor || "#1f2937"
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((p) => p.enabled)

  const range = (start: string, end?: string, current?: boolean): string => {
    const s = fmtDate(start)
    const e = current ? "Present" : fmtDate(end || "")
    return s && e ? `${s} – ${e}` : s
  }

  const heading = (text: string): string =>
    `<h2 style="font-size:13px;font-weight:700;color:${esc(accent)};text-transform:uppercase;letter-spacing:0.5px;margin:16px 0 6px;padding-bottom:3px;border-bottom:1px solid ${esc(accent)};">${esc(text)}</h2>`

  const bullets = (items?: string[]): string =>
    items && items.length
      ? `<ul style="margin:4px 0 0;padding-left:18px;">${items
          .map((a) => `<li style="margin:0 0 3px;line-height:1.45;">${esc(a)}</li>`)
          .join("")}</ul>`
      : ""

  const renderers: Record<string, () => string> = {
    summary: () =>
      pr.summary
        ? heading("Professional Summary") +
          `<p style="margin:0;line-height:1.5;">${esc(pr.summary)}</p>`
        : "",
    experience: () =>
      enabledExp.length
        ? heading("Work Experience") +
          enabledExp
            .map((exp) => {
              const meta = [range(exp.startDate, exp.endDate, exp.isCurrent), exp.location]
                .filter(Boolean)
                .join("  |  ")
              return `<div style="margin:0 0 10px;">` +
                `<div style="font-size:12.5px;"><strong>${esc(exp.title)}</strong>${exp.company ? ` — ${esc(exp.company)}` : ""}</div>` +
                (meta ? `<div style="font-size:10.5px;color:#6b7280;margin:1px 0 2px;">${esc(meta)}</div>` : "") +
                (exp.description ? `<div style="line-height:1.45;">${esc(exp.description)}</div>` : "") +
                bullets(exp.achievements) +
                `</div>`
            })
            .join("")
        : "",
    education: () =>
      enabledEdu.length
        ? heading("Education") +
          enabledEdu
            .map((edu) => {
              const d = range(edu.startDate, edu.endDate)
              return `<div style="margin:0 0 8px;">` +
                `<div style="font-size:12.5px;"><strong>${esc(edu.degree)}${edu.field ? ` in ${esc(edu.field)}` : ""}</strong></div>` +
                `<div style="font-size:11px;color:#374151;">${esc(edu.institution)}${d ? `  |  ${esc(d)}` : ""}</div>` +
                bullets(edu.achievements) +
                `</div>`
            })
            .join("")
        : "",
    skills: () =>
      config.skillCategories.length
        ? heading("Skills") +
          config.skillCategories
            .map(
              (cat) =>
                `<div style="margin:0 0 4px;line-height:1.5;"><strong>${esc(cat.name)}:</strong> ${esc(cat.skills.join(", "))}</div>`
            )
            .join("")
        : "",
    projects: () =>
      enabledProjects.length
        ? heading("Projects") +
          enabledProjects
            .map((proj) => {
              // Clickable placeholder labels — the raw URL is never printed,
              // only embedded in the href so the link stays clickable.
              const abs = (u: string) => (u.startsWith("http") ? u : `https://${u}`)
              const link = (u: string, text: string) =>
                `<a href="${esc(abs(u))}" style="color:${esc(accent)};font-weight:600;text-decoration:none;">${esc(text)}</a>`
              const links = [
                proj.url ? link(proj.url, "Live Demo") : "",
                proj.repoUrl ? link(proj.repoUrl, "GitHub") : "",
              ]
                .filter(Boolean)
                .join("  •  ")
              return `<div style="margin:0 0 9px;">` +
                `<div style="font-size:12.5px;"><strong>${esc(proj.title)}</strong>${proj.role ? ` — ${esc(proj.role)}` : ""}${links ? `  <span style="font-size:11px;">${links}</span>` : ""}</div>` +
                (proj.description ? `<div style="line-height:1.45;">${esc(proj.description)}</div>` : "") +
                bullets(proj.achievements) +
                (proj.techStack && proj.techStack.length
                  ? `<div style="font-size:11px;color:#6b7280;margin-top:2px;"><strong>Tech:</strong> ${esc(proj.techStack.join(", "))}</div>`
                  : "") +
                `</div>`
            })
            .join("")
        : "",
    certifications: () =>
      enabledCerts.length
        ? heading("Certifications") +
          enabledCerts
            .map(
              (cert) =>
                `<div style="margin:0 0 4px;">${esc(cert.name)}${cert.issuer ? ` — ${esc(cert.issuer)}` : ""}${cert.date ? `  |  ${esc(fmtDate(cert.date))}` : ""}</div>`
            )
            .join("")
        : "",
    custom: () =>
      config.customSections.length
        ? config.customSections
            .map((cs) => heading(cs.title) + bullets(cs.items.map((it) => it.content)))
            .join("")
        : "",
  }

  const order =
    config.sectionOrder && config.sectionOrder.length
      ? config.sectionOrder
      : ["summary", "experience", "education", "skills", "projects", "certifications", "custom"]
  const sections = order.map((s) => (renderers[s] ? renderers[s]() : "")).join("")

  const contacts = [pr.email, pr.phone, pr.location, pr.website, pr.linkedin, pr.github]
    .filter(Boolean)
    .map((c) => esc(c))
    .join("  |  ")

  return (
    `<div class="resume-page" style="padding:48px 56px;font-family:Arial,'Inter',sans-serif;color:#1f2937;font-size:12px;line-height:1.5;">` +
    `<h1 style="font-size:24px;font-weight:700;margin:0;color:#111827;">${esc(pr.fullName || "Your Name")}</h1>` +
    (pr.title ? `<div style="font-size:13px;color:${esc(accent)};font-weight:600;margin:2px 0 0;">${esc(pr.title)}</div>` : "") +
    (contacts ? `<div style="font-size:11px;color:#4b5563;margin:6px 0 2px;">${contacts}</div>` : "") +
    `<div style="border-bottom:2px solid ${esc(accent)};margin-top:6px;"></div>` +
    sections +
    `</div>`
  )
}

export async function downloadAtsPDF(config: ResumeConfig, fileName: string): Promise<void> {
  const html = buildAtsResumeHtml(config)

  const res = await fetch("/api/admin/resume/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html, fileName }),
  })

  if (!res.ok) {
    throw new Error(`ATS PDF generation failed: ${res.statusText}`)
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
