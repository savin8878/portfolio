"use client"

import React from "react"
import type { ResumeConfig } from "@/components/admin/resume-builder"
import type { TemplateTheme } from "./themes"

interface TemplateRendererProps {
  config: ResumeConfig
  template: TemplateTheme
}

/**
 * Main template renderer that routes to specific template components
 */
export function TemplateRenderer({ config, template }: TemplateRendererProps) {
  const { profile, accentColor } = config
  const accent = accentColor || "#2563eb"

  // Route to specific template based on ID
  switch (template.id) {
    case "aurora":
      return <AuroraTemplate config={config} accent={accent} />
    case "vibrant":
      return <VibrantTemplate config={config} accent={accent} />
    case "sunset":
      return <SunsetTemplate config={config} accent={accent} />
    case "neon":
      return <NeonTemplate config={config} accent={accent} />
    case "artist":
      return <ArtistTemplate config={config} accent={accent} />
    case "minimal-modern":
      return <MinimalModernTemplate config={config} accent={accent} />
    case "code-stack":
      return <CodeStackTemplate config={config} accent={accent} />
    case "hacker":
      return <HackerTemplate config={config} accent={accent} />
    case "cloud-native":
      return <CloudNativeTemplate config={config} accent={accent} />
    case "devops":
      return <DevOpsTemplate config={config} accent={accent} />
    case "executive-pro":
      return <ExecutiveProTemplate config={config} accent={accent} />
    case "corporate-blue":
      return <CorporateBlueTemplate config={config} accent={accent} />
    case "business-classic":
      return <BusinessClassicTemplate config={config} accent={accent} />
    case "investor-ready":
      return <InvestorReadyTemplate config={config} accent={accent} />
    case "ultra-modern":
      return <UltraModernTemplate config={config} accent={accent} />
    case "geo-modern":
      return <GeoModernTemplate config={config} accent={accent} />
    case "gradient-pro":
      return <GradientProTemplate config={config} accent={accent} />
    case "sleek":
      return <SleekTemplate config={config} accent={accent} />
    case "startup-spark":
      return <StartupSparkTemplate config={config} accent={accent} />
    case "innovation":
      return <InnovationTemplate config={config} accent={accent} />
    case "disruptive":
      return <DisruptiveTemplate config={config} accent={accent} />
    case "zen":
      return <ZenTemplate config={config} accent={accent} />
    case "whitespace":
      return <WhitespaceTemplate config={config} accent={accent} />
    case "pure-minimal":
      return <PureMinimalTemplate config={config} accent={accent} />
    case "academic":
      return <AcademicTemplate config={config} accent={accent} />
    case "research":
      return <ResearchTemplate config={config} accent={accent} />
    case "medical-pro":
      return <MedicalProTemplate config={config} accent={accent} />
    case "legal":
      return <LegalTemplate config={config} accent={accent} />
    case "finance":
      return <FinanceTemplate config={config} accent={accent} />
    case "creative-finance":
      return <CreativeFinanceTemplate config={config} accent={accent} />
    default:
      return <ClassicTemplate config={config} accent={accent} />
  }
}

// ════════════════════════════════════════════════════════════════
// TEMPLATE COMPONENTS
// ════════════════════════════════════════════════════════════════

// Shared header components
function Header({ config, accent, variant = "default" }: { config: ResumeConfig; accent: string; variant?: string }) {
  const { profile } = config
  const contacts = [profile.email, profile.phone, profile.location, profile.website, profile.linkedin, profile.github]
    .filter(Boolean)
    .join(" • ")

  if (variant === "banner") {
    return (
      <div style={{ backgroundColor: accent, color: "white", padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", margin: "0 0 0.5rem 0" }}>{profile.fullName}</h1>
        {profile.title && <p style={{ fontSize: "1.2rem", margin: "0 0 1rem 0", opacity: 0.95 }}>{profile.title}</p>}
        {contacts && <p style={{ fontSize: "0.9rem", margin: 0, opacity: 0.85 }}>{contacts}</p>}
      </div>
    )
  }

  if (variant === "sidebar") {
    return (
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: "0 0 0.5rem 0", color: accent }}>
          {profile.fullName}
        </h1>
        {profile.title && <p style={{ fontSize: "1.1rem", margin: "0 0 1rem 0", fontWeight: "500" }}>{profile.title}</p>}
        {contacts && <p style={{ fontSize: "0.85rem", margin: "0 0 1rem 0", lineHeight: "1.6" }}>{contacts}</p>}
      </div>
    )
  }

  return (
    <div style={{ textAlign: "center", paddingBottom: "1.5rem", borderBottom: `2px solid ${accent}` }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: "0 0 0.3rem 0" }}>{profile.fullName}</h1>
      {profile.title && <p style={{ fontSize: "1rem", margin: "0 0 0.8rem 0", color: accent, fontWeight: "500" }}>{profile.title}</p>}
      {contacts && <p style={{ fontSize: "0.85rem", margin: 0, color: "#666" }}>{contacts}</p>}
    </div>
  )
}

