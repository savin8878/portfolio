"use client"

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  type TemplateTheme,
  TEMPLATE_THEMES,
  THEME_CATEGORIES,
} from "./resume-templates/themes"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TemplateGalleryProps {
  currentTemplate: string
  onSelectTemplate: (templateId: string) => void
  onClose: () => void
  isOpen: boolean
}

interface UnifiedTemplate {
  id: string
  name: string
  category: string
  description: string
  previewColors: [string, string, string]
  layout: string
  isOriginal: boolean
}

/* ------------------------------------------------------------------ */
/*  Original templates shipped with the builder                        */
/* ------------------------------------------------------------------ */

const ORIGINAL_TEMPLATES: UnifiedTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    category: "original",
    description: "Traditional resume layout trusted by recruiters worldwide",
    previewColors: ["#2563eb", "#f8fafc", "#1f2937"],
    layout: "single",
    isOriginal: true,
  },
  {
    id: "modern",
    name: "Modern",
    category: "original",
    description: "Contemporary design with bold header accents",
    previewColors: ["#2563eb", "#1e293b", "#ffffff"],
    layout: "top-banner",
    isOriginal: true,
  },
  {
    id: "minimal",
    name: "Minimal",
    category: "original",
    description: "Clean and distraction-free for maximum readability",
    previewColors: ["#6b7280", "#ffffff", "#f3f4f6"],
    layout: "single",
    isOriginal: true,
  },
  {
    id: "healthcare",
    name: "Healthcare",
    category: "original",
    description: "Tailored for medical and healthcare professionals",
    previewColors: ["#059669", "#ecfdf5", "#1f2937"],
    layout: "sidebar-left",
    isOriginal: true,
  },
  {
    id: "elegant",
    name: "Elegant",
    category: "original",
    description: "Sophisticated design with refined purple accents",
    previewColors: ["#7c3aed", "#faf5ff", "#1f2937"],
    layout: "sidebar-right",
    isOriginal: true,
  },
  {
    id: "slate",
    name: "Slate",
    category: "original",
    description: "Professional slate palette with a polished feel",
    previewColors: ["#475569", "#f8fafc", "#334155"],
    layout: "two-column",
    isOriginal: true,
  },
]

/* ------------------------------------------------------------------ */
/*  Category definitions (including "Original")                        */
/* ------------------------------------------------------------------ */

const ALL_CATEGORIES = [
  { id: "all", name: "All", description: "Browse every template", icon: "grid" },
  { id: "original", name: "Original", description: "Shipped with the builder", icon: "star" },
  ...THEME_CATEGORIES,
]

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */

function SearchIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
    </svg>
  )
}

function CloseIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function CheckIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function CategoryIcon({ icon, className = "w-4 h-4" }: { icon: string; className?: string }) {
  switch (icon) {
    case "grid":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    case "star":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    case "briefcase":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        </svg>
      )
    case "palette":
    case "sparkles":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      )
    case "code":
    case "terminal":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    case "minus":
    case "feather":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 8L2 22M17.5 15H9" />
        </svg>
      )
    case "zap":
    case "bolt":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    case "layers":
    case "squares":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )
  }
}

/* ------------------------------------------------------------------ */
/*  Mini Preview                                                       */
/* ------------------------------------------------------------------ */

