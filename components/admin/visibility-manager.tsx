"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Eye, EyeOff, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SectionVisibility } from "@/lib/db"

const PAGE_META: Record<string, { label: string; description: string }> = {
  home: { label: "Home Page", description: "Landing page sections" },
  about: { label: "About Page", description: "Bio, experience, and skills" },
  services: { label: "Services Page", description: "Service offerings and pricing" },
  projects: { label: "Projects Page", description: "Portfolio and case studies" },
  blog: { label: "Blog Page", description: "Blog listing and categories" },
  contact: { label: "Contact Page", description: "Contact form and info" },
}

const SECTION_LABELS: Record<string, string> = {
  // Home
  hero: "Hero Banner",
  clients: "Client Logos",
  metrics: "Impact Metrics",
  featured_projects: "Featured Projects",
  philosophy: "Philosophy / Values",
  tech_stack: "Tech Stack",
  process: "Work Process",
  testimonials: "Testimonials",
  blog_preview: "Blog Preview",
  cta: "Call to Action",

  // About
  experience: "Experience Timeline",
  skills: "Skills Overview",

  // Services
  services_grid: "Services Grid",
  pricing: "Pricing Section",
  faq: "FAQ Section",

  // Projects
  projects_grid: "Projects Grid",

  // Blog
  blog_grid: "Blog Grid",

  // Contact
  form: "Contact Form",
  info: "Contact Info",
}

interface VisibilityManagerProps {
  initialSections: SectionVisibility[]
}

export function VisibilityManager({ initialSections }: VisibilityManagerProps) {
  const router = useRouter()
  const [sections, setSections] = useState<SectionVisibility[]>(initialSections)
  const [saving, setSaving] = useState<string | null>(null)
  const [savedPages, setSavedPages] = useState<Set<string>>(new Set())

  // Group by page
  const grouped = sections.reduce(
    (acc, s) => {
      if (!acc[s.page]) acc[s.page] = []
      acc[s.page].push(s)
      return acc
    },
    {} as Record<string, SectionVisibility[]>
  )

  const pageOrder = ["home", "about", "services", "projects", "blog", "contact"]
  const sortedPages = pageOrder.filter((p) => grouped[p])

  function toggleSection(page: string, section: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.page === page && s.section === section
          ? { ...s, is_visible: !s.is_visible }
          : s
      )
    )
  }

  async function savePage(page: string) {
    setSaving(page)
    const pageSections = sections.filter((s) => s.page === page)
    const updates = pageSections.map((s) => ({
      page: s.page,
      section: s.section,
      is_visible: s.is_visible,
    }))

    try {
      await fetch("/api/admin/visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      })
      setSavedPages((prev) => new Set(prev).add(page))
      setTimeout(() => {
        setSavedPages((prev) => {
          const next = new Set(prev)
          next.delete(page)
          return next
        })
      }, 2000)
      router.refresh()
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {sortedPages.map((page) => {
        const meta = PAGE_META[page] || { label: page, description: "" }
        const pageSections = grouped[page].sort(
          (a, b) => a.display_order - b.display_order
        )
        const visibleCount = pageSections.filter((s) => s.is_visible).length
        const totalCount = pageSections.length

        return (
          <Card key={page}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-3">
                    {meta.label}
                    <Badge
                      variant="secondary"
                      className={
                        visibleCount === totalCount
                          ? "bg-green-500/10 text-green-600"
                          : visibleCount === 0
                            ? "bg-red-500/10 text-red-600"
                            : "bg-amber-500/10 text-amber-600"
                      }
                    >
                      {visibleCount}/{totalCount} visible
                    </Badge>
                    {savedPages.has(page) && (
                      <Badge
                        variant="secondary"
                        className="bg-green-500/10 text-green-600"
                      >
                        Saved
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {meta.description}
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => savePage(page)}
                  disabled={saving === page}
                >
                  {saving === page ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {pageSections.map((s) => (
                  <div
                    key={`${s.page}-${s.section}`}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      {s.is_visible ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            s.is_visible
                              ? "text-foreground"
                              : "text-muted-foreground line-through"
                          }`}
                        >
                          {SECTION_LABELS[s.section] || s.section}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {s.page}/{s.section}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={s.is_visible}
                      onCheckedChange={() => toggleSection(s.page, s.section)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
