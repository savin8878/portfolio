import { PageCanvas } from "@/components/admin/page-canvas"
import { sql } from "@/lib/db"

async function getPageData() {
  const [contentRows, visibilityRows] = await Promise.all([
    sql`SELECT * FROM section_content WHERE page = 'home'`,
    sql`SELECT * FROM section_visibility WHERE page = 'home' ORDER BY display_order`,
  ])

  // Parse content into a map
  const contentMap: Record<string, Record<string, string>> = {}
  for (const row of contentRows) {
    contentMap[row.section as string] = (row.content || {}) as Record<string, string>
  }

  // Parse visibility into a map
  const visMap: Record<string, { isVisible: boolean; order: number }> = {}
  for (const row of visibilityRows) {
    visMap[row.section as string] = {
      isVisible: row.is_visible as boolean,
      order: (row.display_order as number) || 0,
    }
  }

  return { contentMap, visMap }
}

// Section definitions with their labels and order
const SECTION_DEFS = [
  { id: "hero", label: "Hero Section" },
  { id: "clients", label: "Clients Logos" },
  { id: "metrics", label: "Impact Metrics" },
  { id: "featured_projects", label: "Featured Projects" },
  { id: "philosophy", label: "Philosophy" },
  { id: "tech_stack", label: "Tech Stack" },
  { id: "process", label: "Process" },
  { id: "testimonials", label: "Testimonials" },
  { id: "blog_preview", label: "Blog Preview" },
  { id: "cta", label: "Call to Action" },
]

// Editable fields per section (matching content-manager schema)
const SECTION_SCHEMA: Record<string, { label: string; fields: { key: string; label: string; type: string }[] }> = {
  hero: {
    label: "Hero Section",
    fields: [{ key: "availability_text", label: "Availability Status", type: "text" }],
  },
  clients: {
    label: "Clients Section",
    fields: [{ key: "subtitle", label: "Subtitle", type: "text" }],
  },
  metrics: {
    label: "Impact Metrics",
    fields: [],
  },
  featured_projects: {
    label: "Featured Projects",
    fields: [
      { key: "label", label: "Section Label", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
    ],
  },
  philosophy: {
    label: "Philosophy",
    fields: [],
  },
  tech_stack: {
    label: "Tech Stack",
    fields: [],
  },
  process: {
    label: "Process",
    fields: [
      { key: "label", label: "Section Label", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
      { key: "panel_label", label: "Panel Label", type: "text" },
      { key: "panel_title", label: "Panel Title", type: "text" },
      { key: "panel_description", label: "Panel Description", type: "textarea" },
      { key: "panel_items", label: "Panel Bullet Points (one per line)", type: "list" },
    ],
  },
  testimonials: {
    label: "Testimonials",
    fields: [
      { key: "label", label: "Section Label", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
    ],
  },
  blog_preview: {
    label: "Blog Preview",
    fields: [
      { key: "label", label: "Section Label", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  cta: {
    label: "Call to Action",
    fields: [
      { key: "label", label: "Section Label", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
      { key: "title_suffix", label: "Title After Highlight", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "response_text", label: "Response Time Text", type: "text" },
    ],
  },
}

export default async function PageBuilderPage() {
  const { contentMap, visMap } = await getPageData()

  const sections = SECTION_DEFS.map((def, i) => ({
    id: def.id,
    label: def.label,
    isVisible: visMap[def.id]?.isVisible ?? true,
    order: visMap[def.id]?.order ?? i,
    content: contentMap[def.id] || {},
    seo: {},
  })).sort((a, b) => a.order - b.order)

  return (
    <div className="-m-6">
      <PageCanvas page="home" sections={sections} schema={SECTION_SCHEMA} />
    </div>
  )
}
