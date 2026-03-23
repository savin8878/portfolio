"use client"

import { useState } from "react"
import { Home, User, Briefcase, FolderKanban, PenTool, Mail, Blocks } from "lucide-react"
import { PageCanvas } from "@/components/admin/page-canvas"
import { BlockCanvasEditor } from "@/components/admin/block-canvas-editor"

interface FieldDef {
  key: string
  label: string
  type: "text" | "textarea" | "list"
}

interface PageDef {
  id: string
  label: string
  icon: React.ElementType
  path: string
  sections: { id: string; label: string }[]
  schema: Record<string, { label: string; fields: FieldDef[] }>
}

// ─── Complete field definitions for every section on every page ───

const PAGES: PageDef[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    path: "/",
    sections: [
      { id: "hero", label: "Hero Section" },
      { id: "clients", label: "Client Logos" },
      { id: "metrics", label: "Impact Metrics" },
      { id: "featured_projects", label: "Featured Projects" },
      { id: "philosophy", label: "Philosophy" },
      { id: "tech_stack", label: "Tech Stack" },
      { id: "process", label: "Process" },
      { id: "testimonials", label: "Testimonials" },
      { id: "blog_preview", label: "Blog Preview" },
      { id: "cta", label: "Call to Action" },
    ],
    schema: {
      hero: { label: "Hero Section", fields: [
        { key: "availability_text", label: "Availability Badge Text", type: "text" },
        { key: "heading_prefix", label: "Heading Prefix (e.g. Hi, I'm)", type: "text" },
        { key: "heading_highlight", label: "Heading Highlight Word", type: "text" },
        { key: "subheading", label: "Subheading / Tagline", type: "textarea" },
        { key: "primary_cta_text", label: "Primary Button Text", type: "text" },
        { key: "primary_cta_url", label: "Primary Button URL", type: "text" },
        { key: "secondary_cta_text", label: "Secondary Button Text", type: "text" },
        { key: "secondary_cta_url", label: "Secondary Button URL", type: "text" },
        { key: "scroll_text", label: "Scroll Indicator Text", type: "text" },
      ] },
      clients: { label: "Client Logos", fields: [
        { key: "subtitle", label: "Section Subtitle", type: "text" },
        { key: "title", label: "Section Title", type: "text" },
      ] },
      metrics: { label: "Impact Metrics", fields: [
        { key: "title", label: "Section Title", type: "text" },
        { key: "subtitle", label: "Subtitle", type: "text" },
      ] },
      featured_projects: { label: "Featured Projects", fields: [
        { key: "label", label: "Section Badge Label", type: "text" },
        { key: "title", label: "Section Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
        { key: "description", label: "Section Description", type: "textarea" },
        { key: "view_all_text", label: "View All Button Text", type: "text" },
        { key: "view_all_url", label: "View All Button URL", type: "text" },
      ] },
      philosophy: { label: "Philosophy", fields: [
        { key: "label", label: "Section Badge Label", type: "text" },
        { key: "title", label: "Section Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
        { key: "description", label: "Section Description", type: "textarea" },
      ] },
      tech_stack: { label: "Tech Stack", fields: [
        { key: "label", label: "Section Badge Label", type: "text" },
        { key: "title", label: "Section Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
        { key: "description", label: "Section Description", type: "textarea" },
      ] },
      process: { label: "Process", fields: [
        { key: "label", label: "Section Badge Label", type: "text" },
        { key: "title", label: "Section Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
        { key: "panel_label", label: "Info Panel Badge", type: "text" },
        { key: "panel_title", label: "Info Panel Title", type: "text" },
        { key: "panel_description", label: "Info Panel Description", type: "textarea" },
        { key: "panel_items", label: "Info Panel Bullet Points", type: "list" },
      ] },
      testimonials: { label: "Testimonials", fields: [
        { key: "label", label: "Section Badge Label", type: "text" },
        { key: "title", label: "Section Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
        { key: "description", label: "Section Description", type: "textarea" },
      ] },
      blog_preview: { label: "Blog Preview", fields: [
        { key: "label", label: "Section Badge Label", type: "text" },
        { key: "title", label: "Section Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
        { key: "description", label: "Section Description", type: "textarea" },
        { key: "view_all_text", label: "View All Button Text", type: "text" },
      ] },
      cta: { label: "Call to Action", fields: [
        { key: "label", label: "Section Badge Label", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
        { key: "title_suffix", label: "Title After Highlight", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "primary_cta_text", label: "Primary Button Text", type: "text" },
        { key: "primary_cta_url", label: "Primary Button URL", type: "text" },
        { key: "secondary_cta_text", label: "Secondary Button Text", type: "text" },
        { key: "response_text", label: "Response Time Text", type: "text" },
      ] },
    },
  },
  {
    id: "about",
    label: "About",
    icon: User,
    path: "/about",
    sections: [
      { id: "hero", label: "About Hero" },
      { id: "experience", label: "Experience Timeline" },
      { id: "skills", label: "Skills Overview" },
      { id: "cta", label: "Call to Action" },
    ],
    schema: {
      hero: { label: "About Hero", fields: [
        { key: "title", label: "Page Title", type: "text" },
        { key: "subtitle", label: "Subtitle", type: "text" },
        { key: "bio_text", label: "Bio / Intro Paragraph", type: "textarea" },
        { key: "experience_text", label: "Experience Paragraph", type: "textarea" },
        { key: "personal_text", label: "Personal / Hobby Paragraph", type: "textarea" },
        { key: "years_experience", label: "Years of Experience Badge", type: "text" },
        { key: "profile_alt", label: "Profile Image Alt Text", type: "text" },
      ] },
      experience: { label: "Experience Timeline", fields: [
        { key: "label", label: "Section Badge Label", type: "text" },
        { key: "title", label: "Section Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
        { key: "panel_label", label: "Info Panel Badge", type: "text" },
        { key: "panel_title", label: "Info Panel Title", type: "text" },
        { key: "panel_description", label: "Info Panel Description", type: "textarea" },
        { key: "panel_items", label: "Info Panel Bullet Points", type: "list" },
      ] },
      skills: { label: "Skills Overview", fields: [
        { key: "label", label: "Section Badge Label", type: "text" },
        { key: "title", label: "Section Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
        { key: "description", label: "Section Description", type: "textarea" },
      ] },
      cta: { label: "Call to Action", fields: [
        { key: "label", label: "Section Badge Label", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "cta_text", label: "Button Text", type: "text" },
        { key: "cta_url", label: "Button URL", type: "text" },
      ] },
    },
  },
  {
    id: "services",
    label: "Services",
    icon: Briefcase,
    path: "/services",
    sections: [
      { id: "hero", label: "Services Hero" },
      { id: "services_grid", label: "Services Grid" },
      { id: "pricing", label: "Pricing Section" },
      { id: "faq", label: "FAQ Section" },
      { id: "cta", label: "Call to Action" },
    ],
    schema: {
      hero: { label: "Services Hero", fields: [
        { key: "title", label: "Page Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
        { key: "description", label: "Page Description", type: "textarea" },
        { key: "badge_text", label: "Badge Text", type: "text" },
      ] },
      services_grid: { label: "Services Grid", fields: [
        { key: "label", label: "Section Label", type: "text" },
        { key: "title", label: "Section Title", type: "text" },
        { key: "description", label: "Section Description", type: "textarea" },
      ] },
      pricing: { label: "Pricing", fields: [
        { key: "label", label: "Section Label", type: "text" },
        { key: "title", label: "Section Title", type: "text" },
        { key: "description", label: "Section Description", type: "textarea" },
        { key: "note", label: "Pricing Note / Disclaimer", type: "textarea" },
      ] },
      faq: { label: "FAQ", fields: [
        { key: "label", label: "Section Label", type: "text" },
        { key: "title", label: "Section Title", type: "text" },
        { key: "description", label: "Section Description", type: "textarea" },
      ] },
      cta: { label: "Call to Action", fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "cta_text", label: "Button Text", type: "text" },
        { key: "cta_url", label: "Button URL", type: "text" },
      ] },
    },
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderKanban,
    path: "/projects",
    sections: [
      { id: "hero", label: "Projects Hero" },
      { id: "projects_grid", label: "Projects Grid" },
      { id: "cta", label: "Call to Action" },
    ],
    schema: {
      hero: { label: "Projects Hero", fields: [
        { key: "title", label: "Page Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
        { key: "description", label: "Page Description", type: "textarea" },
        { key: "badge_text", label: "Badge Text", type: "text" },
      ] },
      projects_grid: { label: "Projects Grid", fields: [
        { key: "filter_label", label: "Filter Label", type: "text" },
        { key: "empty_text", label: "Empty State Text", type: "text" },
      ] },
      cta: { label: "Call to Action", fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "cta_text", label: "Button Text", type: "text" },
        { key: "cta_url", label: "Button URL", type: "text" },
      ] },
    },
  },
  {
    id: "blog",
    label: "Blog",
    icon: PenTool,
    path: "/blog",
    sections: [
      { id: "hero", label: "Blog Hero" },
      { id: "blog_grid", label: "Blog Grid" },
    ],
    schema: {
      hero: { label: "Blog Hero", fields: [
        { key: "title", label: "Page Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
        { key: "description", label: "Page Description", type: "textarea" },
        { key: "badge_text", label: "Badge Text", type: "text" },
      ] },
      blog_grid: { label: "Blog Grid", fields: [
        { key: "filter_label", label: "Filter/Category Label", type: "text" },
        { key: "search_placeholder", label: "Search Placeholder Text", type: "text" },
        { key: "empty_text", label: "Empty State Text", type: "text" },
        { key: "read_more_text", label: "Read More Button Text", type: "text" },
      ] },
    },
  },
  {
    id: "contact",
    label: "Contact",
    icon: Mail,
    path: "/contact",
    sections: [
      { id: "hero", label: "Contact Hero" },
      { id: "form", label: "Contact Form" },
      { id: "info", label: "Contact Info" },
    ],
    schema: {
      hero: { label: "Contact Hero", fields: [
        { key: "title", label: "Page Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
        { key: "description", label: "Page Description", type: "textarea" },
        { key: "badge_text", label: "Badge Text", type: "text" },
      ] },
      form: { label: "Contact Form", fields: [
        { key: "form_title", label: "Form Heading", type: "text" },
        { key: "form_description", label: "Form Description", type: "textarea" },
        { key: "submit_text", label: "Submit Button Text", type: "text" },
        { key: "success_title", label: "Success Message Title", type: "text" },
        { key: "success_text", label: "Success Message Body", type: "textarea" },
      ] },
      info: { label: "Contact Info", fields: [
        { key: "info_title", label: "Info Section Heading", type: "text" },
        { key: "info_description", label: "Info Description", type: "textarea" },
        { key: "email_label", label: "Email Label", type: "text" },
        { key: "phone_label", label: "Phone Label", type: "text" },
        { key: "location_label", label: "Location Label", type: "text" },
        { key: "hours_label", label: "Business Hours Label", type: "text" },
        { key: "hours_text", label: "Business Hours Text", type: "text" },
        { key: "social_title", label: "Social Links Title", type: "text" },
      ] },
    },
  },
]

// ─── Theme presets ───
export const THEME_PRESETS = [
  { id: "default", name: "Default Dark", colors: { primary: "#6366f1", bg: "#09090b", text: "#fafafa", muted: "#27272a" } },
  { id: "ocean", name: "Ocean Blue", colors: { primary: "#0ea5e9", bg: "#0c1222", text: "#e2e8f0", muted: "#1e293b" } },
  { id: "emerald", name: "Emerald", colors: { primary: "#10b981", bg: "#022c22", text: "#ecfdf5", muted: "#064e3b" } },
  { id: "rose", name: "Rose", colors: { primary: "#f43f5e", bg: "#1a0a0e", text: "#fce7f3", muted: "#3b0f1e" } },
  { id: "amber", name: "Amber Warm", colors: { primary: "#f59e0b", bg: "#1c1108", text: "#fef3c7", muted: "#451a03" } },
  { id: "violet", name: "Violet", colors: { primary: "#8b5cf6", bg: "#0f0720", text: "#ede9fe", muted: "#2e1065" } },
  { id: "minimal", name: "Minimal Light", colors: { primary: "#18181b", bg: "#ffffff", text: "#18181b", muted: "#f4f4f5" } },
  { id: "slate", name: "Corporate Slate", colors: { primary: "#475569", bg: "#0f172a", text: "#e2e8f0", muted: "#1e293b" } },
]

interface PageBuilderClientProps {
  contentMap: Record<string, Record<string, Record<string, string>>>
  visMap: Record<string, Record<string, { isVisible: boolean; order: number }>>
}

export function PageBuilderClient({ contentMap, visMap }: PageBuilderClientProps) {
  const [activePage, setActivePage] = useState("home")
  const [mode, setMode] = useState<"sections" | "blocks">("sections")

  const pageDef = PAGES.find((p) => p.id === activePage)!

  const sections = pageDef.sections.map((sec, i) => ({
    id: sec.id,
    label: sec.label,
    isVisible: visMap[activePage]?.[sec.id]?.isVisible ?? true,
    order: visMap[activePage]?.[sec.id]?.order ?? i,
    content: contentMap[activePage]?.[sec.id] || {},
    styles: contentMap[activePage]?.[`${sec.id}_styles`] || {},
  })).sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -m-6">
      {/* Page tabs + mode toggle */}
      <div className="flex items-center border-b bg-background flex-shrink-0">
        <div className="flex items-center overflow-x-auto flex-1 px-2">
          {PAGES.map((pg) => {
            const Icon = pg.icon
            return (
              <button
                key={pg.id}
                onClick={() => setActivePage(pg.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activePage === pg.id ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {pg.label}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-1 px-3 border-l">
          <button
            onClick={() => setMode("sections")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === "sections" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Sections
          </button>
          <button
            onClick={() => setMode("blocks")}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === "blocks" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Blocks className="h-3 w-3" />
            Block Editor
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {mode === "sections" ? (
          <PageCanvas
            key={activePage}
            page={activePage}
            sections={sections}
            schema={pageDef.schema}
            pagePath={pageDef.path}
          />
        ) : (
          <BlockCanvasEditor key={`blocks-${activePage}`} page={activePage} />
        )}
      </div>
    </div>
  )
}
