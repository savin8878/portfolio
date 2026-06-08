/**
 * Single source of truth for the homepage's scroll-driven section explorer.
 *
 * Both the page-level <SectionReveal> wrappers and the floating <SectionRail>
 * derive from this map, keyed by the same section ids used in app/page.tsx, so
 * the rail and the reveal wrappers can never drift apart.
 *
 * `sticky: true` marks sections whose inner layout relies on position:sticky
 * (the morphing project preview in "Work", the pinned commitment panel in
 * "Process"). A CSS transform / clip-path / filter on an ANCESTOR becomes the
 * containing block for sticky/fixed descendants and silently breaks the pin —
 * so those sections get a transform-free, opacity-only reveal instead.
 */

export interface SectionMeta {
  /** kebab DOM id attached to the wrapper — used for scroll-to + scroll-spy */
  anchorId: string
  /** short label shown in the rail */
  label: string
  /** uses position:sticky internally -> must NOT receive a transform reveal */
  sticky: boolean
}

export const SECTION_META: Record<string, SectionMeta> = {
  hero: { anchorId: "cinematic-hero", label: "Intro", sticky: false },
  clients: { anchorId: "clients", label: "Clients", sticky: false },
  metrics: { anchorId: "impact-metrics", label: "Impact", sticky: false },
  featured_projects: { anchorId: "featured-work", label: "Work", sticky: true },
  philosophy: { anchorId: "philosophy", label: "Ethos", sticky: false },
  tech_stack: { anchorId: "tech-stack", label: "Stack", sticky: false },
  process: { anchorId: "process", label: "Process", sticky: true },
  testimonials: { anchorId: "testimonials", label: "Testimonials", sticky: false },
  blog_preview: { anchorId: "blog-preview", label: "Writing", sticky: false },
  cta: { anchorId: "get-in-touch", label: "Contact", sticky: false },
}

export interface RailItem {
  anchorId: string
  label: string
}