// Classic Template
function ClassicTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  const { profile, experiences, education } = config
  return (
    <div className="resume-page" style={{ padding: "2rem", fontFamily: "Inter, sans-serif", lineHeight: "1.6" }}>
      <Header config={config} accent={accent} />
      {profile.summary && (
        <section style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ color: accent, fontWeight: "bold", fontSize: "1.1rem", borderBottom: `2px solid ${accent}`, paddingBottom: "0.5rem" }}>
            Professional Summary
          </h2>
          <p style={{ marginTop: "0.8rem", color: "#333" }}>{profile.summary}</p>
        </section>
      )}
      {experiences.filter((e) => e.enabled).length > 0 && (
        <section style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ color: accent, fontWeight: "bold", fontSize: "1.1rem", borderBottom: `2px solid ${accent}`, paddingBottom: "0.5rem" }}>
            Work Experience
          </h2>
          {experiences
            .filter((e) => e.enabled)
            .map((exp) => (
              <div key={exp.id} style={{ marginTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h3 style={{ fontWeight: "bold", margin: 0, fontSize: "1rem" }}>{exp.title}</h3>
                  <span style={{ fontSize: "0.9rem", color: "#666" }}>{exp.startDate}</span>
                </div>
                <p style={{ margin: "0.2rem 0", color: accent, fontWeight: "500", fontSize: "0.95rem" }}>{exp.company}</p>
              </div>
            ))}
        </section>
      )}
    </div>
  )
}

// Aurora Template
function AuroraTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "0", fontFamily: "Inter, sans-serif", lineHeight: "1.6" }}>
      <div style={{ display: "flex", minHeight: "100%" }}>
        <div style={{ flex: "0 0 30%", background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, color: "white", padding: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", margin: "0 0 0.5rem 0" }}>{config.profile.fullName}</h1>
          <p style={{ fontSize: "0.95rem", margin: "0 0 1.5rem 0", opacity: 0.9 }}>{config.profile.title}</p>
          <div style={{ fontSize: "0.9rem", lineHeight: "1.8", opacity: 0.95 }}>
            {config.profile.email && <div>📧 {config.profile.email}</div>}
            {config.profile.phone && <div>📱 {config.profile.phone}</div>}
            {config.profile.location && <div>📍 {config.profile.location}</div>}
          </div>
        </div>
        <div style={{ flex: "1", padding: "2rem", paddingLeft: "2.5rem" }}>
          {config.profile.summary && (
            <section style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ color: accent, fontWeight: "bold", fontSize: "1.05rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.8rem" }}>
                About
              </h2>
              <p style={{ color: "#555", fontSize: "0.95rem" }}>{config.profile.summary}</p>
            </section>
          )}
          {config.experiences.filter((e) => e.enabled).length > 0 && (
            <section style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ color: accent, fontWeight: "bold", fontSize: "1.05rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.8rem" }}>
                Experience
              </h2>
              {config.experiences
                .filter((e) => e.enabled)
                .map((exp) => (
                  <div key={exp.id} style={{ marginBottom: "0.8rem" }}>
                    <h3 style={{ fontWeight: "bold", margin: "0 0 0.2rem 0", fontSize: "0.95rem" }}>{exp.title}</h3>
                    <p style={{ margin: "0", color: accent, fontSize: "0.9rem", fontWeight: "500" }}>{exp.company}</p>
                    <p style={{ margin: "0.2rem 0 0 0", color: "#999", fontSize: "0.85rem" }}>{exp.startDate}</p>
                  </div>
                ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

// Vibrant Template
function VibrantTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "2rem", fontFamily: "Inter, sans-serif", lineHeight: "1.6", backgroundColor: "#fff5f7" }}>
      <div style={{ borderLeft: `6px solid ${accent}`, paddingLeft: "1.5rem", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "bold", margin: "0", color: accent }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "1.1rem", margin: "0.5rem 0", color: "#666" }}>{config.profile.title}</p>
      </div>
      {config.profile.summary && (
        <section style={{ marginBottom: "2rem", backgroundColor: "white", padding: "1.5rem", borderRadius: "8px", borderLeft: `4px solid ${accent}` }}>
          <p style={{ margin: 0, color: "#555" }}>{config.profile.summary}</p>
        </section>
      )}
      {config.experiences.filter((e) => e.enabled).length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: accent, fontWeight: "bold", fontSize: "1.2rem", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Experience
          </h2>
          {config.experiences
            .filter((e) => e.enabled)
            .map((exp) => (
              <div key={exp.id} style={{ marginBottom: "1.2rem", backgroundColor: "white", padding: "1.5rem", borderRadius: "6px", borderTop: `3px solid ${accent}` }}>
                <h3 style={{ fontWeight: "bold", margin: "0 0 0.3rem 0", fontSize: "1rem" }}>{exp.title}</h3>
                <p style={{ margin: "0.2rem 0", color: accent, fontWeight: "500", fontSize: "0.95rem" }}>{exp.company}</p>
              </div>
            ))}
        </section>
      )}
    </div>
  )
}

