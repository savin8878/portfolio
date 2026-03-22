"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SectionContent } from "@/lib/db"
import { AIWriteButton } from "@/components/admin/ai-assistant"

// Schema defines the editable fields for each page/section
const SECTION_SCHEMA: Record<
  string,
  Record<string, { label: string; fields: FieldDef[] }>
> = {
  home: {
    hero: {
      label: "Hero Section",
      fields: [
        { key: "availability_text", label: "Availability Status Text", type: "text" },
      ],
    },
    clients: {
      label: "Clients Section",
      fields: [
        { key: "subtitle", label: "Subtitle", type: "text" },
      ],
    },
    featured_projects: {
      label: "Featured Projects Section",
      fields: [
        { key: "label", label: "Section Label", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
      ],
    },
    process: {
      label: "Process Section",
      fields: [
        { key: "label", label: "Section Label", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
        { key: "panel_label", label: "Right Panel Label", type: "text" },
        { key: "panel_title", label: "Right Panel Title", type: "text" },
        { key: "panel_description", label: "Right Panel Description", type: "textarea" },
        { key: "panel_items", label: "Right Panel Bullet Points (one per line)", type: "list" },
      ],
    },
    testimonials: {
      label: "Testimonials Section",
      fields: [
        { key: "label", label: "Section Label", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
      ],
    },
    blog_preview: {
      label: "Blog Preview Section",
      fields: [
        { key: "label", label: "Section Label", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ],
    },
    cta: {
      label: "Call to Action Section",
      fields: [
        { key: "label", label: "Section Label", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
        { key: "title_suffix", label: "Title Suffix (after highlight)", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "response_text", label: "Response Time Text", type: "text" },
      ],
    },
  },
  about: {
    hero: {
      label: "About Hero Section",
      fields: [
        { key: "experience_text", label: "Experience Paragraph", type: "textarea" },
        { key: "personal_text", label: "Personal/Hobby Paragraph", type: "textarea" },
        { key: "years_experience", label: "Years of Experience Badge", type: "text" },
      ],
    },
    experience: {
      label: "Experience Timeline Section",
      fields: [
        { key: "label", label: "Section Label", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
        { key: "panel_label", label: "Right Panel Label", type: "text" },
        { key: "panel_title", label: "Right Panel Title", type: "text" },
        { key: "panel_description", label: "Right Panel Description", type: "textarea" },
        { key: "panel_items", label: "Right Panel Bullet Points (one per line)", type: "list" },
      ],
    },
    skills: {
      label: "Skills Overview Section",
      fields: [
        { key: "label", label: "Section Label", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "title_highlight", label: "Gradient Highlight Word", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ],
    },
  },
}

interface FieldDef {
  key: string
  label: string
  type: "text" | "textarea" | "list"
}

interface SectionEditorProps {
  page: string
  section: string
  schema: { label: string; fields: FieldDef[] }
  initialContent: Record<string, unknown>
}

function SectionEditor({ page, section, schema, initialContent }: SectionEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<Record<string, unknown>>(() => {
    const data: Record<string, unknown> = {}
    for (const field of schema.fields) {
      if (field.type === "list") {
        const val = initialContent[field.key]
        data[field.key] = Array.isArray(val) ? (val as string[]).join("\n") : ""
      } else {
        data[field.key] = (initialContent[field.key] as string) || ""
      }
    }
    return data
  })

  async function handleSave() {
    setIsLoading(true)
    setIsSaved(false)

    // Convert list fields back to arrays
    const payload: Record<string, unknown> = {}
    for (const field of schema.fields) {
      if (field.type === "list") {
        payload[field.key] = (content[field.key] as string)
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      } else {
        payload[field.key] = content[field.key]
      }
    }

    // Preserve any fields from initialContent not in schema (e.g. CTA links)
    for (const key of Object.keys(initialContent)) {
      if (!(key in payload)) {
        payload[key] = initialContent[key]
      }
    }

    try {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, section, content: payload }),
      })
      setIsSaved(true)
      router.refresh()
      setTimeout(() => setIsSaved(false), 2000)
    } catch (error) {
      console.error("Failed to save content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <div>
              <CardTitle className="text-base">{schema.label}</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {page}/{section}
              </CardDescription>
            </div>
          </div>
          {isSaved && (
            <Badge variant="secondary" className="text-green-600 bg-green-500/10">
              Saved
            </Badge>
          )}
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="space-y-4 pt-0">
          {schema.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${page}-${section}-${field.key}`}>
                  {field.label}
                </Label>
                {(field.type === "textarea" || field.type === "list") && (
                  <AIWriteButton
                    value={(content[field.key] as string) || ""}
                    onApply={(t) => setContent({ ...content, [field.key]: t })}
                    context={`${field.label} for ${section} section`}
                  />
                )}
              </div>
              {field.type === "textarea" || field.type === "list" ? (
                <Textarea
                  id={`${page}-${section}-${field.key}`}
                  value={(content[field.key] as string) || ""}
                  onChange={(e) =>
                    setContent({ ...content, [field.key]: e.target.value })
                  }
                  rows={field.type === "list" ? 4 : 3}
                  placeholder={
                    field.type === "list"
                      ? "One item per line"
                      : `Enter ${field.label.toLowerCase()}...`
                  }
                />
              ) : (
                <Input
                  id={`${page}-${section}-${field.key}`}
                  value={(content[field.key] as string) || ""}
                  onChange={(e) =>
                    setContent({ ...content, [field.key]: e.target.value })
                  }
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={isLoading} size="sm">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Section
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

interface ContentManagerProps {
  initialSections: SectionContent[]
}

export function ContentManager({ initialSections }: ContentManagerProps) {
  // Build a lookup from existing data
  const contentMap: Record<string, Record<string, unknown>> = {}
  for (const s of initialSections) {
    contentMap[`${s.page}:${s.section}`] = s.content
  }

  const pages = Object.entries(SECTION_SCHEMA)

  return (
    <div className="space-y-8 max-w-4xl">
      {pages.map(([page, sections]) => (
        <div key={page}>
          <h3 className="text-lg font-semibold text-foreground capitalize mb-4 flex items-center gap-2">
            <span className="h-px w-6 bg-accent" />
            {page === "home" ? "Home Page" : "About Page"}
          </h3>
          <div className="space-y-3">
            {Object.entries(sections).map(([section, schema]) => (
              <SectionEditor
                key={`${page}-${section}`}
                page={page}
                section={section}
                schema={schema}
                initialContent={contentMap[`${page}:${section}`] || {}}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
