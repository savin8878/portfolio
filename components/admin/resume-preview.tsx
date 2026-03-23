"use client"

import type { ResumeConfig } from "./resume-builder"

/* ─────────────────────────────────────────────
   UTILITY HELPERS
   ───────────────────────────────────────────── */

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

function getFontSize(size: string) {
  switch (size) {
    case "small":
      return { body: "11.5px", h1: "22px", h2: "12.5px", h3: "11.5px", small: "9.5px" }
    case "large":
      return { body: "14px", h1: "28px", h2: "15.5px", h3: "13.5px", small: "11.5px" }
    default:
      return { body: "12.5px", h1: "25px", h2: "13.5px", h3: "12.5px", small: "10.5px" }
  }
}

/* ─────────────────────────────────────────────
   INLINE SVG ICONS (print-safe, no external deps)
   All icons are 16×16 by default, colored via fill/stroke props
   ───────────────────────────────────────────── */

const s = 14 // default icon size
const sw = 1.8 // stroke width

function IconMail({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function IconPhone({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function IconMapPin({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconGlobe({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )
}

function IconLinkedin({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function IconGithub({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function IconBriefcase({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

function IconGradCap({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
    </svg>
  )
}

function IconAward({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  )
}

function IconCode({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function IconStar({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconUser({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconFolder({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  )
}

function IconLayers({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
    </svg>
  )
}

function IconHeart({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

function IconShield({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function IconTarget({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function IconCalendar({ color = "currentColor", size = s }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}

/* ─────────────────────────────────────────────
   CONTACT ITEM RENDERER (icon + text)
   ───────────────────────────────────────────── */

function contactIcon(type: string, color: string, sz = 12) {
  switch (type) {
    case "email": return <IconMail color={color} size={sz} />
    case "phone": return <IconPhone color={color} size={sz} />
    case "location": return <IconMapPin color={color} size={sz} />
    case "website": return <IconGlobe color={color} size={sz} />
    case "linkedin": return <IconLinkedin color={color} size={sz} />
    case "github": return <IconGithub color={color} size={sz} />
    default: return null
  }
}

function getContactItems(p: ResumeConfig["profile"]) {
  return [
    { type: "email", value: p.email },
    { type: "phone", value: p.phone },
    { type: "location", value: p.location },
    { type: "website", value: p.website },
    { type: "linkedin", value: p.linkedin },
    { type: "github", value: p.github },
  ].filter((c) => c.value)
}

// Generate href for contact types
function contactHref(type: string, value: string): string | undefined {
  if (!value) return undefined
  switch (type) {
    case "email": return `mailto:${value}`
    case "phone": return `tel:${value.replace(/\s/g, "")}`
    case "website": return value.startsWith("http") ? value : `https://${value}`
    case "linkedin": return value.startsWith("http") ? value : `https://${value}`
    case "github": return value.startsWith("http") ? value : `https://${value}`
    default: return undefined
  }
}

// Linkable text — renders as <a> if href exists, else <span>
function LinkText({ href, children, style }: { href?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit", ...style }}>{children}</a>
  }
  return <span style={style}>{children}</span>
}

// URL text — renders a clickable link with accent color
function UrlLink({ url, color, fontSize }: { url: string; color: string; fontSize: string }) {
  if (!url) return null
  const href = url.startsWith("http") ? url : `https://${url}`
  const display = url.replace(/^https?:\/\//, "").replace(/\/$/, "")
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize, color, textDecoration: "none", fontWeight: 500 }}>
      {display}
    </a>
  )
}


/* ─────────────────────────────────────────────
   SHARED STYLED COMPONENTS
   ───────────────────────────────────────────── */

const PAGE_BASE: React.CSSProperties = {
  width: "210mm",
  minHeight: "297mm",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  backgroundColor: "white",
  color: "#1f2937",
  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
  borderRadius: "4px",
  margin: "0 auto",
  lineHeight: 1.5,
}

/* ═══════════════════════════════════════════════
   1. CLASSIC TEMPLATE
   Traditional centered header, clean sections with icon + colored underline
   ═══════════════════════════════════════════════ */
function ClassicTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)

  function SectionHead({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", borderRadius: "50%", backgroundColor: `${accent}12`, flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ fontSize: fs.h2, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "1.5px" }}>{title}</div>
        <div style={{ flex: 1, height: "2px", background: `linear-gradient(90deg, ${accent}, ${accent}20)` }} />
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <div key="summary" style={{ marginBottom: "18px" }}>
          <SectionHead icon={<IconUser color={accent} size={13} />} title="Professional Summary" />
          <p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#374151", paddingLeft: "32px" }}>{p.summary}</p>
        </div>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <div key="experience" style={{ marginBottom: "18px" }}>
          <SectionHead icon={<IconBriefcase color={accent} size={13} />} title="Work Experience" />
          {enabledExp.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "14px", paddingLeft: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</span>
                  {exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 500 }}> — {exp.company}</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                  <IconCalendar color="#9ca3af" size={10} />
                  <span style={{ fontSize: fs.small, color: "#9ca3af" }}>
                    {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                  </span>
                </div>
              </div>
              {exp.location && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "1px" }}>
                  <IconMapPin color="#9ca3af" size={10} />
                  <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{exp.location}</span>
                </div>
              )}
              {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.6 }}>{exp.description}</p>}
              {exp.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
                  {exp.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <div key="education" style={{ marginBottom: "18px" }}>
          <SectionHead icon={<IconGradCap color={accent} size={13} />} title="Education" />
          {enabledEdu.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "10px", paddingLeft: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>
                  {edu.degree}{edu.field && ` in ${edu.field}`}
                </span>
                <span style={{ fontSize: fs.small, color: "#9ca3af" }}>
                  {formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}
                </span>
              </div>
              <div style={{ fontSize: fs.body, color: "#6b7280", marginTop: "1px" }}>{edu.institution}</div>
              {edu.achievements && edu.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                  {edu.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <div key="skills" style={{ marginBottom: "18px" }}>
          <SectionHead icon={<IconLayers color={accent} size={13} />} title="Technical Skills" />
          <div style={{ paddingLeft: "32px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {config.skillCategories.map((cat) => (
              <div key={cat.id} style={{ display: "flex", gap: "8px", fontSize: fs.body }}>
                <span style={{ fontWeight: 600, color: "#111827", minWidth: "110px" }}>{cat.name}:</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {cat.skills.map((skill, i) => (
                    <span key={i} style={{ fontSize: fs.small, padding: "1px 8px", borderRadius: "4px", backgroundColor: `${accent}10`, color: accent, fontWeight: 500 }}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <div key="projects" style={{ marginBottom: "18px" }}>
          <SectionHead icon={<IconFolder color={accent} size={13} />} title="Key Projects" />
          {enabledProjects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "14px", paddingLeft: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</span>
                  {proj.role && <span style={{ fontSize: fs.body, color: accent, fontWeight: 500 }}> — {proj.role}</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                  {(proj.startDate || proj.endDate || proj.isCurrent) && (
                    <span style={{ fontSize: fs.small, color: "#9ca3af" }}>
                      {formatDisplayDate(proj.startDate)}{(proj.endDate || proj.isCurrent) && ` – ${proj.isCurrent ? "Present" : formatDisplayDate(proj.endDate)}`}
                    </span>
                  )}
                </div>
              </div>
              {(proj.url || proj.repoUrl) && (
                <div style={{ display: "flex", gap: "10px", marginTop: "2px" }}>
                  {proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}
                  {proj.repoUrl && <UrlLink url={proj.repoUrl} color="#6b7280" fontSize={fs.small} />}
                </div>
              )}
              {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.5 }}>{proj.description}</p>}
              {proj.achievements && proj.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
                  {proj.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
              {proj.techStack.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                  {proj.techStack.map((t, i) => (
                    <span key={i} style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "3px", border: `1px solid ${accent}30`, color: accent, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <div key="certifications" style={{ marginBottom: "18px" }}>
          <SectionHead icon={<IconAward color={accent} size={13} />} title="Certifications" />
          <div style={{ paddingLeft: "32px", display: "flex", flexDirection: "column", gap: "5px" }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>{cert.name}</span>
                  {cert.issuer && <span style={{ fontSize: fs.body, color: "#6b7280" }}> — {cert.issuer}</span>}
                </div>
                {cert.date && <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{formatDisplayDate(cert.date)}</span>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <div key={section.id} style={{ marginBottom: "18px" }}>
              <SectionHead icon={<IconStar color={accent} size={13} />} title={section.title} />
              <ul style={{ listStyle: "none", padding: 0, margin: 0, paddingLeft: "32px" }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                    {item.content}
                  </li>
                ))}
              </ul>
            </div>
          ))
        : null,
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: `${config.pagePadding ?? 32}px ${(config.pagePadding ?? 32) + 6}px` }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {config.showProfileImage && p.profileImage && (
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: `3px solid ${accent}`, margin: "0 auto 10px", overflow: "hidden" }}>
            <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <h1 style={{ fontSize: fs.h1, fontWeight: 800, letterSpacing: "-0.5px", color: "#111827", margin: 0, lineHeight: 1.2 }}>
          {p.fullName || "Your Name"}
        </h1>
        {p.title && (
          <div style={{ fontSize: fs.h2, color: accent, fontWeight: 500, marginTop: "4px", letterSpacing: "0.5px" }}>{p.title}</div>
        )}
        {contacts.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px 16px", marginTop: "10px" }}>
            {contacts.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: fs.small, color: "#6b7280" }}>
                {contactIcon(c.type, accent, 11)}
                <LinkText href={contactHref(c.type, c.value)}>{c.value}</LinkText>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ height: "2px", background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, marginBottom: "18px" }} />

      {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   2. MODERN TEMPLATE (Sidebar)
   Accent-colored sidebar with icons, main content with timeline dots
   ═══════════════════════════════════════════════ */
function ModernTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)

  function SidebarSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
          {icon}
          <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", opacity: 0.85, fontWeight: 600 }}>{title}</div>
        </div>
        {children}
      </div>
    )
  }

  function MainSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "6px", backgroundColor: `${accent}12` }}>
            {icon}
          </div>
          <div style={{ fontSize: fs.h2, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "1.5px" }}>{title}</div>
          <div style={{ flex: 1, height: "1px", backgroundColor: `${accent}20` }} />
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: `${config.sidebarWidth ?? 220}px`, minWidth: `${config.sidebarWidth ?? 220}px`, backgroundColor: accent, color: "white", padding: "0", display: "flex", flexDirection: "column" }}>
        {/* Profile */}
        <div style={{ padding: "28px 20px 20px", textAlign: "center" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "76px", height: "76px", borderRadius: "50%", border: "3px solid rgba(255,255,255,0.3)", margin: "0 auto 12px", overflow: "hidden" }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <h1 style={{ fontSize: "17px", fontWeight: 800, margin: 0, lineHeight: 1.2 }}>{p.fullName || "Your Name"}</h1>
          {p.title && <div style={{ fontSize: fs.small, opacity: 0.85, marginTop: "4px" }}>{p.title}</div>}
        </div>

        <div style={{ width: "70%", height: "1px", backgroundColor: "rgba(255,255,255,0.2)", margin: "0 auto" }} />

        <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Contact */}
          <SidebarSection icon={<IconPhone color="rgba(255,255,255,0.8)" size={12} />} title="Contact">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {contacts.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: fs.small }}>
                  {contactIcon(c.type, "rgba(255,255,255,0.7)", 11)}
                  <LinkText href={contactHref(c.type, c.value)} style={{ wordBreak: "break-all", opacity: 0.9 }}>{c.value}</LinkText>
                </div>
              ))}
            </div>
          </SidebarSection>

          {/* Skills */}
          {config.skillCategories.length > 0 && (
            <SidebarSection icon={<IconLayers color="rgba(255,255,255,0.8)" size={12} />} title="Skills">
              {config.skillCategories.map((cat) => (
                <div key={cat.id} style={{ marginBottom: "10px" }}>
                  <div style={{ fontSize: fs.small, fontWeight: 600, marginBottom: "4px" }}>{cat.name}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {cat.skills.map((skill, i) => (
                      <span key={i} style={{ fontSize: "9.5px", backgroundColor: "rgba(255,255,255,0.15)", padding: "2px 8px", borderRadius: "10px" }}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </SidebarSection>
          )}

          {/* Certifications */}
          {enabledCerts.length > 0 && (
            <SidebarSection icon={<IconAward color="rgba(255,255,255,0.8)" size={12} />} title="Certifications">
              {enabledCerts.map((cert) => (
                <div key={cert.id} style={{ marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "5px" }}>
                    <IconShield color="rgba(255,255,255,0.5)" size={10} />
                    <div>
                      <div style={{ fontSize: fs.small, fontWeight: 600 }}>{cert.name}</div>
                      <div style={{ fontSize: "9.5px", opacity: 0.7 }}>{cert.issuer}{cert.date && ` · ${formatDisplayDate(cert.date)}`}</div>
                    </div>
                  </div>
                </div>
              ))}
            </SidebarSection>
          )}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: `${config.pagePadding ?? 28}px` }}>
        {(() => {
          const sectionRenderers: Record<string, () => React.ReactNode> = {
            summary: () =>
              p.summary ? (
                <MainSection key="summary" icon={<IconUser color={accent} size={14} />} title="About Me">
                  <p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#374151" }}>{p.summary}</p>
                </MainSection>
              ) : null,

            experience: () =>
              enabledExp.length > 0 ? (
                <MainSection key="experience" icon={<IconBriefcase color={accent} size={14} />} title="Experience">
                  {enabledExp.map((exp, idx) => (
                    <div key={exp.id} style={{ marginBottom: "14px", position: "relative", paddingLeft: "18px" }}>
                      {/* Timeline dot + line */}
                      <div style={{ position: "absolute", left: 0, top: "5px", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: accent, border: "2px solid white", boxShadow: `0 0 0 1px ${accent}40` }} />
                      {idx < enabledExp.length - 1 && (
                        <div style={{ position: "absolute", left: "3px", top: "14px", width: "2px", bottom: "-8px", backgroundColor: `${accent}20` }} />
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</span>
                        <span style={{ fontSize: fs.small, color: "#9ca3af", whiteSpace: "nowrap" }}>
                          {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                        </span>
                      </div>
                      <div style={{ fontSize: fs.body, color: accent, fontWeight: 500 }}>
                        {exp.company}{exp.location && <span style={{ color: "#9ca3af", fontWeight: 400 }}> · {exp.location}</span>}
                      </div>
                      {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.55 }}>{exp.description}</p>}
                      {exp.achievements.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
                          {exp.achievements.map((a, i) => (
                            <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.55, paddingLeft: "12px", position: "relative" }}>
                              <span style={{ position: "absolute", left: 0, top: "7px", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: accent }} />
                              {a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </MainSection>
              ) : null,

            education: () =>
              enabledEdu.length > 0 ? (
                <MainSection key="education" icon={<IconGradCap color={accent} size={14} />} title="Education">
                  {enabledEdu.map((edu) => (
                    <div key={edu.id} style={{ marginBottom: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                        <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}</span>
                      </div>
                      <div style={{ fontSize: fs.body, color: "#6b7280" }}>{edu.institution}</div>
                    </div>
                  ))}
                </MainSection>
              ) : null,

            skills: () => null,

            projects: () =>
              enabledProjects.length > 0 ? (
                <MainSection key="projects" icon={<IconFolder color={accent} size={14} />} title="Projects">
                  {enabledProjects.map((proj) => (
                    <div key={proj.id} style={{ marginBottom: "10px" }}>
                      <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</span>
                      {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "2px", lineHeight: 1.5 }}>{proj.description}</p>}
                      {proj.techStack.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "3px" }}>
                          {proj.techStack.map((t, i) => (
                            <span key={i} style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "3px", backgroundColor: `${accent}10`, color: accent, fontWeight: 500 }}>{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </MainSection>
              ) : null,

            certifications: () => null,

            custom: () =>
              config.customSections.length > 0
                ? <>{config.customSections.map((section) => (
                    <MainSection key={section.id} icon={<IconStar color={accent} size={14} />} title={section.title}>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {section.items.map((item) => (
                          <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "12px", position: "relative" }}>
                            <span style={{ position: "absolute", left: 0, top: "7px", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: accent }} />
                            {item.content}
                          </li>
                        ))}
                      </ul>
                    </MainSection>
                  ))}</>
                : null,
          }

          return config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)
        })()}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   3. MINIMAL TEMPLATE
   Understated elegance: thin accent line, subtle icons, lots of whitespace
   ═══════════════════════════════════════════════ */
function MinimalTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)

  function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
      <div style={{ marginBottom: "22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
          {icon}
          <span style={{ fontSize: fs.small, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "2px" }}>{title}</span>
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: `${(config.pagePadding ?? 32) + 8}px ${(config.pagePadding ?? 32) + 16}px` }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: 300, letterSpacing: "-0.5px", color: "#111827", margin: 0, lineHeight: 1.1 }}>
          {p.fullName || "Your Name"}
        </h1>
        {p.title && <div style={{ fontSize: fs.h2, color: accent, fontWeight: 400, marginTop: "4px" }}>{p.title}</div>}
        {contacts.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", marginTop: "10px" }}>
            {contacts.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: fs.small, color: "#6b7280" }}>
                {contactIcon(c.type, "#9ca3af", 10)}
                <LinkText href={contactHref(c.type, c.value)}>{c.value}</LinkText>
              </div>
            ))}
          </div>
        )}
        <div style={{ width: "40px", height: "2px", backgroundColor: accent, marginTop: "16px" }} />
      </div>

      {(() => {
        const sectionRenderers: Record<string, () => React.ReactNode> = {
          summary: () =>
            p.summary ? (
              <div key="summary" style={{ marginBottom: "24px" }}>
                <p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#4b5563", fontStyle: "italic" }}>{p.summary}</p>
              </div>
            ) : null,

          experience: () =>
            enabledExp.length > 0 ? (
              <Section key="experience" icon={<IconBriefcase color="#9ca3af" size={12} />} title="Experience">
                {enabledExp.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: "16px", paddingLeft: "12px", borderLeft: `2px solid ${accent}30` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>
                        {exp.title} <span style={{ fontWeight: 400, color: "#6b7280" }}>at {exp.company}</span>
                      </span>
                      <span style={{ fontSize: fs.small, color: "#9ca3af" }}>
                        {formatDisplayDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.achievements.length > 0 && (
                      <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0 0" }}>
                        {exp.achievements.map((a, i) => (
                          <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6 }}>— {a}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </Section>
            ) : null,

          education: () =>
            enabledEdu.length > 0 ? (
              <Section key="education" icon={<IconGradCap color="#9ca3af" size={12} />} title="Education">
                {enabledEdu.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: "10px", paddingLeft: "12px", borderLeft: `2px solid ${accent}30` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                      <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{formatDisplayDate(edu.endDate)}</span>
                    </div>
                    <div style={{ fontSize: fs.body, color: "#6b7280" }}>{edu.institution}</div>
                  </div>
                ))}
              </Section>
            ) : null,

          skills: () =>
            config.skillCategories.length > 0 ? (
              <Section key="skills" icon={<IconLayers color="#9ca3af" size={12} />} title="Skills">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {config.skillCategories.flatMap((cat) =>
                    cat.skills.map((skill, i) => (
                      <span key={`${cat.id}-${i}`} style={{ fontSize: fs.small, padding: "3px 12px", borderRadius: "20px", border: `1px solid ${accent}40`, color: "#374151" }}>{skill}</span>
                    ))
                  )}
                </div>
              </Section>
            ) : null,

          projects: () =>
            enabledProjects.length > 0 ? (
              <Section key="projects" icon={<IconFolder color="#9ca3af" size={12} />} title="Projects">
                {enabledProjects.map((proj) => (
                  <div key={proj.id} style={{ marginBottom: "10px", paddingLeft: "12px", borderLeft: `2px solid ${accent}30` }}>
                    <span style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>{proj.title}</span>
                    {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "2px", lineHeight: 1.5 }}>{proj.description}</p>}
                  </div>
                ))}
              </Section>
            ) : null,

          certifications: () =>
            enabledCerts.length > 0 ? (
              <Section key="certifications" icon={<IconAward color="#9ca3af" size={12} />} title="Certifications">
                {enabledCerts.map((cert) => (
                  <div key={cert.id} style={{ fontSize: fs.body, color: "#374151", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600 }}>{cert.name}</span>
                    <span style={{ color: "#6b7280" }}> — {cert.issuer}</span>
                    {cert.date && <span style={{ color: "#9ca3af" }}> ({formatDisplayDate(cert.date)})</span>}
                  </div>
                ))}
              </Section>
            ) : null,

          custom: () => null,
        }

        return config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)
      })()}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   4. EXECUTIVE TEMPLATE
   Bold gradient header, date badges, premium section dividers
   ═══════════════════════════════════════════════ */
function ExecutiveTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)

  function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
      <div style={{ marginBottom: "22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "6px", background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, flexShrink: 0 }}>
            {icon}
          </div>
          <span style={{ fontSize: fs.h2, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: "2px" }}>{title}</span>
          <div style={{ flex: 1, height: "2px", backgroundColor: `${accent}15` }} />
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE }}>
      {/* Bold Header */}
      <div style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, color: "white", padding: `${config.pagePadding ?? 30}px ${(config.pagePadding ?? 30) + 10}px ${(config.pagePadding ?? 30) - 4}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "60px", height: "60px", borderRadius: "12px", border: "2px solid rgba(255,255,255,0.3)", overflow: "hidden", flexShrink: 0 }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "-0.5px", margin: 0, textTransform: "uppercase" }}>
              {p.fullName || "Your Name"}
            </h1>
            {p.title && <div style={{ fontSize: "14px", fontWeight: 300, marginTop: "2px", opacity: 0.9, letterSpacing: "3px", textTransform: "uppercase" }}>{p.title}</div>}
          </div>
        </div>
        {contacts.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", marginTop: "14px" }}>
            {contacts.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: fs.small, opacity: 0.85 }}>
                {contactIcon(c.type, "rgba(255,255,255,0.8)", 11)}
                <LinkText href={contactHref(c.type, c.value)}>{c.value}</LinkText>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: `${config.pagePadding ?? 24}px ${(config.pagePadding ?? 24) + 16}px ${config.pagePadding ?? 32}px` }}>
        {(() => {
          const sectionRenderers: Record<string, () => React.ReactNode> = {
            summary: () =>
              p.summary ? (
                <div key="summary" style={{ marginBottom: "22px" }}>
                  <p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#374151", borderLeft: `4px solid ${accent}`, paddingLeft: "16px" }}>{p.summary}</p>
                </div>
              ) : null,

            experience: () =>
              enabledExp.length > 0 ? (
                <Section key="experience" icon={<IconBriefcase color="white" size={14} />} title="Professional Experience">
                  {enabledExp.map((exp) => (
                    <div key={exp.id} style={{ marginBottom: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</div>
                          <div style={{ fontSize: fs.body, color: accent, fontWeight: 600 }}>
                            {exp.company}{exp.location && <span style={{ fontWeight: 400, color: "#6b7280" }}> · {exp.location}</span>}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: fs.small, color: "white", backgroundColor: accent, padding: "2px 10px", borderRadius: "12px", whiteSpace: "nowrap", fontWeight: 500, flexShrink: 0 }}>
                          <IconCalendar color="rgba(255,255,255,0.8)" size={9} />
                          {formatDisplayDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}
                        </div>
                      </div>
                      {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "6px", lineHeight: 1.55 }}>{exp.description}</p>}
                      {exp.achievements.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0 0" }}>
                          {exp.achievements.map((a, i) => (
                            <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.55, paddingLeft: "16px", position: "relative" }}>
                              <span style={{ position: "absolute", left: 0, top: "7px", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: accent }} />
                              {a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </Section>
              ) : null,

            education: () =>
              enabledEdu.length > 0 ? (
                <div key="education" style={{ display: "flex", gap: "28px", marginBottom: "22px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "6px", background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
                        <IconGradCap color="white" size={14} />
                      </div>
                      <span style={{ fontSize: fs.h2, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: "2px" }}>Education</span>
                      <div style={{ flex: 1, height: "2px", backgroundColor: `${accent}15` }} />
                    </div>
                    {enabledEdu.map((edu) => (
                      <div key={edu.id} style={{ marginBottom: "10px" }}>
                        <div style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{edu.degree}{edu.field && ` in ${edu.field}`}</div>
                        <div style={{ fontSize: fs.body, color: "#6b7280" }}>{edu.institution}{edu.endDate && ` · ${formatDisplayDate(edu.endDate)}`}</div>
                      </div>
                    ))}
                  </div>
                  {config.skillCategories.length > 0 && (
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "6px", background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
                          <IconLayers color="white" size={14} />
                        </div>
                        <span style={{ fontSize: fs.h2, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: "2px" }}>Skills</span>
                        <div style={{ flex: 1, height: "2px", backgroundColor: `${accent}15` }} />
                      </div>
                      {config.skillCategories.map((cat) => (
                        <div key={cat.id} style={{ marginBottom: "8px" }}>
                          <div style={{ fontSize: fs.small, fontWeight: 700, color: "#111827", marginBottom: "3px" }}>{cat.name}</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                            {cat.skills.map((skill, i) => (
                              <span key={i} style={{ fontSize: "9.5px", padding: "2px 8px", borderRadius: "4px", backgroundColor: `${accent}10`, color: accent, fontWeight: 500 }}>{skill}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null,

            skills: () =>
              !enabledEdu.length && config.skillCategories.length > 0 ? (
                <div key="skills" style={{ marginBottom: "22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "6px", background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
                      <IconLayers color="white" size={14} />
                    </div>
                    <span style={{ fontSize: fs.h2, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: "2px" }}>Skills</span>
                    <div style={{ flex: 1, height: "2px", backgroundColor: `${accent}15` }} />
                  </div>
                  {config.skillCategories.map((cat) => (
                    <div key={cat.id} style={{ marginBottom: "8px" }}>
                      <div style={{ fontSize: fs.small, fontWeight: 700, color: "#111827", marginBottom: "3px" }}>{cat.name}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {cat.skills.map((skill, i) => (
                          <span key={i} style={{ fontSize: "9.5px", padding: "2px 8px", borderRadius: "4px", backgroundColor: `${accent}10`, color: accent, fontWeight: 500 }}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null,

            projects: () =>
              enabledProjects.length > 0 ? (
                <Section key="projects" icon={<IconCode color="white" size={14} />} title="Key Projects">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {enabledProjects.map((proj) => (
                      <div key={proj.id} style={{ padding: "10px 14px", borderRadius: "8px", border: `1px solid ${accent}20`, backgroundColor: `${accent}04` }}>
                        <div style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</div>
                        {proj.description && <p style={{ fontSize: fs.small, color: "#4b5563", marginTop: "3px", lineHeight: 1.4 }}>{proj.description}</p>}
                        {proj.techStack.length > 0 && <div style={{ fontSize: "9px", color: accent, marginTop: "4px", fontWeight: 500 }}>{proj.techStack.join(" · ")}</div>}
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null,

            certifications: () =>
              enabledCerts.length > 0 ? (
                <Section key="certifications" icon={<IconAward color="white" size={14} />} title="Certifications">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {enabledCerts.map((cert) => (
                      <div key={cert.id} style={{ padding: "6px 14px", borderRadius: "8px", backgroundColor: `${accent}08`, border: `1px solid ${accent}20` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <IconShield color={accent} size={11} />
                          <div style={{ fontSize: fs.small, fontWeight: 600, color: "#111827" }}>{cert.name}</div>
                        </div>
                        <div style={{ fontSize: "9.5px", color: "#6b7280", marginLeft: "16px" }}>{cert.issuer}</div>
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null,

            custom: () =>
              config.customSections.length > 0
                ? <>{config.customSections.map((section) => (
                    <Section key={section.id} icon={<IconStar color="white" size={14} />} title={section.title}>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {section.items.map((item) => (
                          <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "16px", position: "relative" }}>
                            <span style={{ position: "absolute", left: 0, top: "7px", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: accent }} />
                            {item.content}
                          </li>
                        ))}
                      </ul>
                    </Section>
                  ))}</>
                : null,
          }

          return config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)
        })()}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   5. HEALTHCARE TEMPLATE
   Two-column with teal sidebar, medical-inspired icons, clean sections
   ═══════════════════════════════════════════════ */
function HealthcareTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)

  function SidebarHead({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", paddingBottom: "5px", borderBottom: `1.5px solid ${accent}40` }}>
        {icon}
        <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "2px", color: accent, fontWeight: 700 }}>{title}</span>
      </div>
    )
  }

  function MainHead({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", paddingBottom: "5px", borderBottom: `2px solid ${accent}` }}>
        {icon}
        <span style={{ fontSize: fs.h2, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "1.5px" }}>{title}</span>
      </div>
    )
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, display: "flex" }}>
      {/* Left Sidebar */}
      <div style={{ width: `${config.sidebarWidth ?? 228}px`, minWidth: `${config.sidebarWidth ?? 228}px`, backgroundColor: `${accent}08`, borderRight: `2px solid ${accent}25`, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ backgroundColor: accent, color: "white", padding: "26px 20px 22px", textAlign: "center" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "68px", height: "68px", borderRadius: "50%", border: "3px solid rgba(255,255,255,0.4)", margin: "0 auto 10px", overflow: "hidden" }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <h1 style={{ fontSize: "16px", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{p.fullName || "Your Name"}</h1>
          {p.title && <div style={{ fontSize: fs.small, marginTop: "4px", opacity: 0.9 }}>{p.title}</div>}
        </div>

        <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Contact */}
          <div>
            <SidebarHead icon={<IconPhone color={accent} size={11} />} title="Contact" />
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {contacts.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: fs.small, color: "#374151" }}>
                  {contactIcon(c.type, accent, 10)}
                  <LinkText href={contactHref(c.type, c.value)} style={{ wordBreak: "break-all" }}>{c.value}</LinkText>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          {enabledEdu.length > 0 && (
            <div>
              <SidebarHead icon={<IconGradCap color={accent} size={11} />} title="Education" />
              {enabledEdu.map((edu) => (
                <div key={edu.id} style={{ marginBottom: "10px" }}>
                  <div style={{ fontSize: fs.small, fontWeight: 700, color: "#111827" }}>{edu.degree}{edu.field && ` in ${edu.field}`}</div>
                  <div style={{ fontSize: "10px", color: "#6b7280" }}>{edu.institution}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px", marginTop: "1px" }}>
                    <IconCalendar color="#9ca3af" size={9} />
                    <span style={{ fontSize: "9.5px", color: "#9ca3af" }}>{formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}</span>
                  </div>
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul style={{ listStyle: "none", padding: 0, margin: "3px 0 0 0" }}>
                      {edu.achievements.map((a, i) => (
                        <li key={i} style={{ fontSize: "10px", color: "#4b5563", lineHeight: 1.4, paddingLeft: "10px", position: "relative" }}>
                          <span style={{ position: "absolute", left: 0, top: "4px", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: accent }} />{a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {enabledCerts.length > 0 && (
            <div>
              <SidebarHead icon={<IconShield color={accent} size={11} />} title="Licenses & Certifications" />
              {enabledCerts.map((cert) => (
                <div key={cert.id} style={{ marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "5px" }}>
                    <IconAward color={accent} size={10} />
                    <div>
                      <div style={{ fontSize: fs.small, fontWeight: 600, color: "#111827" }}>{cert.name}</div>
                      <div style={{ fontSize: "9.5px", color: "#6b7280" }}>{cert.issuer}{cert.date && ` · ${formatDisplayDate(cert.date)}`}</div>
                      {cert.credentialId && <div style={{ fontSize: "9px", color: "#9ca3af" }}>ID: {cert.credentialId}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {config.skillCategories.length > 0 && (
            <div>
              <SidebarHead icon={<IconLayers color={accent} size={11} />} title="Skills" />
              {config.skillCategories.map((cat) => (
                <div key={cat.id} style={{ marginBottom: "8px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 600, color: "#111827", marginBottom: "3px" }}>{cat.name}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                    {cat.skills.map((skill, i) => (
                      <span key={i} style={{ fontSize: "9px", padding: "1px 7px", borderRadius: "3px", backgroundColor: `${accent}12`, color: accent, fontWeight: 500 }}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: `${config.pagePadding ?? 26}px ${(config.pagePadding ?? 26) + 2}px` }}>
        {(() => {
          const sectionRenderers: Record<string, () => React.ReactNode> = {
            summary: () =>
              p.summary ? (
                <div key="summary" style={{ marginBottom: "18px" }}>
                  <MainHead icon={<IconHeart color={accent} size={14} />} title="Professional Profile" />
                  <p style={{ fontSize: fs.body, lineHeight: 1.65, color: "#374151" }}>{p.summary}</p>
                </div>
              ) : null,

            experience: () =>
              enabledExp.length > 0 ? (
                <div key="experience" style={{ marginBottom: "18px" }}>
                  <MainHead icon={<IconBriefcase color={accent} size={14} />} title="Experience" />
                  {enabledExp.map((exp) => (
                    <div key={exp.id} style={{ marginBottom: "14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "3px", flexShrink: 0 }}>
                          <IconCalendar color="#9ca3af" size={9} />
                          <span style={{ fontSize: fs.small, color: "#9ca3af" }}>
                            {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: fs.body, color: accent, fontWeight: 500 }}>
                        {exp.company}{exp.location && <span style={{ color: "#9ca3af", fontWeight: 400 }}>, {exp.location}</span>}
                      </div>
                      {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.55 }}>{exp.description}</p>}
                      {exp.achievements.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
                          {exp.achievements.map((a, i) => (
                            <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.55, paddingLeft: "14px", position: "relative" }}>
                              <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />{a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : null,

            education: () => null,

            skills: () => null,

            projects: () =>
              enabledProjects.length > 0 ? (
                <div key="projects" style={{ marginBottom: "18px" }}>
                  <MainHead icon={<IconFolder color={accent} size={14} />} title="Projects" />
                  {enabledProjects.map((proj) => (
                    <div key={proj.id} style={{ marginBottom: "10px" }}>
                      <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</span>
                      {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "2px", lineHeight: 1.5 }}>{proj.description}</p>}
                      {proj.techStack.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "3px" }}>
                          {proj.techStack.map((t, i) => (
                            <span key={i} style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "3px", border: `1px solid ${accent}30`, color: accent, fontWeight: 500 }}>{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null,

            certifications: () => null,

            custom: () =>
              config.customSections.length > 0
                ? <>{config.customSections.map((section) => (
                    <div key={section.id} style={{ marginBottom: "18px" }}>
                      <MainHead icon={<IconStar color={accent} size={14} />} title={section.title} />
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {section.items.map((item) => (
                          <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                            <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />{item.content}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}</>
                : null,
          }

          return config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)
        })()}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   6. ELEGANT TEMPLATE
   Grand header with initials watermark, sophisticated two-column body
   ═══════════════════════════════════════════════ */
function ElegantTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)

  function LeftHead({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px", paddingBottom: "6px", borderBottom: "1px solid #d1d5db" }}>
        {icon}
        <span style={{ fontSize: "9.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "3px", color: "#1f2937" }}>{title}</span>
      </div>
    )
  }

  function RightHead({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", paddingBottom: "6px", borderBottom: `1px solid ${accent}30` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "22px", height: "22px", borderRadius: "50%", backgroundColor: `${accent}10`, flexShrink: 0 }}>
          {icon}
        </div>
        <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "3px", color: "#1f2937" }}>{title}</span>
      </div>
    )
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE }}>
      {/* Grand Header */}
      <div style={{ padding: "34px 40px 26px", textAlign: "center", borderBottom: `3px solid ${accent}`, position: "relative" }}>
        {/* Decorative initials watermark */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "88px", fontWeight: 200, color: `${accent}06`, letterSpacing: "8px", fontStyle: "italic", pointerEvents: "none", userSelect: "none" }}>
          {(p.fullName || "YN").split(" ").map(w => w[0]).join("")}
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: 300, letterSpacing: "8px", textTransform: "uppercase", margin: 0, color: "#1f2937", position: "relative" }}>
          {p.fullName || "Your Name"}
        </h1>
        {p.title && (
          <div style={{ fontSize: "11px", letterSpacing: "5px", textTransform: "uppercase", color: "#6b7280", marginTop: "8px", fontWeight: 400, position: "relative" }}>{p.title}</div>
        )}
      </div>

      {/* Two Column Body */}
      <div style={{ display: "flex", minHeight: "calc(297mm - 100px)" }}>
        {/* Left Column */}
        <div style={{ width: `${config.sidebarWidth ?? 210}px`, minWidth: `${config.sidebarWidth ?? 210}px`, padding: "22px 18px", backgroundColor: "#fafafa", borderRight: "1px solid #e5e7eb" }}>
          {/* Contact */}
          <div style={{ marginBottom: "20px" }}>
            <LeftHead icon={<IconPhone color={accent} size={11} />} title="Contact" />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {contacts.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: fs.small, color: "#374151" }}>
                  {contactIcon(c.type, accent, 10)}
                  <LinkText href={contactHref(c.type, c.value)} style={{ wordBreak: "break-all" }}>{c.value}</LinkText>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          {enabledEdu.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <LeftHead icon={<IconGradCap color={accent} size={11} />} title="Education" />
              {enabledEdu.map((edu) => (
                <div key={edu.id} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "1px" }}>
                    <IconCalendar color="#9ca3af" size={9} />
                    <span style={{ fontSize: fs.small, fontWeight: 600, color: "#6b7280" }}>
                      {formatDisplayDate(edu.startDate)} – {formatDisplayDate(edu.endDate)}
                    </span>
                  </div>
                  <div style={{ fontSize: fs.small, fontWeight: 700, color: accent, marginTop: "2px" }}>{edu.institution}</div>
                  <div style={{ fontSize: "10px", color: "#4b5563", marginTop: "1px" }}>{edu.degree}{edu.field && ` in ${edu.field}`}</div>
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul style={{ listStyle: "none", padding: 0, margin: "3px 0 0 0" }}>
                      {edu.achievements.map((a, i) => (
                        <li key={i} style={{ fontSize: "10px", color: "#4b5563", lineHeight: 1.4, paddingLeft: "10px", position: "relative" }}>
                          <span style={{ position: "absolute", left: 0, top: "4px", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: accent }} />{a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {config.skillCategories.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <LeftHead icon={<IconLayers color={accent} size={11} />} title="Skills" />
              {config.skillCategories.flatMap((cat) => cat.skills).map((skill, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: fs.small, color: "#374151", lineHeight: 1.8 }}>
                  <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: accent, flexShrink: 0 }} />
                  {skill}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {enabledCerts.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <LeftHead icon={<IconAward color={accent} size={11} />} title="Certifications" />
              {enabledCerts.map((cert) => (
                <div key={cert.id} style={{ marginBottom: "6px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "4px" }}>
                    <IconShield color={accent} size={10} />
                    <div>
                      <div style={{ fontSize: fs.small, fontWeight: 600, color: "#111827" }}>{cert.name}</div>
                      <div style={{ fontSize: "9.5px", color: "#6b7280" }}>{cert.issuer}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ flex: 1, padding: `${config.pagePadding ?? 22}px ${(config.pagePadding ?? 22) + 4}px` }}>
          {(() => {
            const sectionRenderers: Record<string, () => React.ReactNode> = {
              summary: () =>
                p.summary ? (
                  <div key="summary" style={{ marginBottom: "22px" }}>
                    <RightHead icon={<IconUser color={accent} size={12} />} title="Profile Summary" />
                    <p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#374151", textAlign: "justify" }}>{p.summary}</p>
                  </div>
                ) : null,

              experience: () =>
                enabledExp.length > 0 ? (
                  <div key="experience" style={{ marginBottom: "22px" }}>
                    <RightHead icon={<IconBriefcase color={accent} size={12} />} title="Work Experience" />
                    {enabledExp.map((exp) => (
                      <div key={exp.id} style={{ marginBottom: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.company}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: "3px", flexShrink: 0 }}>
                            <IconCalendar color="#9ca3af" size={9} />
                            <span style={{ fontSize: fs.small, color: "#9ca3af" }}>
                              {formatDisplayDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}
                            </span>
                          </div>
                        </div>
                        <div style={{ fontSize: fs.body, color: accent, fontWeight: 500 }}>{exp.title}</div>
                        {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.65, textAlign: "justify" }}>{exp.description}</p>}
                        {exp.achievements.length > 0 && (
                          <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
                            {exp.achievements.map((a, i) => (
                              <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative", textAlign: "justify" }}>
                                <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#374151" }} />{a}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null,

              education: () => null,

              skills: () => null,

              projects: () =>
                enabledProjects.length > 0 ? (
                  <div key="projects" style={{ marginBottom: "22px" }}>
                    <RightHead icon={<IconFolder color={accent} size={12} />} title="Projects" />
                    {enabledProjects.map((proj) => (
                      <div key={proj.id} style={{ marginBottom: "10px" }}>
                        <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</span>
                        {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "2px", lineHeight: 1.5 }}>{proj.description}</p>}
                        {proj.techStack.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "3px" }}>
                            {proj.techStack.map((t, i) => (
                              <span key={i} style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "10px", backgroundColor: `${accent}10`, color: accent, fontWeight: 500 }}>{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null,

              certifications: () => null,

              custom: () =>
                config.customSections.length > 0
                  ? <>{config.customSections.map((section) => (
                      <div key={section.id} style={{ marginBottom: "22px" }}>
                        <RightHead icon={<IconStar color={accent} size={12} />} title={section.title} />
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                          {section.items.map((item) => (
                            <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                              <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#374151" }} />{item.content}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}</>
                  : null,
            }

            return config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)
          })()}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   7. COMPACT TEMPLATE
   Dense professional layout, accent top bar, inline icons, two-column sections
   ═══════════════════════════════════════════════ */
function CompactTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)

  function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
      <div style={{ marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "7px" }}>
          {icon}
          <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accent }}>{title}</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE }}>
      {/* Top accent bar */}
      <div style={{ height: "5px", background: `linear-gradient(90deg, ${accent}, ${accent}88)` }} />

      {/* Header */}
      <div style={{ padding: `${(config.pagePadding ?? 32) - 14}px ${config.pagePadding ?? 34}px ${(config.pagePadding ?? 32) - 18}px` }}>
        <h1 style={{ fontSize: "23px", fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.1, textTransform: "uppercase" }}>
          {p.fullName || "Your Name"}
        </h1>
        {p.title && <div style={{ fontSize: fs.h2, color: accent, fontWeight: 600, marginTop: "2px" }}>{p.title}</div>}
        {contacts.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", marginTop: "8px" }}>
            {contacts.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "#6b7280" }}>
                {contactIcon(c.type, accent, 10)}
                <LinkText href={contactHref(c.type, c.value)}>{c.value}</LinkText>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: `0 ${config.pagePadding ?? 34}px ${config.pagePadding ?? 24}px` }}>
        {(() => {
          const sectionRenderers: Record<string, () => React.ReactNode> = {
            summary: () =>
              p.summary ? (
                <Section key="summary" icon={<IconTarget color={accent} size={12} />} title="Summary">
                  <p style={{ fontSize: fs.body, lineHeight: 1.55, color: "#374151", margin: 0 }}>{p.summary}</p>
                </Section>
              ) : null,

            experience: () =>
              enabledExp.length > 0 ? (
                <Section key="experience" icon={<IconBriefcase color={accent} size={12} />} title="Experience">
                  {enabledExp.map((exp) => (
                    <div key={exp.id} style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <div>
                          <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</span>
                          {exp.company && <span style={{ fontSize: fs.body, color: accent, fontWeight: 500 }}> | {exp.company}</span>}
                          {exp.location && <span style={{ fontSize: fs.small, color: "#9ca3af" }}> · {exp.location}</span>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "3px", flexShrink: 0 }}>
                          <IconCalendar color="#9ca3af" size={9} />
                          <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: 500 }}>
                            {formatDisplayDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}
                          </span>
                        </div>
                      </div>
                      {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "3px", lineHeight: 1.5 }}>{exp.description}</p>}
                      {exp.achievements.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                          {exp.achievements.map((a, i) => (
                            <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.5, paddingLeft: "12px", position: "relative" }}>
                              <span style={{ position: "absolute", left: 0, top: "7px", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: accent }} />{a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </Section>
              ) : null,

            projects: () =>
              enabledProjects.length > 0 ? (
                <Section key="projects" icon={<IconCode color={accent} size={12} />} title="Key Projects">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 18px" }}>
                    {enabledProjects.map((proj) => (
                      <div key={proj.id}>
                        <div style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>{proj.title}</div>
                        {proj.description && <p style={{ fontSize: fs.small, color: "#4b5563", marginTop: "1px", lineHeight: 1.4 }}>{proj.description}</p>}
                        {proj.techStack.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "2px" }}>
                            {proj.techStack.map((t, i) => (
                              <span key={i} style={{ fontSize: "8.5px", padding: "1px 5px", borderRadius: "3px", backgroundColor: `${accent}10`, color: accent, fontWeight: 500 }}>{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null,

            education: () =>
              enabledEdu.length > 0 ? (
                <div key="education" style={{ display: "flex", gap: "22px", marginBottom: "14px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "7px" }}>
                      <IconGradCap color={accent} size={12} />
                      <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accent }}>Education</span>
                      <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
                    </div>
                    {enabledEdu.map((edu) => (
                      <div key={edu.id} style={{ marginBottom: "8px" }}>
                        <div style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>{edu.degree}{edu.field && ` in ${edu.field}`}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                          <span style={{ fontSize: fs.small, color: "#6b7280" }}>{edu.institution}</span>
                          {edu.endDate && (
                            <>
                              <span style={{ color: "#d1d5db" }}>·</span>
                              <IconCalendar color="#9ca3af" size={9} />
                              <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{formatDisplayDate(edu.endDate)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {config.skillCategories.length > 0 && (
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "7px" }}>
                        <IconLayers color={accent} size={12} />
                        <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accent }}>Skills</span>
                        <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
                      </div>
                      {config.skillCategories.map((cat) => (
                        <div key={cat.id} style={{ marginBottom: "6px" }}>
                          <span style={{ fontSize: fs.small, fontWeight: 600, color: "#111827" }}>{cat.name}: </span>
                          <span style={{ fontSize: fs.small, color: "#4b5563" }}>{cat.skills.join(", ")}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null,

            skills: () =>
              !enabledEdu.length && config.skillCategories.length > 0 ? (
                <div key="skills" style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "7px" }}>
                    <IconLayers color={accent} size={12} />
                    <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: accent }}>Skills</span>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
                  </div>
                  {config.skillCategories.map((cat) => (
                    <div key={cat.id} style={{ marginBottom: "6px" }}>
                      <span style={{ fontSize: fs.small, fontWeight: 600, color: "#111827" }}>{cat.name}: </span>
                      <span style={{ fontSize: fs.small, color: "#4b5563" }}>{cat.skills.join(", ")}</span>
                    </div>
                  ))}
                </div>
              ) : null,

            certifications: () =>
              enabledCerts.length > 0 ? (
                <Section key="certifications" icon={<IconAward color={accent} size={12} />} title="Certifications">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {enabledCerts.map((cert) => (
                      <div key={cert.id} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "6px", backgroundColor: `${accent}06`, border: `1px solid ${accent}18` }}>
                        <IconShield color={accent} size={10} />
                        <div>
                          <span style={{ fontSize: fs.small, fontWeight: 600, color: "#111827" }}>{cert.name}</span>
                          <span style={{ fontSize: fs.small, color: "#6b7280" }}> — {cert.issuer}</span>
                          {cert.date && <span style={{ fontSize: fs.small, color: "#9ca3af" }}> ({formatDisplayDate(cert.date)})</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null,

            custom: () =>
              config.customSections.length > 0
                ? <>{config.customSections.map((section) => (
                    <Section key={section.id} icon={<IconStar color={accent} size={12} />} title={section.title}>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {section.items.map((item) => (
                          <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.5, paddingLeft: "12px", position: "relative" }}>
                            <span style={{ position: "absolute", left: 0, top: "7px", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: accent }} />{item.content}
                          </li>
                        ))}
                      </ul>
                    </Section>
                  ))}</>
                : null,
          }

          return config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)
        })()}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   8. BOLD TEMPLATE
   Full-width header with large bold name, diagonal accent stripe,
   timeline-style experience with vertical line and dots,
   skills as progress-bar style horizontal bars
   ═══════════════════════════════════════════════ */
function BoldTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)

  function SectionHead({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", borderRadius: "4px", backgroundColor: accent, flexShrink: 0 }}>
          {icon}
        </div>
        <span style={{ fontSize: fs.h2, fontWeight: 900, color: "#111827", textTransform: "uppercase", letterSpacing: "2px" }}>{title}</span>
        <div style={{ flex: 1, height: "3px", background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      </div>
    )
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, overflow: "hidden" }}>
      {/* Full-width header with diagonal accent stripe */}
      <div style={{ position: "relative", padding: `${(config.pagePadding ?? 32) + 10}px ${(config.pagePadding ?? 32) + 8}px ${(config.pagePadding ?? 32)}px`, backgroundColor: "#111827" }}>
        {/* Diagonal stripe */}
        <div style={{ position: "absolute", top: 0, right: 0, width: "200px", height: "100%", background: accent, clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)", opacity: 0.9 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {config.showProfileImage && p.profileImage && (
              <div style={{ width: "70px", height: "70px", borderRadius: "8px", border: `3px solid ${accent}`, overflow: "hidden", flexShrink: 0 }}>
                <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <div>
              <h1 style={{ fontSize: "34px", fontWeight: 900, letterSpacing: "-0.5px", color: "white", margin: 0, lineHeight: 1.1, textTransform: "uppercase" }}>
                {p.fullName || "Your Name"}
              </h1>
              {p.title && (
                <div style={{ fontSize: "14px", color: accent, fontWeight: 600, marginTop: "4px", letterSpacing: "2px", textTransform: "uppercase" }}>{p.title}</div>
              )}
            </div>
          </div>
          {contacts.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", marginTop: "14px" }}>
              {contacts.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: fs.small, color: "rgba(255,255,255,0.8)" }}>
                  {contactIcon(c.type, accent, 11)}
                  <LinkText href={contactHref(c.type, c.value)}>{c.value}</LinkText>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: `${config.pagePadding ?? 24}px ${(config.pagePadding ?? 24) + 8}px` }}>
        {(() => {
          const sectionRenderers: Record<string, () => React.ReactNode> = {
            summary: () =>
              p.summary ? (
                <div key="summary" style={{ marginBottom: "20px", padding: "14px 18px", backgroundColor: `${accent}08`, borderLeft: `4px solid ${accent}`, borderRadius: "0 6px 6px 0" }}>
                  <p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#374151", margin: 0 }}>{p.summary}</p>
                </div>
              ) : null,

            experience: () =>
              enabledExp.length > 0 ? (
                <div key="experience" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconBriefcase color="white" size={14} />} title="Experience" />
                  <div style={{ position: "relative", paddingLeft: "24px" }}>
                    {/* Vertical timeline line */}
                    <div style={{ position: "absolute", left: "7px", top: "4px", bottom: "4px", width: "2px", backgroundColor: `${accent}30` }} />
                    {enabledExp.map((exp, idx) => (
                      <div key={exp.id} style={{ marginBottom: "16px", position: "relative" }}>
                        {/* Timeline dot */}
                        <div style={{ position: "absolute", left: "-21px", top: "4px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: accent, border: "2px solid white", boxShadow: `0 0 0 2px ${accent}40` }} />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <div>
                            <span style={{ fontSize: fs.h3, fontWeight: 800, color: "#111827" }}>{exp.title}</span>
                            {exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 600 }}> | {exp.company}</span>}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, backgroundColor: "#111827", color: "white", padding: "2px 10px", borderRadius: "3px", fontSize: fs.small, fontWeight: 600 }}>
                            <IconCalendar color={accent} size={9} />
                            {formatDisplayDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}
                          </div>
                        </div>
                        {exp.location && (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                            <IconMapPin color="#9ca3af" size={10} />
                            <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{exp.location}</span>
                          </div>
                        )}
                        {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.6 }}>{exp.description}</p>}
                        {exp.achievements.length > 0 && (
                          <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
                            {exp.achievements.map((a, i) => (
                              <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "16px", position: "relative" }}>
                                <span style={{ position: "absolute", left: 0, top: "7px", width: "6px", height: "6px", borderRadius: "1px", backgroundColor: accent, transform: "rotate(45deg)" }} />
                                {a}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null,

            education: () =>
              enabledEdu.length > 0 ? (
                <div key="education" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconGradCap color="white" size={14} />} title="Education" />
                  {enabledEdu.map((edu) => (
                    <div key={edu.id} style={{ marginBottom: "10px", padding: "8px 14px", backgroundColor: `${accent}05`, borderRadius: "6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: fs.h3, fontWeight: 800, color: "#111827" }}>{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                        <span style={{ fontSize: fs.small, color: "#9ca3af", fontWeight: 600 }}>{formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}</span>
                      </div>
                      <div style={{ fontSize: fs.body, color: accent, fontWeight: 600 }}>{edu.institution}</div>
                      {edu.achievements && edu.achievements.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                          {edu.achievements.map((a, i) => (
                            <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.5, paddingLeft: "14px", position: "relative" }}>
                              <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "1px", backgroundColor: accent, transform: "rotate(45deg)" }} />{a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : null,

            skills: () =>
              config.skillCategories.length > 0 ? (
                <div key="skills" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconLayers color="white" size={14} />} title="Skills" />
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {config.skillCategories.map((cat) => (
                      <div key={cat.id}>
                        <div style={{ fontSize: fs.small, fontWeight: 800, color: "#111827", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "1px" }}>{cat.name}</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {cat.skills.map((skill, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ fontSize: fs.small, color: "#374151", fontWeight: 500, minWidth: "100px" }}>{skill}</span>
                              <div style={{ flex: 1, height: "8px", backgroundColor: `${accent}15`, borderRadius: "4px", overflow: "hidden" }}>
                                <div style={{ width: `${75 + ((i * 17) % 25)}%`, height: "100%", backgroundColor: accent, borderRadius: "4px", background: `linear-gradient(90deg, ${accent}, ${accent}cc)` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null,

            projects: () =>
              enabledProjects.length > 0 ? (
                <div key="projects" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconFolder color="white" size={14} />} title="Projects" />
                  {enabledProjects.map((proj) => (
                    <div key={proj.id} style={{ marginBottom: "12px", padding: "10px 14px", border: `2px solid ${accent}20`, borderRadius: "6px", borderLeft: `4px solid ${accent}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: fs.h3, fontWeight: 800, color: "#111827" }}>{proj.title}</span>
                        {proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}
                      </div>
                      {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "3px", lineHeight: 1.5 }}>{proj.description}</p>}
                      {proj.techStack.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
                          {proj.techStack.map((t, i) => (
                            <span key={i} style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "3px", backgroundColor: "#111827", color: accent, fontWeight: 600 }}>{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null,

            certifications: () =>
              enabledCerts.length > 0 ? (
                <div key="certifications" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconAward color="white" size={14} />} title="Certifications" />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {enabledCerts.map((cert) => (
                      <div key={cert.id} style={{ padding: "8px 14px", borderRadius: "6px", backgroundColor: "#111827", color: "white", minWidth: "140px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <IconShield color={accent} size={11} />
                          <span style={{ fontSize: fs.small, fontWeight: 700 }}>{cert.name}</span>
                        </div>
                        <div style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.6)", marginTop: "2px", marginLeft: "16px" }}>
                          {cert.issuer}{cert.date && ` · ${formatDisplayDate(cert.date)}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null,

            custom: () =>
              config.customSections.length > 0
                ? <>{config.customSections.map((section) => (
                    <div key={section.id} style={{ marginBottom: "22px" }}>
                      <SectionHead icon={<IconStar color="white" size={14} />} title={section.title} />
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {section.items.map((item) => (
                          <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "16px", position: "relative" }}>
                            <span style={{ position: "absolute", left: 0, top: "7px", width: "6px", height: "6px", borderRadius: "1px", backgroundColor: accent, transform: "rotate(45deg)" }} />
                            {item.content}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}</>
                : null,
          }

          return config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)
        })()}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   9. CREATIVE TEMPLATE
   Asymmetric two-column with narrow right sidebar,
   large colored initial letter, experience with left-border blocks,
   project cards in 2-column grid
   ═══════════════════════════════════════════════ */
function CreativeTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const sideW = config.sidebarWidth ?? 190

  function MainHead({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        {icon}
        <span style={{ fontSize: fs.h2, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "1.5px" }}>{title}</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: `${accent}25` }} />
      </div>
    )
  }

  function SideHead({ title }: { title: string }) {
    return (
      <div style={{ marginBottom: "8px", paddingBottom: "4px", borderBottom: `2px solid ${accent}` }}>
        <span style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.5px", color: accent }}>{title}</span>
      </div>
    )
  }

  const initials = (p.fullName || "Y").charAt(0)

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, display: "flex" }}>
      {/* Main content area (left, larger) */}
      <div style={{ flex: 1, padding: `${config.pagePadding ?? 28}px ${(config.pagePadding ?? 28)}px ${config.pagePadding ?? 28}px ${(config.pagePadding ?? 28) + 4}px` }}>
        {/* Name with large initial */}
        <div style={{ marginBottom: "22px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "4px" }}>
            <span style={{ fontSize: "56px", fontWeight: 900, color: accent, lineHeight: 0.85, fontFamily: "Georgia, 'Times New Roman', serif" }}>{initials}</span>
            <div>
              <h1 style={{ fontSize: fs.h1, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.1, letterSpacing: "-0.5px" }}>
                {(p.fullName || "Your Name").slice(1)}
              </h1>
              {p.title && (
                <div style={{ fontSize: fs.h2, color: "#6b7280", fontWeight: 400, marginTop: "2px", fontStyle: "italic" }}>{p.title}</div>
              )}
            </div>
          </div>
          <div style={{ width: "60px", height: "3px", backgroundColor: accent, marginTop: "10px", borderRadius: "2px" }} />
        </div>

        {(() => {
          const sectionRenderers: Record<string, () => React.ReactNode> = {
            summary: () =>
              p.summary ? (
                <div key="summary" style={{ marginBottom: "22px" }}>
                  <MainHead icon={<IconUser color={accent} size={13} />} title="About" />
                  <p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#374151" }}>{p.summary}</p>
                </div>
              ) : null,

            experience: () =>
              enabledExp.length > 0 ? (
                <div key="experience" style={{ marginBottom: "22px" }}>
                  <MainHead icon={<IconBriefcase color={accent} size={13} />} title="Experience" />
                  {enabledExp.map((exp) => (
                    <div key={exp.id} style={{ marginBottom: "14px", paddingLeft: "14px", borderLeft: `3px solid ${accent}`, backgroundColor: `${accent}04`, padding: "10px 14px", borderRadius: "0 6px 6px 0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</span>
                        <span style={{ fontSize: fs.small, color: "#9ca3af", whiteSpace: "nowrap" }}>
                          {formatDisplayDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}
                        </span>
                      </div>
                      <div style={{ fontSize: fs.body, color: accent, fontWeight: 600 }}>
                        {exp.company}{exp.location && <span style={{ color: "#9ca3af", fontWeight: 400 }}> · {exp.location}</span>}
                      </div>
                      {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.55 }}>{exp.description}</p>}
                      {exp.achievements.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
                          {exp.achievements.map((a, i) => (
                            <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.55, paddingLeft: "12px", position: "relative" }}>
                              <span style={{ position: "absolute", left: 0, top: "7px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                              {a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : null,

            education: () =>
              enabledEdu.length > 0 ? (
                <div key="education" style={{ marginBottom: "22px" }}>
                  <MainHead icon={<IconGradCap color={accent} size={13} />} title="Education" />
                  {enabledEdu.map((edu) => (
                    <div key={edu.id} style={{ marginBottom: "10px", paddingLeft: "14px", borderLeft: `3px solid ${accent}30` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                        <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}</span>
                      </div>
                      <div style={{ fontSize: fs.body, color: "#6b7280" }}>{edu.institution}</div>
                      {edu.achievements && edu.achievements.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: "3px 0 0 0" }}>
                          {edu.achievements.map((a, i) => (
                            <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.5, paddingLeft: "12px", position: "relative" }}>
                              <span style={{ position: "absolute", left: 0, top: "6px", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: accent }} />{a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : null,

            skills: () => null,

            projects: () =>
              enabledProjects.length > 0 ? (
                <div key="projects" style={{ marginBottom: "22px" }}>
                  <MainHead icon={<IconFolder color={accent} size={13} />} title="Projects" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {enabledProjects.map((proj) => (
                      <div key={proj.id} style={{ padding: "10px 12px", borderRadius: "8px", border: `1px solid ${accent}20`, backgroundColor: `${accent}04` }}>
                        <div style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</div>
                        {proj.url && <div style={{ fontSize: "9px", color: accent, marginTop: "1px" }}><UrlLink url={proj.url} color={accent} fontSize="9px" /></div>}
                        {proj.description && <p style={{ fontSize: fs.small, color: "#4b5563", marginTop: "4px", lineHeight: 1.4 }}>{proj.description}</p>}
                        {proj.techStack.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "5px" }}>
                            {proj.techStack.map((t, i) => (
                              <span key={i} style={{ fontSize: "8.5px", padding: "1px 6px", borderRadius: "3px", backgroundColor: `${accent}15`, color: accent, fontWeight: 500 }}>{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null,

            certifications: () => null,

            custom: () =>
              config.customSections.length > 0
                ? <>{config.customSections.map((section) => (
                    <div key={section.id} style={{ marginBottom: "22px" }}>
                      <MainHead icon={<IconStar color={accent} size={13} />} title={section.title} />
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {section.items.map((item) => (
                          <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "12px", position: "relative" }}>
                            <span style={{ position: "absolute", left: 0, top: "7px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                            {item.content}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}</>
                : null,
          }

          return config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)
        })()}
      </div>

      {/* Right sidebar (narrow) */}
      <div style={{ width: `${sideW}px`, minWidth: `${sideW}px`, backgroundColor: `${accent}06`, borderLeft: `3px solid ${accent}`, padding: "28px 16px", display: "flex", flexDirection: "column", gap: "18px" }}>
        {/* Profile image */}
        {config.showProfileImage && p.profileImage && (
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", border: `3px solid ${accent}`, margin: "0 auto", overflow: "hidden" }}>
            <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        {/* Contact */}
        <div>
          <SideHead title="Contact" />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {contacts.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: fs.small, color: "#374151" }}>
                {contactIcon(c.type, accent, 10)}
                <LinkText href={contactHref(c.type, c.value)} style={{ wordBreak: "break-all", lineHeight: 1.3 }}>{c.value}</LinkText>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        {config.skillCategories.length > 0 && (
          <div>
            <SideHead title="Skills" />
            {config.skillCategories.map((cat) => (
              <div key={cat.id} style={{ marginBottom: "10px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#111827", marginBottom: "3px" }}>{cat.name}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                  {cat.skills.map((skill, i) => (
                    <span key={i} style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "10px", backgroundColor: `${accent}15`, color: accent, fontWeight: 500 }}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {enabledCerts.length > 0 && (
          <div>
            <SideHead title="Certifications" />
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "5px" }}>
                  <IconShield color={accent} size={10} />
                  <div>
                    <div style={{ fontSize: fs.small, fontWeight: 600, color: "#111827" }}>{cert.name}</div>
                    <div style={{ fontSize: "9.5px", color: "#6b7280" }}>{cert.issuer}{cert.date && ` · ${formatDisplayDate(cert.date)}`}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   10. PROFESSIONAL TEMPLATE
   Dark header band with white text, two-column below with
   skills/certs on left and experience on right,
   clean horizontal rule dividers, serif-inspired font mix
   ═══════════════════════════════════════════════ */
function ProfessionalTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const sideW = config.sidebarWidth ?? 220

  function LeftHead({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
      <div style={{ marginBottom: "10px", paddingBottom: "6px", borderBottom: `1px solid #d1d5db` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {icon}
          <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "#1f2937", fontFamily: "Georgia, 'Times New Roman', serif" }}>{title}</span>
        </div>
      </div>
    )
  }

  function RightHead({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
      <div style={{ marginBottom: "12px", paddingBottom: "6px", borderBottom: `2px solid ${accent}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {icon}
          <span style={{ fontSize: fs.h2, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "#1f2937", fontFamily: "Georgia, 'Times New Roman', serif" }}>{title}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE }}>
      {/* Dark header band */}
      <div style={{ backgroundColor: accent, color: "white", padding: `${(config.pagePadding ?? 28) + 4}px ${(config.pagePadding ?? 28) + 12}px`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "3px solid rgba(255,255,255,0.3)", overflow: "hidden", flexShrink: 0 }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, margin: 0, lineHeight: 1.1, fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "1px" }}>
              {p.fullName || "Your Name"}
            </h1>
            {p.title && (
              <div style={{ fontSize: "13px", fontWeight: 300, marginTop: "4px", opacity: 0.85, letterSpacing: "2px", textTransform: "uppercase" }}>{p.title}</div>
            )}
          </div>
        </div>
        {contacts.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
            {contacts.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: fs.small }}>
                <LinkText href={contactHref(c.type, c.value)} style={{ opacity: 0.85 }}>{c.value}</LinkText>
                {contactIcon(c.type, "rgba(255,255,255,0.7)", 10)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary bar */}
      {p.summary && (
        <div style={{ padding: "14px 40px", backgroundColor: `${accent}08`, borderBottom: `1px solid ${accent}20` }}>
          <p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#374151", margin: 0, fontStyle: "italic", fontFamily: "Georgia, 'Times New Roman', serif" }}>{p.summary}</p>
        </div>
      )}

      {/* Two-column body */}
      <div style={{ display: "flex", minHeight: "calc(297mm - 140px)" }}>
        {/* Left column - Skills, Education, Certifications */}
        <div style={{ width: `${sideW}px`, minWidth: `${sideW}px`, padding: "22px 18px", borderRight: "1px solid #e5e7eb", backgroundColor: "#fafafa" }}>
          {/* Skills */}
          {config.skillCategories.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <LeftHead icon={<IconLayers color={accent} size={11} />} title="Skills" />
              {config.skillCategories.map((cat) => (
                <div key={cat.id} style={{ marginBottom: "10px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: accent, marginBottom: "4px", fontFamily: "Georgia, 'Times New Roman', serif" }}>{cat.name}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                    {cat.skills.map((skill, i) => (
                      <span key={i} style={{ fontSize: "9.5px", padding: "2px 8px", borderRadius: "3px", backgroundColor: `${accent}10`, color: "#374151", fontWeight: 500 }}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {enabledEdu.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <LeftHead icon={<IconGradCap color={accent} size={11} />} title="Education" />
              {enabledEdu.map((edu) => (
                <div key={edu.id} style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: fs.small, fontWeight: 700, color: "#111827", fontFamily: "Georgia, 'Times New Roman', serif" }}>{edu.degree}{edu.field && ` in ${edu.field}`}</div>
                  <div style={{ fontSize: "10px", color: accent, fontWeight: 500 }}>{edu.institution}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px", marginTop: "2px" }}>
                    <IconCalendar color="#9ca3af" size={9} />
                    <span style={{ fontSize: "9.5px", color: "#9ca3af" }}>{formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}</span>
                  </div>
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                      {edu.achievements.map((a, i) => (
                        <li key={i} style={{ fontSize: "10px", color: "#4b5563", lineHeight: 1.4, paddingLeft: "10px", position: "relative" }}>
                          <span style={{ position: "absolute", left: 0, top: "4px", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: accent }} />{a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {enabledCerts.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <LeftHead icon={<IconAward color={accent} size={11} />} title="Certifications" />
              {enabledCerts.map((cert) => (
                <div key={cert.id} style={{ marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "5px" }}>
                    <IconShield color={accent} size={10} />
                    <div>
                      <div style={{ fontSize: fs.small, fontWeight: 600, color: "#111827" }}>{cert.name}</div>
                      <div style={{ fontSize: "9.5px", color: "#6b7280" }}>{cert.issuer}{cert.date && ` · ${formatDisplayDate(cert.date)}`}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column - Experience, Projects, Custom */}
        <div style={{ flex: 1, padding: `${config.pagePadding ?? 22}px ${(config.pagePadding ?? 22) + 4}px` }}>
          {/* Experience */}
          {enabledExp.length > 0 && (
            <div style={{ marginBottom: "22px" }}>
              <RightHead icon={<IconBriefcase color={accent} size={13} />} title="Experience" />
              {enabledExp.map((exp, idx) => (
                <div key={exp.id} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827", fontFamily: "Georgia, 'Times New Roman', serif" }}>{exp.title}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                      <IconCalendar color="#9ca3af" size={9} />
                      <span style={{ fontSize: fs.small, color: "#9ca3af" }}>
                        {formatDisplayDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: fs.body, color: accent, fontWeight: 600, fontFamily: "Georgia, 'Times New Roman', serif" }}>
                    {exp.company}{exp.location && <span style={{ color: "#9ca3af", fontWeight: 400 }}> · {exp.location}</span>}
                  </div>
                  {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "5px", lineHeight: 1.6 }}>{exp.description}</p>}
                  {exp.achievements.length > 0 && (
                    <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
                      {exp.achievements.map((a, i) => (
                        <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                          <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />{a}
                        </li>
                      ))}
                    </ul>
                  )}
                  {idx < enabledExp.length - 1 && (
                    <div style={{ height: "1px", backgroundColor: "#e5e7eb", marginTop: "14px" }} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {enabledProjects.length > 0 && (
            <div style={{ marginBottom: "22px" }}>
              <RightHead icon={<IconFolder color={accent} size={13} />} title="Projects" />
              {enabledProjects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827", fontFamily: "Georgia, 'Times New Roman', serif" }}>{proj.title}</span>
                    {proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}
                  </div>
                  {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "3px", lineHeight: 1.5 }}>{proj.description}</p>}
                  {proj.techStack.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                      {proj.techStack.map((t, i) => (
                        <span key={i} style={{ fontSize: "9px", padding: "1px 7px", borderRadius: "3px", border: `1px solid ${accent}30`, color: accent, fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Custom Sections */}
          {config.customSections.map((section) => (
            <div key={section.id} style={{ marginBottom: "22px" }}>
              <RightHead icon={<IconStar color={accent} size={13} />} title={section.title} />
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />{item.content}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   11. TECHNICAL TEMPLATE
   Top band with name/title/contact in single row,
   code-bracket style section decorators,
   skills as tag chips grouped by category,
   projects with tech badges
   ═══════════════════════════════════════════════ */
function TechnicalTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)

  function SectionHead({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span style={{ fontSize: "16px", fontWeight: 300, color: accent, fontFamily: "'Courier New', monospace" }}>{"{"}</span>
        {icon}
        <span style={{ fontSize: fs.h2, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "'Courier New', monospace" }}>{title}</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: `${accent}30`, borderTop: `1px dashed ${accent}40` }} />
        <span style={{ fontSize: "16px", fontWeight: 300, color: accent, fontFamily: "'Courier New', monospace" }}>{"}"}</span>
      </div>
    )
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE }}>
      {/* Top band - single row with name, title, contact */}
      <div style={{ backgroundColor: "#1e293b", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "48px", height: "48px", borderRadius: "6px", border: `2px solid ${accent}`, overflow: "hidden", flexShrink: 0 }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "white", margin: 0, lineHeight: 1.1, fontFamily: "'Courier New', monospace" }}>
              {p.fullName || "Your Name"}
            </h1>
            {p.title && (
              <div style={{ fontSize: fs.body, color: accent, fontWeight: 500, marginTop: "2px", fontFamily: "'Courier New', monospace" }}>
                <span style={{ color: "#64748b" }}>// </span>{p.title}
              </div>
            )}
          </div>
        </div>
        {contacts.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", justifyContent: "flex-end" }}>
            {contacts.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: fs.small, color: "rgba(255,255,255,0.7)" }}>
                {contactIcon(c.type, accent, 10)}
                <LinkText href={contactHref(c.type, c.value)}>{c.value}</LinkText>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Thin accent line under top band */}
      <div style={{ height: "3px", background: `linear-gradient(90deg, ${accent}, ${accent}60, transparent)` }} />

      <div style={{ padding: `${config.pagePadding ?? 24}px ${(config.pagePadding ?? 24) + 8}px` }}>
        {/* Summary */}
        {p.summary && (
          <div style={{ marginBottom: "20px", padding: "12px 16px", backgroundColor: "#f8fafc", border: `1px solid ${accent}20`, borderRadius: "6px", borderLeft: `3px solid ${accent}` }}>
            <div style={{ fontSize: "9px", fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "4px", fontFamily: "'Courier New', monospace" }}>/* about */</div>
            <p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#374151", margin: 0 }}>{p.summary}</p>
          </div>
        )}

        {/* Skills - Tag chips grouped by category */}
        {config.skillCategories.length > 0 && (
          <div style={{ marginBottom: "22px" }}>
            <SectionHead icon={<IconLayers color={accent} size={13} />} title="skills" />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {config.skillCategories.map((cat) => (
                <div key={cat.id}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#64748b", marginBottom: "5px", fontFamily: "'Courier New', monospace" }}>
                    <span style={{ color: accent }}>const</span> {cat.name.toLowerCase().replace(/\s+/g, "_")} <span style={{ color: accent }}>=</span> [
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", paddingLeft: "16px" }}>
                    {cat.skills.map((skill, i) => (
                      <span key={i} style={{ fontSize: fs.small, padding: "3px 10px", borderRadius: "4px", backgroundColor: `${accent}10`, color: accent, fontWeight: 600, border: `1px solid ${accent}25`, fontFamily: "'Courier New', monospace" }}>"{skill}"</span>
                    ))}
                  </div>
                  <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px", fontFamily: "'Courier New', monospace" }}>];</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {enabledExp.length > 0 && (
          <div style={{ marginBottom: "22px" }}>
            <SectionHead icon={<IconBriefcase color={accent} size={13} />} title="experience" />
            {enabledExp.map((exp) => (
              <div key={exp.id} style={{ marginBottom: "16px", padding: "10px 14px", backgroundColor: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</span>
                    {exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 600 }}> @ {exp.company}</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, padding: "2px 8px", backgroundColor: "#1e293b", borderRadius: "3px" }}>
                    <IconCalendar color={accent} size={9} />
                    <span style={{ fontSize: fs.small, color: "rgba(255,255,255,0.8)", fontFamily: "'Courier New', monospace" }}>
                      {formatDisplayDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}
                    </span>
                  </div>
                </div>
                {exp.location && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                    <IconMapPin color="#9ca3af" size={10} />
                    <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{exp.location}</span>
                  </div>
                )}
                {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "5px", lineHeight: 1.6 }}>{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0 0" }}>
                    {exp.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "18px", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, top: "4px", fontSize: "10px", color: accent, fontFamily: "'Courier New', monospace", fontWeight: 700 }}>{`>`}</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {enabledEdu.length > 0 && (
          <div style={{ marginBottom: "22px" }}>
            <SectionHead icon={<IconGradCap color={accent} size={13} />} title="education" />
            {enabledEdu.map((edu) => (
              <div key={edu.id} style={{ marginBottom: "10px", paddingLeft: "14px", borderLeft: `2px solid ${accent}30` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                  <span style={{ fontSize: fs.small, color: "#9ca3af", fontFamily: "'Courier New', monospace" }}>{formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}</span>
                </div>
                <div style={{ fontSize: fs.body, color: accent, fontWeight: 500 }}>{edu.institution}</div>
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                    {edu.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.5, paddingLeft: "18px", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, top: "4px", fontSize: "10px", color: accent, fontFamily: "'Courier New', monospace", fontWeight: 700 }}>{`>`}</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects - with tech badges */}
        {enabledProjects.length > 0 && (
          <div style={{ marginBottom: "22px" }}>
            <SectionHead icon={<IconCode color={accent} size={13} />} title="projects" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {enabledProjects.map((proj) => (
                <div key={proj.id} style={{ padding: "10px 14px", borderRadius: "6px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827", fontFamily: "'Courier New', monospace" }}>{proj.title}</span>
                    {proj.url && (
                      <span style={{ fontSize: "9px", color: accent }}>
                        <IconGlobe color={accent} size={9} />
                      </span>
                    )}
                  </div>
                  {proj.description && <p style={{ fontSize: fs.small, color: "#4b5563", marginTop: "4px", lineHeight: 1.4 }}>{proj.description}</p>}
                  {proj.techStack.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "6px" }}>
                      {proj.techStack.map((t, i) => (
                        <span key={i} style={{ fontSize: "8.5px", padding: "2px 7px", borderRadius: "3px", backgroundColor: "#1e293b", color: accent, fontWeight: 600, fontFamily: "'Courier New', monospace" }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {enabledCerts.length > 0 && (
          <div style={{ marginBottom: "22px" }}>
            <SectionHead icon={<IconAward color={accent} size={13} />} title="certifications" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {enabledCerts.map((cert) => (
                <div key={cert.id} style={{ padding: "6px 12px", borderRadius: "4px", backgroundColor: `${accent}08`, border: `1px solid ${accent}20` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <IconShield color={accent} size={10} />
                    <span style={{ fontSize: fs.small, fontWeight: 600, color: "#111827", fontFamily: "'Courier New', monospace" }}>{cert.name}</span>
                  </div>
                  <div style={{ fontSize: "9.5px", color: "#6b7280", marginLeft: "15px" }}>
                    {cert.issuer}{cert.date && ` · ${formatDisplayDate(cert.date)}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {config.customSections.map((section) => (
          <div key={section.id} style={{ marginBottom: "22px" }}>
            <SectionHead icon={<IconStar color={accent} size={13} />} title={section.title.toLowerCase()} />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {section.items.map((item) => (
                <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "18px", position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, top: "4px", fontSize: "10px", color: accent, fontFamily: "'Courier New', monospace", fontWeight: 700 }}>{`>`}</span>
                  {item.content}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   12. METRO TEMPLATE
   Windows Metro / tiles flat design — sharp corners, grid tiles, flat colors
   ═══════════════════════════════════════════════ */
function MetroTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 32

  function TileHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <div style={{ width: "28px", height: "28px", backgroundColor: accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ fontSize: fs.h2, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: "2px" }}>{title}</div>
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <div key="summary" style={{ marginBottom: "20px" }}>
          <TileHeader icon={<IconUser color="white" size={14} />} title="Summary" />
          <div style={{ backgroundColor: "#f3f4f6", padding: "14px 16px", fontSize: fs.body, color: "#374151", lineHeight: 1.7 }}>{p.summary}</div>
        </div>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <div key="experience" style={{ marginBottom: "20px" }}>
          <TileHeader icon={<IconBriefcase color="white" size={14} />} title="Experience" />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {enabledExp.map((exp) => (
              <div key={exp.id} style={{ backgroundColor: "#f9fafb", border: `2px solid ${accent}20`, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</span>
                    {exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 600 }}> | {exp.company}</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                    <IconCalendar color="#9ca3af" size={10} />
                    <span style={{ fontSize: fs.small, color: "#9ca3af" }}>
                      {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                    </span>
                  </div>
                </div>
                {exp.location && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                    <IconMapPin color="#9ca3af" size={10} />
                    <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{exp.location}</span>
                  </div>
                )}
                {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "6px", lineHeight: 1.6, margin: "6px 0 0 0" }}>{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0 0" }}>
                    {exp.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, top: "7px", width: "6px", height: "6px", backgroundColor: accent }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <div key="education" style={{ marginBottom: "20px" }}>
          <TileHeader icon={<IconGradCap color="white" size={14} />} title="Education" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {enabledEdu.map((edu) => (
              <div key={edu.id} style={{ backgroundColor: `${accent}08`, border: `2px solid ${accent}15`, padding: "12px 14px" }}>
                <div style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>
                  {edu.degree}{edu.field && ` in ${edu.field}`}
                </div>
                <div style={{ fontSize: fs.body, color: "#6b7280", marginTop: "2px" }}>{edu.institution}</div>
                <div style={{ fontSize: fs.small, color: "#9ca3af", marginTop: "2px" }}>
                  {formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}
                </div>
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                    {edu.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.small, color: "#4b5563", lineHeight: 1.5, paddingLeft: "10px", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, top: "6px", width: "4px", height: "4px", backgroundColor: accent }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <div key="skills" style={{ marginBottom: "20px" }}>
          <TileHeader icon={<IconLayers color="white" size={14} />} title="Skills" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {config.skillCategories.map((cat) =>
              cat.skills.map((skill, i) => (
                <div key={`${cat.id}-${i}`} style={{ backgroundColor: accent, color: "white", padding: "6px 14px", fontSize: fs.small, fontWeight: 600, minWidth: "60px", textAlign: "center" }}>
                  {skill}
                </div>
              ))
            )}
          </div>
          {config.skillCategories.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
              {config.skillCategories.map((cat) => (
                <span key={cat.id} style={{ fontSize: "9px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                  [{cat.name}]
                </span>
              ))}
            </div>
          )}
        </div>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <div key="projects" style={{ marginBottom: "20px" }}>
          <TileHeader icon={<IconFolder color="white" size={14} />} title="Projects" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {enabledProjects.map((proj) => (
              <div key={proj.id} style={{ backgroundColor: "#f9fafb", border: `2px solid ${accent}15`, padding: "12px 14px" }}>
                <div style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</div>
                {proj.url && (
                  <a href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.small, color: accent, textDecoration: "none", fontWeight: 500 }}>
                    {proj.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                )}
                {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.5, margin: "4px 0 0 0" }}>{proj.description}</p>}
                {proj.techStack.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "6px" }}>
                    {proj.techStack.map((t, i) => (
                      <span key={i} style={{ fontSize: "9px", padding: "2px 6px", backgroundColor: `${accent}15`, color: accent, fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <div key="certifications" style={{ marginBottom: "20px" }}>
          <TileHeader icon={<IconAward color="white" size={14} />} title="Certifications" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ backgroundColor: `${accent}08`, border: `2px solid ${accent}20`, padding: "10px 14px", minWidth: "180px" }}>
                {cert.url ? (
                  <a href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.h3, fontWeight: 600, color: accent, textDecoration: "none" }}>{cert.name}</a>
                ) : (
                  <div style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>{cert.name}</div>
                )}
                {cert.issuer && <div style={{ fontSize: fs.small, color: "#6b7280", marginTop: "2px" }}>{cert.issuer}</div>}
                {cert.date && <div style={{ fontSize: fs.small, color: "#9ca3af", marginTop: "1px" }}>{formatDisplayDate(cert.date)}</div>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <div key={section.id} style={{ marginBottom: "20px" }}>
              <TileHeader icon={<IconStar color="white" size={14} />} title={section.title} />
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {section.items.map((item) => (
                  <div key={item.id} style={{ backgroundColor: "#f9fafb", padding: "8px 14px", fontSize: fs.body, color: "#4b5563", lineHeight: 1.6 }}>
                    {item.content}
                  </div>
                ))}
              </div>
            </div>
          ))
        : null,
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: `${pad}px` }}>
      {/* Header Tile */}
      <div style={{ backgroundColor: accent, padding: "24px 28px", marginBottom: "20px", color: "white" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "60px", height: "60px", border: "3px solid rgba(255,255,255,0.4)", overflow: "hidden", flexShrink: 0 }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: fs.h1, fontWeight: 800, margin: 0, lineHeight: 1.2, letterSpacing: "-0.5px" }}>
              {p.fullName || "Your Name"}
            </h1>
            {p.title && <div style={{ fontSize: fs.h2, opacity: 0.9, marginTop: "4px", fontWeight: 400 }}>{p.title}</div>}
          </div>
        </div>
      </div>

      {/* Contact Icon Tiles */}
      {contacts.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
          {contacts.map((c, i) => {
            const href = contactHref(c.type, c.value)
            const inner = (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#f3f4f6", padding: "6px 12px", fontSize: fs.small, color: "#374151" }}>
                {contactIcon(c.type, accent, 12)}
                <span>{c.value}</span>
              </div>
            )
            return href ? (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>{inner}</a>
            ) : (
              <div key={i}>{inner}</div>
            )
          })}
        </div>
      )}

      {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   13. NEWSPAPER TEMPLATE
   Editorial style — serif fonts, two columns, justified text, pull-quote summary
   ═══════════════════════════════════════════════ */
function NewspaperTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 32
  const serif = "'Georgia', 'Times New Roman', 'Times', serif"

  function SectionTitle({ title }: { title: string }) {
    return (
      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontSize: fs.h2, fontWeight: 700, fontVariant: "small-caps", letterSpacing: "1.5px", color: "#1f2937", fontFamily: serif }}>{title}</div>
        <div style={{ height: "1px", backgroundColor: "#d1d5db", marginTop: "4px" }} />
      </div>
    )
  }

  // Left column sections: experience, projects
  const leftSections: Record<string, () => React.ReactNode> = {
    experience: () =>
      enabledExp.length > 0 ? (
        <div key="experience" style={{ marginBottom: "18px" }}>
          <SectionTitle title="Work Experience" />
          {enabledExp.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827", fontFamily: serif }}>{exp.title}</div>
              {exp.company && <div style={{ fontSize: fs.body, color: accent, fontWeight: 600, fontStyle: "italic" }}>{exp.company}</div>}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                <span style={{ fontSize: fs.small, color: "#9ca3af" }}>
                  {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                </span>
                {exp.location && (
                  <>
                    <span style={{ fontSize: fs.small, color: "#d1d5db" }}>|</span>
                    <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{exp.location}</span>
                  </>
                )}
              </div>
              {exp.description && <p style={{ fontSize: fs.body, color: "#374151", marginTop: "4px", lineHeight: 1.7, textAlign: "justify", fontFamily: serif, margin: "4px 0 0 0" }}>{exp.description}</p>}
              {exp.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                  {exp.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: "#374151", lineHeight: 1.7, textAlign: "justify", fontFamily: serif, paddingLeft: "12px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: accent, fontWeight: 700 }}>&bull;</span>
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <div key="projects" style={{ marginBottom: "18px" }}>
          <SectionTitle title="Projects" />
          {enabledProjects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827", fontFamily: serif }}>{proj.title}</span>
                {proj.url && (
                  <a href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.small, color: accent, textDecoration: "none" }}>
                    {proj.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                )}
              </div>
              {proj.description && <p style={{ fontSize: fs.body, color: "#374151", marginTop: "3px", lineHeight: 1.7, textAlign: "justify", fontFamily: serif, margin: "3px 0 0 0" }}>{proj.description}</p>}
              {proj.techStack.length > 0 && (
                <div style={{ fontSize: fs.small, color: "#6b7280", marginTop: "3px", fontStyle: "italic" }}>
                  Tech: {proj.techStack.join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <div key={section.id} style={{ marginBottom: "18px" }}>
              <SectionTitle title={section.title} />
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: "#374151", lineHeight: 1.7, fontFamily: serif, paddingLeft: "12px", position: "relative", textAlign: "justify" }}>
                    <span style={{ position: "absolute", left: 0, color: accent, fontWeight: 700 }}>&bull;</span>
                    {item.content}
                  </li>
                ))}
              </ul>
            </div>
          ))
        : null,
  }

  // Right column sections: education, skills, certifications
  const rightSections: Record<string, () => React.ReactNode> = {
    education: () =>
      enabledEdu.length > 0 ? (
        <div key="education" style={{ marginBottom: "18px" }}>
          <SectionTitle title="Education" />
          {enabledEdu.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827", fontFamily: serif }}>
                {edu.degree}{edu.field && ` in ${edu.field}`}
              </div>
              <div style={{ fontSize: fs.body, color: "#6b7280", fontStyle: "italic" }}>{edu.institution}</div>
              <div style={{ fontSize: fs.small, color: "#9ca3af" }}>
                {formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}
              </div>
              {edu.achievements && edu.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "3px 0 0 0" }}>
                  {edu.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: "#374151", lineHeight: 1.6, fontFamily: serif, paddingLeft: "12px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: accent }}>&bull;</span>
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <div key="skills" style={{ marginBottom: "18px" }}>
          <SectionTitle title="Skills" />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {config.skillCategories.map((cat) => (
              <div key={cat.id}>
                <div style={{ fontSize: fs.small, fontWeight: 700, color: "#111827", fontVariant: "small-caps", fontFamily: serif }}>{cat.name}</div>
                <div style={{ fontSize: fs.body, color: "#374151", lineHeight: 1.6, fontFamily: serif }}>{cat.skills.join(", ")}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <div key="certifications" style={{ marginBottom: "18px" }}>
          <SectionTitle title="Certifications" />
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id}>
                {cert.url ? (
                  <a href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.h3, fontWeight: 600, color: accent, textDecoration: "none", fontFamily: serif }}>{cert.name}</a>
                ) : (
                  <span style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827", fontFamily: serif }}>{cert.name}</span>
                )}
                {cert.issuer && <span style={{ fontSize: fs.body, color: "#6b7280", fontFamily: serif }}> — {cert.issuer}</span>}
                {cert.date && <div style={{ fontSize: fs.small, color: "#9ca3af" }}>{formatDisplayDate(cert.date)}</div>}
              </div>
            ))}
          </div>
        </div>
      ) : null,
  }

  const leftKeys = ["experience", "projects", "custom"]
  const rightKeys = ["education", "skills", "certifications"]

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: `${pad}px ${pad + 6}px`, fontFamily: serif }}>
      {/* Masthead */}
      <div style={{ textAlign: "center", marginBottom: "6px" }}>
        <div style={{ height: "3px", backgroundColor: "#111827", marginBottom: "10px" }} />
        {config.showProfileImage && p.profileImage && (
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", border: `2px solid ${accent}`, margin: "0 auto 8px", overflow: "hidden" }}>
            <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <h1 style={{ fontSize: "30px", fontWeight: 800, fontFamily: serif, letterSpacing: "2px", color: "#111827", margin: 0, lineHeight: 1.2, textTransform: "uppercase" }}>
          {p.fullName || "Your Name"}
        </h1>
        {p.title && <div style={{ fontSize: fs.h2, color: "#6b7280", fontStyle: "italic", marginTop: "4px", fontFamily: serif }}>{p.title}</div>}
        <div style={{ height: "1px", backgroundColor: "#111827", marginTop: "10px" }} />
      </div>

      {/* Contact Row */}
      {contacts.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px 18px", marginBottom: "4px", paddingBottom: "10px", borderBottom: "1px solid #e5e7eb" }}>
          {contacts.map((c, i) => {
            const href = contactHref(c.type, c.value)
            const inner = (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: fs.small, color: "#6b7280" }}>
                {contactIcon(c.type, accent, 10)}
                {c.value}
              </span>
            )
            return href ? (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>{inner}</a>
            ) : (
              <span key={i}>{inner}</span>
            )
          })}
        </div>
      )}

      {/* Pull-quote Summary */}
      {p.summary && (
        <div style={{ padding: "12px 20px", margin: "12px 0 16px", borderLeft: `3px solid ${accent}`, position: "relative" }}>
          <span style={{ fontSize: "36px", fontFamily: serif, color: accent, lineHeight: 1, position: "absolute", top: "2px", left: "6px", opacity: 0.5 }}>&ldquo;</span>
          <p style={{ fontSize: fs.body, color: "#374151", lineHeight: 1.8, textAlign: "justify", fontFamily: serif, margin: 0, paddingLeft: "20px" }}>{p.summary}</p>
        </div>
      )}

      {/* Two Column Layout */}
      <div style={{ display: "flex", gap: "24px" }}>
        <div style={{ flex: 1 }}>
          {config.sectionOrder.filter((sec) => leftKeys.includes(sec)).map((section) => leftSections[section] ? leftSections[section]() : null)}
        </div>
        <div style={{ flex: 1 }}>
          {config.sectionOrder.filter((sec) => rightKeys.includes(sec)).map((section) => rightSections[section] ? rightSections[section]() : null)}
        </div>
      </div>

      {config.sectionOrder.filter((sec) => !leftKeys.includes(sec) && !rightKeys.includes(sec) && sec !== "summary").map((section) => {
        if (leftSections[section]) return leftSections[section]()
        if (rightSections[section]) return rightSections[section]()
        return null
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   14. INFOGRAPHIC TEMPLATE
   Data-visualization inspired — percentage bars, timeline, icon circles, accent gradients
   ═══════════════════════════════════════════════ */
function InfographicTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 32

  function SectionDivider({ title, icon }: { title: string; icon: React.ReactNode }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", marginTop: "6px" }}>
        <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ fontSize: fs.h2, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", letterSpacing: "1.5px" }}>{title}</div>
        <div style={{ flex: 1, height: "3px", background: `linear-gradient(90deg, ${accent}, ${accent}40, transparent)`, borderRadius: "2px" }} />
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <div key="summary" style={{ marginBottom: "20px" }}>
          <SectionDivider title="About" icon={<IconUser color="white" size={14} />} />
          <p style={{ fontSize: fs.body, color: "#374151", lineHeight: 1.8, borderLeft: `4px solid ${accent}`, paddingLeft: "16px", margin: 0 }}>{p.summary}</p>
        </div>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <div key="experience" style={{ marginBottom: "20px" }}>
          <SectionDivider title="Experience" icon={<IconBriefcase color="white" size={14} />} />
          <div style={{ position: "relative", paddingLeft: "0" }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "2px", backgroundColor: `${accent}30`, transform: "translateX(-50%)" }} />
            {enabledExp.map((exp, idx) => {
              const isLeft = idx % 2 === 0
              return (
                <div key={exp.id} style={{ display: "flex", marginBottom: "16px", position: "relative" }}>
                  <div style={{ width: "48%", paddingRight: isLeft ? "16px" : "0", textAlign: isLeft ? "right" : "left" }}>
                    {isLeft && (
                      <div style={{ backgroundColor: "#f9fafb", border: `1px solid ${accent}25`, borderRadius: "8px", padding: "12px 14px" }}>
                        <div style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827", textAlign: "left" }}>{exp.title}</div>
                        {exp.company && <div style={{ fontSize: fs.body, color: accent, fontWeight: 600, textAlign: "left" }}>{exp.company}</div>}
                        <div style={{ fontSize: fs.small, color: "#9ca3af", marginTop: "2px", textAlign: "left" }}>
                          {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                        </div>
                        {exp.location && <div style={{ fontSize: fs.small, color: "#9ca3af", textAlign: "left" }}>{exp.location}</div>}
                        {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.6, textAlign: "left", margin: "4px 0 0 0" }}>{exp.description}</p>}
                        {exp.achievements.length > 0 && (
                          <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0", textAlign: "left" }}>
                            {exp.achievements.map((a, i) => (
                              <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "12px", position: "relative" }}>
                                <span style={{ position: "absolute", left: 0, top: "7px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                                {a}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ position: "absolute", left: "50%", top: "12px", transform: "translateX(-50%)", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: accent, border: "2px solid white", zIndex: 1 }} />
                  <div style={{ width: "48%", paddingLeft: isLeft ? "0" : "16px", marginLeft: isLeft ? "auto" : "0" }}>
                    {!isLeft && (
                      <div style={{ backgroundColor: "#f9fafb", border: `1px solid ${accent}25`, borderRadius: "8px", padding: "12px 14px" }}>
                        <div style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</div>
                        {exp.company && <div style={{ fontSize: fs.body, color: accent, fontWeight: 600 }}>{exp.company}</div>}
                        <div style={{ fontSize: fs.small, color: "#9ca3af", marginTop: "2px" }}>
                          {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                        </div>
                        {exp.location && <div style={{ fontSize: fs.small, color: "#9ca3af" }}>{exp.location}</div>}
                        {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.6, margin: "4px 0 0 0" }}>{exp.description}</p>}
                        {exp.achievements.length > 0 && (
                          <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                            {exp.achievements.map((a, i) => (
                              <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "12px", position: "relative" }}>
                                <span style={{ position: "absolute", left: 0, top: "7px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                                {a}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <div key="education" style={{ marginBottom: "20px" }}>
          <SectionDivider title="Education" icon={<IconGradCap color="white" size={14} />} />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {enabledEdu.map((edu) => (
              <div key={edu.id} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: accent, marginTop: "6px", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </div>
                  <div style={{ fontSize: fs.body, color: "#6b7280" }}>{edu.institution}</div>
                  <div style={{ fontSize: fs.small, color: "#9ca3af" }}>
                    {formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}
                  </div>
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul style={{ listStyle: "none", padding: 0, margin: "3px 0 0 0" }}>
                      {edu.achievements.map((a, i) => (
                        <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "12px", position: "relative" }}>
                          <span style={{ position: "absolute", left: 0, top: "7px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: `${accent}60` }} />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <div key="skills" style={{ marginBottom: "20px" }}>
          <SectionDivider title="Skills" icon={<IconLayers color="white" size={14} />} />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {config.skillCategories.map((cat) => (
              <div key={cat.id}>
                <div style={{ fontSize: fs.small, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" }}>{cat.name}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {cat.skills.map((skill, i) => {
                    const barWidth = Math.max(35, 100 - i * 8)
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ fontSize: fs.small, color: "#374151", minWidth: "90px", fontWeight: 500 }}>{skill}</div>
                        <div style={{ flex: 1, height: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${barWidth}%`, height: "100%", background: `linear-gradient(90deg, ${accent}, ${accent}aa)`, borderRadius: "4px" }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <div key="projects" style={{ marginBottom: "20px" }}>
          <SectionDivider title="Projects" icon={<IconFolder color="white" size={14} />} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {enabledProjects.map((proj) => (
              <div key={proj.id} style={{ backgroundColor: "#f9fafb", borderRadius: "8px", padding: "12px 14px", borderLeft: `3px solid ${accent}` }}>
                <div style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</div>
                {proj.url && (
                  <a href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.small, color: accent, textDecoration: "none" }}>
                    {proj.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                )}
                {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "3px", lineHeight: 1.5, margin: "3px 0 0 0" }}>{proj.description}</p>}
                {proj.techStack.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "4px" }}>
                    {proj.techStack.map((t, i) => (
                      <span key={i} style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "10px", backgroundColor: `${accent}15`, color: accent, fontWeight: 500 }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <div key="certifications" style={{ marginBottom: "20px" }}>
          <SectionDivider title="Certifications" icon={<IconAward color="white" size={14} />} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#f9fafb", borderRadius: "8px", padding: "10px 14px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `linear-gradient(135deg, ${accent}30, ${accent}10)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <IconAward color={accent} size={16} />
                </div>
                <div>
                  {cert.url ? (
                    <a href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.h3, fontWeight: 600, color: accent, textDecoration: "none" }}>{cert.name}</a>
                  ) : (
                    <div style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>{cert.name}</div>
                  )}
                  {cert.issuer && <div style={{ fontSize: fs.small, color: "#6b7280" }}>{cert.issuer}</div>}
                  {cert.date && <div style={{ fontSize: fs.small, color: "#9ca3af" }}>{formatDisplayDate(cert.date)}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <div key={section.id} style={{ marginBottom: "20px" }}>
              <SectionDivider title={section.title} icon={<IconStar color="white" size={14} />} />
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, marginBottom: "4px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: accent, marginTop: "7px", flexShrink: 0 }} />
                    {item.content}
                  </li>
                ))}
              </ul>
            </div>
          ))
        : null,
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: `${pad}px` }}>
      {/* Header with thick left accent */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "8px" }}>
        <div style={{ width: "6px", alignSelf: "stretch", background: `linear-gradient(180deg, ${accent}, ${accent}60)`, borderRadius: "3px" }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {config.showProfileImage && p.profileImage && (
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: `3px solid ${accent}`, overflow: "hidden", flexShrink: 0 }}>
                <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <div>
              <h1 style={{ fontSize: fs.h1, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.2, letterSpacing: "-0.5px" }}>
                {p.fullName || "Your Name"}
              </h1>
              {p.title && <div style={{ fontSize: fs.h2, color: accent, fontWeight: 500, marginTop: "4px" }}>{p.title}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Icon Circles */}
      {contacts.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "18px", paddingBottom: "14px", borderBottom: `2px solid ${accent}15` }}>
          {contacts.map((c, i) => {
            const href = contactHref(c.type, c.value)
            const inner = (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `linear-gradient(135deg, ${accent}20, ${accent}08)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {contactIcon(c.type, accent, 13)}
                </div>
                <span style={{ fontSize: fs.small, color: "#374151" }}>{c.value}</span>
              </div>
            )
            return href ? (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>{inner}</a>
            ) : (
              <div key={i}>{inner}</div>
            )
          })}
        </div>
      )}

      {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   15. NORDIC TEMPLATE
   Scandinavian minimalism — whitespace, ultra-thin weight, no borders, no lines
   ═══════════════════════════════════════════════ */
function NordicTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 40

  function SectionLabel({ title }: { title: string }) {
    return (
      <div style={{ fontSize: fs.h2, fontWeight: 300, color: accent, textTransform: "uppercase", letterSpacing: "3px", marginBottom: "14px" }}>{title}</div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <div key="summary" style={{ marginBottom: "32px" }}>
          <SectionLabel title="About" />
          <p style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.9, margin: 0, maxWidth: "540px" }}>{p.summary}</p>
        </div>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <div key="experience" style={{ marginBottom: "32px" }}>
          <SectionLabel title="Experience" />
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {enabledExp.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>{exp.title}</span>
                    {exp.company && <span style={{ fontSize: fs.h3, color: "#9ca3af", fontWeight: 300 }}> — {exp.company}</span>}
                  </div>
                  <span style={{ fontSize: fs.small, color: "#9ca3af", fontWeight: 300, flexShrink: 0 }}>
                    {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                  </span>
                </div>
                {exp.location && <div style={{ fontSize: fs.small, color: "#d1d5db", marginTop: "1px", fontWeight: 300 }}>{exp.location}</div>}
                {exp.description && <p style={{ fontSize: fs.body, color: "#6b7280", marginTop: "6px", lineHeight: 1.8, margin: "6px 0 0 0" }}>{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0 0" }}>
                    {exp.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.8, paddingLeft: "16px", position: "relative" }}>
                        <span style={{ position: "absolute", left: "4px", top: "10px", width: "4px", height: "1px", backgroundColor: "#d1d5db" }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <div key="education" style={{ marginBottom: "32px" }}>
          <SectionLabel title="Education" />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {enabledEdu.map((edu) => (
              <div key={edu.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </span>
                  <span style={{ fontSize: fs.small, color: "#9ca3af", fontWeight: 300, flexShrink: 0 }}>
                    {formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}
                  </span>
                </div>
                <div style={{ fontSize: fs.body, color: "#9ca3af", fontWeight: 300, marginTop: "1px" }}>{edu.institution}</div>
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                    {edu.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.8, paddingLeft: "16px", position: "relative" }}>
                        <span style={{ position: "absolute", left: "4px", top: "10px", width: "4px", height: "1px", backgroundColor: "#d1d5db" }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <div key="skills" style={{ marginBottom: "32px" }}>
          <SectionLabel title="Skills" />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {config.skillCategories.map((cat) => (
              <div key={cat.id} style={{ fontSize: fs.body }}>
                <span style={{ fontWeight: 500, color: "#111827" }}>{cat.name}: </span>
                <span style={{ color: "#6b7280", fontWeight: 300 }}>{cat.skills.join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <div key="projects" style={{ marginBottom: "32px" }}>
          <SectionLabel title="Projects" />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {enabledProjects.map((proj) => (
              <div key={proj.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>{proj.title}</span>
                  {proj.url && (
                    <a href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.small, color: accent, textDecoration: "none", fontWeight: 300 }}>
                      {proj.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  )}
                </div>
                {proj.description && <p style={{ fontSize: fs.body, color: "#6b7280", marginTop: "4px", lineHeight: 1.8, margin: "4px 0 0 0" }}>{proj.description}</p>}
                {proj.techStack.length > 0 && (
                  <div style={{ fontSize: fs.small, color: "#9ca3af", marginTop: "4px", fontWeight: 300 }}>
                    {proj.techStack.join(" / ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <div key="certifications" style={{ marginBottom: "32px" }}>
          <SectionLabel title="Certifications" />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  {cert.url ? (
                    <a href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.h3, fontWeight: 500, color: accent, textDecoration: "none" }}>{cert.name}</a>
                  ) : (
                    <span style={{ fontSize: fs.h3, fontWeight: 500, color: "#111827" }}>{cert.name}</span>
                  )}
                  {cert.issuer && <span style={{ fontSize: fs.body, color: "#9ca3af", fontWeight: 300 }}> — {cert.issuer}</span>}
                </div>
                {cert.date && <span style={{ fontSize: fs.small, color: "#d1d5db", fontWeight: 300, flexShrink: 0 }}>{formatDisplayDate(cert.date)}</span>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <div key={section.id} style={{ marginBottom: "32px" }}>
              <SectionLabel title={section.title} />
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.8, paddingLeft: "16px", position: "relative", marginBottom: "2px" }}>
                    <span style={{ position: "absolute", left: "4px", top: "10px", width: "4px", height: "1px", backgroundColor: "#d1d5db" }} />
                    {item.content}
                  </li>
                ))}
              </ul>
            </div>
          ))
        : null,
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: `${pad + 8}px ${pad + 12}px` }}>
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, opacity: 0.9 }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: 200, color: accent, margin: 0, lineHeight: 1.2, letterSpacing: "1px" }}>
              {p.fullName || "Your Name"}
            </h1>
            {p.title && <div style={{ fontSize: fs.h2, color: "#9ca3af", fontWeight: 300, marginTop: "4px", letterSpacing: "0.5px" }}>{p.title}</div>}
          </div>
        </div>

        {/* Contact in a single muted line */}
        {contacts.length > 0 && (
          <div style={{ marginTop: "12px", fontSize: fs.small, color: "#9ca3af", fontWeight: 300 }}>
            {contacts.map((c, i) => {
              const href = contactHref(c.type, c.value)
              return (
                <span key={i}>
                  {i > 0 && <span style={{ margin: "0 10px", color: "#e5e7eb" }}>|</span>}
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#9ca3af", textDecoration: "none" }}>{c.value}</a>
                  ) : (
                    <span>{c.value}</span>
                  )}
                </span>
              )
            })}
          </div>
        )}
      </div>

      {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   16. CASCADE TEMPLATE
   Staggered/cascading section headers that step down like a waterfall
   ═══════════════════════════════════════════════ */
function CascadeTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 40

  let sectionIndex = 0
  function CascadeHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
    const ml = sectionIndex * 8
    sectionIndex++
    return (
      <div style={{ marginLeft: `${ml}px`, marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "4px", height: "24px", backgroundColor: accent, borderRadius: "2px" }} />
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {icon}
          <span style={{ fontSize: fs.h2, fontWeight: 700, color: "#111827", textTransform: "uppercase" as const, letterSpacing: "1.5px" }}>{title}</span>
        </span>
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <div key="summary" style={{ marginBottom: "24px" }}>
          <CascadeHeader title="Summary" icon={<IconUser color={accent} size={14} />} />
          <p style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.7, margin: "0 0 0 12px" }}>{p.summary}</p>
        </div>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <div key="experience" style={{ marginBottom: "24px" }}>
          <CascadeHeader title="Experience" icon={<IconBriefcase color={accent} size={14} />} />
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginLeft: "12px" }}>
            {enabledExp.map((exp) => (
              <div key={exp.id} style={{ backgroundColor: "#fafafa", border: "1px solid #f3f4f6", borderRadius: "6px", padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</span>
                  <span style={{ fontSize: fs.small, color: "#9ca3af", flexShrink: 0 }}>
                    {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                  </span>
                </div>
                {exp.company && <div style={{ fontSize: fs.body, color: accent, fontWeight: 600, marginTop: "2px" }}>{exp.company}</div>}
                {exp.location && <div style={{ fontSize: fs.small, color: "#9ca3af", marginTop: "1px" }}>{exp.location}</div>}
                {exp.description && <p style={{ fontSize: fs.body, color: "#6b7280", marginTop: "6px", lineHeight: 1.6, margin: "6px 0 0 0" }}>{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul style={{ margin: "6px 0 0 0", paddingLeft: "16px" }}>
                    {exp.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.6 }}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <div key="education" style={{ marginBottom: "24px" }}>
          <CascadeHeader title="Education" icon={<IconGradCap color={accent} size={14} />} />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginLeft: "12px" }}>
            {enabledEdu.map((edu) => (
              <div key={edu.id} style={{ backgroundColor: "#fafafa", border: "1px solid #f3f4f6", borderRadius: "6px", padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </span>
                  <span style={{ fontSize: fs.small, color: "#9ca3af", flexShrink: 0 }}>
                    {formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}
                  </span>
                </div>
                <div style={{ fontSize: fs.body, color: "#6b7280", marginTop: "2px" }}>{edu.institution}</div>
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}>
                    {edu.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.6 }}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <div key="skills" style={{ marginBottom: "24px" }}>
          <CascadeHeader title="Skills" icon={<IconStar color={accent} size={14} />} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginLeft: "12px" }}>
            {config.skillCategories.map((cat) =>
              cat.skills.map((skill, i) => (
                <span key={`${cat.id}-${i}`} style={{
                  display: "inline-block", fontSize: fs.small, padding: "3px 10px", backgroundColor: `${accent}14`,
                  color: accent, borderRadius: "12px", fontWeight: 500, border: `1px solid ${accent}30`,
                }}>
                  {cat.name ? `${cat.name}: ${skill}` : skill}
                </span>
              ))
            )}
          </div>
        </div>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <div key="projects" style={{ marginBottom: "24px" }}>
          <CascadeHeader title="Projects" icon={<IconCode color={accent} size={14} />} />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginLeft: "12px" }}>
            {enabledProjects.map((proj) => (
              <div key={proj.id} style={{ backgroundColor: "#fafafa", border: "1px solid #f3f4f6", borderRadius: "6px", padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</span>
                  {proj.url && (
                    <a href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.small, color: accent, textDecoration: "none" }}>
                      {proj.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  )}
                </div>
                {proj.description && <p style={{ fontSize: fs.body, color: "#6b7280", marginTop: "4px", lineHeight: 1.6, margin: "4px 0 0 0" }}>{proj.description}</p>}
                {proj.techStack.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
                    {proj.techStack.map((t, i) => (
                      <span key={i} style={{ fontSize: fs.small, padding: "1px 8px", backgroundColor: "#f3f4f6", borderRadius: "4px", color: "#6b7280" }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <div key="certifications" style={{ marginBottom: "24px" }}>
          <CascadeHeader title="Certifications" icon={<IconAward color={accent} size={14} />} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginLeft: "12px" }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  {cert.url ? (
                    <a href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.h3, fontWeight: 600, color: accent, textDecoration: "none" }}>{cert.name}</a>
                  ) : (
                    <span style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>{cert.name}</span>
                  )}
                  {cert.issuer && <span style={{ fontSize: fs.body, color: "#9ca3af" }}> — {cert.issuer}</span>}
                </div>
                {cert.date && <span style={{ fontSize: fs.small, color: "#9ca3af", flexShrink: 0 }}>{formatDisplayDate(cert.date)}</span>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <div key={section.id} style={{ marginBottom: "24px" }}>
              <CascadeHeader title={section.title} icon={<IconLayers color={accent} size={14} />} />
              <ul style={{ margin: "0 0 0 12px", paddingLeft: "16px" }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.6 }}>{item.content}</li>
                ))}
              </ul>
            </div>
          ))
        : null,
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: `${pad}px` }}>
      {/* Header: name left, title right */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "8px", borderBottom: `3px solid ${accent}`, paddingBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <h1 style={{ fontSize: fs.h1, fontWeight: 800, color: "#111827", margin: 0 }}>{p.fullName || "Your Name"}</h1>
        </div>
        {p.title && <div style={{ fontSize: fs.h2, color: accent, fontWeight: 600, textAlign: "right" }}>{p.title}</div>}
      </div>

      {/* Contact row */}
      {contacts.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "20px", paddingTop: "8px" }}>
          {contacts.map((c, i) => {
            const href = contactHref(c.type, c.value)
            return (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: fs.small, color: "#6b7280" }}>
                {contactIcon(c.type, accent, 10)}
                <LinkText href={href} style={{ color: "#6b7280" }}>{c.value}</LinkText>
              </span>
            )
          })}
        </div>
      )}

      {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   17. HORIZON TEMPLATE
   Horizontal bands of alternating backgrounds
   ═══════════════════════════════════════════════ */
function HorizonTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 40

  let bandIndex = 0
  function Band({ children }: { children: React.ReactNode }) {
    const bg = bandIndex % 2 === 0 ? "#ffffff" : "#f9fafb"
    bandIndex++
    return (
      <div style={{ backgroundColor: bg, padding: `16px ${pad}px`, margin: `0 -${pad}px` }}>
        {children}
      </div>
    )
  }

  function SectionTitle({ title, icon }: { title: string; icon: React.ReactNode }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        {icon}
        <span style={{ fontSize: fs.h2, fontWeight: 700, color: "#111827", textTransform: "uppercase" as const, letterSpacing: "1px" }}>{title}</span>
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <Band key="summary">
          <SectionTitle title="Summary" icon={<IconUser color={accent} size={14} />} />
          <p style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.7, margin: 0 }}>{p.summary}</p>
        </Band>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <Band key="experience">
          <SectionTitle title="Experience" icon={<IconBriefcase color={accent} size={14} />} />
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {enabledExp.map((exp) => (
              <div key={exp.id} style={{ borderLeft: `3px solid ${accent}`, paddingLeft: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</span>
                  <span style={{ fontSize: fs.small, color: "#9ca3af", flexShrink: 0 }}>
                    {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                  </span>
                </div>
                {exp.company && <div style={{ fontSize: fs.body, color: accent, fontWeight: 600 }}>{exp.company}</div>}
                {exp.location && <div style={{ fontSize: fs.small, color: "#9ca3af" }}>{exp.location}</div>}
                {exp.description && <p style={{ fontSize: fs.body, color: "#6b7280", marginTop: "4px", lineHeight: 1.6, margin: "4px 0 0 0" }}>{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}>
                    {exp.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.6 }}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Band>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <Band key="education">
          <SectionTitle title="Education" icon={<IconGradCap color={accent} size={14} />} />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {enabledEdu.map((edu) => (
              <div key={edu.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </span>
                  <span style={{ fontSize: fs.small, color: "#9ca3af", flexShrink: 0 }}>
                    {formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}
                  </span>
                </div>
                <div style={{ fontSize: fs.body, color: "#6b7280" }}>{edu.institution}</div>
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}>
                    {edu.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.6 }}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Band>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <Band key="skills">
          <SectionTitle title="Skills" icon={<IconStar color={accent} size={14} />} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {config.skillCategories.map((cat) => (
              <div key={cat.id}>
                <div style={{ fontSize: fs.small, fontWeight: 700, color: accent, marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{cat.name}</div>
                <div style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.6 }}>{cat.skills.join(", ")}</div>
              </div>
            ))}
          </div>
        </Band>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <Band key="projects">
          <SectionTitle title="Projects" icon={<IconCode color={accent} size={14} />} />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {enabledProjects.map((proj) => (
              <div key={proj.id} style={{ borderLeft: `3px solid ${accent}`, paddingLeft: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</span>
                  {proj.url && (
                    <a href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.small, color: accent, textDecoration: "none" }}>
                      {proj.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  )}
                </div>
                {proj.description && <p style={{ fontSize: fs.body, color: "#6b7280", marginTop: "4px", lineHeight: 1.6, margin: "4px 0 0 0" }}>{proj.description}</p>}
                {proj.techStack.length > 0 && (
                  <div style={{ fontSize: fs.small, color: "#9ca3af", marginTop: "4px" }}>{proj.techStack.join(" · ")}</div>
                )}
              </div>
            ))}
          </div>
        </Band>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <Band key="certifications">
          <SectionTitle title="Certifications" icon={<IconAward color={accent} size={14} />} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  {cert.url ? (
                    <a href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.h3, fontWeight: 600, color: accent, textDecoration: "none" }}>{cert.name}</a>
                  ) : (
                    <span style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>{cert.name}</span>
                  )}
                  {cert.issuer && <span style={{ fontSize: fs.body, color: "#9ca3af" }}> — {cert.issuer}</span>}
                </div>
                {cert.date && <span style={{ fontSize: fs.small, color: "#9ca3af", flexShrink: 0 }}>{formatDisplayDate(cert.date)}</span>}
              </div>
            ))}
          </div>
        </Band>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <Band key={section.id}>
              <SectionTitle title={section.title} icon={<IconLayers color={accent} size={14} />} />
              <ul style={{ margin: 0, paddingLeft: "16px" }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.6 }}>{item.content}</li>
                ))}
              </ul>
            </Band>
          ))
        : null,
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: 0, overflow: "hidden" }}>
      {/* Full-width name banner */}
      <div style={{ padding: `${pad}px ${pad}px 16px`, backgroundColor: "#ffffff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "50px", height: "50px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: fs.h1, fontWeight: 800, color: "#111827", margin: 0 }}>{p.fullName || "Your Name"}</h1>
            {p.title && <div style={{ fontSize: fs.h2, color: "#6b7280", fontWeight: 500, marginTop: "2px" }}>{p.title}</div>}
          </div>
        </div>
        <div style={{ width: "100%", height: "3px", backgroundColor: accent, marginTop: "12px", borderRadius: "2px" }} />

        {/* Contact row with icons */}
        {contacts.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "10px" }}>
            {contacts.map((c, i) => {
              const href = contactHref(c.type, c.value)
              return (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: fs.small, color: "#6b7280" }}>
                  {contactIcon(c.type, accent, 11)}
                  <LinkText href={href} style={{ color: "#6b7280" }}>{c.value}</LinkText>
                </span>
              )
            })}
          </div>
        )}
      </div>

      <div style={{ padding: `8px ${pad}px ${pad}px` }}>
        {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   18. MOSAIC TEMPLATE
   Multi-column masonry-style layout using CSS grid
   ═══════════════════════════════════════════════ */
function MosaicTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 40

  function MosaicSectionTitle({ title, icon }: { title: string; icon: React.ReactNode }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px", borderBottom: `2px solid ${accent}`, paddingBottom: "6px" }}>
        {icon}
        <span style={{ fontSize: fs.h2, fontWeight: 700, color: "#111827", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{title}</span>
      </div>
    )
  }

  // Build grid items for mosaic layout
  const col1Items: React.ReactNode[] = []
  const col23Items: React.ReactNode[] = []

  // Assign sections to columns based on type for mosaic feel
  const sectionRenderers: Record<string, () => void> = {
    skills: () => {
      if (config.skillCategories.length > 0) {
        col1Items.push(
          <div key="skills" style={{ marginBottom: "20px" }}>
            <MosaicSectionTitle title="Skills" icon={<IconStar color={accent} size={13} />} />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {config.skillCategories.map((cat) => (
                <div key={cat.id}>
                  <div style={{ fontSize: fs.small, fontWeight: 700, color: accent, marginBottom: "3px" }}>{cat.name}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {cat.skills.map((skill, i) => (
                      <span key={i} style={{ fontSize: fs.small, padding: "2px 8px", backgroundColor: `${accent}12`, color: "#4b5563", borderRadius: "3px" }}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }
    },

    education: () => {
      if (enabledEdu.length > 0) {
        col1Items.push(
          <div key="education" style={{ marginBottom: "20px" }}>
            <MosaicSectionTitle title="Education" icon={<IconGradCap color={accent} size={13} />} />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {enabledEdu.map((edu) => (
                <div key={edu.id}>
                  <div style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </div>
                  <div style={{ fontSize: fs.body, color: "#6b7280" }}>{edu.institution}</div>
                  <div style={{ fontSize: fs.small, color: "#9ca3af" }}>
                    {formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}
                  </div>
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul style={{ margin: "4px 0 0 0", paddingLeft: "14px" }}>
                      {edu.achievements.map((a, i) => (
                        <li key={i} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.5 }}>{a}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      }
    },

    certifications: () => {
      if (enabledCerts.length > 0) {
        col1Items.push(
          <div key="certifications" style={{ marginBottom: "20px" }}>
            <MosaicSectionTitle title="Certifications" icon={<IconAward color={accent} size={13} />} />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {enabledCerts.map((cert) => (
                <div key={cert.id}>
                  {cert.url ? (
                    <a href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.h3, fontWeight: 600, color: accent, textDecoration: "none", display: "block" }}>{cert.name}</a>
                  ) : (
                    <div style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>{cert.name}</div>
                  )}
                  <div style={{ fontSize: fs.small, color: "#9ca3af" }}>
                    {cert.issuer}{cert.date && ` · ${formatDisplayDate(cert.date)}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }
    },

    summary: () => {
      if (p.summary) {
        col23Items.push(
          <div key="summary" style={{ marginBottom: "20px" }}>
            <MosaicSectionTitle title="Summary" icon={<IconUser color={accent} size={13} />} />
            <p style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.7, margin: 0 }}>{p.summary}</p>
          </div>
        )
      }
    },

    experience: () => {
      if (enabledExp.length > 0) {
        col23Items.push(
          <div key="experience" style={{ marginBottom: "20px" }}>
            <MosaicSectionTitle title="Experience" icon={<IconBriefcase color={accent} size={13} />} />
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {enabledExp.map((exp) => (
                <div key={exp.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                    <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</span>
                    <span style={{ fontSize: fs.small, color: "#9ca3af", flexShrink: 0 }}>
                      {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                    </span>
                  </div>
                  {exp.company && <div style={{ fontSize: fs.body, color: accent, fontWeight: 600 }}>{exp.company}</div>}
                  {exp.location && <div style={{ fontSize: fs.small, color: "#9ca3af" }}>{exp.location}</div>}
                  {exp.description && <p style={{ fontSize: fs.body, color: "#6b7280", marginTop: "4px", lineHeight: 1.6, margin: "4px 0 0 0" }}>{exp.description}</p>}
                  {exp.achievements.length > 0 && (
                    <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}>
                      {exp.achievements.map((a, i) => (
                        <li key={i} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.6 }}>{a}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      }
    },

    projects: () => {
      if (enabledProjects.length > 0) {
        col23Items.push(
          <div key="projects" style={{ marginBottom: "20px" }}>
            <MosaicSectionTitle title="Projects" icon={<IconCode color={accent} size={13} />} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {enabledProjects.map((proj) => (
                <div key={proj.id} style={{ border: `1px solid ${accent}25`, borderRadius: "6px", padding: "10px 12px", backgroundColor: "#fafafa" }}>
                  <div style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827", marginBottom: "3px" }}>{proj.title}</div>
                  {proj.url && (
                    <a href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.small, color: accent, textDecoration: "none", display: "block", marginBottom: "3px" }}>
                      {proj.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  )}
                  {proj.description && <p style={{ fontSize: fs.small, color: "#6b7280", lineHeight: 1.5, margin: "0 0 4px 0" }}>{proj.description}</p>}
                  {proj.techStack.length > 0 && (
                    <div style={{ fontSize: "9px", color: "#9ca3af" }}>{proj.techStack.join(" · ")}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      }
    },

    custom: () => {
      if (config.customSections.length > 0) {
        config.customSections.forEach((section) => {
          col1Items.push(
            <div key={section.id} style={{ marginBottom: "20px" }}>
              <MosaicSectionTitle title={section.title} icon={<IconLayers color={accent} size={13} />} />
              <ul style={{ margin: 0, paddingLeft: "14px" }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.6 }}>{item.content}</li>
                ))}
              </ul>
            </div>
          )
        })
      }
    },
  }

  // Execute section renderers in order
  config.sectionOrder.forEach((section) => {
    if (sectionRenderers[section]) sectionRenderers[section]()
  })

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: `${pad}px` }}>
      {/* Centered header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        {config.showProfileImage && p.profileImage && (
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 8px" }}>
            <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <h1 style={{ fontSize: fs.h1, fontWeight: 800, color: "#111827", margin: 0 }}>{p.fullName || "Your Name"}</h1>
        {p.title && <div style={{ fontSize: fs.h2, color: accent, fontWeight: 600, marginTop: "2px" }}>{p.title}</div>}
        {contacts.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginTop: "8px" }}>
            {contacts.map((c, i) => {
              const href = contactHref(c.type, c.value)
              return (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: fs.small, color: "#6b7280" }}>
                  {contactIcon(c.type, accent, 10)}
                  <LinkText href={href} style={{ color: "#6b7280" }}>{c.value}</LinkText>
                </span>
              )
            })}
          </div>
        )}
      </div>

      {/* 3-column mosaic grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
        {/* Column 1 */}
        <div>{col1Items}</div>
        {/* Columns 2-3 */}
        <div>{col23Items}</div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   19. APEX TEMPLATE
   Angular/geometric design with bold typography
   ═══════════════════════════════════════════════ */
function ApexTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 40

  function ApexSectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        {/* Triangular accent marker */}
        <div style={{ width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderLeft: `10px solid ${accent}`, flexShrink: 0 }} />
        {icon}
        <span style={{ fontSize: fs.h2, fontWeight: 800, color: "#111827", textTransform: "uppercase" as const, letterSpacing: "2px" }}>{title}</span>
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <div key="summary" style={{ marginBottom: "22px" }}>
          <ApexSectionHeader title="Summary" icon={<IconUser color={accent} size={14} />} />
          <p style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.7, margin: 0 }}>{p.summary}</p>
        </div>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <div key="experience" style={{ marginBottom: "22px" }}>
          <ApexSectionHeader title="Experience" icon={<IconBriefcase color={accent} size={14} />} />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {enabledExp.map((exp) => (
              <div key={exp.id} style={{ position: "relative", paddingLeft: "14px" }}>
                {/* Chevron date badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 800, color: "#111827" }}>{exp.title}</span>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "4px",
                    backgroundColor: accent, color: "#ffffff", fontSize: fs.small, fontWeight: 700,
                    padding: "2px 12px 2px 8px", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)",
                  }}>
                    {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Now" : formatDisplayDate(exp.endDate)}`}
                  </div>
                </div>
                {exp.company && <div style={{ fontSize: fs.body, color: accent, fontWeight: 700 }}>{exp.company}</div>}
                {exp.location && <div style={{ fontSize: fs.small, color: "#9ca3af", fontWeight: 500 }}>{exp.location}</div>}
                {exp.description && <p style={{ fontSize: fs.body, color: "#6b7280", marginTop: "4px", lineHeight: 1.6, margin: "4px 0 0 0" }}>{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul style={{ margin: "6px 0 0 0", paddingLeft: "16px" }}>
                    {exp.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.6, marginBottom: "2px" }}>{a}</li>
                    ))}
                  </ul>
                )}
                {/* Left accent bar */}
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", backgroundColor: `${accent}40` }} />
              </div>
            ))}
          </div>
        </div>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <div key="education" style={{ marginBottom: "22px" }}>
          <ApexSectionHeader title="Education" icon={<IconGradCap color={accent} size={14} />} />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {enabledEdu.map((edu) => (
              <div key={edu.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 800, color: "#111827" }}>
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </span>
                  <span style={{ fontSize: fs.small, color: "#ffffff", backgroundColor: accent, padding: "1px 8px", fontWeight: 700 }}>
                    {formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}
                  </span>
                </div>
                <div style={{ fontSize: fs.body, color: "#6b7280", fontWeight: 600, marginTop: "2px" }}>{edu.institution}</div>
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}>
                    {edu.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.6 }}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <div key="skills" style={{ marginBottom: "22px" }}>
          <ApexSectionHeader title="Skills" icon={<IconStar color={accent} size={14} />} />
          {/* Hexagonal-inspired grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "8px" }}>
            {config.skillCategories.flatMap((cat) =>
              cat.skills.map((skill, i) => (
                <div key={`${cat.id}-${i}`} style={{
                  textAlign: "center", fontSize: fs.small, fontWeight: 600, padding: "8px 6px",
                  backgroundColor: `${accent}10`, border: `2px solid ${accent}30`, color: "#374151",
                  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  minHeight: "44px", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {skill}
                </div>
              ))
            )}
          </div>
        </div>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <div key="projects" style={{ marginBottom: "22px" }}>
          <ApexSectionHeader title="Projects" icon={<IconCode color={accent} size={14} />} />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {enabledProjects.map((proj) => (
              <div key={proj.id} style={{ position: "relative", paddingLeft: "14px" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", backgroundColor: `${accent}40` }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 800, color: "#111827" }}>{proj.title}</span>
                  {proj.url && (
                    <a href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.small, color: accent, textDecoration: "none", fontWeight: 600 }}>
                      {proj.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  )}
                </div>
                {proj.description && <p style={{ fontSize: fs.body, color: "#6b7280", marginTop: "4px", lineHeight: 1.6, margin: "4px 0 0 0" }}>{proj.description}</p>}
                {proj.techStack.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                    {proj.techStack.map((t, i) => (
                      <span key={i} style={{ fontSize: fs.small, fontWeight: 600, color: accent, padding: "1px 6px", border: `1px solid ${accent}40`, borderRadius: "2px" }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <div key="certifications" style={{ marginBottom: "22px" }}>
          <ApexSectionHeader title="Certifications" icon={<IconAward color={accent} size={14} />} />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  {cert.url ? (
                    <a href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.h3, fontWeight: 700, color: accent, textDecoration: "none" }}>{cert.name}</a>
                  ) : (
                    <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{cert.name}</span>
                  )}
                  {cert.issuer && <span style={{ fontSize: fs.body, color: "#9ca3af", fontWeight: 500 }}> — {cert.issuer}</span>}
                </div>
                {cert.date && (
                  <span style={{ fontSize: fs.small, color: "#ffffff", backgroundColor: accent, padding: "1px 8px", fontWeight: 700, flexShrink: 0 }}>
                    {formatDisplayDate(cert.date)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <div key={section.id} style={{ marginBottom: "22px" }}>
              <ApexSectionHeader title={section.title} icon={<IconLayers color={accent} size={14} />} />
              <ul style={{ margin: 0, paddingLeft: "16px" }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.6 }}>{item.content}</li>
                ))}
              </ul>
            </div>
          ))
        : null,
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: 0, overflow: "hidden" }}>
      {/* Trapezoid header */}
      <div style={{
        backgroundColor: accent, padding: `${pad}px ${pad}px 20px`,
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), 0 100%)",
        marginBottom: "4px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "52px", height: "52px", borderRadius: "4px", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(255,255,255,0.4)" }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: fs.h1, fontWeight: 900, color: "#ffffff", margin: 0, letterSpacing: "1px" }}>{p.fullName || "Your Name"}</h1>
            {p.title && <div style={{ fontSize: fs.h2, color: "rgba(255,255,255,0.85)", fontWeight: 600, marginTop: "2px" }}>{p.title}</div>}
          </div>
        </div>
      </div>

      {/* Contact row */}
      {contacts.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", padding: `8px ${pad}px 0` }}>
          {contacts.map((c, i) => {
            const href = contactHref(c.type, c.value)
            return (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: fs.small, color: "#6b7280" }}>
                {contactIcon(c.type, accent, 11)}
                <LinkText href={href} style={{ color: "#6b7280" }}>{c.value}</LinkText>
              </span>
            )
          })}
        </div>
      )}

      <div style={{ padding: `16px ${pad}px ${pad}px` }}>
        {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   20. SLATE TEMPLATE
   Dark sidebar on LEFT, clean white main area
   ═══════════════════════════════════════════════ */
function SlateTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 40
  const sideW = config.sidebarWidth ?? 220

  const sidebarBg = "#1e293b"
  const sidebarText = "#e2e8f0"
  const sidebarMuted = "#94a3b8"
  const sidebarDivider = "#334155"

  function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: fs.h2, fontWeight: 700, color: "#ffffff", textTransform: "uppercase" as const, letterSpacing: "1.5px", marginBottom: "8px", paddingBottom: "6px", borderBottom: `1px solid ${sidebarDivider}` }}>
          {title}
        </div>
        {children}
      </div>
    )
  }

  function MainSectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        {icon}
        <span style={{ fontSize: fs.h2, fontWeight: 700, color: "#111827", textTransform: "uppercase" as const, letterSpacing: "1px" }}>{title}</span>
      </div>
    )
  }

  // Sidebar content collectors
  const sidebarContent: React.ReactNode[] = []
  const mainContent: React.ReactNode[] = []

  // Contact always in sidebar
  if (contacts.length > 0) {
    sidebarContent.push(
      <SidebarSection key="contact" title="Contact">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {contacts.map((c, i) => {
            const href = contactHref(c.type, c.value)
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: fs.small }}>
                {contactIcon(c.type, accent, 11)}
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: sidebarText, textDecoration: "none", wordBreak: "break-all" }}>{c.value}</a>
                ) : (
                  <span style={{ color: sidebarText, wordBreak: "break-all" }}>{c.value}</span>
                )}
              </div>
            )
          })}
        </div>
      </SidebarSection>
    )
  }

  const sectionRenderers: Record<string, () => void> = {
    skills: () => {
      if (config.skillCategories.length > 0) {
        sidebarContent.push(
          <SidebarSection key="skills" title="Skills">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {config.skillCategories.map((cat) => (
                <div key={cat.id}>
                  <div style={{ fontSize: fs.small, fontWeight: 700, color: accent, marginBottom: "3px" }}>{cat.name}</div>
                  <div style={{ fontSize: fs.body, color: sidebarMuted, lineHeight: 1.6 }}>{cat.skills.join(", ")}</div>
                </div>
              ))}
            </div>
          </SidebarSection>
        )
      }
    },

    certifications: () => {
      if (enabledCerts.length > 0) {
        sidebarContent.push(
          <SidebarSection key="certifications" title="Certifications">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {enabledCerts.map((cert) => (
                <div key={cert.id}>
                  {cert.url ? (
                    <a href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.h3, fontWeight: 600, color: accent, textDecoration: "none", display: "block" }}>{cert.name}</a>
                  ) : (
                    <div style={{ fontSize: fs.h3, fontWeight: 600, color: sidebarText }}>{cert.name}</div>
                  )}
                  <div style={{ fontSize: fs.small, color: sidebarMuted }}>
                    {cert.issuer}{cert.date && ` · ${formatDisplayDate(cert.date)}`}
                  </div>
                </div>
              ))}
            </div>
          </SidebarSection>
        )
      }
    },

    summary: () => {
      if (p.summary) {
        mainContent.push(
          <div key="summary" style={{ marginBottom: "22px" }}>
            <MainSectionHeader title="Summary" icon={<IconUser color={accent} size={14} />} />
            <p style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.7, margin: 0 }}>{p.summary}</p>
          </div>
        )
      }
    },

    experience: () => {
      if (enabledExp.length > 0) {
        mainContent.push(
          <div key="experience" style={{ marginBottom: "22px" }}>
            <MainSectionHeader title="Experience" icon={<IconBriefcase color={accent} size={14} />} />
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {enabledExp.map((exp) => (
                <div key={exp.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                    <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</span>
                    <span style={{ fontSize: fs.small, color: "#9ca3af", flexShrink: 0 }}>
                      {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                    </span>
                  </div>
                  {exp.company && <div style={{ fontSize: fs.body, color: accent, fontWeight: 600 }}>{exp.company}</div>}
                  {exp.location && <div style={{ fontSize: fs.small, color: "#9ca3af" }}>{exp.location}</div>}
                  {exp.description && <p style={{ fontSize: fs.body, color: "#6b7280", marginTop: "4px", lineHeight: 1.6, margin: "4px 0 0 0" }}>{exp.description}</p>}
                  {exp.achievements.length > 0 && (
                    <ul style={{ listStyle: "none", margin: "6px 0 0 0", padding: 0 }}>
                      {exp.achievements.map((a, i) => (
                        <li key={i} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                          <span style={{ position: "absolute", left: "2px", top: "9px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: `${accent}60` }} />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      }
    },

    education: () => {
      if (enabledEdu.length > 0) {
        mainContent.push(
          <div key="education" style={{ marginBottom: "22px" }}>
            <MainSectionHeader title="Education" icon={<IconGradCap color={accent} size={14} />} />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {enabledEdu.map((edu) => (
                <div key={edu.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                    </span>
                    <span style={{ fontSize: fs.small, color: "#9ca3af", flexShrink: 0 }}>
                      {formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}
                    </span>
                  </div>
                  <div style={{ fontSize: fs.body, color: "#6b7280" }}>{edu.institution}</div>
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul style={{ listStyle: "none", margin: "4px 0 0 0", padding: 0 }}>
                      {edu.achievements.map((a, i) => (
                        <li key={i} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                          <span style={{ position: "absolute", left: "2px", top: "9px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: `${accent}60` }} />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      }
    },

    projects: () => {
      if (enabledProjects.length > 0) {
        mainContent.push(
          <div key="projects" style={{ marginBottom: "22px" }}>
            <MainSectionHeader title="Projects" icon={<IconCode color={accent} size={14} />} />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {enabledProjects.map((proj) => (
                <div key={proj.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</span>
                    {proj.url && (
                      <a href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.small, color: accent, textDecoration: "none" }}>
                        {proj.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </a>
                    )}
                  </div>
                  {proj.description && <p style={{ fontSize: fs.body, color: "#6b7280", marginTop: "4px", lineHeight: 1.6, margin: "4px 0 0 0" }}>{proj.description}</p>}
                  {proj.techStack.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                      {proj.techStack.map((t, i) => (
                        <span key={i} style={{ fontSize: fs.small, padding: "1px 8px", backgroundColor: "#f3f4f6", borderRadius: "3px", color: "#6b7280" }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      }
    },

    custom: () => {
      if (config.customSections.length > 0) {
        config.customSections.forEach((section) => {
          mainContent.push(
            <div key={section.id} style={{ marginBottom: "22px" }}>
              <MainSectionHeader title={section.title} icon={<IconLayers color={accent} size={14} />} />
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: "#6b7280", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                    <span style={{ position: "absolute", left: "2px", top: "9px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: `${accent}60` }} />
                    {item.content}
                  </li>
                ))}
              </ul>
            </div>
          )
        })
      }
    },
  }

  // Execute section renderers in order
  config.sectionOrder.forEach((section) => {
    if (sectionRenderers[section]) sectionRenderers[section]()
  })

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: 0, overflow: "hidden" }}>
      {/* Full-width name bar */}
      <div style={{ padding: `${pad}px ${pad}px 14px`, backgroundColor: "#ffffff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "50px", height: "50px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#111827", margin: 0, letterSpacing: "0.5px" }}>{p.fullName || "Your Name"}</h1>
            {p.title && <div style={{ fontSize: fs.h2, color: accent, fontWeight: 600, marginTop: "2px" }}>{p.title}</div>}
          </div>
        </div>
      </div>

      {/* Two-column: dark sidebar + white main */}
      <div style={{ display: "flex", minHeight: "calc(297mm - 90px)" }}>
        {/* Dark sidebar */}
        <div style={{ width: `${sideW}px`, flexShrink: 0, backgroundColor: sidebarBg, padding: `${pad - 16}px ${pad - 20}px`, color: sidebarText }}>
          {sidebarContent}
        </div>

        {/* White main area */}
        <div style={{ flex: 1, padding: `${pad - 16}px ${pad - 8}px`, backgroundColor: "#ffffff" }}>
          {mainContent}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   21. GLASS TEMPLATE
   Glassmorphism design with frosted glass cards
   ═══════════════════════════════════════════════ */
function GlassTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 32

  const glassCard: React.CSSProperties = {
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: "12px",
    padding: "14px 16px",
    marginBottom: "14px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
  }

  function GlassSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
      <div style={glassCard}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "8px", background: `rgba(255,255,255,0.6)`, border: `1px solid ${accent}30`, flexShrink: 0 }}>
            {icon}
          </div>
          <span style={{ fontSize: fs.h2, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "1.5px" }}>{title}</span>
        </div>
        {children}
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <div key="summary" style={glassCard}>
          <p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#374151", margin: 0 }}>{p.summary}</p>
        </div>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <GlassSection key="experience" icon={<IconBriefcase color={accent} size={13} />} title="Experience">
          {enabledExp.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</span>
                  {exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 500 }}> — {exp.company}</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                  <IconCalendar color="#9ca3af" size={10} />
                  <span style={{ fontSize: fs.small, color: "#9ca3af" }}>
                    {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                  </span>
                </div>
              </div>
              {exp.location && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                  <IconMapPin color="#9ca3af" size={10} />
                  <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{exp.location}</span>
                </div>
              )}
              {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.6 }}>{exp.description}</p>}
              {exp.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
                  {exp.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </GlassSection>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <GlassSection key="education" icon={<IconGradCap color={accent} size={13} />} title="Education">
          {enabledEdu.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>
                  {edu.degree}{edu.field && ` in ${edu.field}`}
                </span>
                <span style={{ fontSize: fs.small, color: "#9ca3af" }}>
                  {formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}
                </span>
              </div>
              <div style={{ fontSize: fs.body, color: "#6b7280", marginTop: "1px" }}>{edu.institution}</div>
              {edu.achievements && edu.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                  {edu.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </GlassSection>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <GlassSection key="skills" icon={<IconLayers color={accent} size={13} />} title="Skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {config.skillCategories.flatMap((cat) =>
              cat.skills.map((skill, i) => (
                <span key={`${cat.id}-${i}`} style={{
                  fontSize: fs.small,
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${accent}30`,
                  color: accent,
                  fontWeight: 600,
                }}>{skill}</span>
              ))
            )}
          </div>
        </GlassSection>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <GlassSection key="projects" icon={<IconFolder color={accent} size={13} />} title="Projects">
          {enabledProjects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</span>
                {proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}
              </div>
              {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "3px", lineHeight: 1.5 }}>{proj.description}</p>}
              {proj.techStack.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                  {proj.techStack.map((t, i) => (
                    <span key={i} style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "10px", background: "rgba(255,255,255,0.5)", border: `1px solid ${accent}25`, color: accent, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </GlassSection>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <GlassSection key="certifications" icon={<IconAward color={accent} size={13} />} title="Certifications">
          {enabledCerts.map((cert) => (
            <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "5px" }}>
              <div>
                <span style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>{cert.name}</span>
                {cert.issuer && <span style={{ fontSize: fs.body, color: "#6b7280" }}> — {cert.issuer}</span>}
                {cert.url && <> · <UrlLink url={cert.url} color={accent} fontSize={fs.small} /></>}
              </div>
              {cert.date && <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{formatDisplayDate(cert.date)}</span>}
            </div>
          ))}
        </GlassSection>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <GlassSection key={section.id} icon={<IconStar color={accent} size={13} />} title={section.title}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                    {item.content}
                  </li>
                ))}
              </ul>
            </GlassSection>
          ))
        : null,
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, background: `linear-gradient(135deg, ${accent}08 0%, ${accent}15 50%, ${accent}05 100%)`, padding: 0, overflow: "hidden" }}>
      {/* Frosted glass header */}
      <div style={{
        background: `linear-gradient(135deg, ${accent}cc, ${accent}aa)`,
        backdropFilter: "blur(16px)",
        padding: `${pad}px ${pad + 8}px ${pad - 8}px`,
        position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {config.showProfileImage && p.profileImage && (
              <div style={{ width: "60px", height: "60px", borderRadius: "14px", border: "2px solid rgba(255,255,255,0.4)", overflow: "hidden", flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <div>
              <h1 style={{ fontSize: fs.h1, fontWeight: 800, color: "white", margin: 0, lineHeight: 1.2, textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                {p.fullName || "Your Name"}
              </h1>
              {p.title && <div style={{ fontSize: fs.h2, color: "rgba(255,255,255,0.9)", fontWeight: 500, marginTop: "4px" }}>{p.title}</div>}
            </div>
          </div>
          {contacts.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "14px" }}>
              {contacts.map((c, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  fontSize: fs.small, color: "rgba(255,255,255,0.9)",
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}>
                  {contactIcon(c.type, "rgba(255,255,255,0.85)", 10)}
                  <LinkText href={contactHref(c.type, c.value)} style={{ color: "rgba(255,255,255,0.95)" }}>{c.value}</LinkText>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: `${pad - 8}px ${pad + 8}px ${pad}px` }}>
        {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   22. GRADIENT TEMPLATE
   Bold gradient backgrounds and accent fills
   ═══════════════════════════════════════════════ */
function GradientTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const secondary = accent + "99"
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 32

  function GradSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
      <div style={{ marginBottom: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", paddingLeft: "12px", borderLeft: `3px solid transparent`, borderImage: `linear-gradient(to bottom, ${accent}, ${secondary}) 1` }}>
          {icon}
          <span style={{ fontSize: fs.h2, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "1.5px" }}>{title}</span>
        </div>
        {children}
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <div key="summary" style={{ marginBottom: "18px", paddingLeft: "15px", borderLeft: `3px solid transparent`, borderImage: `linear-gradient(to bottom, ${accent}, ${secondary}) 1` }}>
          <p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#374151", margin: 0 }}>{p.summary}</p>
        </div>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <GradSection key="experience" icon={<IconBriefcase color={accent} size={13} />} title="Experience">
          {enabledExp.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "14px", paddingLeft: "15px", borderTop: `3px solid transparent`, borderImage: `linear-gradient(to right, ${accent}, ${secondary}, transparent) 1`, paddingTop: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</span>
                  {exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 500 }}> — {exp.company}</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                  <IconCalendar color="#9ca3af" size={10} />
                  <span style={{ fontSize: fs.small, color: "#9ca3af" }}>
                    {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                  </span>
                </div>
              </div>
              {exp.location && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                  <IconMapPin color="#9ca3af" size={10} />
                  <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{exp.location}</span>
                </div>
              )}
              {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.6 }}>{exp.description}</p>}
              {exp.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
                  {exp.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, ${secondary})` }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </GradSection>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <GradSection key="education" icon={<IconGradCap color={accent} size={13} />} title="Education">
          {enabledEdu.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "10px", paddingLeft: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>
                  {edu.degree}{edu.field && ` in ${edu.field}`}
                </span>
                <span style={{ fontSize: fs.small, color: "#9ca3af" }}>
                  {formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}
                </span>
              </div>
              <div style={{ fontSize: fs.body, color: "#6b7280", marginTop: "1px" }}>{edu.institution}</div>
              {edu.achievements && edu.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                  {edu.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, ${secondary})` }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </GradSection>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <GradSection key="skills" icon={<IconLayers color={accent} size={13} />} title="Skills">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingLeft: "15px" }}>
            {config.skillCategories.map((cat) => (
              <div key={cat.id}>
                <div style={{ fontSize: fs.small, fontWeight: 600, color: "#374151", marginBottom: "4px" }}>{cat.name}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {cat.skills.map((skill, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: fs.small }}>
                      <span style={{ color: "#374151", fontWeight: 500 }}>{skill}</span>
                      <div style={{ width: "50px", height: "4px", borderRadius: "2px", background: `linear-gradient(90deg, ${accent}, ${secondary})`, opacity: 0.7 + (0.3 * (1 - i / Math.max(cat.skills.length, 1))) }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GradSection>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <GradSection key="projects" icon={<IconFolder color={accent} size={13} />} title="Projects">
          {enabledProjects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "10px", paddingLeft: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</span>
                {proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}
              </div>
              {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "3px", lineHeight: 1.5 }}>{proj.description}</p>}
              {proj.techStack.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                  {proj.techStack.map((t, i) => (
                    <span key={i} style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "3px", background: `linear-gradient(135deg, ${accent}15, ${secondary}15)`, border: `1px solid ${accent}25`, color: accent, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </GradSection>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <GradSection key="certifications" icon={<IconAward color={accent} size={13} />} title="Certifications">
          <div style={{ paddingLeft: "15px" }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "5px" }}>
                <div>
                  <span style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>{cert.name}</span>
                  {cert.issuer && <span style={{ fontSize: fs.body, color: "#6b7280" }}> — {cert.issuer}</span>}
                  {cert.url && <> · <UrlLink url={cert.url} color={accent} fontSize={fs.small} /></>}
                </div>
                {cert.date && <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{formatDisplayDate(cert.date)}</span>}
              </div>
            ))}
          </div>
        </GradSection>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <GradSection key={section.id} icon={<IconStar color={accent} size={13} />} title={section.title}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, paddingLeft: "15px" }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, ${secondary})` }} />
                    {item.content}
                  </li>
                ))}
              </ul>
            </GradSection>
          ))
        : null,
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: 0 }}>
      {/* Gradient header */}
      <div style={{ padding: `${pad}px ${pad + 8}px ${pad - 8}px`, borderBottom: `3px solid transparent`, borderImage: `linear-gradient(90deg, ${accent}, ${secondary}, transparent) 1` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", border: `3px solid transparent`, background: `linear-gradient(white, white) padding-box, linear-gradient(135deg, ${accent}, ${secondary}) border-box`, overflow: "hidden", flexShrink: 0 }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{
              fontSize: fs.h1, fontWeight: 800, margin: 0, lineHeight: 1.2,
              background: `linear-gradient(135deg, ${accent}, ${secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {p.fullName || "Your Name"}
            </h1>
            {p.title && <div style={{ fontSize: fs.h2, color: "#6b7280", fontWeight: 500, marginTop: "4px" }}>{p.title}</div>}
          </div>
        </div>
        {contacts.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: "12px", paddingBottom: "4px", borderBottom: `2px solid transparent`, borderImage: `linear-gradient(90deg, ${accent}40, transparent) 1` }}>
            {contacts.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: fs.small, color: "#6b7280" }}>
                {contactIcon(c.type, accent, 11)}
                <LinkText href={contactHref(c.type, c.value)}>{c.value}</LinkText>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: `${pad - 8}px ${pad + 8}px ${pad}px` }}>
        {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   23. MONO TEMPLATE
   Brutalist monochrome with bold typography
   ═══════════════════════════════════════════════ */
function MonoTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 32

  const sectionNames: Record<string, { num: string; label: string }> = {
    summary: { num: "01", label: "SUMMARY" },
    experience: { num: "02", label: "EXPERIENCE" },
    education: { num: "03", label: "EDUCATION" },
    skills: { num: "04", label: "SKILLS" },
    projects: { num: "05", label: "PROJECTS" },
    certifications: { num: "06", label: "CERTIFICATIONS" },
    custom: { num: "07", label: "OTHER" },
  }

  function MonoSection({ sectionKey, children }: { sectionKey: string; children: React.ReactNode }) {
    const info = sectionNames[sectionKey] || { num: "00", label: sectionKey.toUpperCase() }
    return (
      <div style={{ marginBottom: "22px", position: "relative", paddingLeft: "60px" }}>
        <div style={{ position: "absolute", left: 0, top: "-4px", fontSize: "48px", fontWeight: 900, color: `${accent}12`, lineHeight: 1, letterSpacing: "-2px", userSelect: "none" }}>
          {info.num}
        </div>
        <div style={{ fontSize: "16px", fontWeight: 900, color: "#000000", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "10px", borderBottom: `3px solid #000000`, paddingBottom: "4px", display: "inline-block" }}>
          {info.label}
        </div>
        <div>{children}</div>
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <MonoSection key="summary" sectionKey="summary">
          <p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#000000", margin: 0, fontWeight: 500 }}>{p.summary}</p>
        </MonoSection>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <MonoSection key="experience" sectionKey="experience">
          {enabledExp.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "14px", paddingBottom: "10px", borderBottom: "2px solid #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontSize: fs.h3, fontWeight: 900, color: "#000000", textTransform: "uppercase" }}>{exp.title}</span>
                  {exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 700 }}> // {exp.company}</span>}
                </div>
                <span style={{ fontSize: fs.small, color: "#000000", fontWeight: 700, flexShrink: 0 }}>
                  {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "NOW" : formatDisplayDate(exp.endDate)}`}
                </span>
              </div>
              {exp.location && <div style={{ fontSize: fs.small, color: "#6b7280", fontWeight: 600, marginTop: "2px" }}>{exp.location}</div>}
              {exp.description && <p style={{ fontSize: fs.body, color: "#374151", marginTop: "4px", lineHeight: 1.6 }}>{exp.description}</p>}
              {exp.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0 0" }}>
                  {exp.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: "#374151", lineHeight: 1.6, paddingLeft: "16px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "5px", width: "8px", height: "8px", backgroundColor: accent }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </MonoSection>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <MonoSection key="education" sectionKey="education">
          {enabledEdu.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 900, color: "#000000", textTransform: "uppercase" }}>
                  {edu.degree}{edu.field && ` / ${edu.field}`}
                </span>
                <span style={{ fontSize: fs.small, color: "#000000", fontWeight: 700 }}>
                  {formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}
                </span>
              </div>
              <div style={{ fontSize: fs.body, color: "#6b7280", fontWeight: 600, marginTop: "1px" }}>{edu.institution}</div>
              {edu.achievements && edu.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                  {edu.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: "#374151", lineHeight: 1.6, paddingLeft: "16px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "5px", width: "8px", height: "8px", backgroundColor: accent }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </MonoSection>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <MonoSection key="skills" sectionKey="skills">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {config.skillCategories.map((cat) => (
              <div key={cat.id}>
                <div style={{ fontSize: fs.small, fontWeight: 900, color: "#000000", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "3px" }}>{cat.name}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {cat.skills.map((skill, i) => (
                    <span key={i} style={{ fontSize: fs.small, padding: "2px 10px", backgroundColor: "#000000", color: "#ffffff", fontWeight: 700 }}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </MonoSection>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <MonoSection key="projects" sectionKey="projects">
          {enabledProjects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 900, color: "#000000", textTransform: "uppercase" }}>{proj.title}</span>
                {proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}
              </div>
              {proj.description && <p style={{ fontSize: fs.body, color: "#374151", marginTop: "3px", lineHeight: 1.5 }}>{proj.description}</p>}
              {proj.techStack.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                  {proj.techStack.map((t, i) => (
                    <span key={i} style={{ fontSize: "9px", padding: "2px 8px", backgroundColor: accent, color: "#ffffff", fontWeight: 700 }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </MonoSection>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <MonoSection key="certifications" sectionKey="certifications">
          {enabledCerts.map((cert) => (
            <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "5px" }}>
              <div>
                <span style={{ fontSize: fs.h3, fontWeight: 900, color: "#000000" }}>{cert.name}</span>
                {cert.issuer && <span style={{ fontSize: fs.body, color: "#6b7280", fontWeight: 600 }}> // {cert.issuer}</span>}
                {cert.url && <> · <UrlLink url={cert.url} color={accent} fontSize={fs.small} /></>}
              </div>
              {cert.date && <span style={{ fontSize: fs.small, color: "#000000", fontWeight: 700 }}>{formatDisplayDate(cert.date)}</span>}
            </div>
          ))}
        </MonoSection>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <MonoSection key={section.id} sectionKey="custom">
              <div style={{ fontSize: "16px", fontWeight: 900, color: "#000000", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "10px", marginTop: "-32px" }}>
                {section.title}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: "#374151", lineHeight: 1.6, paddingLeft: "16px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: "5px", width: "8px", height: "8px", backgroundColor: accent }} />
                    {item.content}
                  </li>
                ))}
              </ul>
            </MonoSection>
          ))
        : null,
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: 0 }}>
      {/* Hard-edge header */}
      <div style={{ backgroundColor: "#000000", color: "#ffffff", padding: `${pad}px ${pad + 8}px ${pad - 6}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "60px", height: "60px", border: `3px solid ${accent}`, overflow: "hidden", flexShrink: 0 }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: 900, margin: 0, lineHeight: 1.1, textTransform: "uppercase", letterSpacing: "2px" }}>
              {p.fullName || "YOUR NAME"}
            </h1>
            {p.title && <div style={{ fontSize: fs.h2, color: accent, fontWeight: 700, marginTop: "4px", textTransform: "uppercase", letterSpacing: "3px" }}>{p.title}</div>}
          </div>
        </div>
        {contacts.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", marginTop: "14px" }}>
            {contacts.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: fs.small, color: "#ffffff" }}>
                {contactIcon(c.type, accent, 11)}
                <LinkText href={contactHref(c.type, c.value)} style={{ color: "#ffffff" }}>{c.value}</LinkText>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Accent bar */}
      <div style={{ height: "4px", backgroundColor: accent }} />

      <div style={{ padding: `${pad - 4}px ${pad + 8}px ${pad}px` }}>
        {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   24. TIMELINE PRO TEMPLATE
   Professional centered vertical timeline
   ═══════════════════════════════════════════════ */
function TimelineProTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 32

  const dotColors: Record<string, string> = {
    summary: "#6366f1",
    experience: accent,
    education: "#10b981",
    skills: "#f59e0b",
    projects: "#8b5cf6",
    certifications: "#ef4444",
    custom: "#6b7280",
  }

  let cardIndex = 0

  function TimelineCard({ sectionKey, children }: { sectionKey: string; children: React.ReactNode }) {
    const isLeft = cardIndex % 2 === 0
    const dotColor = dotColors[sectionKey] || accent
    cardIndex++
    return (
      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "16px", position: "relative" }}>
        {/* Left content or spacer */}
        <div style={{ width: "calc(50% - 16px)", paddingRight: isLeft ? "20px" : "0", textAlign: isLeft ? "right" : "left" }}>
          {isLeft && children}
        </div>
        {/* Center dot + connector */}
        <div style={{ width: "32px", display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, position: "relative", zIndex: 1 }}>
          <div style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: dotColor, border: "3px solid white", boxShadow: `0 0 0 2px ${dotColor}40` }} />
        </div>
        {/* Right content or spacer */}
        <div style={{ width: "calc(50% - 16px)", paddingLeft: isLeft ? "0" : "20px" }}>
          {!isLeft && children}
        </div>
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <TimelineCard key="summary" sectionKey="summary">
          <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "12px 14px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: fs.small, fontWeight: 700, color: dotColors.summary, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Summary</div>
            <p style={{ fontSize: fs.body, lineHeight: 1.6, color: "#374151", margin: 0 }}>{p.summary}</p>
          </div>
        </TimelineCard>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <div key="experience">
          {enabledExp.map((exp) => (
            <TimelineCard key={exp.id} sectionKey="experience">
              <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "12px 14px", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: fs.small, fontWeight: 700, color: dotColors.experience, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Experience</div>
                <div style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</div>
                {exp.company && <div style={{ fontSize: fs.body, color: accent, fontWeight: 500 }}>{exp.company}</div>}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                  <span style={{ fontSize: fs.small, color: "#9ca3af" }}>
                    {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                  </span>
                  {exp.location && <span style={{ fontSize: fs.small, color: "#9ca3af" }}>| {exp.location}</span>}
                </div>
                {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.6 }}>{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
                    {exp.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "12px", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </TimelineCard>
          ))}
        </div>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <div key="education">
          {enabledEdu.map((edu) => (
            <TimelineCard key={edu.id} sectionKey="education">
              <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "12px 14px", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: fs.small, fontWeight: 700, color: dotColors.education, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Education</div>
                <div style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{edu.degree}{edu.field && ` in ${edu.field}`}</div>
                <div style={{ fontSize: fs.body, color: "#6b7280" }}>{edu.institution}</div>
                <span style={{ fontSize: fs.small, color: "#9ca3af" }}>
                  {formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}
                </span>
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                    {edu.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "12px", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: dotColors.education }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </TimelineCard>
          ))}
        </div>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <TimelineCard key="skills" sectionKey="skills">
          <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "12px 14px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: fs.small, fontWeight: 700, color: dotColors.skills, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Skills</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {config.skillCategories.flatMap((cat) =>
                cat.skills.map((skill, i) => (
                  <span key={`${cat.id}-${i}`} style={{ fontSize: fs.small, padding: "2px 10px", borderRadius: "4px", backgroundColor: `${dotColors.skills}15`, color: "#374151", fontWeight: 500, border: `1px solid ${dotColors.skills}30` }}>{skill}</span>
                ))
              )}
            </div>
          </div>
        </TimelineCard>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <div key="projects">
          {enabledProjects.map((proj) => (
            <TimelineCard key={proj.id} sectionKey="projects">
              <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "12px 14px", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: fs.small, fontWeight: 700, color: dotColors.projects, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Project</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</span>
                  {proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}
                </div>
                {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "3px", lineHeight: 1.5 }}>{proj.description}</p>}
                {proj.techStack.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                    {proj.techStack.map((t, i) => (
                      <span key={i} style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "3px", border: `1px solid ${dotColors.projects}30`, color: dotColors.projects, fontWeight: 500 }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </TimelineCard>
          ))}
        </div>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <TimelineCard key="certifications" sectionKey="certifications">
          <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "12px 14px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: fs.small, fontWeight: 700, color: dotColors.certifications, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Certifications</div>
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ marginBottom: "4px" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>{cert.name}</span>
                {cert.issuer && <span style={{ fontSize: fs.body, color: "#6b7280" }}> — {cert.issuer}</span>}
                {cert.url && <> · <UrlLink url={cert.url} color={accent} fontSize={fs.small} /></>}
                {cert.date && <span style={{ fontSize: fs.small, color: "#9ca3af" }}> ({formatDisplayDate(cert.date)})</span>}
              </div>
            ))}
          </div>
        </TimelineCard>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <TimelineCard key={section.id} sectionKey="custom">
              <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "12px 14px", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: fs.small, fontWeight: 700, color: dotColors.custom, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>{section.title}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {section.items.map((item) => (
                    <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "12px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: dotColors.custom }} />
                      {item.content}
                    </li>
                  ))}
                </ul>
              </div>
            </TimelineCard>
          ))
        : null,
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: 0 }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: `${pad}px ${pad + 8}px ${pad - 12}px`, borderBottom: `2px solid ${accent}20` }}>
        {config.showProfileImage && p.profileImage && (
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", border: `3px solid ${accent}`, margin: "0 auto 10px", overflow: "hidden" }}>
            <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <h1 style={{ fontSize: fs.h1, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.2 }}>
          {p.fullName || "Your Name"}
        </h1>
        {p.title && <div style={{ fontSize: fs.h2, color: accent, fontWeight: 500, marginTop: "4px" }}>{p.title}</div>}
        {contacts.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px 16px", marginTop: "10px" }}>
            {contacts.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: fs.small, color: "#6b7280" }}>
                {contactIcon(c.type, accent, 11)}
                <LinkText href={contactHref(c.type, c.value)}>{c.value}</LinkText>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline body */}
      <div style={{ padding: `${pad - 8}px ${pad - 16}px ${pad}px`, position: "relative" }}>
        {/* Center line */}
        <div style={{ position: "absolute", left: "50%", top: `${pad - 8}px`, bottom: `${pad}px`, width: "2px", backgroundColor: `${accent}20`, transform: "translateX(-50%)" }} />
        {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   25. CARD DECK TEMPLATE
   Elevated card sections with accent top borders
   ═══════════════════════════════════════════════ */
function CardDeckTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 32

  function DeckCard({ icon, title, large, children }: { icon?: React.ReactNode; title?: string; large?: boolean; children: React.ReactNode }) {
    return (
      <div style={{
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderTop: `3px solid ${accent}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
        padding: large ? "20px 22px" : "14px 16px",
        marginBottom: "12px",
      }}>
        {title && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            {icon && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", borderRadius: "6px", backgroundColor: `${accent}10`, flexShrink: 0 }}>
                {icon}
              </div>
            )}
            <span style={{ fontSize: fs.h2, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "1px" }}>{title}</span>
          </div>
        )}
        {children}
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <DeckCard key="summary" icon={<IconUser color={accent} size={12} />} title="Summary">
          <p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#374151", margin: 0 }}>{p.summary}</p>
        </DeckCard>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <DeckCard key="experience" icon={<IconBriefcase color={accent} size={12} />} title="Experience">
          {enabledExp.map((exp, idx) => (
            <div key={exp.id} style={{ marginBottom: "12px", paddingBottom: idx < enabledExp.length - 1 ? "10px" : "0", borderBottom: idx < enabledExp.length - 1 ? "1px solid #f3f4f6" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</span>
                  {exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 500 }}> — {exp.company}</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                  <IconCalendar color="#9ca3af" size={10} />
                  <span style={{ fontSize: fs.small, color: "#9ca3af" }}>
                    {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                  </span>
                </div>
              </div>
              {exp.location && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                  <IconMapPin color="#9ca3af" size={10} />
                  <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{exp.location}</span>
                </div>
              )}
              {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.6 }}>{exp.description}</p>}
              {exp.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
                  {exp.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </DeckCard>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <DeckCard key="education" icon={<IconGradCap color={accent} size={12} />} title="Education">
          {enabledEdu.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>
                  {edu.degree}{edu.field && ` in ${edu.field}`}
                </span>
                <span style={{ fontSize: fs.small, color: "#9ca3af" }}>
                  {formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}
                </span>
              </div>
              <div style={{ fontSize: fs.body, color: "#6b7280", marginTop: "1px" }}>{edu.institution}</div>
              {edu.achievements && edu.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                  {edu.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </DeckCard>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <DeckCard key="skills" icon={<IconLayers color={accent} size={12} />} title="Skills">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
            {config.skillCategories.flatMap((cat) =>
              cat.skills.map((skill, i) => (
                <span key={`${cat.id}-${i}`} style={{
                  fontSize: fs.small,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  backgroundColor: `${accent}08`,
                  border: `1px solid ${accent}20`,
                  color: "#374151",
                  fontWeight: 500,
                  textAlign: "center",
                }}>{skill}</span>
              ))
            )}
          </div>
        </DeckCard>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <DeckCard key="projects" icon={<IconFolder color={accent} size={12} />} title="Projects">
          {enabledProjects.map((proj, idx) => (
            <div key={proj.id} style={{ marginBottom: "10px", paddingBottom: idx < enabledProjects.length - 1 ? "8px" : "0", borderBottom: idx < enabledProjects.length - 1 ? "1px solid #f3f4f6" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</span>
                {proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}
              </div>
              {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "3px", lineHeight: 1.5 }}>{proj.description}</p>}
              {proj.techStack.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                  {proj.techStack.map((t, i) => (
                    <span key={i} style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "4px", backgroundColor: `${accent}10`, color: accent, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </DeckCard>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <DeckCard key="certifications" icon={<IconAward color={accent} size={12} />} title="Certifications">
          {enabledCerts.map((cert) => (
            <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "5px" }}>
              <div>
                <span style={{ fontSize: fs.h3, fontWeight: 600, color: "#111827" }}>{cert.name}</span>
                {cert.issuer && <span style={{ fontSize: fs.body, color: "#6b7280" }}> — {cert.issuer}</span>}
                {cert.url && <> · <UrlLink url={cert.url} color={accent} fontSize={fs.small} /></>}
              </div>
              {cert.date && <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{formatDisplayDate(cert.date)}</span>}
            </div>
          ))}
        </DeckCard>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <DeckCard key={section.id} icon={<IconStar color={accent} size={12} />} title={section.title}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                    {item.content}
                  </li>
                ))}
              </ul>
            </DeckCard>
          ))
        : null,
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: 0, backgroundColor: "#f8f9fa" }}>
      {/* Header card */}
      <div style={{
        margin: `${pad - 8}px ${pad - 8}px 12px`,
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderTop: `4px solid ${accent}`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        padding: "22px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "56px", height: "56px", borderRadius: "12px", border: `2px solid ${accent}30`, overflow: "hidden", flexShrink: 0 }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: fs.h1, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.2 }}>
              {p.fullName || "Your Name"}
            </h1>
            {p.title && <div style={{ fontSize: fs.h2, color: accent, fontWeight: 500, marginTop: "4px" }}>{p.title}</div>}
          </div>
        </div>
        {contacts.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: "12px", paddingTop: "10px", borderTop: "1px solid #f3f4f6" }}>
            {contacts.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: fs.small, color: "#6b7280" }}>
                {contactIcon(c.type, accent, 11)}
                <LinkText href={contactHref(c.type, c.value)}>{c.value}</LinkText>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section cards */}
      <div style={{ padding: `0 ${pad - 8}px ${pad - 8}px` }}>
        {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   DUAL TONE TEMPLATE
   Split-screen: dark left 40% / white right 60%
   ═══════════════════════════════════════════════ */
function DualToneTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 40

  const darkBg = "#111827"
  const lightText = "#f9fafb"
  const mutedLight = "#d1d5db"

  /* ── left-side section header ── */
  function LeftSectionHead({ title }: { title: string }) {
    return (
      <div style={{ marginBottom: "8px" }}>
        <div style={{ fontSize: fs.h2, fontWeight: 700, color: accent, textTransform: "uppercase" as const, letterSpacing: "1.5px", marginBottom: "4px" }}>{title}</div>
        <div style={{ width: "30px", height: "2px", backgroundColor: accent }} />
      </div>
    )
  }

  /* ── right-side section header ── */
  function RightSectionHead({ title }: { title: string }) {
    return (
      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontSize: fs.h2, fontWeight: 700, color: "#111827", textTransform: "uppercase" as const, letterSpacing: "1.5px", marginBottom: "4px" }}>{title}</div>
        <div style={{ width: "40px", height: "2px", backgroundColor: accent }} />
      </div>
    )
  }

  /* ── left-side content collectors ── */
  const leftContent: React.ReactNode[] = []
  const rightContent: React.ReactNode[] = []

  /* ── section renderers that route to left/right ── */
  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () => {
      if (!p.summary) return null
      rightContent.push(
        <div key="summary" style={{ marginBottom: "20px" }}>
          <RightSectionHead title="Summary" />
          <p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#374151" }}>{p.summary}</p>
        </div>
      )
      return null
    },

    experience: () => {
      if (enabledExp.length === 0) return null
      rightContent.push(
        <div key="experience" style={{ marginBottom: "20px" }}>
          <RightSectionHead title="Experience" />
          {enabledExp.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</span>
                  {exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 500 }}> — {exp.company}</span>}
                </div>
                <span style={{ fontSize: fs.small, color: "#9ca3af", flexShrink: 0 }}>
                  {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                </span>
              </div>
              {exp.location && <div style={{ fontSize: fs.small, color: "#9ca3af", marginTop: "2px" }}>{exp.location}</div>}
              {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.6 }}>{exp.description}</p>}
              {exp.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                  {exp.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "8px", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: accent }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )
      return null
    },

    education: () => {
      if (enabledEdu.length === 0) return null
      rightContent.push(
        <div key="education" style={{ marginBottom: "20px" }}>
          <RightSectionHead title="Education" />
          {enabledEdu.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}</span>
              </div>
              <div style={{ fontSize: fs.body, color: "#6b7280", marginTop: "1px" }}>{edu.institution}</div>
              {edu.achievements && edu.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                  {edu.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "8px", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: accent }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )
      return null
    },

    skills: () => {
      if (config.skillCategories.length === 0) return null
      leftContent.push(
        <div key="skills" style={{ marginBottom: "20px" }}>
          <LeftSectionHead title="Skills" />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {config.skillCategories.map((cat) => (
              <div key={cat.id}>
                <div style={{ fontSize: fs.small, fontWeight: 600, color: accent, marginBottom: "3px" }}>{cat.name}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {cat.skills.map((skill, i) => (
                    <span key={i} style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "3px", border: `1px solid ${mutedLight}40`, color: mutedLight, fontWeight: 500 }}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
      return null
    },

    projects: () => {
      if (enabledProjects.length === 0) return null
      rightContent.push(
        <div key="projects" style={{ marginBottom: "20px" }}>
          <RightSectionHead title="Projects" />
          {enabledProjects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</span>
                {proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}
              </div>
              {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "3px", lineHeight: 1.5 }}>{proj.description}</p>}
              {proj.techStack.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                  {proj.techStack.map((t, i) => (
                    <span key={i} style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "3px", border: `1px solid ${accent}30`, color: accent, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )
      return null
    },

    certifications: () => {
      if (enabledCerts.length === 0) return null
      leftContent.push(
        <div key="certifications" style={{ marginBottom: "20px" }}>
          <LeftSectionHead title="Certifications" />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id}>
                <div style={{ fontSize: fs.small, fontWeight: 600, color: lightText }}>{cert.name}</div>
                {cert.issuer && <div style={{ fontSize: fs.small, color: mutedLight }}>{cert.issuer}</div>}
                {cert.date && <div style={{ fontSize: fs.small, color: mutedLight, opacity: 0.7 }}>{formatDisplayDate(cert.date)}</div>}
              </div>
            ))}
          </div>
        </div>
      )
      return null
    },

    custom: () => {
      if (config.customSections.length === 0) return null
      config.customSections.forEach((section) => {
        rightContent.push(
          <div key={section.id} style={{ marginBottom: "20px" }}>
            <RightSectionHead title={section.title} />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {section.items.map((item) => (
                <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, top: "8px", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: accent }} />
                  {item.content}
                </li>
              ))}
            </ul>
          </div>
        )
      })
      return null
    },
  }

  // Execute section renderers in order to populate left/right content
  config.sectionOrder.forEach((section) => {
    if (sectionRenderers[section]) sectionRenderers[section]()
  })

  return (
    <div style={{ ...PAGE_BASE, padding: 0, overflow: "hidden", display: "flex" }}>
      {/* Dark left panel – 40% */}
      <div style={{ width: "40%", backgroundColor: darkBg, padding: `${pad}px ${pad - 8}px`, display: "flex", flexDirection: "column" }}>
        {/* Name */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: fs.h1, fontWeight: 800, color: lightText, lineHeight: 1.2 }}>{p.fullName || "Your Name"}</div>
          {p.title && <div style={{ fontSize: fs.h3, color: accent, fontWeight: 500, marginTop: "4px" }}>{p.title}</div>}
        </div>

        {/* Contact */}
        {contacts.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <LeftSectionHead title="Contact" />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {contacts.map((c, i) => {
                const href = contactHref(c.type, c.value)
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {contactIcon(c.type, accent, 11)}
                    <LinkText href={href} style={{ fontSize: fs.small, color: mutedLight }}>{c.value}</LinkText>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {leftContent}
      </div>

      {/* Clean dividing line */}
      <div style={{ width: "1px", backgroundColor: `${accent}40` }} />

      {/* White right panel – 60% */}
      <div style={{ width: "60%", backgroundColor: "#ffffff", padding: `${pad}px ${pad - 8}px` }}>
        {rightContent}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   MAGAZINE TEMPLATE
   Editorial magazine spread with multi-column layout
   ═══════════════════════════════════════════════ */
function MagazineTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 40

  function SectionHead({ title }: { title: string }) {
    return (
      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: fs.h2, fontWeight: 700, color: "#111827", textTransform: "uppercase" as const, letterSpacing: "2px", marginBottom: "4px" }}>{title}</div>
        <div style={{ height: "1px", backgroundColor: "#d1d5db" }} />
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <div key="summary" style={{ marginBottom: "22px" }}>
          <SectionHead title="Profile" />
          <p style={{ fontSize: fs.body, lineHeight: 1.8, color: "#374151", fontStyle: "italic", borderLeft: `3px solid ${accent}`, paddingLeft: "14px", margin: 0 }}>
            <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "28px", fontWeight: 700, color: accent, float: "left", lineHeight: 1, marginRight: "6px", marginTop: "2px" }}>
              {p.summary.charAt(0)}
            </span>
            {p.summary.slice(1)}
          </p>
        </div>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <div key="experience" style={{ marginBottom: "22px" }}>
          <SectionHead title="Experience" />
          <div style={{ columnCount: enabledExp.length > 2 ? 2 : 1, columnGap: "20px", columnRule: "1px solid #e5e7eb" }}>
            {enabledExp.map((exp) => (
              <div key={exp.id} style={{ breakInside: "avoid" as const, marginBottom: "14px" }}>
                <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</div>
                {exp.company && <div style={{ fontSize: fs.small, color: accent, fontWeight: 600 }}>{exp.company}</div>}
                <div style={{ fontSize: fs.small, color: "#9ca3af" }}>
                  {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                  {exp.location && ` | ${exp.location}`}
                </div>
                {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "3px", lineHeight: 1.6 }}>{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "3px 0 0 0" }}>
                    {exp.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.5, paddingLeft: "12px", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, top: "7px", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#374151" }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <div key="education" style={{ marginBottom: "22px" }}>
          <SectionHead title="Education" />
          {enabledEdu.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}</span>
              </div>
              <div style={{ fontSize: fs.body, color: "#6b7280" }}>{edu.institution}</div>
              {edu.achievements && edu.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                  {edu.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.5, paddingLeft: "12px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "7px", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#374151" }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <div key="skills" style={{ marginBottom: "22px" }}>
          <SectionHead title="Skills" />
          <div style={{ columnCount: 2, columnGap: "20px", columnRule: "1px solid #e5e7eb" }}>
            {config.skillCategories.map((cat) => (
              <div key={cat.id} style={{ breakInside: "avoid" as const, marginBottom: "8px" }}>
                <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: fs.small, fontWeight: 700, color: "#111827", marginBottom: "2px" }}>{cat.name}</div>
                <div style={{ fontSize: fs.small, color: "#6b7280", lineHeight: 1.6 }}>{cat.skills.join(" · ")}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <div key="projects" style={{ marginBottom: "22px" }}>
          <SectionHead title="Projects" />
          <div style={{ columnCount: enabledProjects.length > 2 ? 2 : 1, columnGap: "20px", columnRule: "1px solid #e5e7eb" }}>
            {enabledProjects.map((proj) => (
              <div key={proj.id} style={{ breakInside: "avoid" as const, marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</span>
                  {proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}
                </div>
                {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "3px", lineHeight: 1.5 }}>{proj.description}</p>}
                {proj.techStack.length > 0 && (
                  <div style={{ fontSize: fs.small, color: "#9ca3af", marginTop: "3px" }}>{proj.techStack.join(" · ")}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <div key="certifications" style={{ marginBottom: "22px" }}>
          <SectionHead title="Certifications" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ fontSize: fs.small, padding: "4px 10px", border: "1px solid #d1d5db", borderRadius: "2px" }}>
                <span style={{ fontWeight: 600, color: "#111827" }}>{cert.name}</span>
                {cert.issuer && <span style={{ color: "#6b7280" }}> — {cert.issuer}</span>}
                {cert.date && <span style={{ color: "#9ca3af" }}> ({formatDisplayDate(cert.date)})</span>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <div key={section.id} style={{ marginBottom: "22px" }}>
              <SectionHead title={section.title} />
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "12px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: "7px", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#374151" }} />
                    {item.content}
                  </li>
                ))}
              </ul>
            </div>
          ))
        : null,
  }

  return (
    <div style={{ ...PAGE_BASE, fontFamily: "'Inter', -apple-system, sans-serif", padding: `${pad}px` }}>
      {/* Masthead */}
      <div style={{ textAlign: "center", marginBottom: "20px", borderBottom: "3px double #111827", paddingBottom: "16px" }}>
        <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "32px", fontWeight: 700, color: "#111827", letterSpacing: "4px", textTransform: "uppercase" as const }}>{p.fullName || "Your Name"}</div>
        {p.title && <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: fs.h3, color: accent, fontStyle: "italic", marginTop: "4px" }}>{p.title}</div>}
        {contacts.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "8px", flexWrap: "wrap" }}>
            {contacts.map((c, i) => {
              const href = contactHref(c.type, c.value)
              return (
                <LinkText key={i} href={href} style={{ fontSize: fs.small, color: "#6b7280" }}>{c.value}</LinkText>
              )
            })}
          </div>
        )}
      </div>

      {/* Sections */}
      {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}

      {/* Page number footer */}
      <div style={{ position: "absolute" as const, bottom: `${pad}px`, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "10px", color: "#9ca3af" }}>— 1 —</span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   NEON TEMPLATE
   Dark cyberpunk with neon glow effects
   ═══════════════════════════════════════════════ */
function NeonTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 40

  const darkBg = "#0a0a0f"
  const cardBg = "#12121a"
  const textMain = "#e2e8f0"
  const textMuted = "#94a3b8"
  const neonGlow = `0 0 8px ${accent}60, 0 0 20px ${accent}30`
  const neonGlowText = `0 0 10px ${accent}80, 0 0 30px ${accent}40`

  function SectionHead({ title }: { title: string }) {
    return (
      <div style={{ marginBottom: "12px", paddingBottom: "6px", borderBottom: `1px solid ${accent}40`, boxShadow: `0 1px 0 ${accent}20` }}>
        <div style={{ fontSize: fs.h2, fontWeight: 700, color: accent, textTransform: "uppercase" as const, letterSpacing: "2px", textShadow: `0 0 8px ${accent}60` }}>{title}</div>
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <div key="summary" style={{ marginBottom: "20px", padding: "14px", backgroundColor: cardBg, borderRadius: "4px", borderLeft: `2px solid ${accent}`, boxShadow: neonGlow }}>
          <SectionHead title="Profile" />
          <p style={{ fontSize: fs.body, lineHeight: 1.7, color: textMuted, margin: 0 }}>{p.summary}</p>
        </div>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <div key="experience" style={{ marginBottom: "20px" }}>
          <SectionHead title="Experience" />
          {enabledExp.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "14px", padding: "12px", backgroundColor: cardBg, borderRadius: "4px", border: `1px solid ${accent}15` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: textMain }}>{exp.title}</span>
                  {exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 500 }}> @ {exp.company}</span>}
                </div>
                <span style={{ fontSize: fs.small, color: textMuted, flexShrink: 0 }}>
                  {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                </span>
              </div>
              {exp.location && <div style={{ fontSize: fs.small, color: textMuted, marginTop: "2px" }}>{exp.location}</div>}
              {exp.description && <p style={{ fontSize: fs.body, color: textMuted, marginTop: "4px", lineHeight: 1.6 }}>{exp.description}</p>}
              {exp.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                  {exp.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: textMuted, lineHeight: 1.6, paddingLeft: "16px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "7px", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <div key="education" style={{ marginBottom: "20px" }}>
          <SectionHead title="Education" />
          {enabledEdu.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "10px", padding: "12px", backgroundColor: cardBg, borderRadius: "4px", border: `1px solid ${accent}15` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 700, color: textMain }}>{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                <span style={{ fontSize: fs.small, color: textMuted }}>{formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}</span>
              </div>
              <div style={{ fontSize: fs.body, color: textMuted, marginTop: "1px" }}>{edu.institution}</div>
              {edu.achievements && edu.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                  {edu.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: textMuted, lineHeight: 1.6, paddingLeft: "16px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "7px", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <div key="skills" style={{ marginBottom: "20px" }}>
          <SectionHead title="Skills" />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {config.skillCategories.map((cat) => (
              <div key={cat.id}>
                <div style={{ fontSize: fs.small, fontWeight: 600, color: textMain, marginBottom: "4px" }}>{cat.name}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {cat.skills.map((skill, i) => (
                    <span key={i} style={{ fontSize: "9.5px", padding: "3px 10px", borderRadius: "20px", border: `1px solid ${accent}`, color: accent, fontWeight: 500, textShadow: `0 0 6px ${accent}50`, boxShadow: `0 0 4px ${accent}20` }}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <div key="projects" style={{ marginBottom: "20px" }}>
          <SectionHead title="Projects" />
          {enabledProjects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "10px", padding: "12px", backgroundColor: cardBg, borderRadius: "4px", border: `1px solid ${accent}15` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 700, color: textMain }}>{proj.title}</span>
                {proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}
              </div>
              {proj.description && <p style={{ fontSize: fs.body, color: textMuted, marginTop: "3px", lineHeight: 1.5 }}>{proj.description}</p>}
              {proj.techStack.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                  {proj.techStack.map((t, i) => (
                    <span key={i} style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "3px", border: `1px solid ${accent}40`, color: accent, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <div key="certifications" style={{ marginBottom: "20px" }}>
          <SectionHead title="Certifications" />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "8px 12px", backgroundColor: cardBg, borderRadius: "4px", border: `1px solid ${accent}15` }}>
                <div>
                  <span style={{ fontSize: fs.h3, fontWeight: 600, color: textMain }}>{cert.name}</span>
                  {cert.issuer && <span style={{ fontSize: fs.body, color: textMuted }}> — {cert.issuer}</span>}
                </div>
                {cert.date && <span style={{ fontSize: fs.small, color: textMuted }}>{formatDisplayDate(cert.date)}</span>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <div key={section.id} style={{ marginBottom: "20px" }}>
              <SectionHead title={section.title} />
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: textMuted, lineHeight: 1.6, paddingLeft: "16px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: "7px", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }} />
                    {item.content}
                  </li>
                ))}
              </ul>
            </div>
          ))
        : null,
  }

  return (
    <div style={{ ...PAGE_BASE, backgroundColor: darkBg, color: textMain, padding: `${pad}px`, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)", backgroundSize: "24px 24px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "34px", fontWeight: 800, color: accent, textShadow: neonGlowText, letterSpacing: "2px" }}>{p.fullName || "Your Name"}</div>
        {p.title && <div style={{ fontSize: fs.h3, color: textMuted, marginTop: "4px", letterSpacing: "1px" }}>{p.title}</div>}
        {contacts.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "14px", marginTop: "10px", flexWrap: "wrap" }}>
            {contacts.map((c, i) => {
              const href = contactHref(c.type, c.value)
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  {contactIcon(c.type, accent, 10)}
                  <LinkText href={href} style={{ fontSize: fs.small, color: textMuted }}>{c.value}</LinkText>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Neon divider */}
      <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, boxShadow: `0 0 8px ${accent}60`, marginBottom: "20px" }} />

      {/* Sections */}
      {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   PAPER TEMPLATE
   Warm parchment with classic typography
   ═══════════════════════════════════════════════ */
function PaperTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = "#8b6914"
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 40

  const paperBg = "#faf8f5"
  const textDark = "#2c2416"
  const textBody = "#4a3f30"
  const textMuted = "#8a7e6b"

  function SectionHead({ title }: { title: string }) {
    return (
      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: fs.h2, fontWeight: 700, color: textDark, textTransform: "uppercase" as const, letterSpacing: "2px", marginBottom: "4px" }}>{title}</div>
        <div style={{ height: "1px", background: `linear-gradient(90deg, ${accent}, ${accent}20)` }} />
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <div key="summary" style={{ marginBottom: "20px" }}>
          <SectionHead title="Summary" />
          <p style={{ fontSize: fs.body, lineHeight: 1.8, color: textBody, fontFamily: "Georgia, 'Times New Roman', serif", margin: 0 }}>{p.summary}</p>
        </div>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <div key="experience" style={{ marginBottom: "20px" }}>
          <SectionHead title="Professional Experience" />
          {enabledExp.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: fs.h3, fontWeight: 700, color: textDark }}>{exp.title}</span>
                  {exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 500 }}> — {exp.company}</span>}
                </div>
                <span style={{ fontSize: fs.small, color: textMuted, fontStyle: "italic", flexShrink: 0 }}>
                  {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                </span>
              </div>
              {exp.location && <div style={{ fontSize: fs.small, color: textMuted, fontStyle: "italic", marginTop: "1px" }}>{exp.location}</div>}
              {exp.description && <p style={{ fontSize: fs.body, color: textBody, marginTop: "4px", lineHeight: 1.7 }}>{exp.description}</p>}
              {exp.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
                  {exp.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: textBody, lineHeight: 1.7, paddingLeft: "16px", position: "relative" }}>
                      <span style={{ position: "absolute", left: "2px", top: "6px", fontSize: "8px", color: accent }}>&#9830;</span>
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <div key="education" style={{ marginBottom: "20px" }}>
          <SectionHead title="Education" />
          {enabledEdu.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: fs.h3, fontWeight: 700, color: textDark }}>{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                <span style={{ fontSize: fs.small, color: textMuted, fontStyle: "italic" }}>{formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}</span>
              </div>
              <div style={{ fontSize: fs.body, color: textMuted }}>{edu.institution}</div>
              {edu.achievements && edu.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                  {edu.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: textBody, lineHeight: 1.7, paddingLeft: "16px", position: "relative" }}>
                      <span style={{ position: "absolute", left: "2px", top: "6px", fontSize: "8px", color: accent }}>&#9830;</span>
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <div key="skills" style={{ marginBottom: "20px" }}>
          <SectionHead title="Skills & Expertise" />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {config.skillCategories.map((cat) => (
              <div key={cat.id} style={{ display: "flex", gap: "8px", fontSize: fs.body }}>
                <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 600, color: textDark, minWidth: "110px" }}>{cat.name}:</span>
                <span style={{ color: textBody }}>{cat.skills.join(" · ")}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <div key="projects" style={{ marginBottom: "20px" }}>
          <SectionHead title="Selected Projects" />
          {enabledProjects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: fs.h3, fontWeight: 700, color: textDark }}>{proj.title}</span>
                {proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}
              </div>
              {proj.description && <p style={{ fontSize: fs.body, color: textBody, marginTop: "3px", lineHeight: 1.6 }}>{proj.description}</p>}
              {proj.techStack.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                  {proj.techStack.map((t, i) => (
                    <span key={i} style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "2px", border: `1px solid ${accent}40`, color: accent, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <div key="certifications" style={{ marginBottom: "20px" }}>
          <SectionHead title="Certifications" />
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: fs.h3, fontWeight: 600, color: textDark }}>{cert.name}</span>
                  {cert.issuer && <span style={{ fontSize: fs.body, color: textMuted }}> — {cert.issuer}</span>}
                </div>
                {cert.date && <span style={{ fontSize: fs.small, color: textMuted, fontStyle: "italic" }}>{formatDisplayDate(cert.date)}</span>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <div key={section.id} style={{ marginBottom: "20px" }}>
              <SectionHead title={section.title} />
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: textBody, lineHeight: 1.7, paddingLeft: "16px", position: "relative" }}>
                    <span style={{ position: "absolute", left: "2px", top: "6px", fontSize: "8px", color: accent }}>&#9830;</span>
                    {item.content}
                  </li>
                ))}
              </ul>
            </div>
          ))
        : null,
  }

  return (
    <div style={{ ...PAGE_BASE, backgroundColor: paperBg, color: textBody, padding: `${pad}px`, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")" }}>
      {/* Elegant border frame */}
      <div style={{ border: `1px solid ${accent}30`, padding: `${pad - 10}px`, minHeight: "calc(297mm - 80px)" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "22px", paddingBottom: "14px", borderBottom: `1px solid ${accent}40` }}>
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "30px", fontWeight: 700, color: textDark, letterSpacing: "3px" }}>{p.fullName || "Your Name"}</div>
          {p.title && <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: fs.h3, color: accent, fontStyle: "italic", marginTop: "4px" }}>{p.title}</div>}
          {contacts.length > 0 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "14px", marginTop: "8px", flexWrap: "wrap" }}>
              {contacts.map((c, i) => {
                const href = contactHref(c.type, c.value)
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    {contactIcon(c.type, accent, 10)}
                    <LinkText href={href} style={{ fontSize: fs.small, color: textMuted }}>{c.value}</LinkText>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Sections */}
        {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   STACKED TEMPLATE
   Full-width horizontal bands stacked vertically
   ═══════════════════════════════════════════════ */
function StackedTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 40

  const bandLight = "#ffffff"
  const bandDark = "#f8fafc"
  const textDark = "#111827"
  const textBody = "#4b5563"
  const textMuted = "#9ca3af"
  let bandIndex = 0

  function getBandBg() {
    return (bandIndex++) % 2 === 0 ? bandLight : bandDark
  }

  function BandSection({ title, children }: { title: string; children: React.ReactNode }) {
    const bg = getBandBg()
    return (
      <div style={{ backgroundColor: bg, padding: `18px ${pad}px`, borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ fontSize: fs.h2, fontWeight: 700, color: accent, textTransform: "uppercase" as const, letterSpacing: "1.5px", marginBottom: "10px" }}>{title}</div>
        {children}
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <BandSection key="summary" title="Summary">
          <p style={{ fontSize: fs.body, lineHeight: 1.7, color: textBody, margin: 0, maxWidth: "700px" }}>{p.summary}</p>
        </BandSection>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <BandSection key="experience" title="Experience">
          {enabledExp.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: textDark }}>{exp.title}</span>
                  {exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 500 }}> — {exp.company}</span>}
                </div>
                <span style={{ fontSize: fs.small, color: textMuted, flexShrink: 0 }}>
                  {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` – ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                </span>
              </div>
              {exp.location && <div style={{ fontSize: fs.small, color: textMuted, marginTop: "2px" }}>{exp.location}</div>}
              {exp.description && <p style={{ fontSize: fs.body, color: textBody, marginTop: "4px", lineHeight: 1.6 }}>{exp.description}</p>}
              {exp.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
                  {exp.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: textBody, lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </BandSection>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <BandSection key="education" title="Education">
          {enabledEdu.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 700, color: textDark }}>{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                <span style={{ fontSize: fs.small, color: textMuted }}>{formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}</span>
              </div>
              <div style={{ fontSize: fs.body, color: "#6b7280", marginTop: "1px" }}>{edu.institution}</div>
              {edu.achievements && edu.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                  {edu.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: textBody, lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </BandSection>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <BandSection key="skills" title="Skills">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {config.skillCategories.map((cat) => (
              <div key={cat.id}>
                <div style={{ fontSize: fs.small, fontWeight: 600, color: textDark, marginBottom: "4px" }}>{cat.name}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {cat.skills.map((skill, i) => (
                    <span key={i} style={{ fontSize: fs.small, padding: "3px 12px", borderRadius: "20px", backgroundColor: `${accent}10`, color: accent, fontWeight: 500, whiteSpace: "nowrap" as const }}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </BandSection>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <BandSection key="projects" title="Projects">
          {enabledProjects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 700, color: textDark }}>{proj.title}</span>
                {proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}
              </div>
              {proj.description && <p style={{ fontSize: fs.body, color: textBody, marginTop: "3px", lineHeight: 1.5 }}>{proj.description}</p>}
              {proj.techStack.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                  {proj.techStack.map((t, i) => (
                    <span key={i} style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "3px", border: `1px solid ${accent}30`, color: accent, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </BandSection>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <BandSection key="certifications" title="Certifications">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ padding: "6px 12px", border: `1px solid ${accent}20`, borderRadius: "4px", backgroundColor: `${accent}05` }}>
                <span style={{ fontSize: fs.h3, fontWeight: 600, color: textDark }}>{cert.name}</span>
                {cert.issuer && <span style={{ fontSize: fs.body, color: "#6b7280" }}> — {cert.issuer}</span>}
                {cert.date && <div style={{ fontSize: fs.small, color: textMuted }}>{formatDisplayDate(cert.date)}</div>}
              </div>
            ))}
          </div>
        </BandSection>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <BandSection key={section.id} title={section.title}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: textBody, lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />
                    {item.content}
                  </li>
                ))}
              </ul>
            </BandSection>
          ))
        : null,
  }

  return (
    <div style={{ ...PAGE_BASE, padding: 0, overflow: "hidden" }}>
      {/* Name band — tallest */}
      <div style={{ backgroundColor: accent, padding: `${pad}px ${pad}px`, textAlign: "center" }}>
        <div style={{ fontSize: "36px", fontWeight: 800, color: "#ffffff", letterSpacing: "2px" }}>{p.fullName || "Your Name"}</div>
        {p.title && <div style={{ fontSize: fs.h3, color: "rgba(255,255,255,0.85)", marginTop: "4px", letterSpacing: "1px" }}>{p.title}</div>}
      </div>

      {/* Contact band */}
      {contacts.length > 0 && (
        <div style={{ backgroundColor: "#f1f5f9", padding: `10px ${pad}px`, borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          {contacts.map((c, i) => {
            const href = contactHref(c.type, c.value)
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                {contactIcon(c.type, accent, 11)}
                <LinkText href={href} style={{ fontSize: fs.small, color: textBody }}>{c.value}</LinkText>
              </div>
            )
          })}
        </div>
      )}

      {/* Section bands */}
      {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   31. RETRO TEMPLATE
   1970s vintage design — warm earthy tones, pill headers, retro badges
   ═══════════════════════════════════════════════ */
function RetroTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 40

  const brown = "#6d4c2e"
  const orange = "#d97706"
  const cream = "#fdf6ec"
  const warmGray = "#78716c"

  function SectionPill({ title }: { title: string }) {
    return (
      <div style={{ display: "inline-block", backgroundColor: orange, color: "#fff", fontSize: fs.h2, fontWeight: 700, padding: "5px 18px", borderRadius: "999px", marginBottom: "14px", letterSpacing: "1px", textTransform: "uppercase" }}>
        {title}
      </div>
    )
  }

  function GroovyLine() {
    return (
      <div style={{ height: "3px", background: `repeating-linear-gradient(90deg, ${orange} 0px, ${orange} 8px, transparent 8px, transparent 14px)`, margin: "18px 0", borderRadius: "2px" }} />
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <div key="summary" style={{ marginBottom: "24px" }}>
          <SectionPill title="About Me" />
          <p style={{ fontSize: fs.body, color: brown, lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>{p.summary}</p>
        </div>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <div key="experience" style={{ marginBottom: "24px" }}>
          <SectionPill title="Experience" />
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {enabledExp.map((exp) => (
              <div key={exp.id} style={{ backgroundColor: "#fff", border: `2px solid ${orange}`, borderRadius: "16px", padding: "14px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontSize: fs.h3, fontWeight: 700, color: brown }}>{exp.title}</span>
                    {exp.company && <span style={{ fontSize: fs.h3, color: orange, fontWeight: 600 }}> @ {exp.company}</span>}
                  </div>
                  <span style={{ fontSize: fs.small, color: warmGray, fontWeight: 600, flexShrink: 0, backgroundColor: cream, padding: "2px 10px", borderRadius: "999px" }}>
                    {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` \u2013 ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                  </span>
                </div>
                {exp.location && <div style={{ fontSize: fs.small, color: warmGray, marginTop: "2px" }}>{exp.location}</div>}
                {exp.description && <p style={{ fontSize: fs.body, color: brown, marginTop: "6px", lineHeight: 1.7, margin: "6px 0 0 0" }}>{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0 0" }}>
                    {exp.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: brown, lineHeight: 1.7, paddingLeft: "18px", position: "relative" }}>
                        <span style={{ position: "absolute", left: "2px", top: "8px", width: "8px", height: "8px", backgroundColor: orange, borderRadius: "50%" }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <div key="education" style={{ marginBottom: "24px" }}>
          <SectionPill title="Education" />
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {enabledEdu.map((edu) => (
              <div key={edu.id} style={{ backgroundColor: "#fff", border: `2px solid ${orange}`, borderRadius: "16px", padding: "12px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: brown }}>
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </span>
                  <span style={{ fontSize: fs.small, color: warmGray, fontWeight: 600, flexShrink: 0 }}>
                    {formatDisplayDate(edu.startDate)}{edu.endDate && ` \u2013 ${formatDisplayDate(edu.endDate)}`}
                  </span>
                </div>
                <div style={{ fontSize: fs.body, color: orange, fontWeight: 600, marginTop: "2px" }}>{edu.institution}</div>
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                    {edu.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: brown, lineHeight: 1.7, paddingLeft: "18px", position: "relative" }}>
                        <span style={{ position: "absolute", left: "2px", top: "8px", width: "8px", height: "8px", backgroundColor: orange, borderRadius: "50%" }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <div key="skills" style={{ marginBottom: "24px" }}>
          <SectionPill title="Skills" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {config.skillCategories.map((cat) =>
              cat.skills.map((skill, i) => (
                <span key={`${cat.id}-${i}`} style={{ display: "inline-block", backgroundColor: cream, color: brown, border: `2px solid ${orange}`, borderRadius: "999px", padding: "4px 14px", fontSize: fs.small, fontWeight: 700, letterSpacing: "0.5px" }}>
                  {skill}
                </span>
              ))
            )}
          </div>
        </div>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <div key="projects" style={{ marginBottom: "24px" }}>
          <SectionPill title="Projects" />
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {enabledProjects.map((proj) => (
              <div key={proj.id} style={{ backgroundColor: "#fff", border: `2px solid ${orange}`, borderRadius: "16px", padding: "12px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: brown }}>{proj.title}</span>
                  {proj.url && (
                    <a href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.small, color: orange, textDecoration: "none", fontWeight: 600 }}>
                      {proj.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  )}
                </div>
                {proj.description && <p style={{ fontSize: fs.body, color: brown, marginTop: "4px", lineHeight: 1.7, margin: "4px 0 0 0" }}>{proj.description}</p>}
                {proj.techStack.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
                    {proj.techStack.map((t, i) => (
                      <span key={i} style={{ fontSize: fs.small, backgroundColor: cream, color: orange, padding: "1px 8px", borderRadius: "999px", fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <div key="certifications" style={{ marginBottom: "24px" }}>
          <SectionPill title="Certifications" />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  {cert.url ? (
                    <a href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.h3, fontWeight: 700, color: orange, textDecoration: "none" }}>{cert.name}</a>
                  ) : (
                    <span style={{ fontSize: fs.h3, fontWeight: 700, color: brown }}>{cert.name}</span>
                  )}
                  {cert.issuer && <span style={{ fontSize: fs.body, color: warmGray, fontWeight: 500 }}> \u2014 {cert.issuer}</span>}
                </div>
                {cert.date && <span style={{ fontSize: fs.small, color: warmGray, fontWeight: 600, flexShrink: 0 }}>{formatDisplayDate(cert.date)}</span>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <div key={section.id} style={{ marginBottom: "24px" }}>
              <SectionPill title={section.title} />
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: brown, lineHeight: 1.7, paddingLeft: "18px", position: "relative", marginBottom: "2px" }}>
                    <span style={{ position: "absolute", left: "2px", top: "8px", width: "8px", height: "8px", backgroundColor: orange, borderRadius: "50%" }} />
                    {item.content}
                  </li>
                ))}
              </ul>
            </div>
          ))
        : null,
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, backgroundColor: cream, padding: `${pad}px ${pad + 4}px` }}>
      {/* Retro Header */}
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        {config.showProfileImage && p.profileImage && (
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 10px", border: `4px solid ${orange}` }}>
            <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <h1 style={{ fontSize: "30px", fontWeight: 900, color: brown, margin: 0, letterSpacing: "2px", textTransform: "uppercase" }}>
          {p.fullName || "Your Name"}
        </h1>
        {p.title && <div style={{ fontSize: fs.h2, color: orange, fontWeight: 700, marginTop: "4px", letterSpacing: "1px" }}>{p.title}</div>}

        {contacts.length > 0 && (
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px" }}>
            {contacts.map((c, i) => {
              const href = contactHref(c.type, c.value)
              return (
                <span key={i} style={{ fontSize: fs.small, backgroundColor: brown, color: "#fff", padding: "3px 12px", borderRadius: "999px", fontWeight: 600 }}>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "none" }}>{c.value}</a>
                  ) : (
                    c.value
                  )}
                </span>
              )
            })}
          </div>
        )}
      </div>

      <GroovyLine />

      {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   32. ORIGAMI TEMPLATE
   Folded paper panels with CSS triangle corners, alternating rotations
   ═══════════════════════════════════════════════ */
function OrigamiTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 40

  const foldSize = "12px"
  const paperBg = "#fafafa"
  const foldColor = "#e5e7eb"
  const textMain = "#1f2937"
  const textMuted = "#6b7280"

  function PaperCard({ children, index = 0 }: { children: React.ReactNode; index?: number }) {
    const rotation = index % 2 === 0 ? "0.5deg" : "-0.5deg"
    return (
      <div style={{ position: "relative", backgroundColor: paperBg, border: `1px solid ${foldColor}`, padding: "16px 18px", marginBottom: "14px", transform: `rotate(${rotation})`, boxShadow: "2px 3px 8px rgba(0,0,0,0.06)" }}>
        {/* Top-right fold triangle */}
        <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: `0 ${foldSize} ${foldSize} 0`, borderColor: "transparent #fff transparent transparent" }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: `0 ${foldSize} ${foldSize} 0`, borderColor: `transparent ${foldColor} transparent transparent`, opacity: 0.5 }} />
        {/* Fold shadow line */}
        <div style={{ position: "absolute", top: "1px", right: foldSize, width: "1px", height: foldSize, backgroundColor: foldColor }} />
        <div style={{ position: "absolute", top: foldSize, right: "1px", width: foldSize, height: "1px", backgroundColor: foldColor }} />
        {children}
      </div>
    )
  }

  function SectionTitle({ title }: { title: string }) {
    return (
      <div style={{ fontSize: fs.h2, fontWeight: 600, color: accent, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px", borderBottom: `1px dashed ${foldColor}`, paddingBottom: "6px" }}>
        {title}
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <div key="summary" style={{ marginBottom: "18px" }}>
          <SectionTitle title="About" />
          <PaperCard index={0}>
            <p style={{ fontSize: fs.body, color: textMuted, lineHeight: 1.8, margin: 0 }}>{p.summary}</p>
          </PaperCard>
        </div>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <div key="experience" style={{ marginBottom: "18px" }}>
          <SectionTitle title="Experience" />
          {enabledExp.map((exp, idx) => (
            <PaperCard key={exp.id} index={idx}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontSize: fs.h3, fontWeight: 600, color: textMain }}>{exp.title}</span>
                  {exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 500 }}> \u2014 {exp.company}</span>}
                </div>
                <span style={{ fontSize: fs.small, color: textMuted, flexShrink: 0 }}>
                  {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` \u2013 ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                </span>
              </div>
              {exp.location && <div style={{ fontSize: fs.small, color: textMuted, marginTop: "2px" }}>{exp.location}</div>}
              {exp.description && <p style={{ fontSize: fs.body, color: textMuted, marginTop: "6px", lineHeight: 1.7, margin: "6px 0 0 0" }}>{exp.description}</p>}
              {exp.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0 0" }}>
                  {exp.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: textMuted, lineHeight: 1.7, paddingLeft: "16px", position: "relative" }}>
                      <span style={{ position: "absolute", left: "4px", top: "9px", width: "5px", height: "5px", border: `1px solid ${accent}`, transform: "rotate(45deg)" }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </PaperCard>
          ))}
        </div>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <div key="education" style={{ marginBottom: "18px" }}>
          <SectionTitle title="Education" />
          {enabledEdu.map((edu, idx) => (
            <PaperCard key={edu.id} index={idx + 3}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 600, color: textMain }}>
                  {edu.degree}{edu.field && ` in ${edu.field}`}
                </span>
                <span style={{ fontSize: fs.small, color: textMuted, flexShrink: 0 }}>
                  {formatDisplayDate(edu.startDate)}{edu.endDate && ` \u2013 ${formatDisplayDate(edu.endDate)}`}
                </span>
              </div>
              <div style={{ fontSize: fs.body, color: accent, marginTop: "2px" }}>{edu.institution}</div>
              {edu.achievements && edu.achievements.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                  {edu.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: textMuted, lineHeight: 1.7, paddingLeft: "16px", position: "relative" }}>
                      <span style={{ position: "absolute", left: "4px", top: "9px", width: "5px", height: "5px", border: `1px solid ${accent}`, transform: "rotate(45deg)" }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </PaperCard>
          ))}
        </div>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <div key="skills" style={{ marginBottom: "18px" }}>
          <SectionTitle title="Skills" />
          <PaperCard index={5}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {config.skillCategories.map((cat) => (
                <div key={cat.id} style={{ fontSize: fs.body }}>
                  <span style={{ fontWeight: 600, color: textMain }}>{cat.name}: </span>
                  <span style={{ color: textMuted }}>{cat.skills.join(" \u00b7 ")}</span>
                </div>
              ))}
            </div>
          </PaperCard>
        </div>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <div key="projects" style={{ marginBottom: "18px" }}>
          <SectionTitle title="Projects" />
          {enabledProjects.map((proj, idx) => (
            <PaperCard key={proj.id} index={idx + 7}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: fs.h3, fontWeight: 600, color: textMain }}>{proj.title}</span>
                {proj.url && (
                  <a href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.small, color: accent, textDecoration: "none" }}>
                    {proj.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                )}
              </div>
              {proj.description && <p style={{ fontSize: fs.body, color: textMuted, marginTop: "4px", lineHeight: 1.7, margin: "4px 0 0 0" }}>{proj.description}</p>}
              {proj.techStack.length > 0 && (
                <div style={{ fontSize: fs.small, color: textMuted, marginTop: "4px", fontStyle: "italic" }}>
                  {proj.techStack.join(" / ")}
                </div>
              )}
            </PaperCard>
          ))}
        </div>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <div key="certifications" style={{ marginBottom: "18px" }}>
          <SectionTitle title="Certifications" />
          <PaperCard index={10}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {enabledCerts.map((cert) => (
                <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    {cert.url ? (
                      <a href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.h3, fontWeight: 600, color: accent, textDecoration: "none" }}>{cert.name}</a>
                    ) : (
                      <span style={{ fontSize: fs.h3, fontWeight: 600, color: textMain }}>{cert.name}</span>
                    )}
                    {cert.issuer && <span style={{ fontSize: fs.body, color: textMuted }}> \u2014 {cert.issuer}</span>}
                  </div>
                  {cert.date && <span style={{ fontSize: fs.small, color: textMuted, flexShrink: 0 }}>{formatDisplayDate(cert.date)}</span>}
                </div>
              ))}
            </div>
          </PaperCard>
        </div>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section, sIdx) => (
            <div key={section.id} style={{ marginBottom: "18px" }}>
              <SectionTitle title={section.title} />
              <PaperCard index={sIdx + 12}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {section.items.map((item) => (
                    <li key={item.id} style={{ fontSize: fs.body, color: textMuted, lineHeight: 1.7, paddingLeft: "16px", position: "relative", marginBottom: "2px" }}>
                      <span style={{ position: "absolute", left: "4px", top: "9px", width: "5px", height: "5px", border: `1px solid ${accent}`, transform: "rotate(45deg)" }} />
                      {item.content}
                    </li>
                  ))}
                </ul>
              </PaperCard>
            </div>
          ))
        : null,
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: `${pad}px ${pad + 4}px`, backgroundColor: "#fff" }}>
      {/* Header as a paper card */}
      <PaperCard index={0}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "56px", height: "56px", overflow: "hidden", flexShrink: 0, border: `1px solid ${foldColor}`, transform: "rotate(-2deg)" }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 700, color: textMain, margin: 0 }}>{p.fullName || "Your Name"}</h1>
            {p.title && <div style={{ fontSize: fs.h2, color: accent, fontWeight: 500, marginTop: "2px" }}>{p.title}</div>}
          </div>
        </div>
        {contacts.length > 0 && (
          <div style={{ marginTop: "10px", fontSize: fs.small, color: textMuted, borderTop: `1px dashed ${foldColor}`, paddingTop: "8px" }}>
            {contacts.map((c, i) => {
              const href = contactHref(c.type, c.value)
              return (
                <span key={i}>
                  {i > 0 && <span style={{ margin: "0 8px", color: foldColor }}>|</span>}
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: accent, textDecoration: "none" }}>{c.value}</a>
                  ) : (
                    <span>{c.value}</span>
                  )}
                </span>
              )
            })}
          </div>
        )}
      </PaperCard>

      <div style={{ marginTop: "18px" }}>
        {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   33. TERMINAL TEMPLATE
   Command-line / hacker aesthetic — black bg, green text, monospace
   ═══════════════════════════════════════════════ */
function TerminalTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 40

  const bg = "#0d1117"
  const green = "#00ff41"
  const dimGreen = "#238636"
  const textBody = "#c9d1d9"
  const textMuted = "#8b949e"
  const mono = "'Courier New', 'Consolas', 'Liberation Mono', monospace"

  function TermHeader({ title }: { title: string }) {
    return (
      <div style={{ fontSize: fs.h2, fontFamily: mono, fontWeight: 700, color: green, marginBottom: "10px", letterSpacing: "1px" }}>
        <span style={{ color: dimGreen }}>$ </span>{title.toLowerCase().replace(/\s+/g, "_")}
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <div key="summary" style={{ marginBottom: "22px" }}>
          <TermHeader title="cat about.txt" />
          <p style={{ fontSize: fs.body, fontFamily: mono, color: textBody, lineHeight: 1.8, margin: 0, paddingLeft: "18px", borderLeft: `2px solid ${dimGreen}` }}>{p.summary}</p>
        </div>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <div key="experience" style={{ marginBottom: "22px" }}>
          <TermHeader title="ls ./experience" />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingLeft: "18px", borderLeft: `2px solid ${dimGreen}` }}>
            {enabledExp.map((exp) => (
              <div key={exp.id}>
                <div style={{ fontFamily: mono }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: green }}>{exp.title}</span>
                  {exp.company && <span style={{ fontSize: fs.h3, color: textMuted }}> @ {exp.company}</span>}
                </div>
                <div style={{ fontFamily: mono, fontSize: fs.small, color: textMuted, marginTop: "2px" }}>
                  <span style={{ color: dimGreen }}>&gt; </span>
                  {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` \u2013 ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                  {exp.location && <span> | {exp.location}</span>}
                </div>
                {exp.description && <p style={{ fontSize: fs.body, fontFamily: mono, color: textBody, marginTop: "6px", lineHeight: 1.7, margin: "6px 0 0 0" }}>{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0 0" }}>
                    {exp.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, fontFamily: mono, color: textBody, lineHeight: 1.7, paddingLeft: "20px", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, color: dimGreen }}>{"->"}</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <div key="education" style={{ marginBottom: "22px" }}>
          <TermHeader title="cat education.log" />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingLeft: "18px", borderLeft: `2px solid ${dimGreen}` }}>
            {enabledEdu.map((edu) => (
              <div key={edu.id} style={{ fontFamily: mono }}>
                <div>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: green }}>
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </span>
                </div>
                <div style={{ fontSize: fs.body, color: textMuted, marginTop: "1px" }}>
                  <span style={{ color: dimGreen }}>&gt; </span>{edu.institution} | {formatDisplayDate(edu.startDate)}{edu.endDate && ` \u2013 ${formatDisplayDate(edu.endDate)}`}
                </div>
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                    {edu.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: textBody, lineHeight: 1.7, paddingLeft: "20px", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, color: dimGreen }}>{"->"}</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <div key="skills" style={{ marginBottom: "22px" }}>
          <TermHeader title="apt list --installed" />
          <div style={{ paddingLeft: "18px", borderLeft: `2px solid ${dimGreen}`, fontFamily: mono }}>
            {config.skillCategories.map((cat) => (
              <div key={cat.id} style={{ marginBottom: "6px" }}>
                <div style={{ fontSize: fs.small, color: textMuted, marginBottom: "2px" }}>
                  <span style={{ color: dimGreen }}># </span>{cat.name}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px" }}>
                  {cat.skills.map((skill, i) => (
                    <span key={i} style={{ fontSize: fs.body, color: green }}>
                      {skill}<span style={{ color: textMuted }}>/installed</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <div key="projects" style={{ marginBottom: "22px" }}>
          <TermHeader title="ls ./projects" />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingLeft: "18px", borderLeft: `2px solid ${dimGreen}` }}>
            {enabledProjects.map((proj) => (
              <div key={proj.id} style={{ fontFamily: mono }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 700, color: green }}>{proj.title}</span>
                  {proj.url && (
                    <a href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.small, color: dimGreen, textDecoration: "none" }}>
                      {proj.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  )}
                </div>
                {proj.description && <p style={{ fontSize: fs.body, color: textBody, marginTop: "4px", lineHeight: 1.7, margin: "4px 0 0 0" }}>{proj.description}</p>}
                {proj.techStack.length > 0 && (
                  <div style={{ fontSize: fs.small, color: textMuted, marginTop: "4px" }}>
                    {"stack: ["}{proj.techStack.join(", ")}{"]"}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <div key="certifications" style={{ marginBottom: "22px" }}>
          <TermHeader title="cat certifications.txt" />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "18px", borderLeft: `2px solid ${dimGreen}`, fontFamily: mono }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ fontSize: fs.body, color: textBody }}>
                <span style={{ color: dimGreen }}>&gt; </span>
                {cert.url ? (
                  <a href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ color: green, textDecoration: "none" }}>{cert.name}</a>
                ) : (
                  <span style={{ color: green }}>{cert.name}</span>
                )}
                {cert.issuer && <span style={{ color: textMuted }}> [{cert.issuer}]</span>}
                {cert.date && <span style={{ color: textMuted }}> ({formatDisplayDate(cert.date)})</span>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <div key={section.id} style={{ marginBottom: "22px" }}>
              <TermHeader title={`cat ${section.title.toLowerCase().replace(/\s+/g, "_")}.txt`} />
              <ul style={{ listStyle: "none", padding: 0, margin: 0, paddingLeft: "18px", borderLeft: `2px solid ${dimGreen}`, fontFamily: mono }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: textBody, lineHeight: 1.7, paddingLeft: "20px", position: "relative", marginBottom: "2px" }}>
                    <span style={{ position: "absolute", left: 0, color: dimGreen }}>{"->"}</span>
                    {item.content}
                  </li>
                ))}
              </ul>
            </div>
          ))
        : null,
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, backgroundColor: bg, color: textBody, fontFamily: mono, padding: `${pad}px ${pad + 4}px` }}>
      {/* Terminal title bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ff5f57" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#febc2e" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#28c840" }} />
        <span style={{ fontSize: fs.small, color: textMuted, marginLeft: "8px" }}>resume@{(p.fullName || "user").toLowerCase().replace(/\s+/g, "-")}:~</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: "24px", paddingTop: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "52px", height: "52px", borderRadius: "4px", overflow: "hidden", flexShrink: 0, border: `1px solid ${dimGreen}` }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 700, fontFamily: mono, color: green, margin: 0, letterSpacing: "1px" }}>
              {p.fullName || "Your Name"}<span style={{ display: "inline-block", width: "8px", height: "18px", backgroundColor: green, marginLeft: "4px", verticalAlign: "middle" }} />
            </h1>
            {p.title && <div style={{ fontSize: fs.h2, color: textMuted, fontFamily: mono, marginTop: "2px" }}>{p.title}</div>}
          </div>
        </div>

        {contacts.length > 0 && (
          <div style={{ marginTop: "10px", fontSize: fs.small, fontFamily: mono, color: textMuted }}>
            {contacts.map((c, i) => {
              const href = contactHref(c.type, c.value)
              return (
                <span key={i}>
                  {i > 0 && <span style={{ margin: "0 8px", color: dimGreen }}>|</span>}
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: green, textDecoration: "none" }}>{c.value}</a>
                  ) : (
                    <span style={{ color: textBody }}>{c.value}</span>
                  )}
                </span>
              )
            })}
          </div>
        )}
      </div>

      <div style={{ height: "1px", backgroundColor: dimGreen, marginBottom: "20px" }} />

      {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   34. RIBBON TEMPLATE
   Ribbon/banner design elements — folded ribbon headers, ribbon date labels
   ═══════════════════════════════════════════════ */
function RibbonTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 40

  const textMain = "#1f2937"
  const textMuted = "#6b7280"

  function darkenAccent(hex: string): string {
    const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 40)
    const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 40)
    const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 40)
    return `rgb(${r},${g},${b})`
  }

  function RibbonBanner({ title }: { title: string }) {
    const foldShadow = darkenAccent(accent)
    return (
      <div style={{ position: "relative", display: "inline-block", marginBottom: "14px", marginLeft: "-8px" }}>
        {/* Left fold */}
        <div style={{ position: "absolute", left: "-6px", bottom: "-6px", width: 0, height: 0, borderStyle: "solid", borderWidth: "0 6px 6px 0", borderColor: `transparent ${foldShadow} transparent transparent` }} />
        {/* Main ribbon */}
        <div style={{ backgroundColor: accent, color: "#fff", fontSize: fs.h2, fontWeight: 700, padding: "5px 22px 5px 14px", textTransform: "uppercase", letterSpacing: "1.5px", position: "relative" }}>
          {title}
          {/* Right notch */}
          <div style={{ position: "absolute", right: 0, top: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "12px 8px 12px 0", borderColor: "transparent #fff transparent transparent" }} />
        </div>
      </div>
    )
  }

  function DateRibbon({ text }: { text: string }) {
    return (
      <span style={{ display: "inline-block", backgroundColor: accent, color: "#fff", fontSize: fs.small, fontWeight: 600, padding: "2px 12px 2px 8px", position: "relative", flexShrink: 0 }}>
        {text}
        <span style={{ position: "absolute", right: "-6px", top: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "10px 6px 10px 0", borderColor: `transparent transparent transparent ${accent}` }} />
      </span>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <div key="summary" style={{ marginBottom: "24px" }}>
          <RibbonBanner title="About" />
          <p style={{ fontSize: fs.body, color: textMuted, lineHeight: 1.8, margin: 0 }}>{p.summary}</p>
        </div>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <div key="experience" style={{ marginBottom: "24px" }}>
          <RibbonBanner title="Experience" />
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {enabledExp.map((exp) => (
              <div key={exp.id} style={{ paddingLeft: "12px", borderLeft: `3px solid ${accent}20` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                  <div>
                    <span style={{ fontSize: fs.h3, fontWeight: 600, color: textMain }}>{exp.title}</span>
                    {exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 500 }}> \u2014 {exp.company}</span>}
                  </div>
                  <DateRibbon text={`${formatDisplayDate(exp.startDate)}${(exp.endDate || exp.isCurrent) ? ` \u2013 ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}` : ""}`} />
                </div>
                {exp.location && <div style={{ fontSize: fs.small, color: textMuted, marginTop: "2px" }}>{exp.location}</div>}
                {exp.description && <p style={{ fontSize: fs.body, color: textMuted, marginTop: "6px", lineHeight: 1.7, margin: "6px 0 0 0" }}>{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0 0" }}>
                    {exp.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: textMuted, lineHeight: 1.7, paddingLeft: "16px", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, top: "8px", width: "8px", height: "8px", backgroundColor: `${accent}30`, border: `2px solid ${accent}`, borderRadius: "2px" }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <div key="education" style={{ marginBottom: "24px" }}>
          <RibbonBanner title="Education" />
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {enabledEdu.map((edu) => (
              <div key={edu.id} style={{ paddingLeft: "12px", borderLeft: `3px solid ${accent}20` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 600, color: textMain }}>
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </span>
                  <DateRibbon text={`${formatDisplayDate(edu.startDate)}${edu.endDate ? ` \u2013 ${formatDisplayDate(edu.endDate)}` : ""}`} />
                </div>
                <div style={{ fontSize: fs.body, color: accent, marginTop: "2px" }}>{edu.institution}</div>
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                    {edu.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: textMuted, lineHeight: 1.7, paddingLeft: "16px", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, top: "8px", width: "8px", height: "8px", backgroundColor: `${accent}30`, border: `2px solid ${accent}`, borderRadius: "2px" }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <div key="skills" style={{ marginBottom: "24px" }}>
          <RibbonBanner title="Skills" />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {config.skillCategories.map((cat) => (
              <div key={cat.id} style={{ position: "relative", padding: "10px 14px", border: `1px solid ${accent}25`, borderRadius: "4px" }}>
                {/* Decorative ribbon corner */}
                <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 20px 20px 0", borderColor: `transparent ${accent}20 transparent transparent` }} />
                <div style={{ fontSize: fs.small, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{cat.name}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {cat.skills.map((skill, i) => (
                    <span key={i} style={{ fontSize: fs.body, color: textMain, backgroundColor: `${accent}10`, padding: "2px 10px", borderRadius: "3px" }}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <div key="projects" style={{ marginBottom: "24px" }}>
          <RibbonBanner title="Projects" />
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {enabledProjects.map((proj) => (
              <div key={proj.id} style={{ paddingLeft: "12px", borderLeft: `3px solid ${accent}20` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 600, color: textMain }}>{proj.title}</span>
                  {proj.url && (
                    <a href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.small, color: accent, textDecoration: "none" }}>
                      {proj.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  )}
                </div>
                {proj.description && <p style={{ fontSize: fs.body, color: textMuted, marginTop: "4px", lineHeight: 1.7, margin: "4px 0 0 0" }}>{proj.description}</p>}
                {proj.techStack.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
                    {proj.techStack.map((t, i) => (
                      <span key={i} style={{ fontSize: fs.small, color: accent, backgroundColor: `${accent}10`, padding: "1px 8px", borderRadius: "3px" }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <div key="certifications" style={{ marginBottom: "24px" }}>
          <RibbonBanner title="Certifications" />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingLeft: "12px", borderLeft: `3px solid ${accent}20` }}>
                <div>
                  {cert.url ? (
                    <a href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.h3, fontWeight: 600, color: accent, textDecoration: "none" }}>{cert.name}</a>
                  ) : (
                    <span style={{ fontSize: fs.h3, fontWeight: 600, color: textMain }}>{cert.name}</span>
                  )}
                  {cert.issuer && <span style={{ fontSize: fs.body, color: textMuted }}> \u2014 {cert.issuer}</span>}
                </div>
                {cert.date && <span style={{ fontSize: fs.small, color: textMuted, flexShrink: 0 }}>{formatDisplayDate(cert.date)}</span>}
              </div>
            ))}
          </div>
        </div>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <div key={section.id} style={{ marginBottom: "24px" }}>
              <RibbonBanner title={section.title} />
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: textMuted, lineHeight: 1.7, paddingLeft: "16px", position: "relative", marginBottom: "2px" }}>
                    <span style={{ position: "absolute", left: 0, top: "8px", width: "8px", height: "8px", backgroundColor: `${accent}30`, border: `2px solid ${accent}`, borderRadius: "2px" }} />
                    {item.content}
                  </li>
                ))}
              </ul>
            </div>
          ))
        : null,
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: `${pad}px ${pad + 4}px` }}>
      {/* Ribbon Header Banner */}
      <div style={{ position: "relative", backgroundColor: accent, margin: `-${pad}px -${pad + 4}px ${24}px`, padding: "24px 32px", color: "#fff" }}>
        {/* Left fold shadow */}
        <div style={{ position: "absolute", bottom: "-8px", left: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "8px 8px 0 0", borderColor: `${darkenAccent(accent)} transparent transparent transparent` }} />
        {/* Right fold shadow */}
        <div style={{ position: "absolute", bottom: "-8px", right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 8px 8px 0", borderColor: `transparent transparent transparent ${darkenAccent(accent)}`, transform: "scaleX(-1)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "3px solid rgba(255,255,255,0.4)" }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", margin: 0 }}>{p.fullName || "Your Name"}</h1>
            {p.title && <div style={{ fontSize: fs.h2, color: "rgba(255,255,255,0.85)", fontWeight: 500, marginTop: "2px" }}>{p.title}</div>}
          </div>
        </div>
        {contacts.length > 0 && (
          <div style={{ marginTop: "10px", fontSize: fs.small, color: "rgba(255,255,255,0.8)" }}>
            {contacts.map((c, i) => {
              const href = contactHref(c.type, c.value)
              return (
                <span key={i}>
                  {i > 0 && <span style={{ margin: "0 8px", opacity: 0.5 }}>|</span>}
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "none" }}>{c.value}</a>
                  ) : (
                    <span>{c.value}</span>
                  )}
                </span>
              )
            })}
          </div>
        )}
      </div>

      {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   35. ZEN TEMPLATE
   Japanese zen minimalism — extreme whitespace, subtle dot separators, muted tones
   ═══════════════════════════════════════════════ */
function ZenTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const pad = config.pagePadding ?? 40

  const textMain = "#374151"
  const textMuted = "#9ca3af"
  const textLight = "#d1d5db"
  const dotSep = "\u00b7   \u00b7   \u00b7   \u00b7   \u00b7   \u00b7   \u00b7"

  function ZenDivider() {
    return (
      <div style={{ textAlign: "center", fontSize: fs.small, color: textLight, letterSpacing: "4px", margin: "28px 0", userSelect: "none" }}>
        {dotSep}
      </div>
    )
  }

  function SectionLabel({ title }: { title: string }) {
    return (
      <div style={{ fontSize: fs.h2, fontWeight: 200, color: textMuted, textTransform: "lowercase", letterSpacing: "4px", marginBottom: "18px" }}>{title}</div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () =>
      p.summary ? (
        <div key="summary">
          <SectionLabel title="about" />
          <p style={{ fontSize: fs.body, color: textMain, lineHeight: 2.0, margin: 0, fontWeight: 300, maxWidth: "520px" }}>{p.summary}</p>
          <ZenDivider />
        </div>
      ) : null,

    experience: () =>
      enabledExp.length > 0 ? (
        <div key="experience">
          <SectionLabel title="experience" />
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {enabledExp.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontSize: fs.h3, fontWeight: 400, color: textMain }}>{exp.title}</span>
                    {exp.company && <span style={{ fontSize: fs.h3, color: textMuted, fontWeight: 200 }}>{"  "}{exp.company}</span>}
                  </div>
                  <span style={{ fontSize: fs.small, color: textLight, fontWeight: 200, flexShrink: 0 }}>
                    {formatDisplayDate(exp.startDate)}{(exp.endDate || exp.isCurrent) && ` \u2014 ${exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}`}
                  </span>
                </div>
                {exp.location && <div style={{ fontSize: fs.small, color: textLight, marginTop: "3px", fontWeight: 200 }}>{exp.location}</div>}
                {exp.description && <p style={{ fontSize: fs.body, color: textMuted, marginTop: "8px", lineHeight: 1.9, margin: "8px 0 0 0", fontWeight: 300 }}>{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0 0" }}>
                    {exp.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: textMuted, lineHeight: 2.0, paddingLeft: "16px", position: "relative", fontWeight: 300 }}>
                        <span style={{ position: "absolute", left: "4px", top: "12px", width: "4px", height: "4px", borderRadius: "50%", border: `1px solid ${textLight}`, backgroundColor: "transparent" }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <ZenDivider />
        </div>
      ) : null,

    education: () =>
      enabledEdu.length > 0 ? (
        <div key="education">
          <SectionLabel title="education" />
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {enabledEdu.map((edu) => (
              <div key={edu.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 400, color: textMain }}>
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </span>
                  <span style={{ fontSize: fs.small, color: textLight, fontWeight: 200, flexShrink: 0 }}>
                    {formatDisplayDate(edu.startDate)}{edu.endDate && ` \u2014 ${formatDisplayDate(edu.endDate)}`}
                  </span>
                </div>
                <div style={{ fontSize: fs.body, color: textMuted, fontWeight: 200, marginTop: "3px" }}>{edu.institution}</div>
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0 0" }}>
                    {edu.achievements.map((a, i) => (
                      <li key={i} style={{ fontSize: fs.body, color: textMuted, lineHeight: 2.0, paddingLeft: "16px", position: "relative", fontWeight: 300 }}>
                        <span style={{ position: "absolute", left: "4px", top: "12px", width: "4px", height: "4px", borderRadius: "50%", border: `1px solid ${textLight}`, backgroundColor: "transparent" }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <ZenDivider />
        </div>
      ) : null,

    skills: () =>
      config.skillCategories.length > 0 ? (
        <div key="skills">
          <SectionLabel title="skills" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {config.skillCategories.map((cat) =>
              cat.skills.map((skill, i) => (
                <span key={`${cat.id}-${i}`} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "4px 14px", fontSize: fs.small, color: textMuted, fontWeight: 300, border: `1px solid ${textLight}`, borderRadius: "999px" }}>
                  {skill}
                </span>
              ))
            )}
          </div>
          <ZenDivider />
        </div>
      ) : null,

    projects: () =>
      enabledProjects.length > 0 ? (
        <div key="projects">
          <SectionLabel title="projects" />
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {enabledProjects.map((proj) => (
              <div key={proj.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: fs.h3, fontWeight: 400, color: textMain }}>{proj.title}</span>
                  {proj.url && (
                    <a href={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.small, color: textMuted, textDecoration: "none", fontWeight: 200 }}>
                      {proj.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  )}
                </div>
                {proj.description && <p style={{ fontSize: fs.body, color: textMuted, marginTop: "6px", lineHeight: 1.9, margin: "6px 0 0 0", fontWeight: 300 }}>{proj.description}</p>}
                {proj.techStack.length > 0 && (
                  <div style={{ fontSize: fs.small, color: textLight, marginTop: "4px", fontWeight: 200 }}>
                    {proj.techStack.join("  \u00b7  ")}
                  </div>
                )}
              </div>
            ))}
          </div>
          <ZenDivider />
        </div>
      ) : null,

    certifications: () =>
      enabledCerts.length > 0 ? (
        <div key="certifications">
          <SectionLabel title="certifications" />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {enabledCerts.map((cert) => (
              <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  {cert.url ? (
                    <a href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs.h3, fontWeight: 400, color: accent, textDecoration: "none" }}>{cert.name}</a>
                  ) : (
                    <span style={{ fontSize: fs.h3, fontWeight: 400, color: textMain }}>{cert.name}</span>
                  )}
                  {cert.issuer && <span style={{ fontSize: fs.body, color: textLight, fontWeight: 200 }}>{"  "}{cert.issuer}</span>}
                </div>
                {cert.date && <span style={{ fontSize: fs.small, color: textLight, fontWeight: 200, flexShrink: 0 }}>{formatDisplayDate(cert.date)}</span>}
              </div>
            ))}
          </div>
          <ZenDivider />
        </div>
      ) : null,

    custom: () =>
      config.customSections.length > 0
        ? config.customSections.map((section) => (
            <div key={section.id}>
              <SectionLabel title={section.title} />
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.items.map((item) => (
                  <li key={item.id} style={{ fontSize: fs.body, color: textMuted, lineHeight: 2.0, paddingLeft: "16px", position: "relative", fontWeight: 300, marginBottom: "2px" }}>
                    <span style={{ position: "absolute", left: "4px", top: "12px", width: "4px", height: "4px", borderRadius: "50%", border: `1px solid ${textLight}`, backgroundColor: "transparent" }} />
                    {item.content}
                  </li>
                ))}
              </ul>
              <ZenDivider />
            </div>
          ))
        : null,
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, padding: `${pad + 16}px ${pad + 12}px` }}>
      {/* Thin ink-brush accent line */}
      <div style={{ height: "1px", backgroundColor: accent, marginBottom: "36px", opacity: 0.6 }} />

      {/* Zen Header */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, opacity: 0.85 }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: "34px", fontWeight: 100, color: textMain, margin: 0, letterSpacing: "3px" }}>
              {p.fullName || "Your Name"}
            </h1>
            {p.title && <div style={{ fontSize: fs.h2, color: textMuted, fontWeight: 200, marginTop: "6px", letterSpacing: "2px" }}>{p.title}</div>}
          </div>
        </div>

        {contacts.length > 0 && (
          <div style={{ marginTop: "14px", fontSize: fs.small, color: textLight, fontWeight: 200, letterSpacing: "0.5px" }}>
            {contacts.map((c, i) => {
              const href = contactHref(c.type, c.value)
              return (
                <span key={i}>
                  {i > 0 && <span style={{ margin: "0 12px" }}>{"\u00b7"}</span>}
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: textMuted, textDecoration: "none" }}>{c.value}</a>
                  ) : (
                    <span>{c.value}</span>
                  )}
                </span>
              )
            })}
          </div>
        )}
      </div>

      <ZenDivider />

      {config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   31. DIAGONAL TEMPLATE
   Dynamic angled accents with diagonal stripes,
   skewed section markers and slanted date badges
   ═══════════════════════════════════════════════ */
function DiagonalTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const pad = config.pagePadding ?? 32
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)

  function SectionHead({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "28px", height: "28px", backgroundColor: accent,
          transform: "rotate(-3deg)", borderRadius: "3px", flexShrink: 0,
        }}>
          {icon}
        </div>
        <span style={{ fontSize: fs.h2, fontWeight: 800, color: "#1a1a2e", textTransform: "uppercase", letterSpacing: "1.5px" }}>{title}</span>
        <div style={{ flex: 1, height: "3px", background: `linear-gradient(135deg, ${accent}, transparent)`, transform: "skewX(-20deg)" }} />
      </div>
    )
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, overflow: "hidden" }}>
      <div style={{ position: "relative", padding: `${pad + 14}px ${pad + 8}px ${pad}px`, backgroundColor: "#ffffff" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "-30px", left: "-40px", width: "55%", height: "140%", backgroundColor: accent, opacity: 0.08, transform: "skewX(-15deg)" }} />
          <div style={{ position: "absolute", top: "-20px", right: "-30px", width: "35%", height: "140%", backgroundColor: accent, opacity: 0.05, transform: "skewX(-15deg)" }} />
        </div>
        <div style={{ position: "absolute", top: "12px", left: "-20px", width: "70%", height: "48px", backgroundColor: accent, clipPath: "polygon(3% 0, 100% 0, 97% 100%, 0% 100%)", opacity: 0.9, zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {config.showProfileImage && p.profileImage && (
              <div style={{ width: "68px", height: "68px", borderRadius: "6px", border: `3px solid ${accent}`, overflow: "hidden", flexShrink: 0, transform: "rotate(-3deg)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <div>
              <h1 style={{ fontSize: "30px", fontWeight: 900, color: "white", margin: 0, lineHeight: 1.2, letterSpacing: "1px", textTransform: "uppercase", textShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>
                {p.fullName || "Your Name"}
              </h1>
              {p.title && (
                <div style={{ fontSize: "13px", color: "#1a1a2e", fontWeight: 600, marginTop: "8px", letterSpacing: "2px", textTransform: "uppercase" }}>{p.title}</div>
              )}
            </div>
          </div>
          {contacts.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: "16px", paddingTop: "10px", borderTop: `2px solid ${accent}20` }}>
              {contacts.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: fs.small, color: "#4b5563" }}>
                  {contactIcon(c.type, accent, 11)}
                  <LinkText href={contactHref(c.type, c.value)}>{c.value}</LinkText>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: `${pad - 8}px ${pad + 8}px` }}>
        {(() => {
          const sectionRenderers: Record<string, () => React.ReactNode> = {
            summary: () =>
              p.summary ? (
                <div key="summary" style={{ marginBottom: "20px", padding: "12px 16px", position: "relative", backgroundColor: `${accent}06`, borderRadius: "4px" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, width: "5px", height: "100%", backgroundColor: accent, transform: "skewY(-2deg)", borderRadius: "3px" }} />
                  <p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#374151", margin: 0, paddingLeft: "8px" }}>{p.summary}</p>
                </div>
              ) : null,
            experience: () =>
              enabledExp.length > 0 ? (
                <div key="experience" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconBriefcase color="white" size={13} />} title="Experience" />
                  {enabledExp.map((exp) => (
                    <div key={exp.id} style={{ marginBottom: "16px", paddingLeft: "18px", position: "relative" }}>
                      <div style={{ position: "absolute", left: 0, top: "3px", width: "8px", height: "18px", backgroundColor: accent, transform: "skewY(-15deg)", borderRadius: "2px", opacity: 0.7 }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "6px" }}>
                        <div>
                          <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#1a1a2e" }}>{exp.title}</span>
                          {exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 600 }}> — {exp.company}</span>}
                        </div>
                        <div style={{ fontSize: fs.small, fontWeight: 600, color: "white", backgroundColor: accent, padding: "2px 12px", clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)", minWidth: "120px", textAlign: "center" }}>
                          {formatDisplayDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}
                        </div>
                      </div>
                      {exp.location && (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                          <IconMapPin color="#9ca3af" size={10} />
                          <span style={{ fontSize: fs.small, color: "#9ca3af" }}>{exp.location}</span>
                        </div>
                      )}
                      {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.6 }}>{exp.description}</p>}
                      {exp.achievements.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
                          {exp.achievements.map((a, i) => (
                            <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "16px", position: "relative" }}>
                              <span style={{ position: "absolute", left: 0, top: "6px", width: "8px", height: "8px", backgroundColor: `${accent}30`, transform: "rotate(45deg)", borderRadius: "1px" }} />
                              {a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : null,
            education: () =>
              enabledEdu.length > 0 ? (
                <div key="education" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconGradCap color="white" size={13} />} title="Education" />
                  {enabledEdu.map((edu) => (
                    <div key={edu.id} style={{ marginBottom: "10px", paddingLeft: "18px", position: "relative" }}>
                      <div style={{ position: "absolute", left: 0, top: "3px", width: "8px", height: "18px", backgroundColor: accent, transform: "skewY(-15deg)", borderRadius: "2px", opacity: 0.7 }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#1a1a2e" }}>{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                        <span style={{ fontSize: fs.small, color: "#6b7280", fontWeight: 600 }}>{formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}</span>
                      </div>
                      <div style={{ fontSize: fs.body, color: accent, fontWeight: 600 }}>{edu.institution}</div>
                      {edu.achievements && edu.achievements.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                          {edu.achievements.map((a, i) => (
                            <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.5, paddingLeft: "14px", position: "relative" }}>
                              <span style={{ position: "absolute", left: 0, top: "6px", width: "6px", height: "6px", backgroundColor: `${accent}40`, transform: "rotate(45deg)" }} />{a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : null,
            skills: () =>
              config.skillCategories.length > 0 ? (
                <div key="skills" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconLayers color="white" size={13} />} title="Skills" />
                  {config.skillCategories.map((cat) => (
                    <div key={cat.id} style={{ marginBottom: "8px" }}>
                      <div style={{ fontSize: fs.small, fontWeight: 700, color: "#1a1a2e", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>{cat.name}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {cat.skills.map((skill, i) => (
                          <span key={i} style={{ fontSize: fs.small, padding: "3px 12px", backgroundColor: `${accent}12`, color: "#374151", clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)", fontWeight: 500 }}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null,
            projects: () =>
              enabledProjects.length > 0 ? (
                <div key="projects" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconFolder color="white" size={13} />} title="Projects" />
                  {enabledProjects.map((proj) => (
                    <div key={proj.id} style={{ marginBottom: "12px", paddingLeft: "18px", position: "relative" }}>
                      <div style={{ position: "absolute", left: 0, top: "3px", width: "8px", height: "18px", backgroundColor: accent, transform: "skewY(-15deg)", borderRadius: "2px", opacity: 0.7 }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#1a1a2e" }}>{proj.title}</span>
                        {proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}
                      </div>
                      {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "3px", lineHeight: 1.5 }}>{proj.description}</p>}
                      {proj.techStack.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "5px" }}>
                          {proj.techStack.map((t, i) => (
                            <span key={i} style={{ fontSize: "9px", padding: "2px 8px", backgroundColor: `${accent}15`, color: accent, fontWeight: 600, borderRadius: "2px" }}>{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null,
            certifications: () =>
              enabledCerts.length > 0 ? (
                <div key="certifications" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconAward color="white" size={13} />} title="Certifications" />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {enabledCerts.map((cert) => (
                      <div key={cert.id} style={{ padding: "8px 16px", backgroundColor: `${accent}08`, clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0% 100%)", minWidth: "140px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <IconShield color={accent} size={11} />
                          <span style={{ fontSize: fs.small, fontWeight: 700, color: "#1a1a2e" }}>{cert.name}</span>
                        </div>
                        <div style={{ fontSize: "9.5px", color: "#6b7280", marginTop: "2px", marginLeft: "16px" }}>{cert.issuer}{cert.date && ` · ${formatDisplayDate(cert.date)}`}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null,
            custom: () =>
              config.customSections.length > 0
                ? <>{config.customSections.map((section) => (
                    <div key={section.id} style={{ marginBottom: "22px" }}>
                      <SectionHead icon={<IconStar color="white" size={13} />} title={section.title} />
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {section.items.map((item) => (
                          <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "16px", position: "relative" }}>
                            <span style={{ position: "absolute", left: 0, top: "6px", width: "8px", height: "8px", backgroundColor: `${accent}30`, transform: "rotate(45deg)" }} />
                            {item.content}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}</>
                : null,
          }
          return config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)
        })()}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   32. CIRCUIT TEMPLATE
   Tech/circuit board inspired with PCB traces,
   IC chip skill shapes and monospace accents
   ═══════════════════════════════════════════════ */
function CircuitTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const pad = config.pagePadding ?? 32
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const darkBg = "#1a1a2e"
  const bodyBg = "#f8f9fc"

  function SectionHead({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: accent, boxShadow: `0 0 0 3px ${accent}30`, flexShrink: 0 }} />
        <div style={{ width: "20px", height: "0px", borderTop: `2px dotted ${accent}60` }} />
        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 14px", borderRadius: "16px", border: `2px solid ${accent}`, backgroundColor: `${accent}08` }}>
          {icon}
          <span style={{ fontSize: fs.h2, fontWeight: 700, color: darkBg, fontFamily: "'Courier New', monospace", textTransform: "uppercase", letterSpacing: "1.5px" }}>{title}</span>
        </div>
        <div style={{ flex: 1, height: "0px", borderTop: `2px dotted ${accent}40` }} />
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: `${accent}50`, flexShrink: 0 }} />
      </div>
    )
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, overflow: "hidden", backgroundColor: bodyBg }}>
      <div style={{ position: "relative", padding: `${pad + 10}px ${pad + 8}px ${pad}px`, backgroundColor: darkBg, color: "white" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: `radial-gradient(circle, ${accent}15 1px, transparent 1px)`, backgroundSize: "20px 20px", opacity: 0.5 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {config.showProfileImage && p.profileImage && (
              <div style={{ width: "65px", height: "65px", borderRadius: "50%", border: `3px solid ${accent}`, overflow: "hidden", flexShrink: 0, boxShadow: `0 0 0 4px ${darkBg}, 0 0 0 6px ${accent}40` }}>
                <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: 800, color: "white", margin: 0, lineHeight: 1.2, fontFamily: "'Courier New', monospace", letterSpacing: "1px" }}>
                {p.fullName || "Your Name"}
              </h1>
              {p.title && <div style={{ fontSize: "12px", color: accent, fontWeight: 500, marginTop: "4px", fontFamily: "'Courier New', monospace", letterSpacing: "2px" }}>{">"} {p.title}</div>}
            </div>
          </div>
          {contacts.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", marginTop: "14px", paddingTop: "10px", borderTop: `1px dotted ${accent}40` }}>
              {contacts.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: fs.small, color: "rgba(255,255,255,0.8)", fontFamily: "'Courier New', monospace" }}>
                  {contactIcon(c.type, accent, 11)}
                  <LinkText href={contactHref(c.type, c.value)}>{c.value}</LinkText>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: `${pad - 8}px ${pad + 8}px`, backgroundColor: bodyBg }}>
        {(() => {
          const sectionRenderers: Record<string, () => React.ReactNode> = {
            summary: () =>
              p.summary ? (
                <div key="summary" style={{ marginBottom: "20px", padding: "12px 16px", backgroundColor: "white", border: `1px solid ${accent}25`, borderRadius: "8px", position: "relative" }}>
                  <div style={{ position: "absolute", top: "-4px", left: "20px", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: accent }} />
                  <div style={{ position: "absolute", top: "-4px", right: "20px", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: `${accent}50` }} />
                  <p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#374151", margin: 0 }}>{p.summary}</p>
                </div>
              ) : null,
            experience: () =>
              enabledExp.length > 0 ? (
                <div key="experience" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconBriefcase color={accent} size={13} />} title="Experience" />
                  {enabledExp.map((exp) => (
                    <div key={exp.id} style={{ marginBottom: "14px", paddingLeft: "22px", position: "relative" }}>
                      <div style={{ position: "absolute", left: "4px", top: "0", bottom: "0", borderLeft: `2px dotted ${accent}30` }} />
                      <div style={{ position: "absolute", left: "0", top: "5px", width: "10px", height: "10px", borderRadius: "50%", backgroundColor: accent, border: `2px solid ${bodyBg}` }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "6px" }}>
                        <div>
                          <span style={{ fontSize: fs.h3, fontWeight: 700, color: darkBg }}>{exp.title}</span>
                          {exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 600 }}> @ {exp.company}</span>}
                        </div>
                        <span style={{ fontSize: fs.small, color: "#6b7280", fontFamily: "'Courier New', monospace", fontWeight: 500 }}>[{formatDisplayDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}]</span>
                      </div>
                      {exp.location && <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}><IconMapPin color="#9ca3af" size={10} /><span style={{ fontSize: fs.small, color: "#9ca3af" }}>{exp.location}</span></div>}
                      {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.6 }}>{exp.description}</p>}
                      {exp.achievements.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>
                          {exp.achievements.map((a, i) => (
                            <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "16px", position: "relative" }}>
                              <span style={{ position: "absolute", left: "2px", top: "8px", width: "6px", height: "6px", borderRadius: "50%", border: `1.5px solid ${accent}` }} />{a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : null,
            education: () =>
              enabledEdu.length > 0 ? (
                <div key="education" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconGradCap color={accent} size={13} />} title="Education" />
                  {enabledEdu.map((edu) => (
                    <div key={edu.id} style={{ marginBottom: "10px", padding: "8px 14px", backgroundColor: "white", borderRadius: "6px", border: `1px solid ${accent}15` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: fs.h3, fontWeight: 700, color: darkBg }}>{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                        <span style={{ fontSize: fs.small, color: "#6b7280", fontFamily: "'Courier New', monospace" }}>{formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}</span>
                      </div>
                      <div style={{ fontSize: fs.body, color: accent, fontWeight: 600 }}>{edu.institution}</div>
                      {edu.achievements && edu.achievements.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>
                          {edu.achievements.map((a, i) => (
                            <li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.5, paddingLeft: "14px", position: "relative" }}>
                              <span style={{ position: "absolute", left: "2px", top: "8px", width: "5px", height: "5px", borderRadius: "50%", border: `1.5px solid ${accent}` }} />{a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : null,
            skills: () =>
              config.skillCategories.length > 0 ? (
                <div key="skills" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconLayers color={accent} size={13} />} title="Skills" />
                  {config.skillCategories.map((cat) => (
                    <div key={cat.id} style={{ marginBottom: "10px" }}>
                      <div style={{ fontSize: fs.small, fontWeight: 700, color: darkBg, marginBottom: "5px", fontFamily: "'Courier New', monospace", textTransform: "uppercase", letterSpacing: "1px" }}>{cat.name}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {cat.skills.map((skill, i) => (
                          <div key={i} style={{ fontSize: fs.small, padding: "4px 14px", backgroundColor: "white", color: darkBg, border: `1.5px solid ${accent}`, borderRadius: "3px", fontWeight: 500, fontFamily: "'Courier New', monospace", position: "relative" }}>
                            <div style={{ position: "absolute", top: "-3px", left: "25%", width: "3px", height: "3px", backgroundColor: accent, borderRadius: "50%" }} />
                            <div style={{ position: "absolute", top: "-3px", right: "25%", width: "3px", height: "3px", backgroundColor: accent, borderRadius: "50%" }} />
                            <div style={{ position: "absolute", bottom: "-3px", left: "25%", width: "3px", height: "3px", backgroundColor: accent, borderRadius: "50%" }} />
                            <div style={{ position: "absolute", bottom: "-3px", right: "25%", width: "3px", height: "3px", backgroundColor: accent, borderRadius: "50%" }} />
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null,
            projects: () =>
              enabledProjects.length > 0 ? (
                <div key="projects" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconFolder color={accent} size={13} />} title="Projects" />
                  {enabledProjects.map((proj) => (
                    <div key={proj.id} style={{ marginBottom: "12px", padding: "10px 14px", backgroundColor: "white", border: `1px solid ${accent}20`, borderRadius: "6px", position: "relative" }}>
                      <div style={{ position: "absolute", top: "-4px", left: "14px", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: accent }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: fs.h3, fontWeight: 700, color: darkBg }}>{proj.title}</span>
                        {proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}
                      </div>
                      {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "3px", lineHeight: 1.5 }}>{proj.description}</p>}
                      {proj.techStack.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "5px" }}>
                          {proj.techStack.map((t, i) => (
                            <span key={i} style={{ fontSize: "9px", padding: "2px 8px", backgroundColor: darkBg, color: accent, fontWeight: 600, borderRadius: "2px", fontFamily: "'Courier New', monospace" }}>{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null,
            certifications: () =>
              enabledCerts.length > 0 ? (
                <div key="certifications" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconAward color={accent} size={13} />} title="Certifications" />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {enabledCerts.map((cert) => (
                      <div key={cert.id} style={{ padding: "8px 14px", backgroundColor: "white", borderRadius: "6px", border: `1.5px solid ${accent}30` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}><IconShield color={accent} size={11} /><span style={{ fontSize: fs.small, fontWeight: 700, color: darkBg }}>{cert.name}</span></div>
                        <div style={{ fontSize: "9.5px", color: "#6b7280", marginTop: "2px", marginLeft: "16px", fontFamily: "'Courier New', monospace" }}>{cert.issuer}{cert.date && ` · ${formatDisplayDate(cert.date)}`}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null,
            custom: () =>
              config.customSections.length > 0
                ? <>{config.customSections.map((section) => (
                    <div key={section.id} style={{ marginBottom: "22px" }}>
                      <SectionHead icon={<IconStar color={accent} size={13} />} title={section.title} />
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {section.items.map((item) => (
                          <li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "16px", position: "relative" }}>
                            <span style={{ position: "absolute", left: "2px", top: "8px", width: "6px", height: "6px", borderRadius: "50%", border: `1.5px solid ${accent}` }} />{item.content}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}</>
                : null,
          }
          return config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)
        })()}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   33. WATERFALL TEMPLATE
   Content cascades with increasing indentation,
   vertical connecting lines, progressive disclosure
   ═══════════════════════════════════════════════ */
function WaterfallTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const pad = config.pagePadding ?? 32
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)

  function SectionHead({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "50%", backgroundColor: accent, flexShrink: 0 }}>{icon}</div>
        <span style={{ fontSize: fs.h2, fontWeight: 700, color: "#1f2937", letterSpacing: "0.5px" }}>{title}</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: `${accent}30` }} />
      </div>
    )
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, overflow: "hidden" }}>
      <div style={{ padding: `${pad + 8}px ${pad + 8}px ${pad - 4}px`, borderBottom: `3px solid ${accent}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: `3px solid ${accent}`, overflow: "hidden", flexShrink: 0 }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: fs.h1, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.2 }}>{p.fullName || "Your Name"}</h1>
            {p.title && <div style={{ fontSize: "13px", color: accent, fontWeight: 600, marginTop: "3px" }}>{p.title}</div>}
          </div>
        </div>
        {contacts.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: "12px" }}>
            {contacts.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: fs.small, color: "#4b5563" }}>
                {contactIcon(c.type, accent, 11)}
                <LinkText href={contactHref(c.type, c.value)}>{c.value}</LinkText>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding: `${pad - 8}px ${pad}px` }}>
        {(() => {
          let sectionIndex = 0
          function WaterfallSection({ children }: { children: React.ReactNode }) {
            const indent = sectionIndex * 16
            sectionIndex++
            return (
              <div style={{ marginLeft: `${indent}px`, position: "relative", marginBottom: "18px" }}>
                <div style={{ position: "absolute", left: "-8px", top: "0", bottom: "0", width: "2px", backgroundColor: `${accent}25`, borderRadius: "1px" }} />
                {indent > 0 && <div style={{ position: "absolute", left: `-${indent + 8}px`, top: "13px", width: `${indent}px`, height: "2px", backgroundColor: `${accent}20` }} />}
                {children}
              </div>
            )
          }
          const sectionRenderers: Record<string, () => React.ReactNode> = {
            summary: () => p.summary ? (<WaterfallSection key="summary"><div style={{ padding: "10px 14px", backgroundColor: `${accent}06`, borderRadius: "6px", borderLeft: `3px solid ${accent}` }}><p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#374151", margin: 0 }}>{p.summary}</p></div></WaterfallSection>) : null,
            experience: () =>
              enabledExp.length > 0 ? (
                <WaterfallSection key="experience">
                  <SectionHead icon={<IconBriefcase color="white" size={12} />} title="Experience" />
                  {enabledExp.map((exp) => (
                    <div key={exp.id} style={{ marginBottom: "14px", paddingLeft: "14px", borderLeft: `2px solid ${accent}20` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "6px" }}>
                        <div><span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</span>{exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 600 }}> — {exp.company}</span>}</div>
                        <span style={{ fontSize: fs.small, color: "#6b7280", fontWeight: 500 }}>{formatDisplayDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}</span>
                      </div>
                      {exp.location && <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}><IconMapPin color="#9ca3af" size={10} /><span style={{ fontSize: fs.small, color: "#9ca3af" }}>{exp.location}</span></div>}
                      {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.6 }}>{exp.description}</p>}
                      {exp.achievements.length > 0 && (<ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>{exp.achievements.map((a, i) => (<li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}><span style={{ position: "absolute", left: 0, top: "8px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />{a}</li>))}</ul>)}
                    </div>
                  ))}
                </WaterfallSection>
              ) : null,
            education: () =>
              enabledEdu.length > 0 ? (
                <WaterfallSection key="education">
                  <SectionHead icon={<IconGradCap color="white" size={12} />} title="Education" />
                  {enabledEdu.map((edu) => (
                    <div key={edu.id} style={{ marginBottom: "10px", paddingLeft: "14px", borderLeft: `2px solid ${accent}20` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                        <span style={{ fontSize: fs.small, color: "#6b7280" }}>{formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}</span>
                      </div>
                      <div style={{ fontSize: fs.body, color: accent, fontWeight: 600 }}>{edu.institution}</div>
                      {edu.achievements && edu.achievements.length > 0 && (<ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>{edu.achievements.map((a, i) => (<li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.5, paddingLeft: "14px", position: "relative" }}><span style={{ position: "absolute", left: 0, top: "8px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />{a}</li>))}</ul>)}
                    </div>
                  ))}
                </WaterfallSection>
              ) : null,
            skills: () =>
              config.skillCategories.length > 0 ? (
                <WaterfallSection key="skills">
                  <SectionHead icon={<IconLayers color="white" size={12} />} title="Skills" />
                  {config.skillCategories.map((cat) => (<div key={cat.id} style={{ marginBottom: "8px" }}><div style={{ fontSize: fs.small, fontWeight: 700, color: "#111827", marginBottom: "4px" }}>{cat.name}</div><div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>{cat.skills.map((skill, i) => (<span key={i} style={{ fontSize: fs.small, padding: "2px 10px", borderRadius: "12px", backgroundColor: `${accent}10`, color: "#374151", fontWeight: 500, border: `1px solid ${accent}20` }}>{skill}</span>))}</div></div>))}
                </WaterfallSection>
              ) : null,
            projects: () =>
              enabledProjects.length > 0 ? (
                <WaterfallSection key="projects">
                  <SectionHead icon={<IconFolder color="white" size={12} />} title="Projects" />
                  {enabledProjects.map((proj) => (
                    <div key={proj.id} style={{ marginBottom: "12px", paddingLeft: "14px", borderLeft: `2px solid ${accent}20` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</span>{proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}</div>
                      {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "3px", lineHeight: 1.5 }}>{proj.description}</p>}
                      {proj.techStack.length > 0 && (<div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "5px" }}>{proj.techStack.map((t, i) => (<span key={i} style={{ fontSize: "9px", padding: "2px 8px", backgroundColor: `${accent}12`, color: accent, fontWeight: 600, borderRadius: "10px" }}>{t}</span>))}</div>)}
                    </div>
                  ))}
                </WaterfallSection>
              ) : null,
            certifications: () =>
              enabledCerts.length > 0 ? (
                <WaterfallSection key="certifications">
                  <SectionHead icon={<IconAward color="white" size={12} />} title="Certifications" />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>{enabledCerts.map((cert) => (<div key={cert.id} style={{ padding: "6px 12px", backgroundColor: `${accent}06`, borderRadius: "8px", border: `1px solid ${accent}15` }}><div style={{ display: "flex", alignItems: "center", gap: "5px" }}><IconShield color={accent} size={11} /><span style={{ fontSize: fs.small, fontWeight: 700, color: "#111827" }}>{cert.name}</span></div><div style={{ fontSize: "9.5px", color: "#6b7280", marginTop: "2px", marginLeft: "16px" }}>{cert.issuer}{cert.date && ` · ${formatDisplayDate(cert.date)}`}</div></div>))}</div>
                </WaterfallSection>
              ) : null,
            custom: () =>
              config.customSections.length > 0
                ? <>{config.customSections.map((section) => (<WaterfallSection key={section.id}><SectionHead icon={<IconStar color="white" size={12} />} title={section.title} /><ul style={{ listStyle: "none", padding: 0, margin: 0 }}>{section.items.map((item) => (<li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}><span style={{ position: "absolute", left: 0, top: "8px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />{item.content}</li>))}</ul></WaterfallSection>))}</>
                : null,
          }
          return config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)
        })()}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   34. POLAROID TEMPLATE
   Photo/polaroid aesthetic with frame-style header,
   mini-polaroid experience cards and label-maker tags
   ═══════════════════════════════════════════════ */
function PolaroidTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const pad = config.pagePadding ?? 32
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)

  function SectionHead({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "4px", backgroundColor: accent, flexShrink: 0 }}>{icon}</div>
        <span style={{ fontSize: fs.h2, fontWeight: 700, color: "#1f2937", letterSpacing: "0.5px" }}>{title}</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
      </div>
    )
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, overflow: "hidden", backgroundColor: "#fafaf8" }}>
      <div style={{ padding: `${pad + 4}px ${pad + 8}px`, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "20px 28px 28px", backgroundColor: "white", boxShadow: "0 3px 16px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06)", borderRadius: "3px", transform: "rotate(-1deg)", maxWidth: "92%", width: "100%", position: "relative" }}>
          <div style={{ position: "absolute", top: "-8px", left: "50%", transform: "translateX(-50%) rotate(2deg)", width: "60px", height: "16px", backgroundColor: `${accent}30`, borderRadius: "2px", opacity: 0.7 }} />
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {config.showProfileImage && p.profileImage && (
              <div style={{ width: "72px", height: "72px", borderRadius: "3px", border: "4px solid white", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", overflow: "hidden", flexShrink: 0 }}>
                <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <div>
              <h1 style={{ fontSize: fs.h1, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.2 }}>{p.fullName || "Your Name"}</h1>
              {p.title && <div style={{ fontSize: "13px", color: accent, fontWeight: 600, marginTop: "4px", fontStyle: "italic" }}>{p.title}</div>}
            </div>
          </div>
          {contacts.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #e5e7eb" }}>
              {contacts.map((c, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: fs.small, color: "#4b5563" }}>{contactIcon(c.type, accent, 11)}<LinkText href={contactHref(c.type, c.value)}>{c.value}</LinkText></div>))}
            </div>
          )}
          <div style={{ position: "absolute", bottom: "6px", right: "14px", fontSize: "9px", color: "#9ca3af", fontStyle: "italic" }}>resume</div>
        </div>
      </div>
      <div style={{ padding: `${pad - 16}px ${pad + 8}px` }}>
        {(() => {
          const sectionRenderers: Record<string, () => React.ReactNode> = {
            summary: () => p.summary ? (<div key="summary" style={{ marginBottom: "20px", padding: "14px 18px", backgroundColor: "white", borderRadius: "3px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transform: "rotate(0.3deg)", borderBottom: `3px solid ${accent}20` }}><p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#374151", margin: 0, fontStyle: "italic" }}>{p.summary}</p></div>) : null,
            experience: () =>
              enabledExp.length > 0 ? (
                <div key="experience" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconBriefcase color="white" size={12} />} title="Experience" />
                  {enabledExp.map((exp, idx) => (
                    <div key={exp.id} style={{ marginBottom: "14px", padding: "12px 16px 16px", backgroundColor: "white", borderRadius: "3px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transform: `rotate(${idx % 2 === 0 ? "0.4" : "-0.3"}deg)`, position: "relative" }}>
                      <div style={{ position: "absolute", top: "-6px", right: "16px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: accent, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "6px" }}>
                        <div><span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{exp.title}</span>{exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 600 }}> at {exp.company}</span>}</div>
                        <span style={{ fontSize: fs.small, color: "#6b7280", fontStyle: "italic" }}>{formatDisplayDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}</span>
                      </div>
                      {exp.location && <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}><IconMapPin color="#9ca3af" size={10} /><span style={{ fontSize: fs.small, color: "#9ca3af" }}>{exp.location}</span></div>}
                      {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.6 }}>{exp.description}</p>}
                      {exp.achievements.length > 0 && (<ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>{exp.achievements.map((a, i) => (<li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}><span style={{ position: "absolute", left: 0, top: "8px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />{a}</li>))}</ul>)}
                    </div>
                  ))}
                </div>
              ) : null,
            education: () =>
              enabledEdu.length > 0 ? (
                <div key="education" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconGradCap color="white" size={12} />} title="Education" />
                  {enabledEdu.map((edu, idx) => (
                    <div key={edu.id} style={{ marginBottom: "10px", padding: "10px 14px", backgroundColor: "white", borderRadius: "3px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", transform: `rotate(${idx % 2 === 0 ? "-0.3" : "0.3"}deg)` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                        <span style={{ fontSize: fs.small, color: "#6b7280", fontStyle: "italic" }}>{formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}</span>
                      </div>
                      <div style={{ fontSize: fs.body, color: accent, fontWeight: 600 }}>{edu.institution}</div>
                      {edu.achievements && edu.achievements.length > 0 && (<ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>{edu.achievements.map((a, i) => (<li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.5, paddingLeft: "14px", position: "relative" }}><span style={{ position: "absolute", left: 0, top: "8px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />{a}</li>))}</ul>)}
                    </div>
                  ))}
                </div>
              ) : null,
            skills: () =>
              config.skillCategories.length > 0 ? (
                <div key="skills" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconLayers color="white" size={12} />} title="Skills" />
                  {config.skillCategories.map((cat) => (<div key={cat.id} style={{ marginBottom: "8px" }}><div style={{ fontSize: fs.small, fontWeight: 700, color: "#111827", marginBottom: "5px" }}>{cat.name}</div><div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>{cat.skills.map((skill, i) => (<span key={i} style={{ fontSize: fs.small, padding: "3px 10px", backgroundColor: "white", border: `1.5px solid ${accent}40`, borderRadius: "2px", fontWeight: 600, color: "#374151", letterSpacing: "0.5px", textTransform: "uppercase", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", fontFamily: "'Courier New', monospace" }}>{skill}</span>))}</div></div>))}
                </div>
              ) : null,
            projects: () =>
              enabledProjects.length > 0 ? (
                <div key="projects" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconFolder color="white" size={12} />} title="Projects" />
                  {enabledProjects.map((proj, idx) => (
                    <div key={proj.id} style={{ marginBottom: "12px", padding: "10px 14px", backgroundColor: "white", borderRadius: "3px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)", transform: `rotate(${idx % 2 === 0 ? "0.3" : "-0.2"}deg)`, position: "relative" }}>
                      <div style={{ position: "absolute", top: "-6px", left: "14px", width: "40px", height: "12px", backgroundColor: `${accent}25`, borderRadius: "2px" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span style={{ fontSize: fs.h3, fontWeight: 700, color: "#111827" }}>{proj.title}</span>{proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}</div>
                      {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "3px", lineHeight: 1.5 }}>{proj.description}</p>}
                      {proj.techStack.length > 0 && (<div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "5px" }}>{proj.techStack.map((t, i) => (<span key={i} style={{ fontSize: "9px", padding: "2px 8px", backgroundColor: `${accent}10`, color: accent, fontWeight: 600, borderRadius: "2px" }}>{t}</span>))}</div>)}
                    </div>
                  ))}
                </div>
              ) : null,
            certifications: () =>
              enabledCerts.length > 0 ? (
                <div key="certifications" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconAward color="white" size={12} />} title="Certifications" />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>{enabledCerts.map((cert, idx) => (<div key={cert.id} style={{ padding: "8px 14px", backgroundColor: "white", borderRadius: "3px", boxShadow: "0 1px 5px rgba(0,0,0,0.06)", transform: `rotate(${idx % 2 === 0 ? "0.5" : "-0.4"}deg)`, borderBottom: `2px solid ${accent}30` }}><div style={{ display: "flex", alignItems: "center", gap: "5px" }}><IconShield color={accent} size={11} /><span style={{ fontSize: fs.small, fontWeight: 700, color: "#111827" }}>{cert.name}</span></div><div style={{ fontSize: "9.5px", color: "#6b7280", marginTop: "2px", marginLeft: "16px" }}>{cert.issuer}{cert.date && ` · ${formatDisplayDate(cert.date)}`}</div></div>))}</div>
                </div>
              ) : null,
            custom: () =>
              config.customSections.length > 0
                ? <>{config.customSections.map((section) => (<div key={section.id} style={{ marginBottom: "22px" }}><SectionHead icon={<IconStar color="white" size={12} />} title={section.title} /><ul style={{ listStyle: "none", padding: 0, margin: 0 }}>{section.items.map((item) => (<li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "14px", position: "relative" }}><span style={{ position: "absolute", left: 0, top: "8px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accent }} />{item.content}</li>))}</ul></div>))}</>
                : null,
          }
          return config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)
        })()}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   35. ARCHITECT TEMPLATE
   Blueprint/architecture inspired with light blue bg,
   ruler marks, grid overlay, technical drawing aesthetic
   ═══════════════════════════════════════════════ */
function ArchitectTemplate({ config }: { config: ResumeConfig }) {
  const fs = getFontSize(config.fontSize)
  const accent = config.accentColor
  const p = config.profile
  const pad = config.pagePadding ?? 32
  const enabledExp = config.experiences.filter((e) => e.enabled)
  const enabledEdu = config.education.filter((e) => e.enabled)
  const enabledCerts = config.certifications.filter((c) => c.enabled)
  const enabledProjects = config.projects.filter((pr) => pr.enabled)
  const contacts = getContactItems(p)
  const blueprintBg = "#f0f7ff"
  const navy = "#1e3a5f"

  function SectionHead({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", border: `2px solid ${navy}`, borderRadius: "2px", flexShrink: 0 }}>{icon}</div>
        <span style={{ fontSize: fs.h2, fontWeight: 700, color: navy, textTransform: "uppercase", letterSpacing: "2px", fontFamily: "'Courier New', monospace" }}>{title}</span>
        <div style={{ flex: 1, display: "flex", alignItems: "center", height: "12px", position: "relative" }}>
          <div style={{ width: "100%", height: "1px", backgroundColor: navy }} />
          {[0, 20, 40, 60, 80, 100].map((pct) => (<div key={pct} style={{ position: "absolute", left: `${pct}%`, top: "0", width: "1px", height: pct % 40 === 0 ? "10px" : "6px", backgroundColor: `${navy}60` }} />))}
        </div>
      </div>
    )
  }

  return (
    <div className="resume-page" style={{ ...PAGE_BASE, overflow: "hidden", backgroundColor: blueprintBg, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: `linear-gradient(${navy}08 1px, transparent 1px), linear-gradient(90deg, ${navy}08 1px, transparent 1px)`, backgroundSize: "24px 24px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 1, padding: `${pad + 8}px ${pad + 8}px ${pad - 4}px`, borderBottom: `2px solid ${navy}` }}>
        <div style={{ position: "absolute", top: "8px", left: "8px", width: "16px", height: "16px", borderTop: `2px solid ${navy}`, borderLeft: `2px solid ${navy}` }} />
        <div style={{ position: "absolute", top: "8px", right: "8px", width: "16px", height: "16px", borderTop: `2px solid ${navy}`, borderRight: `2px solid ${navy}` }} />
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {config.showProfileImage && p.profileImage && (
            <div style={{ width: "64px", height: "64px", borderRadius: "2px", border: `2px solid ${navy}`, overflow: "hidden", flexShrink: 0 }}>
              <img src={p.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: fs.h1, fontWeight: 800, color: navy, margin: 0, lineHeight: 1.2, fontFamily: "'Courier New', monospace", letterSpacing: "1px", textTransform: "uppercase" }}>{p.fullName || "Your Name"}</h1>
            {p.title && <div style={{ fontSize: "12px", color: accent, fontWeight: 600, marginTop: "4px", fontFamily: "'Courier New', monospace", letterSpacing: "2px" }}>// {p.title}</div>}
          </div>
        </div>
        {contacts.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: "12px", paddingTop: "8px", borderTop: `1px solid ${navy}30` }}>
            {contacts.map((c, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: fs.small, color: navy, fontFamily: "'Courier New', monospace" }}>{contactIcon(c.type, navy, 11)}<LinkText href={contactHref(c.type, c.value)}>{c.value}</LinkText></div>))}
          </div>
        )}
      </div>
      <div style={{ position: "relative", zIndex: 1, padding: `${pad - 8}px ${pad + 8}px` }}>
        {(() => {
          const sectionRenderers: Record<string, () => React.ReactNode> = {
            summary: () => p.summary ? (<div key="summary" style={{ marginBottom: "20px", padding: "12px 16px", backgroundColor: "rgba(255,255,255,0.7)", border: `1px solid ${navy}20`, borderRadius: "2px", borderLeft: `3px solid ${navy}` }}><p style={{ fontSize: fs.body, lineHeight: 1.7, color: "#374151", margin: 0 }}>{p.summary}</p></div>) : null,
            experience: () =>
              enabledExp.length > 0 ? (
                <div key="experience" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconBriefcase color={navy} size={12} />} title="Experience" />
                  {enabledExp.map((exp) => (
                    <div key={exp.id} style={{ marginBottom: "14px", paddingLeft: "16px", borderLeft: `1px solid ${navy}30`, position: "relative" }}>
                      <div style={{ position: "absolute", left: "-4px", top: "5px", width: "8px", height: "1px", backgroundColor: navy }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "6px" }}>
                        <div><span style={{ fontSize: fs.h3, fontWeight: 700, color: navy }}>{exp.title}</span>{exp.company && <span style={{ fontSize: fs.h3, color: accent, fontWeight: 600 }}> — {exp.company}</span>}</div>
                        <span style={{ fontSize: fs.small, color: navy, fontStyle: "italic", fontFamily: "'Courier New', monospace", padding: "1px 8px", border: `1px solid ${navy}30`, borderRadius: "2px", backgroundColor: "rgba(255,255,255,0.8)" }}>{formatDisplayDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDisplayDate(exp.endDate)}</span>
                      </div>
                      {exp.location && <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}><IconMapPin color={`${navy}80`} size={10} /><span style={{ fontSize: fs.small, color: `${navy}80` }}>{exp.location}</span></div>}
                      {exp.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "4px", lineHeight: 1.6 }}>{exp.description}</p>}
                      {exp.achievements.length > 0 && (<ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0 0" }}>{exp.achievements.map((a, i) => (<li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "16px", position: "relative" }}><span style={{ position: "absolute", left: "2px", top: "8px", width: "6px", height: "1px", backgroundColor: navy }} /><span style={{ position: "absolute", left: "2px", top: "5px", width: "1px", height: "6px", backgroundColor: navy }} />{a}</li>))}</ul>)}
                    </div>
                  ))}
                </div>
              ) : null,
            education: () =>
              enabledEdu.length > 0 ? (
                <div key="education" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconGradCap color={navy} size={12} />} title="Education" />
                  {enabledEdu.map((edu) => (
                    <div key={edu.id} style={{ marginBottom: "10px", paddingLeft: "16px", borderLeft: `1px solid ${navy}30`, position: "relative" }}>
                      <div style={{ position: "absolute", left: "-4px", top: "5px", width: "8px", height: "1px", backgroundColor: navy }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: fs.h3, fontWeight: 700, color: navy }}>{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                        <span style={{ fontSize: fs.small, color: navy, fontStyle: "italic", fontFamily: "'Courier New', monospace" }}>{formatDisplayDate(edu.startDate)}{edu.endDate && ` – ${formatDisplayDate(edu.endDate)}`}</span>
                      </div>
                      <div style={{ fontSize: fs.body, color: accent, fontWeight: 600 }}>{edu.institution}</div>
                      {edu.achievements && edu.achievements.length > 0 && (<ul style={{ listStyle: "none", padding: 0, margin: "4px 0 0 0" }}>{edu.achievements.map((a, i) => (<li key={i} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.5, paddingLeft: "14px", position: "relative" }}><span style={{ position: "absolute", left: "2px", top: "8px", width: "5px", height: "1px", backgroundColor: navy }} />{a}</li>))}</ul>)}
                    </div>
                  ))}
                </div>
              ) : null,
            skills: () =>
              config.skillCategories.length > 0 ? (
                <div key="skills" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconLayers color={navy} size={12} />} title="Skills" />
                  {config.skillCategories.map((cat) => (<div key={cat.id} style={{ marginBottom: "8px" }}><div style={{ fontSize: fs.small, fontWeight: 700, color: navy, marginBottom: "5px", fontFamily: "'Courier New', monospace", textTransform: "uppercase", letterSpacing: "1px" }}>{cat.name}</div><div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>{cat.skills.map((skill, i) => (<span key={i} style={{ fontSize: fs.small, padding: "3px 10px", backgroundColor: "rgba(255,255,255,0.8)", border: `1px solid ${navy}30`, borderRadius: "1px", fontWeight: 500, color: navy, fontFamily: "'Courier New', monospace" }}>{skill}</span>))}</div></div>))}
                </div>
              ) : null,
            projects: () =>
              enabledProjects.length > 0 ? (
                <div key="projects" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconFolder color={navy} size={12} />} title="Projects" />
                  {enabledProjects.map((proj) => (
                    <div key={proj.id} style={{ marginBottom: "12px", paddingLeft: "16px", borderLeft: `1px solid ${navy}30`, position: "relative" }}>
                      <div style={{ position: "absolute", left: "-4px", top: "5px", width: "8px", height: "1px", backgroundColor: navy }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span style={{ fontSize: fs.h3, fontWeight: 700, color: navy }}>{proj.title}</span>{proj.url && <UrlLink url={proj.url} color={accent} fontSize={fs.small} />}</div>
                      {proj.description && <p style={{ fontSize: fs.body, color: "#4b5563", marginTop: "3px", lineHeight: 1.5 }}>{proj.description}</p>}
                      {proj.techStack.length > 0 && (<div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "5px" }}>{proj.techStack.map((t, i) => (<span key={i} style={{ fontSize: "9px", padding: "2px 8px", backgroundColor: navy, color: blueprintBg, fontWeight: 600, borderRadius: "1px", fontFamily: "'Courier New', monospace" }}>{t}</span>))}</div>)}
                    </div>
                  ))}
                </div>
              ) : null,
            certifications: () =>
              enabledCerts.length > 0 ? (
                <div key="certifications" style={{ marginBottom: "22px" }}>
                  <SectionHead icon={<IconAward color={navy} size={12} />} title="Certifications" />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>{enabledCerts.map((cert) => (<div key={cert.id} style={{ padding: "6px 12px", backgroundColor: "rgba(255,255,255,0.8)", border: `1px solid ${navy}25`, borderRadius: "2px" }}><div style={{ display: "flex", alignItems: "center", gap: "5px" }}><IconShield color={navy} size={11} /><span style={{ fontSize: fs.small, fontWeight: 700, color: navy }}>{cert.name}</span></div><div style={{ fontSize: "9.5px", color: `${navy}80`, marginTop: "2px", marginLeft: "16px", fontFamily: "'Courier New', monospace", fontStyle: "italic" }}>{cert.issuer}{cert.date && ` · ${formatDisplayDate(cert.date)}`}</div></div>))}</div>
                </div>
              ) : null,
            custom: () =>
              config.customSections.length > 0
                ? <>{config.customSections.map((section) => (<div key={section.id} style={{ marginBottom: "22px" }}><SectionHead icon={<IconStar color={navy} size={12} />} title={section.title} /><ul style={{ listStyle: "none", padding: 0, margin: 0 }}>{section.items.map((item) => (<li key={item.id} style={{ fontSize: fs.body, color: "#4b5563", lineHeight: 1.6, paddingLeft: "16px", position: "relative" }}><span style={{ position: "absolute", left: "2px", top: "8px", width: "6px", height: "1px", backgroundColor: navy }} />{item.content}</li>))}</ul></div>))}</>
                : null,
          }
          return config.sectionOrder.map((section) => sectionRenderers[section] ? sectionRenderers[section]() : null)
        })()}
      </div>
      <div style={{ position: "absolute", bottom: "8px", left: "8px", width: "16px", height: "16px", borderBottom: `2px solid ${navy}`, borderLeft: `2px solid ${navy}`, zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: "8px", right: "8px", width: "16px", height: "16px", borderBottom: `2px solid ${navy}`, borderRight: `2px solid ${navy}`, zIndex: 1 }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════
   MAIN PREVIEW COMPONENT
   ═══════════════════════════════════════════════ */
export function ResumePreview({ config }: { config: ResumeConfig }) {
  switch (config.template) {
    case "modern":
      return <ModernTemplate config={config} />
    case "minimal":
      return <MinimalTemplate config={config} />
    case "executive":
      return <ExecutiveTemplate config={config} />
    case "healthcare":
      return <HealthcareTemplate config={config} />
    case "elegant":
      return <ElegantTemplate config={config} />
    case "compact":
      return <CompactTemplate config={config} />
    case "bold":
      return <BoldTemplate config={config} />
    case "creative":
      return <CreativeTemplate config={config} />
    case "professional":
      return <ProfessionalTemplate config={config} />
    case "technical":
      return <TechnicalTemplate config={config} />
    case "metro":
      return <MetroTemplate config={config} />
    case "newspaper":
      return <NewspaperTemplate config={config} />
    case "infographic":
      return <InfographicTemplate config={config} />
    case "nordic":
      return <NordicTemplate config={config} />
    case "cascade":
      return <CascadeTemplate config={config} />
    case "horizon":
      return <HorizonTemplate config={config} />
    case "mosaic":
      return <MosaicTemplate config={config} />
    case "apex":
      return <ApexTemplate config={config} />
    case "slate":
      return <SlateTemplate config={config} />
    case "glass":
      return <GlassTemplate config={config} />
    case "gradient":
      return <GradientTemplate config={config} />
    case "mono":
      return <MonoTemplate config={config} />
    case "timelinepro":
      return <TimelineProTemplate config={config} />
    case "carddeck":
      return <CardDeckTemplate config={config} />
    case "dualtone":
      return <DualToneTemplate config={config} />
    case "magazine":
      return <MagazineTemplate config={config} />
    case "neon":
      return <NeonTemplate config={config} />
    case "paper":
      return <PaperTemplate config={config} />
    case "stacked":
      return <StackedTemplate config={config} />
    case "retro":
      return <RetroTemplate config={config} />
    case "origami":
      return <OrigamiTemplate config={config} />
    case "terminal":
      return <TerminalTemplate config={config} />
    case "ribbon":
      return <RibbonTemplate config={config} />
    case "zen":
      return <ZenTemplate config={config} />
    case "diagonal":
      return <DiagonalTemplate config={config} />
    case "circuit":
      return <CircuitTemplate config={config} />
    case "waterfall":
      return <WaterfallTemplate config={config} />
    case "polaroid":
      return <PolaroidTemplate config={config} />
    case "architect":
      return <ArchitectTemplate config={config} />
    case "classic":
    default:
      return <ClassicTemplate config={config} />
  }
}