// Sunset Template
function SunsetTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "0", fontFamily: "Georgia, serif", lineHeight: "1.7", backgroundImage: `linear-gradient(to bottom, #fff8f0, white)` }}>
      <div style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)`, color: "white", padding: "2.5rem 2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "300", margin: "0 0 0.5rem 0", letterSpacing: "2px" }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "1.1rem", margin: "0 0 1rem 0", fontWeight: "300", opacity: 0.95 }}>{config.profile.title}</p>
        <div style={{ fontSize: "0.9rem", display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          {config.profile.email && <span>{config.profile.email}</span>}
          {config.profile.phone && <span>{config.profile.phone}</span>}
        </div>
      </div>
      <div style={{ padding: "2.5rem 2rem" }}>
        {config.profile.summary && (
          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ color: accent, fontWeight: "300", fontSize: "1.3rem", borderBottom: `2px solid ${accent}`, paddingBottom: "0.8rem", letterSpacing: "1px", marginBottom: "1rem" }}>
              ABOUT
            </h2>
            <p style={{ color: "#555", lineHeight: "1.8", fontStyle: "italic" }}>{config.profile.summary}</p>
          </section>
        )}
      </div>
    </div>
  )
}

// Neon Template
function NeonTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "2rem", fontFamily: "Inter, sans-serif", lineHeight: "1.6", backgroundColor: "#0a0e27", color: "#e0e0e0" }}>
      <div style={{ borderBottom: `2px solid ${accent}`, paddingBottom: "1.5rem", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "bold", margin: "0", color: accent, textShadow: `0 0 10px ${accent}40` }}>
          {config.profile.fullName}
        </h1>
        <p style={{ fontSize: "1rem", margin: "0.5rem 0", color: accent, opacity: 0.8 }}>{config.profile.title}</p>
      </div>
      {config.profile.summary && (
        <section style={{ marginBottom: "2rem", borderLeft: `3px solid ${accent}`, paddingLeft: "1.5rem" }}>
          <p style={{ margin: 0, color: "#c0c0c0", lineHeight: "1.8" }}>{config.profile.summary}</p>
        </section>
      )}
      {config.experiences.filter((e) => e.enabled).length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: accent, fontWeight: "bold", fontSize: "1.15rem", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1rem" }}>
            Experience
          </h2>
          {config.experiences
            .filter((e) => e.enabled)
            .map((exp) => (
              <div key={exp.id} style={{ marginBottom: "1.2rem", backgroundColor: "#111a2e", padding: "1rem", borderLeft: `3px solid ${accent}` }}>
                <h3 style={{ fontWeight: "bold", margin: "0 0 0.2rem 0", color: accent, fontSize: "0.95rem" }}>{exp.title}</h3>
                <p style={{ margin: "0.2rem 0", color: "#a0a0a0", fontSize: "0.9rem" }}>{exp.company}</p>
              </div>
            ))}
        </section>
      )}
    </div>
  )
}

// Artist Template
function ArtistTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ display: "flex", minHeight: "100%", fontFamily: "Inter, sans-serif", lineHeight: "1.6" }}>
      <div style={{ flex: "1", padding: "2rem", backgroundColor: "#f8f4ff" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", margin: "0 0 0.3rem 0", color: accent }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "0.95rem", margin: "0 0 1.5rem 0", color: "#666" }}>{config.profile.title}</p>
        {config.profile.summary && <p style={{ color: "#555", lineHeight: "1.8", marginBottom: "1.5rem" }}>{config.profile.summary}</p>}
      </div>
      <div style={{ flex: "1", padding: "2rem", borderLeft: `6px solid ${accent}`, backgroundColor: "white" }}>
        {config.experiences.filter((e) => e.enabled).length > 0 && (
          <section>
            <h2 style={{ color: accent, fontWeight: "bold", fontSize: "1.05rem", marginBottom: "1rem" }}>Experience</h2>
            {config.experiences
              .filter((e) => e.enabled)
              .map((exp) => (
                <div key={exp.id} style={{ marginBottom: "1rem" }}>
                  <h3 style={{ fontWeight: "bold", margin: "0 0 0.2rem 0", fontSize: "0.95rem" }}>{exp.title}</h3>
                  <p style={{ margin: "0", color: accent, fontWeight: "500", fontSize: "0.85rem" }}>{exp.company}</p>
                </div>
              ))}
          </section>
        )}
      </div>
    </div>
  )
}

// Minimal Modern Template
function MinimalModernTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "1.5rem 2rem", fontFamily: "Inter, sans-serif", lineHeight: "1.6", maxWidth: "8.5in" }}>
      <div style={{ textAlign: "center", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: "0", letterSpacing: "-0.02em" }}>{config.profile.fullName}</h1>
        {config.profile.title && <p style={{ fontSize: "0.95rem", margin: "0.5rem 0 0 0", color: accent, fontWeight: "600" }}>{config.profile.title}</p>}
      </div>
      {config.profile.summary && (
        <section style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: `1px solid #e5e7eb` }}>
          <p style={{ margin: 0, color: "#555", fontSize: "0.95rem", lineHeight: "1.8" }}>{config.profile.summary}</p>
        </section>
      )}
    </div>
  )
}

