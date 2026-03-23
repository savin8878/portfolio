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
  Type,
  Paintbrush,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
interface FieldDef {
  key: string
  label: string
  type: "text" | "textarea" | "list"
}

interface SectionConfig {
  id: string
  label: string
  isVisible: boolean
  order: number
  content: Record<string, string>
  styles?: Record<string, string>
}

interface PageCanvasProps {
  page: string
  sections: SectionConfig[]
  schema: Record<string, { label: string; fields: FieldDef[] }>
  pagePath: string
}

// ─── Sortable ───
function SortableSection({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 50 : "auto" }}>
      <div className="flex items-center gap-1">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted flex-shrink-0" aria-label="Drag">
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </button>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}

// ─── Inline Editor Overlay ───
function InlineEditor({
  section,
  schema,
  onUpdate,
  onUpdateStyle,
  onClose,
}: {
  section: SectionConfig
  schema: { label: string; fields: FieldDef[] }
  onUpdate: (key: string, value: string) => void
  onUpdateStyle: (key: string, value: string) => void
  onClose: () => void
}) {
  const [tab, setTab] = useState<"content" | "style" | "seo">("content")

  return (
    <div className="absolute inset-0 z-50 flex items-start justify-center pt-8 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-background rounded-xl shadow-2xl border max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <PenLine className="h-4 w-4 text-accent" />
            <span className="font-semibold text-sm">{section.label}</span>
            <Badge variant="secondary" className="text-[9px]">{section.id}</Badge>
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            {[
              { id: "content" as const, icon: PenLine, label: "Content" },
              { id: "style" as const, icon: Paintbrush, label: "Typography & Colors" },
              { id: "seo" as const, icon: Globe, label: "SEO" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  tab === t.id ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-3 w-3" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 space-y-4">
          {tab === "content" && (
            <>
              {schema.fields.length === 0 ? (
                <div className="text-center py-8">
                  <Layers className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">This section&apos;s data is managed via its dedicated admin page.</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Use Projects, Blog, Services, or Testimonials pages to edit items.</p>
                </div>
              ) : (
                schema.fields.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">{field.label}</Label>
                      <AIWriteButton
                        value={section.content[field.key] || ""}
                        onApply={(t) => onUpdate(field.key, t)}
                        context={`${field.label} for ${section.label}`}
                      />
                    </div>
                    {field.type === "textarea" || field.type === "list" ? (
                      <Textarea
                        value={section.content[field.key] || ""}
                        onChange={(e) => onUpdate(field.key, e.target.value)}
                        rows={field.type === "list" ? 5 : 3}
                        placeholder={field.type === "list" ? "One item per line" : `Enter ${field.label.toLowerCase()}...`}
                        className="text-sm"
                      />
                    ) : (
                      <Input
                        value={section.content[field.key] || ""}
                        onChange={(e) => onUpdate(field.key, e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                        className="text-sm"
                      />
                    )}
                  </div>
                ))
              )}
            </>
          )}

          {tab === "style" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Heading Font Size</Label>
                  <Select
                    value={section.styles?.headingSize || "default"}
                    onValueChange={(v) => onUpdateStyle("headingSize", v)}
                  >
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                      <SelectItem value="2xl">2X Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Body Font Size</Label>
                  <Select
                    value={section.styles?.bodySize || "default"}
                    onValueChange={(v) => onUpdateStyle("bodySize", v)}
                  >
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="sm">Small (14px)</SelectItem>
                      <SelectItem value="base">Base (16px)</SelectItem>
                      <SelectItem value="lg">Large (18px)</SelectItem>
                      <SelectItem value="xl">Extra Large (20px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Heading Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={section.styles?.headingColor || "#ffffff"}
                      onChange={(e) => onUpdateStyle("headingColor", e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                    />
                    <Input
                      value={section.styles?.headingColor || ""}
                      onChange={(e) => onUpdateStyle("headingColor", e.target.value)}
                      placeholder="#ffffff"
                      className="text-sm h-8 font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Text Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={section.styles?.textColor || "#9ca3af"}
                      onChange={(e) => onUpdateStyle("textColor", e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                    />
                    <Input
                      value={section.styles?.textColor || ""}
                      onChange={(e) => onUpdateStyle("textColor", e.target.value)}
                      placeholder="#9ca3af"
                      className="text-sm h-8 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Background Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={section.styles?.bgColor || "#000000"}
                      onChange={(e) => onUpdateStyle("bgColor", e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                    />
                    <Input
                      value={section.styles?.bgColor || ""}
                      onChange={(e) => onUpdateStyle("bgColor", e.target.value)}
                      placeholder="transparent"
                      className="text-sm h-8 font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Accent Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={section.styles?.accentColor || "#6366f1"}
                      onChange={(e) => onUpdateStyle("accentColor", e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                    />
                    <Input
                      value={section.styles?.accentColor || ""}
                      onChange={(e) => onUpdateStyle("accentColor", e.target.value)}
                      placeholder="#6366f1"
                      className="text-sm h-8 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Section Padding</Label>
                <Select
                  value={section.styles?.padding || "default"}
                  onValueChange={(v) => onUpdateStyle("padding", v)}
                >
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="xl">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Font Family</Label>
                <Select
                  value={section.styles?.fontFamily || "default"}
                  onValueChange={(v) => onUpdateStyle("fontFamily", v)}
                >
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default (Inter)</SelectItem>
                    <SelectItem value="serif">Serif (Georgia)</SelectItem>
                    <SelectItem value="mono">Monospace (JetBrains Mono)</SelectItem>
                    <SelectItem value="system">System UI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {tab === "seo" && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">SEO Title</Label>
                <Input
                  value={section.content["_seo_title"] || ""}
                  onChange={(e) => onUpdate("_seo_title", e.target.value)}
                  placeholder="Custom page title..."
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Meta Description</Label>
                  <AIWriteButton
                    value={section.content["_seo_description"] || ""}
                    onApply={(t) => onUpdate("_seo_description", t)}
                    context={`SEO meta description for ${section.label}`}
                  />
                </div>
                <Textarea
                  value={section.content["_seo_description"] || ""}
                  onChange={(e) => onUpdate("_seo_description", e.target.value)}
                  placeholder="Meta description for search engines..."
                  rows={3}
                  className="text-sm"
                />
                <p className="text-[10px] text-muted-foreground">{(section.content["_seo_description"] || "").length}/160 characters</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Keywords</Label>
                <Input
                  value={section.content["_seo_keywords"] || ""}
                  onChange={(e) => onUpdate("_seo_keywords", e.target.value)}
                  placeholder="keyword1, keyword2, keyword3..."
                  className="text-sm"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Canvas Component ───
export function PageCanvas({ page, sections: initialSections, schema, pagePath }: PageCanvasProps) {
  const [sections, setSections] = useState<SectionConfig[]>(initialSections)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const [sectionListOpen, setSectionListOpen] = useState(true)
  const [showTheme, setShowTheme] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const viewportWidths = { desktop: "100%", tablet: "768px", mobile: "375px" }

  const updateContent = useCallback((sectionId: string, key: string, value: string) => {
    setSections((prev) => prev.map((s) => s.id === sectionId ? { ...s, content: { ...s.content, [key]: value } } : s))
  }, [])

  const updateStyle = useCallback((sectionId: string, key: string, value: string) => {
    setSections((prev) => prev.map((s) => s.id === sectionId ? { ...s, styles: { ...s.styles, [key]: value } } : s))
  }, [])

  const toggleVisibility = useCallback((sectionId: string) => {
    setSections((prev) => prev.map((s) => s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s))
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setSections((prev) => {
      const oldIdx = prev.findIndex((s) => s.id === active.id)
      const newIdx = prev.findIndex((s) => s.id === over.id)
      return arrayMove(prev, oldIdx, newIdx).map((s, i) => ({ ...s, order: i }))
    })
  }, [])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      // Save content
      for (const section of sections) {
        if (Object.keys(section.content).length > 0) {
          await fetch("/api/admin/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page, section: section.id, content: section.content }),
          })
        }
        // Save styles
        if (section.styles && Object.keys(section.styles).length > 0) {
          await fetch("/api/admin/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page, section: `${section.id}_styles`, content: section.styles }),
          })
        }
      }
      // Save visibility + order
      await fetch("/api/admin/visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: sections.map((s) => ({ page, section: s.id, is_visible: s.isVisible, display_order: s.order })),
        }),
      })
      setSaved(true)
      setPreviewKey((k) => k + 1)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error("Save failed:", err)
    } finally {
      setSaving(false)
    }
  }, [sections, page])

  const editingData = editingSection ? sections.find((s) => s.id === editingSection) : null
  const editingSchema = editingSection ? schema[editingSection] : null

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* ─── Toolbar ─── */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-background flex-shrink-0">
        <div className="flex items-center gap-3">
          <Layout className="h-4 w-4 text-accent" />
          <span className="font-semibold text-sm">Page Builder</span>
          <Badge variant="outline" className="text-[10px] capitalize">{page}</Badge>
        </div>

        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {([["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone]] as const).map(([v, Icon]) => (
            <Button key={v} variant={viewport === v ? "default" : "ghost"} size="sm" className="h-7 w-7 p-0" onClick={() => setViewport(v)}>
              <Icon className="h-3.5 w-3.5" />
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8" onClick={() => setPreviewKey((k) => k + 1)}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="h-8" onClick={() => setShowTheme(true)}>
            <Palette className="h-3.5 w-3.5 mr-1" /> Theme
          </Button>
          <Button variant="outline" size="sm" className="h-8" onClick={() => window.open(pagePath, "_blank")}>
            <ExternalLink className="h-3.5 w-3.5 mr-1" /> View Live
          </Button>
          <Button size="sm" className={`h-8 ${saved ? "bg-green-600 hover:bg-green-600" : ""}`} onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5 mr-1" /> : <Save className="h-3.5 w-3.5 mr-1" />}
            {saving ? "Saving..." : saved ? "Saved!" : "Save All"}
          </Button>
        </div>
      </div>

      {/* ─── Canvas ─── */}
      <div className="flex-1 overflow-hidden relative">
        {/* Section floating panel */}
        <div className={`absolute top-3 left-3 z-40 bg-background/95 backdrop-blur rounded-xl border shadow-lg transition-all ${sectionListOpen ? "w-56" : "w-auto"}`}>
          <button
            onClick={() => setSectionListOpen(!sectionListOpen)}
            className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-muted/50 rounded-t-xl"
          >
            <Layers className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-semibold flex-1">Sections ({sections.filter((s) => s.isVisible).length}/{sections.length})</span>
            {sectionListOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          {sectionListOpen && (
            <div className="px-2 pb-2 max-h-[60vh] overflow-y-auto">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-0.5">
                    {sections.map((section) => (
                      <SortableSection key={section.id} id={section.id}>
                        <div
                          className={`flex items-center justify-between rounded px-2 py-1.5 cursor-pointer text-xs transition-colors ${
                            editingSection === section.id ? "bg-accent/10 text-accent" : "hover:bg-muted"
                          }`}
                          onClick={() => setEditingSection(section.id)}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${section.isVisible ? "bg-green-500" : "bg-gray-300"}`} />
                            <span className="truncate font-medium">{section.label}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); toggleVisibility(section.id) }} className="p-0.5 rounded hover:bg-muted-foreground/10 flex-shrink-0">
                            {section.isVisible ? <Eye className="h-3 w-3 text-green-600" /> : <EyeOff className="h-3 w-3 text-gray-400" />}
                          </button>
                        </div>
                      </SortableSection>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>

        {/* Preview iframe */}
        <div className="h-full flex justify-center bg-gray-100 dark:bg-gray-900 overflow-auto p-4">
          <div style={{ width: viewportWidths[viewport], maxWidth: "100%", transition: "width 0.3s ease" }} className="bg-white dark:bg-background rounded-lg shadow-xl overflow-hidden border">
            <div className="bg-muted/50 px-3 py-1.5 border-b flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-background rounded px-2 py-0.5 text-[10px] text-muted-foreground font-mono">
                {pagePath === "/" ? "localhost:3000" : `localhost:3000${pagePath}`}
              </div>
            </div>
            <iframe
              key={previewKey}
              src={`${pagePath}?t=${Date.now()}`}
              className="w-full border-0"
              style={{ height: "calc(100vh - 160px)", minHeight: "600px" }}
              title="Page Preview"
            />
          </div>
        </div>

        {/* Inline editor overlay */}
        {editingData && editingSchema && (
          <InlineEditor
            section={editingData}
            schema={editingSchema}
            onUpdate={(key, value) => updateContent(editingData.id, key, value)}
            onUpdateStyle={(key, value) => updateStyle(editingData.id, key, value)}
            onClose={() => setEditingSection(null)}
          />
        )}

        {/* Theme overlay */}
        {showTheme && (
          <div className="absolute inset-0 z-50 flex items-start justify-center pt-8 bg-black/40 backdrop-blur-sm" onClick={() => setShowTheme(false)}>
            <div className="w-full max-w-lg bg-background rounded-xl shadow-2xl border overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-accent" />
                  <span className="font-semibold text-sm">Theme Presets</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowTheme(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-xs text-muted-foreground">Select a theme preset. Colors update across all pages.</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "default", name: "Default Dark", primary: "#6366f1", bg: "#09090b" },
                    { id: "ocean", name: "Ocean Blue", primary: "#0ea5e9", bg: "#0c1222" },
                    { id: "emerald", name: "Emerald", primary: "#10b981", bg: "#022c22" },
                    { id: "rose", name: "Rose", primary: "#f43f5e", bg: "#1a0a0e" },
                    { id: "amber", name: "Amber Warm", primary: "#f59e0b", bg: "#1c1108" },
                    { id: "violet", name: "Violet", primary: "#8b5cf6", bg: "#0f0720" },
                    { id: "minimal", name: "Minimal Light", primary: "#18181b", bg: "#ffffff" },
                    { id: "slate", name: "Corporate Slate", primary: "#475569", bg: "#0f172a" },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      className="flex items-center gap-3 p-3 rounded-lg border-2 border-border/50 hover:border-accent/50 transition-all text-left"
                      onClick={async () => {
                        try {
                          await fetch("/api/admin/content", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ page: "_global", section: "theme", content: { preset: theme.id, primary: theme.primary, bg: theme.bg } }),
                          })
                          setPreviewKey((k) => k + 1)
                          setShowTheme(false)
                        } catch {}
                      }}
                    >
                      <div className="flex gap-1 flex-shrink-0">
                        <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: theme.primary }} />
                        <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: theme.bg }} />
                      </div>
                      <span className="text-xs font-medium">{theme.name}</span>
                    </button>
                  ))}
                </div>
                <div className="pt-3 border-t">
                  <p className="text-[10px] text-muted-foreground">For full theme customization (fonts, border radius, dark mode), use the <a href="/admin/theme" className="text-accent underline">Theme Settings</a> page.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