function TemplateMiniPreview({
  colors,
  layout,
}: {
  colors: [string, string, string]
  layout: string
}) {
  const [accent, bg, text] = colors

  const commonClasses = "w-full rounded-sm overflow-hidden border border-zinc-200 dark:border-zinc-700"

  /* Tiny "text lines" helper */
  const Lines = ({
    count = 3,
    color,
    width,
  }: {
    count?: number
    color: string
    width?: string
  }) => (
    <div className="flex flex-col gap-[2px]">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-[1px]"
          style={{
            height: 2,
            width: width ?? (i === count - 1 ? "60%" : "90%"),
            backgroundColor: color,
            opacity: 0.55,
          }}
        />
      ))}
    </div>
  )

  const SectionBlock = ({
    color,
    accentColor,
  }: {
    color: string
    accentColor: string
  }) => (
    <div className="flex flex-col gap-[3px]">
      <div
        className="rounded-[1px]"
        style={{ height: 2.5, width: "40%", backgroundColor: accentColor, opacity: 0.8 }}
      />
      <Lines count={3} color={color} />
    </div>
  )

  /* ---- Layout renderers ---- */

  if (layout === "sidebar-left") {
    return (
      <div className={commonClasses} style={{ aspectRatio: "210/297", backgroundColor: bg }}>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-[32%] h-full p-[6px] flex flex-col gap-[6px]" style={{ backgroundColor: accent }}>
            <div className="w-[60%] aspect-square rounded-full mx-auto" style={{ backgroundColor: bg, opacity: 0.3 }} />
            <Lines count={2} color={bg} width="80%" />
            <div className="mt-auto"><Lines count={4} color={bg} width="75%" /></div>
          </div>
          {/* Content */}
          <div className="flex-1 p-[6px] flex flex-col gap-[6px]">
            <div className="rounded-[1px]" style={{ height: 3, width: "70%", backgroundColor: accent, opacity: 0.9 }} />
            <Lines count={2} color={text} />
            <SectionBlock color={text} accentColor={accent} />
            <SectionBlock color={text} accentColor={accent} />
          </div>
        </div>
      </div>
    )
  }

  if (layout === "sidebar-right") {
    return (
      <div className={commonClasses} style={{ aspectRatio: "210/297", backgroundColor: bg }}>
        <div className="flex h-full">
          {/* Content */}
          <div className="flex-1 p-[6px] flex flex-col gap-[6px]">
            <div className="rounded-[1px]" style={{ height: 3, width: "70%", backgroundColor: accent, opacity: 0.9 }} />
            <Lines count={2} color={text} />
            <SectionBlock color={text} accentColor={accent} />
            <SectionBlock color={text} accentColor={accent} />
          </div>
          {/* Sidebar */}
          <div className="w-[32%] h-full p-[6px] flex flex-col gap-[6px]" style={{ backgroundColor: accent }}>
            <div className="w-[60%] aspect-square rounded-full mx-auto" style={{ backgroundColor: bg, opacity: 0.3 }} />
            <Lines count={2} color={bg} width="80%" />
            <div className="mt-auto"><Lines count={4} color={bg} width="75%" /></div>
          </div>
        </div>
      </div>
    )
  }

  if (layout === "top-banner") {
    return (
      <div className={commonClasses} style={{ aspectRatio: "210/297", backgroundColor: bg }}>
        {/* Banner */}
        <div className="p-[6px] pb-[8px]" style={{ backgroundColor: accent }}>
          <div className="rounded-[1px]" style={{ height: 3.5, width: "55%", backgroundColor: bg, opacity: 0.95 }} />
          <div className="mt-[3px]"><Lines count={1} color={bg} width="80%" /></div>
        </div>
        {/* Content */}
        <div className="p-[6px] flex flex-col gap-[6px]">
          <SectionBlock color={text} accentColor={accent} />
          <SectionBlock color={text} accentColor={accent} />
          <SectionBlock color={text} accentColor={accent} />
        </div>
      </div>
    )
  }

  if (layout === "two-column") {
    return (
      <div className={commonClasses} style={{ aspectRatio: "210/297", backgroundColor: bg }}>
        {/* Header */}
        <div className="p-[6px] flex items-center gap-[4px]" style={{ borderBottom: `1.5px solid ${accent}` }}>
          <div className="rounded-[1px]" style={{ height: 3.5, width: "45%", backgroundColor: accent, opacity: 0.9 }} />
          <div className="ml-auto"><Lines count={1} color={text} width="100%" /></div>
        </div>
        {/* Two columns */}
        <div className="flex h-[calc(100%-20px)]">
          <div className="flex-1 p-[6px] flex flex-col gap-[5px]" style={{ borderRight: `0.5px solid ${accent}33` }}>
            <SectionBlock color={text} accentColor={accent} />
            <SectionBlock color={text} accentColor={accent} />
          </div>
          <div className="flex-1 p-[6px] flex flex-col gap-[5px]">
            <SectionBlock color={text} accentColor={accent} />
            <SectionBlock color={text} accentColor={accent} />
          </div>
        </div>
      </div>
    )
  }

  /* Default: single column */
  return (
    <div className={commonClasses} style={{ aspectRatio: "210/297", backgroundColor: bg }}>
      {/* Header */}
      <div className="p-[6px] text-center" style={{ borderBottom: `1.5px solid ${accent}` }}>
        <div className="mx-auto rounded-[1px]" style={{ height: 3.5, width: "50%", backgroundColor: accent, opacity: 0.9 }} />
        <div className="mt-[3px] mx-auto" style={{ width: "70%" }}>
          <Lines count={1} color={text} width="100%" />
        </div>
      </div>
      {/* Content */}
      <div className="p-[6px] flex flex-col gap-[6px]">
        <SectionBlock color={text} accentColor={accent} />
        <SectionBlock color={text} accentColor={accent} />
        <SectionBlock color={text} accentColor={accent} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Gallery Component                                             */
/* ------------------------------------------------------------------ */

export function TemplateGallery({
  currentTemplate,
  onSelectTemplate,
  onClose,
  isOpen,
}: TemplateGalleryProps) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [pendingTemplate, setPendingTemplate] = useState<string | null>(null)

  /* Unify originals + themed into one list */
  const allTemplates: UnifiedTemplate[] = useMemo(() => {
    const themed: UnifiedTemplate[] = TEMPLATE_THEMES.map((t: TemplateTheme) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      description: t.description,
      previewColors: t.previewColors as [string, string, string],
      layout: t.layout,
      isOriginal: false,
    }))
    return [...ORIGINAL_TEMPLATES, ...themed]
  }, [])

  /* Filter by category + search */
  const filteredTemplates = useMemo(() => {
    let list = allTemplates

    if (activeCategory !== "all") {
      list = list.filter((t) =>
        activeCategory === "original" ? t.isOriginal : t.category === activeCategory,
      )
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      )
    }

    return list
  }, [allTemplates, activeCategory, search])

  const selectedTemplate = pendingTemplate ?? currentTemplate

  const selectedInfo = useMemo(
    () => allTemplates.find((t) => t.id === selectedTemplate),
    [allTemplates, selectedTemplate],
  )

  const handleApply = useCallback(() => {
    if (pendingTemplate) {
      onSelectTemplate(pendingTemplate)
    }
    onClose()
  }, [pendingTemplate, onSelectTemplate, onClose])

  /* ---- Render ---- */

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 w-full max-w-6xl max-h-[92vh] mx-2 sm:mx-4 bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            {/* ============ Header ============ */}
            <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-zinc-200 dark:border-zinc-800">
              {/* Top row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                    Choose Your Template
                  </h2>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300">
                    {allTemplates.length} templates
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                />
              </div>

              {/* Category pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                {ALL_CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      <CategoryIcon icon={cat.icon} className="w-3.5 h-3.5" />
                      {cat.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ============ Grid ============ */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {filteredTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                  <SearchIcon className="w-10 h-10 mb-3 opacity-40" />
                  <p className="text-sm font-medium">No templates found</p>
                  <p className="text-xs mt-1">Try a different search or category</p>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.04 } },
                  }}
                >
                  {filteredTemplates.map((template) => {
                    const isSelected = selectedTemplate === template.id
                    const isCurrent = currentTemplate === template.id
                    const isHovered = hoveredId === template.id

                    return (
                      <motion.div
                        key={template.id}
                        variants={{
                          hidden: { opacity: 0, y: 16 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        onMouseEnter={() => setHoveredId(template.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => setPendingTemplate(template.id)}
                        className={`group relative cursor-pointer rounded-xl overflow-hidden transition-shadow duration-300 ${
                          isSelected
                            ? "ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/20"
                            : "ring-1 ring-zinc-200 dark:ring-zinc-700 hover:shadow-xl hover:shadow-zinc-300/30 dark:hover:shadow-black/40"
                        } bg-zinc-50 dark:bg-zinc-800`}
                      >
                        {/* Preview */}
                        <div className="relative p-3 pb-2">
                          <TemplateMiniPreview
                            colors={template.previewColors}
                            layout={template.layout}
                          />

                          {/* Hover overlay */}
                          <AnimatePresence>
                            {isHovered && !isSelected && (
                              <motion.div
                                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-t-xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                <span className="px-4 py-1.5 rounded-lg bg-white text-zinc-900 text-xs font-semibold shadow-lg">
                                  Use Template
                                </span>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Selected check */}
                          {isSelected && (
                            <motion.div
                              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", damping: 15, stiffness: 400 }}
                            >
                              <CheckIcon className="w-4 h-4 text-white" />
                            </motion.div>
                          )}

                          {/* Current badge */}
                          {isCurrent && !isSelected && (
                            <div className="absolute top-4 right-4 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow">
                              Active
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="px-3 pb-3">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                              {template.name}
                            </p>
                            <span
                              className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider ${
                                template.isOriginal
                                  ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                              }`}
                            >
                              {template.isOriginal ? "Original" : template.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                            {template.description}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}
            </div>

            {/* ============ Bottom Bar ============ */}
            <div className="flex-shrink-0 px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                {/* Selected info */}
                <div className="min-w-0 flex-1">
                  {selectedInfo ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                        <TemplateMiniPreview
                          colors={selectedInfo.previewColors}
                          layout={selectedInfo.layout}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                          {selectedInfo.name}
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                          {selectedInfo.description}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400">Select a template to preview</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium rounded-xl text-zinc-600 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={!pendingTemplate || pendingTemplate === currentTemplate}
                    className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Apply Template
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