// Code Stack Template (Tech)
function CodeStackTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ display: "flex", minHeight: "100%", fontFamily: "'Monaco', monospace", lineHeight: "1.6", backgroundColor: "#1e1e1e", color: "#e0e0e0" }}>
      <div style={{ flex: "0 0 28%", backgroundColor: accent, color: "white", padding: "2rem", paddingRight: "1.5rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", margin: "0 0 1rem 0" }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "0.9rem", margin: "0 0 1.5rem 0", opacity: 0.9 }}>{config.profile.title}</p>
        <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
          {config.profile.email && <div>$ email: {config.profile.email}</div>}
          {config.profile.github && <div>$ github: {config.profile.github}</div>}
          {config.profile.linkedin && <div>$ linkedin: {config.profile.linkedin}</div>}
        </div>
      </div>
      <div style={{ flex: "1", padding: "2rem" }}>
        {config.profile.summary && (
          <section style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ color: accent, fontWeight: "bold", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.8rem" }}>
              About
            </h2>
            <p style={{ margin: 0, color: "#b0b0b0", fontSize: "0.9rem", lineHeight: "1.7" }}>{config.profile.summary}</p>
          </section>
        )}
      </div>
    </div>
  )
}

// Hacker Template
function HackerTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "2rem", fontFamily: "'Courier New', monospace", lineHeight: "1.6", backgroundColor: "#0a0a0a", color: accent }}>
      <div style={{ borderBottom: `1px solid ${accent}`, paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <p style={{ margin: "0", fontSize: "0.85rem", opacity: 0.6 }}>{"$> whoami"}</p>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0", color: accent }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "0.9rem", margin: "0", opacity: 0.8 }}>{"# " + config.profile.title}</p>
      </div>
      {config.profile.summary && (
        <section style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.85rem", margin: "0", marginBottom: "0.5rem", opacity: 0.6 }}>{"$> cat about.txt"}</p>
          <p style={{ margin: "0", fontSize: "0.85rem", lineHeight: "1.8" }}>{config.profile.summary}</p>
        </section>
      )}
    </div>
  )
}

// Cloud Native Template
function CloudNativeTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ display: "flex", fontFamily: "Inter, sans-serif", lineHeight: "1.6", minHeight: "100%", gap: "2rem", padding: "2rem" }}>
      <div style={{ flex: "1" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", margin: "0 0 0.5rem 0", color: accent }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "0.95rem", margin: "0", color: "#666", marginBottom: "1.5rem" }}>{config.profile.title}</p>
        {config.profile.summary && <p style={{ color: "#555", lineHeight: "1.8" }}>{config.profile.summary}</p>}
      </div>
      <div style={{ flex: "1", borderLeft: `2px solid ${accent}`, paddingLeft: "1.5rem" }}>
        {config.experiences.filter((e) => e.enabled).length > 0 && (
          <section>
            <h2 style={{ color: accent, fontWeight: "bold", fontSize: "1rem", marginBottom: "1rem", textTransform: "uppercase" }}>Experience</h2>
            {config.experiences
              .filter((e) => e.enabled)
              .slice(0, 3)
              .map((exp) => (
                <div key={exp.id} style={{ marginBottom: "0.8rem" }}>
                  <h3 style={{ fontWeight: "bold", margin: "0 0 0.2rem 0", fontSize: "0.9rem" }}>{exp.title}</h3>
                  <p style={{ margin: "0", color: accent, fontSize: "0.85rem", fontWeight: "500" }}>{exp.company}</p>
                </div>
              ))}
          </section>
        )}
      </div>
    </div>
  )
}

