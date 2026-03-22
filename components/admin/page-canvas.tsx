"use client"

import { useState, useCallback, useRef } from "react"
import {
  Eye,
  EyeOff,
  GripVertical,
  Save,
  Loader2,
  Check,
  Monitor,
  Tablet,
  Smartphone,
  Palette,
  Layout,
  RefreshCw,
  ExternalLink,
  Layers,
  PenLine,
  X,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// Card not directly used but keeping import for potential future use
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { AIWriteButton } from "./ai-assistant"

// ─── Types ───
interface SectionConfig {
  id: string
  label: string
  isVisible: boolean
  order: number
  content: Record<string, string>
  seo?: { title?: string; description?: string; keywords?: string }
}

interface PageCanvasProps {
  page: string
  sections: SectionConfig[]
  schema: Record<string, { label: string; fields: { key: string; label: string; type: string }[] }>
}

// ─── Sortable Section Item ───
function SortableSectionItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  }
  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-center gap-1">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted" aria-label="Drag">
          <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        {children}
      </div>
    </div>
  )
}

// ─── Main Canvas Component ───
export function PageCanvas({ page, sections: initialSections, schema }: PageCanvasProps) {
  const [sections, setSections] = useState<SectionConfig[]>(initialSections)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [panelTab, setPanelTab] = useState<"content" | "seo" | "style">("content")
  const [previewKey, setPreviewKey] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const viewportWidths = { desktop: "100%", tablet: "768px", mobile: "375px" }

  // ─── Section management ───
  const updateSectionContent = useCallback((sectionId: string, key: string, value: string) => {
    setSections((prev) =>
      prev.map((s) => s.id === sectionId ? { ...s, content: { ...s.content, [key]: value } } : s)
    )
  }, [])

  const updateSectionSeo = useCallback((sectionId: string, field: string, value: string) => {
    setSections((prev) =>
      prev.map((s) => s.id === sectionId ? { ...s, seo: { ...s.seo, [field]: value } } : s)
    )
  }, [])

  const toggleVisibility = useCallback((sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s)
    )
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setSections((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id)
      const newIndex = prev.findIndex((s) => s.id === over.id)
      return arrayMove(prev, oldIndex, newIndex).map((s, i) => ({ ...s, order: i }))
    })
  }, [])

  // ─── Save all changes ───
  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      // Save content for each section
      for (const section of sections) {
        if (Object.keys(section.content).length > 0) {
          await fetch("/api/admin/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              page,
              section: section.id,
              content: section.content,
            }),
          })
        }
      }

      // Save visibility & order
      await fetch("/api/admin/visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: sections.map((s) => ({
            page,
            section: s.id,
            is_visible: s.isVisible,
            display_order: s.order,
          })),
        }),
      })

      // Save SEO data
      const seoData = sections.filter((s) => s.seo && (s.seo.title || s.seo.description || s.seo.keywords))
      if (seoData.length > 0) {
        await fetch("/api/admin/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page,
            section: "_seo",
            content: Object.fromEntries(seoData.map((s) => [s.id, JSON.stringify(s.seo)])),
          }),
        })
      }

      setSaved(true)
      setPreviewKey((k) => k + 1)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error("Save failed:", err)
    } finally {
      setSaving(false)
    }
  }, [sections, page])

  const selected = sections.find((s) => s.id === selectedSection)
  const selectedSchema = selectedSection ? schema[selectedSection] : null

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* ─── Top Toolbar ─── */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Layout className="h-4 w-4 text-accent" />
            <span className="font-semibold text-sm">Page Canvas</span>
          </div>
          <Badge variant="secondary" className="text-[10px]">{page}</Badge>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          <Button variant={viewport === "desktop" ? "default" : "ghost"} size="sm" className="h-7 w-7 p-0" onClick={() => setViewport("desktop")}>
            <Monitor className="h-3.5 w-3.5" />
          </Button>
          <Button variant={viewport === "tablet" ? "default" : "ghost"} size="sm" className="h-7 w-7 p-0" onClick={() => setViewport("tablet")}>
            <Tablet className="h-3.5 w-3.5" />
          </Button>
          <Button variant={viewport === "mobile" ? "default" : "ghost"} size="sm" className="h-7 w-7 p-0" onClick={() => setViewport("mobile")}>
            <Smartphone className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPreviewKey((k) => k + 1)}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open("/", "_blank")}>
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            View Live
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving} className={saved ? "bg-green-600 hover:bg-green-600" : ""}>
            {saving ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5 mr-1" /> : <Save className="h-3.5 w-3.5 mr-1" />}
            {saving ? "Saving..." : saved ? "Saved!" : "Save All"}
          </Button>
        </div>
      </div>

      {/* ─── Main Area ─── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel — Section List */}
        <div className="w-64 border-r bg-muted/30 overflow-y-auto flex-shrink-0">
          <div className="p-3">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sections</span>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1">
                  {sections.map((section) => (
                    <SortableSectionItem key={section.id} id={section.id}>
                      <div
                        className={`flex-1 flex items-center justify-between rounded-md px-2 py-1.5 cursor-pointer transition-colors ${
                          selectedSection === section.id
                            ? "bg-accent/10 border border-accent/30"
                            : "hover:bg-muted border border-transparent"
                        }`}
                        onClick={() => setSelectedSection(section.id)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${section.isVisible ? "bg-green-500" : "bg-gray-300"}`} />
                          <span className="text-xs font-medium truncate">{section.label}</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleVisibility(section.id) }}
                          className="p-0.5 rounded hover:bg-muted-foreground/10"
                        >
                          {section.isVisible ? <Eye className="h-3 w-3 text-green-600" /> : <EyeOff className="h-3 w-3 text-gray-400" />}
                        </button>
                      </div>
                    </SortableSectionItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Center — Live Preview */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-auto flex justify-center p-4">
          <div
            style={{
              width: viewportWidths[viewport],
              maxWidth: "100%",
              transition: "width 0.3s ease",
            }}
            className="bg-white dark:bg-background rounded-lg shadow-xl overflow-hidden border"
          >
            <div className="bg-muted/50 px-3 py-1.5 border-b flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-background rounded px-2 py-0.5 text-[10px] text-muted-foreground font-mono">
                localhost:3000
              </div>
            </div>
            <iframe
              ref={iframeRef}
              key={previewKey}
              src={`/?preview=canvas&t=${Date.now()}`}
              className="w-full border-0"
              style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}
              title="Page Preview"
            />
          </div>
        </div>

        {/* Right Panel — Properties */}
        <div className="w-80 border-l bg-background overflow-y-auto flex-shrink-0">
          {selected && selectedSchema ? (
            <div>
              <div className="p-3 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">{selected.label}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Section ID: {selected.id}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedSection(null)}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <Tabs value={panelTab} onValueChange={(v) => setPanelTab(v as typeof panelTab)} className="w-full">
                <TabsList className="w-full rounded-none border-b h-9">
                  <TabsTrigger value="content" className="text-xs gap-1 flex-1">
                    <PenLine className="h-3 w-3" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="seo" className="text-xs gap-1 flex-1">
                    <Globe className="h-3 w-3" />
                    SEO
                  </TabsTrigger>
                  <TabsTrigger value="style" className="text-xs gap-1 flex-1">
                    <Palette className="h-3 w-3" />
                    Options
                  </TabsTrigger>
                </TabsList>

                {/* Content Tab */}
                <TabsContent value="content" className="p-3 space-y-3 mt-0">
                  {selectedSchema.fields.map((field) => (
                    <div key={field.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">{field.label}</Label>
                        <AIWriteButton
                          value={selected.content[field.key] || ""}
                          onApply={(t) => updateSectionContent(selected.id, field.key, t)}
                          context={`${field.label} for ${selected.label} section`}
                        />
                      </div>
                      {field.type === "textarea" || field.type === "list" ? (
                        <Textarea
                          value={selected.content[field.key] || ""}
                          onChange={(e) => updateSectionContent(selected.id, field.key, e.target.value)}
                          rows={field.type === "list" ? 4 : 3}
                          placeholder={field.type === "list" ? "One item per line" : `Enter ${field.label.toLowerCase()}...`}
                          className="text-xs"
                        />
                      ) : (
                        <Input
                          value={selected.content[field.key] || ""}
                          onChange={(e) => updateSectionContent(selected.id, field.key, e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                          className="text-xs h-8"
                        />
                      )}
                    </div>
                  ))}
                  {selectedSchema.fields.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      This section&apos;s content is managed via its dedicated admin page.
                    </p>
                  )}
                </TabsContent>

                {/* SEO Tab */}
                <TabsContent value="seo" className="p-3 space-y-3 mt-0">
                  <div className="space-y-1">
                    <Label className="text-xs">SEO Title Override</Label>
                    <Input
                      value={selected.seo?.title || ""}
                      onChange={(e) => updateSectionSeo(selected.id, "title", e.target.value)}
                      placeholder="Custom title for this section..."
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">SEO Description</Label>
                      <AIWriteButton
                        value={selected.seo?.description || ""}
                        onApply={(t) => updateSectionSeo(selected.id, "description", t)}
                        context={`SEO description for ${selected.label}`}
                      />
                    </div>
                    <Textarea
                      value={selected.seo?.description || ""}
                      onChange={(e) => updateSectionSeo(selected.id, "description", e.target.value)}
                      placeholder="Meta description for search engines..."
                      rows={3}
                      className="text-xs"
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {(selected.seo?.description || "").length}/160 characters
                    </span>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Keywords</Label>
                    <Input
                      value={selected.seo?.keywords || ""}
                      onChange={(e) => updateSectionSeo(selected.id, "keywords", e.target.value)}
                      placeholder="keyword1, keyword2, keyword3..."
                      className="text-xs h-8"
                    />
                  </div>
                </TabsContent>

                {/* Options Tab */}
                <TabsContent value="style" className="p-3 space-y-3 mt-0">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Visible on Page</Label>
                    <Switch
                      checked={selected.isVisible}
                      onCheckedChange={() => toggleVisibility(selected.id)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Display Order</Label>
                    <p className="text-[10px] text-muted-foreground">
                      Position {selected.order + 1} of {sections.length}. Drag sections in the left panel to reorder.
                    </p>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-[10px] text-muted-foreground">
                      For advanced content editing (adding projects, testimonials, blog posts, etc.), use the dedicated admin pages.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => window.open("/admin/settings", "_blank")}>Settings</Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => window.open("/admin/projects", "_blank")}>Projects</Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => window.open("/admin/blog", "_blank")}>Blog</Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => window.open("/admin/testimonials", "_blank")}>Testimonials</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Layout className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">Select a section</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Click on a section in the left panel to edit its content, SEO, and settings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