// DevOps Template
function DevOpsTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ display: "flex", minHeight: "100%", fontFamily: "Inter, sans-serif", lineHeight: "1.6" }}>
      <div style={{ flex: "0 0 35%", backgroundColor: accent, color: "white", padding: "2.5rem 2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", margin: "0 0 0.3rem 0", letterSpacing: "1px" }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "0.95rem", margin: "0 0 1.5rem 0", opacity: 0.9, fontWeight: "500" }}>{config.profile.title}</p>
        {config.profile.summary && <p style={{ fontSize: "0.9rem", lineHeight: "1.7", opacity: 0.95 }}>{config.profile.summary}</p>}
      </div>
      <div style={{ flex: "1", padding: "2.5rem 2rem" }}>
        {config.experiences.filter((e) => e.enabled).length > 0 && (
          <section>
            <h2 style={{ color: accent, fontWeight: "bold", fontSize: "1.05rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
              Experience
            </h2>
            {config.experiences
              .filter((e) => e.enabled)
              .map((exp) => (
                <div key={exp.id} style={{ marginBottom: "1.2rem", paddingBottom: "1rem", borderBottom: `1px solid #e5e7eb` }}>
                  <h3 style={{ fontWeight: "bold", margin: "0 0 0.2rem 0", fontSize: "0.95rem" }}>{exp.title}</h3>
                  <p style={{ margin: "0.2rem 0", color: accent, fontWeight: "500", fontSize: "0.9rem" }}>{exp.company}</p>
                </div>
              ))}
          </section>
        )}
      </div>
    </div>
  )
}

// Executive Pro Template
function ExecutiveProTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "2rem", fontFamily: "Georgia, serif", lineHeight: "1.8", maxWidth: "8.5in" }}>
      <div style={{ textAlign: "center", borderBottom: `3px solid ${accent}`, paddingBottom: "1.5rem", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "300", margin: "0", letterSpacing: "1px", color: accent }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "1rem", margin: "0.8rem 0 0 0", color: "#555", letterSpacing: "0.5px" }}>{config.profile.title}</p>
      </div>
      {config.profile.summary && (
        <section style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: `1px solid #e5e7eb` }}>
          <p style={{ margin: 0, color: "#555", fontSize: "0.95rem", lineHeight: "1.9", fontStyle: "italic" }}>{config.profile.summary}</p>
        </section>
      )}
    </div>
  )
}

// Corporate Blue Template
function CorporateBlueTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "0", fontFamily: "Inter, sans-serif", lineHeight: "1.6" }}>
      <div style={{ backgroundColor: accent, color: "white", padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "bold", margin: "0 0 0.5rem 0" }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "1rem", margin: "0", fontWeight: "500" }}>{config.profile.title}</p>
      </div>
      <div style={{ padding: "2rem" }}>
        {config.profile.summary && <p style={{ color: "#555", marginBottom: "1.5rem", lineHeight: "1.8" }}>{config.profile.summary}</p>}
        {config.experiences.filter((e) => e.enabled).length > 0 && (
          <section>
            <h2 style={{ color: accent, fontWeight: "bold", fontSize: "1.05rem", marginBottom: "1rem", textTransform: "uppercase", borderBottom: `2px solid ${accent}`, paddingBottom: "0.5rem" }}>
              Professional Experience
            </h2>
            {config.experiences
              .filter((e) => e.enabled)
              .map((exp) => (
                <div key={exp.id} style={{ marginBottom: "1rem" }}>
                  <h3 style={{ fontWeight: "bold", margin: "0 0 0.2rem 0", fontSize: "0.95rem" }}>{exp.title}</h3>
                  <p style={{ margin: "0", color: accent, fontSize: "0.9rem", fontWeight: "500" }}>{exp.company}</p>
                </div>
              ))}
          </section>
        )}
      </div>
    </div>
  )
}

// Business Classic Template
function BusinessClassicTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "2rem", fontFamily: "Calibri, sans-serif", lineHeight: "1.6" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: "0", color: "#1f2937" }}>{config.profile.fullName}</h1>
        {config.profile.title && <p style={{ fontSize: "1rem", margin: "0.3rem 0 0 0", color: accent, fontWeight: "600" }}>{config.profile.title}</p>}
      </div>
      {config.profile.summary && (
        <section style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: `1px solid #d1d5db` }}>
          <p style={{ margin: 0, color: "#374151", fontSize: "0.95rem" }}>{config.profile.summary}</p>
        </section>
      )}
    </div>
  )
}

// Investor Ready Template
function InvestorReadyTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ display: "flex", fontFamily: "Inter, sans-serif", lineHeight: "1.7", minHeight: "100%" }}>
      <div style={{ flex: "1", padding: "2.5rem 2rem", background: "linear-gradient(135deg, #f5f3ff 0%, white 100%)" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", margin: "0 0 0.3rem 0", color: accent }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "0.95rem", margin: "0 0 1.5rem 0", color: "#666" }}>{config.profile.title}</p>
        {config.profile.summary && <p style={{ color: "#555", lineHeight: "1.8" }}>{config.profile.summary}</p>}
      </div>
      <div style={{ flex: "1", padding: "2.5rem 2rem", backgroundColor: white, borderLeft: `6px solid ${accent}` }}>
        {config.experiences.filter((e) => e.enabled).length > 0 && (
          <section>
            <h2 style={{ color: accent, fontWeight: "bold", marginBottom: "1rem" }}>Leadership Experience</h2>
            {config.experiences
              .filter((e) => e.enabled)
              .map((exp) => (
                <div key={exp.id} style={{ marginBottom: "1rem" }}>
                  <h3 style={{ fontWeight: "bold", margin: "0 0 0.2rem 0", fontSize: "0.95rem" }}>{exp.title}</h3>
                  <p style={{ margin: "0", color: accent, fontSize: "0.85rem" }}>{exp.company}</p>
                </div>
              ))}
          </section>
        )}
      </div>
    </div>
  )
}

// Ultra Modern Template
function UltraModernTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "2rem", fontFamily: "Inter, sans-serif", lineHeight: "1.6", backgroundColor: "#f0f9fa" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.3rem", fontWeight: "bold", margin: "0", color: accent, letterSpacing: "-0.01em" }}>{config.profile.fullName}</h1>
        {config.profile.title && <p style={{ fontSize: "1rem", margin: "0.5rem 0 0 0", color: "#666", fontWeight: "500" }}>{config.profile.title}</p>}
      </div>
      {config.profile.summary && (
        <section style={{ marginBottom: "2rem", background: "white", padding: "1.5rem", borderRadius: "12px", borderLeft: `5px solid ${accent}` }}>
          <p style={{ margin: 0, color: "#555", lineHeight: "1.8" }}>{config.profile.summary}</p>
        </section>
      )}
    </div>
  )
}

// Geo Modern Template
function GeoModernTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "0", fontFamily: "Inter, sans-serif", lineHeight: "1.6" }}>
      <div style={{ background: `linear-gradient(45deg, ${accent}, ${accent}dd)`, color: "white", padding: "3rem 2rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "200px", height: "200px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", transform: "translate(50%, -50%)" }} />
        <h1 style={{ fontSize: "2.3rem", fontWeight: "bold", margin: "0 0 0.5rem 0", position: "relative", zIndex: 1 }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "1.05rem", margin: "0", position: "relative", zIndex: 1, opacity: 0.95 }}>{config.profile.title}</p>
      </div>
      <div style={{ padding: "2rem" }}>
        {config.profile.summary && <p style={{ color: "#555", marginBottom: "1.5rem", lineHeight: "1.8" }}>{config.profile.summary}</p>}
      </div>
    </div>
  )
}

// Gradient Pro Template
function GradientProTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "2rem", fontFamily: "Inter, sans-serif", lineHeight: "1.6", background: `linear-gradient(135deg, #f0f4ff 0%, white 100%)` }}>
      <div style={{ paddingBottom: "1.5rem", marginBottom: "1.5rem", borderBottom: `2px solid ${accent}` }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: "0", color: accent }}>{config.profile.fullName}</h1>
        {config.profile.title && <p style={{ fontSize: "0.95rem", margin: "0.5rem 0 0 0", color: "#666" }}>{config.profile.title}</p>}
      </div>
      {config.profile.summary && <p style={{ color: "#555", marginBottom: "1.5rem", lineHeight: "1.8" }}>{config.profile.summary}</p>}
    </div>
  )
}

// Sleek Template
function SleekTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ display: "flex", fontFamily: "Inter, sans-serif", lineHeight: "1.6", minHeight: "100%" }}>
      <div style={{ flex: "0 0 40%", backgroundColor: accent, color: "white", padding: "2.5rem 2rem" }}>
        <h1 style={{ fontSize: "1.7rem", fontWeight: "bold", margin: "0 0 0.5rem 0", letterSpacing: "0.5px" }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "0.9rem", margin: "0 0 1.5rem 0", opacity: 0.9 }}>{config.profile.title}</p>
        {config.profile.summary && <p style={{ fontSize: "0.85rem", lineHeight: "1.7", opacity: 0.95 }}>{config.profile.summary}</p>}
      </div>
      <div style={{ flex: "1", padding: "2.5rem 2.5rem", backgroundColor: "white" }}></div>
    </div>
  )
}

// Startup Spark Template
function StartupSparkTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "2rem", fontFamily: "Inter, sans-serif", lineHeight: "1.6", backgroundColor: "#fef3c7" }}>
      <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: `3px dashed ${accent}` }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "bold", margin: "0", color: accent }}>{config.profile.fullName}</h1>
        {config.profile.title && <p style={{ fontSize: "1rem", margin: "0.5rem 0 0 0", color: "#666" }}>{config.profile.title}</p>}
      </div>
      {config.profile.summary && <p style={{ color: "#555", marginBottom: "1.5rem", lineHeight: "1.8" }}>{config.profile.summary}</p>}
    </div>
  )
}

// Innovation Template
function InnovationTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "0", fontFamily: "Inter, sans-serif", lineHeight: "1.6" }}>
      <div style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`, color: "white", padding: "2.5rem 2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.3rem", fontWeight: "bold", margin: "0 0 0.3rem 0" }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "1rem", margin: "0.5rem 0", opacity: 0.95 }}>{config.profile.title}</p>
      </div>
      <div style={{ padding: "2rem" }}>
        {config.profile.summary && <p style={{ color: "#555", lineHeight: "1.8" }}>{config.profile.summary}</p>}
      </div>
    </div>
  )
}

// Disruptive Template
function DisruptiveTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "2rem", fontFamily: "Inter, sans-serif", lineHeight: "1.6", background: "linear-gradient(135deg, #fff1f2 0%, white 100%)" }}>
      <div style={{ borderLeft: `8px solid ${accent}`, paddingLeft: "1.5rem", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "bold", margin: "0", color: accent }}>{config.profile.fullName}</h1>
        {config.profile.title && <p style={{ fontSize: "1rem", margin: "0.5rem 0 0 0", color: "#666", fontWeight: "600" }}>{config.profile.title}</p>}
      </div>
      {config.profile.summary && <p style={{ color: "#555", lineHeight: "1.8" }}>{config.profile.summary}</p>}
    </div>
  )
}

// Zen Template
function ZenTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "2.5rem", fontFamily: "Georgia, serif", lineHeight: "1.8", maxWidth: "8.5in" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.9rem", fontWeight: "300", margin: "0", letterSpacing: "2px", color: accent }}>{config.profile.fullName}</h1>
        {config.profile.title && <p style={{ fontSize: "0.95rem", margin: "0.8rem 0 0 0", color: "#666", fontWeight: "300", letterSpacing: "1px" }}>{config.profile.title}</p>}
      </div>
      {config.profile.summary && <p style={{ textAlign: "center", color: "#555", marginBottom: "2rem", lineHeight: "1.9", fontStyle: "italic" }}>{config.profile.summary}</p>}
    </div>
  )
}

// Whitespace Template
function WhitespaceTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "3rem 2rem", fontFamily: "Inter, sans-serif", lineHeight: "1.7", maxWidth: "8.5in" }}>
      <div style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "600", margin: "0", letterSpacing: "-0.02em" }}>{config.profile.fullName}</h1>
        {config.profile.title && <p style={{ fontSize: "0.95rem", margin: "0.8rem 0 0 0", color: accent, fontWeight: "500" }}>{config.profile.title}</p>}
      </div>
      {config.profile.summary && <p style={{ color: "#555", lineHeight: "1.9", margin: "0 0 2rem 0" }}>{config.profile.summary}</p>}
    </div>
  )
}

// Pure Minimal Template
function PureMinimalTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "2rem", fontFamily: "Inter, sans-serif", lineHeight: "1.7" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: "600", margin: "0 0 0.3rem 0" }}>{config.profile.fullName}</h1>
      {config.profile.title && <p style={{ fontSize: "0.9rem", margin: "0 0 1rem 0", color: "#666" }}>{config.profile.title}</p>}
      {config.profile.summary && <p style={{ color: "#666", lineHeight: "1.8", margin: 0 }}>{config.profile.summary}</p>}
    </div>
  )
}

// Academic Template
function AcademicTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ display: "flex", minHeight: "100%", fontFamily: "Georgia, serif", lineHeight: "1.8" }}>
      <div style={{ flex: "0 0 35%", backgroundColor: accent, color: "white", padding: "2.5rem 2rem" }}>
        <h1 style={{ fontSize: "1.7rem", fontWeight: "bold", margin: "0 0 1rem 0" }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "0.95rem", margin: "0", opacity: 0.9 }}>{config.profile.title}</p>
      </div>
      <div style={{ flex: "1", padding: "2.5rem 2.5rem" }}>
        {config.profile.summary && <p style={{ margin: "0", color: "#555", lineHeight: "1.8" }}>{config.profile.summary}</p>}
      </div>
    </div>
  )
}

// Research Template
function ResearchTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ display: "flex", fontFamily: "Inter, sans-serif", lineHeight: "1.7", minHeight: "100%" }}>
      <div style={{ flex: "1", padding: "2rem" }}>
        <h1 style={{ fontSize: "1.7rem", fontWeight: "bold", margin: "0 0 0.3rem 0" }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "0.9rem", margin: "0 0 1.5rem 0", color: accent, fontWeight: "500" }}>{config.profile.title}</p>
        {config.profile.summary && <p style={{ color: "#555", lineHeight: "1.8" }}>{config.profile.summary}</p>}
      </div>
      <div style={{ flex: "1", padding: "2rem", backgroundColor: `${accent}10`, borderLeft: `2px solid ${accent}` }}></div>
    </div>
  )
}

// Medical Pro Template
function MedicalProTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ display: "flex", minHeight: "100%", fontFamily: "Inter, sans-serif", lineHeight: "1.6" }}>
      <div style={{ flex: "0 0 32%", backgroundColor: accent, color: "white", padding: "2.5rem 2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", margin: "0 0 0.5rem 0" }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "0.9rem", margin: "0", opacity: 0.9 }}>{config.profile.title}</p>
      </div>
      <div style={{ flex: "1", padding: "2.5rem 2.5rem" }}>
        {config.profile.summary && <p style={{ color: "#555", lineHeight: "1.8" }}>{config.profile.summary}</p>}
      </div>
    </div>
  )
}

// Legal Template
function LegalTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "2.5rem", fontFamily: "Calibri, sans-serif", lineHeight: "1.8", maxWidth: "8.5in" }}>
      <div style={{ textAlign: "center", borderBottom: `2px solid ${accent}`, paddingBottom: "1.5rem", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: "0", color: accent }}>{config.profile.fullName}</h1>
        {config.profile.title && <p style={{ fontSize: "1rem", margin: "0.5rem 0 0 0", color: "#555" }}>{config.profile.title}</p>}
      </div>
      {config.profile.summary && <p style={{ color: "#444", lineHeight: "1.8" }}>{config.profile.summary}</p>}
    </div>
  )
}

// Finance Template
function FinanceTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ display: "flex", minHeight: "100%", fontFamily: "Inter, sans-serif", lineHeight: "1.6" }}>
      <div style={{ flex: "0 0 30%", backgroundColor: accent, color: "white", padding: "2.5rem 1.8rem" }}>
        <h1 style={{ fontSize: "1.7rem", fontWeight: "bold", margin: "0 0 0.5rem 0" }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "0.9rem", margin: "0", opacity: 0.95 }}>{config.profile.title}</p>
      </div>
      <div style={{ flex: "1", padding: "2.5rem 2.5rem" }}>
        {config.profile.summary && <p style={{ color: "#555", lineHeight: "1.8" }}>{config.profile.summary}</p>}
      </div>
    </div>
  )
}

// Creative Finance Template
function CreativeFinanceTemplate({ config, accent }: { config: ResumeConfig; accent: string }) {
  return (
    <div className="resume-page" style={{ padding: "0", fontFamily: "Inter, sans-serif", lineHeight: "1.6" }}>
      <div style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)`, color: "white", padding: "2.5rem 2rem" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "bold", margin: "0 0 0.5rem 0" }}>{config.profile.fullName}</h1>
        <p style={{ fontSize: "1rem", margin: "0", fontWeight: "500" }}>{config.profile.title}</p>
      </div>
      <div style={{ padding: "2rem" }}>
        {config.profile.summary && <p style={{ color: "#555", lineHeight: "1.8" }}>{config.profile.summary}</p>}
      </div>
    </div>
  )
}
