"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
import {
  Eye,
  Palette,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  FolderKanban,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Sparkles,
  FileText,
  Settings2,
  LayoutTemplate,
  Minus,
  FileDown,
  FileType,
  Loader2,
  Save,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ResumePreview } from "@/components/admin/resume-preview"
import { ResumePdfPreview } from "@/components/admin/resume-pdf-preview"
import { downloadPDF, downloadDOCX } from "@/lib/resume-export"
import { AISettingsPanel, AITailorPanel } from "@/components/admin/resume-ai-panel"
import { AIWriteButton, AIAchievementsButton } from "@/components/admin/ai-assistant"
import { ResumeImportPanel } from "@/components/admin/resume-import-panel"

// Types
export interface ResumeProfile {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
  github: string
  summary: string
  profileImage: string | null
}

export interface ResumeExperience {
  id: string
  enabled: boolean
  company: string
  title: string
  location: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description: string
  achievements: string[]
}

export interface ResumeEducation {
  id: string
  enabled: boolean
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description: string
  achievements: string[]
}

export interface ResumeCertification {
  id: string
  enabled: boolean
  name: string
  issuer: string
  date: string
  credentialId: string
  url: string
}

export interface ResumeSkillCategory {
  id: string
  name: string
  skills: string[]
}

export interface ResumeProject {
  id: string
  enabled: boolean
  title: string
  role: string
  description: string
  achievements: string[]
  techStack: string[]
  url: string
  repoUrl: string
  startDate: string
  endDate: string
  isCurrent: boolean
}

export interface ResumeCustomSection {
  id: string
  title: string
  items: { id: string; content: string }[]
}

export interface ResumeConfig {
  profile: ResumeProfile
  experiences: ResumeExperience[]
  education: ResumeEducation[]
  certifications: ResumeCertification[]
  skillCategories: ResumeSkillCategory[]
  projects: ResumeProject[]
  customSections: ResumeCustomSection[]
  template: string
  accentColor: string
  fontSize: string
  sectionOrder: string[]
  showProfileImage: boolean
  sidebarWidth: number
  pagePadding: number
}

function generateId() {
  return Math.random().toString(36).substring(2, 11)
}

function formatDate(dateStr: string | Date | null): string {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ""
  return d.toISOString().split("T")[0]
}

function groupSkillsByCategory(
  techStack: Array<{ name: string; category: string }>
): ResumeSkillCategory[] {
  const groups: Record<string, string[]> = {}
  for (const item of techStack) {
    const cat = item.category || "Other"
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(item.name)
  }
  return Object.entries(groups).map(([name, skills]) => ({
    id: generateId(),
    name,
    skills,
  }))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildInitialConfig(data: any): ResumeConfig {
  const s = data.settings || {}
  const socialLinks = data.socialLinks || []

  const findSocialUrl = (platform: string) => {
    const link = socialLinks.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (l: any) => l.platform?.toLowerCase() === platform.toLowerCase()
    )
    return link?.url || s[`${platform}_url`] || ""
  }

  return {
    profile: {
      fullName: s.developer_name || "",
      title: s.professional_title || "",
      email: s.email || "",
      phone: s.phone || "",
      location: s.location || "",
      website: s.site_name ? `${s.site_name}` : "",
      linkedin: findSocialUrl("linkedin"),
      github: findSocialUrl("github"),
      summary: s.site_description || "",
      profileImage: s.profile_image || null,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    experiences: (data.experiences || []).map((e: any) => ({
      id: String(e.id),
      enabled: true,
      company: e.company_name || "",
      title: e.job_title || "",
      location: e.location || "",
      startDate: formatDate(e.start_date),
      endDate: e.is_current ? "" : formatDate(e.end_date),
      isCurrent: e.is_current || false,
      description: e.description || "",
      achievements: e.achievements || [],
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    education: (data.education || []).map((e: any) => ({
      id: String(e.id),
      enabled: true,
      institution: e.institution || "",
      degree: e.degree || "",
      field: e.field_of_study || "",
      startDate: formatDate(e.start_date),
      endDate: formatDate(e.end_date),
      description: e.description || "",
      achievements: e.achievements || [],
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    certifications: (data.certifications || []).map((c: any) => ({
      id: String(c.id),
      enabled: true,
      name: c.name || "",
      issuer: c.issuer || "",
      date: formatDate(c.issue_date),
      credentialId: c.credential_id || "",
      url: c.credential_url || "",
    })),
    skillCategories: groupSkillsByCategory(data.techStack || []),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    projects: [
      {
        id: "portfolio-cms-project",
        enabled: true,
        title: "Full-Stack Portfolio CMS & AI-Powered Resume Builder",
        role: "Full-Stack Developer",
        description:
          "Built a full-stack portfolio CMS platform using Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4, with Neon serverless PostgreSQL, featuring 12+ admin modules for dynamic content management.",
        achievements: [
          "Engineered an AI-powered resume builder with 40+ premium templates across 10 categories, supporting real-time live preview, 30+ color schemes, and 5 layout types",
          "Implemented server-side PDF generation using Puppeteer with A4-optimized rendering, intelligent multi-page breaks, and DOCX export producing ATS-friendly, WCAG 2.1 AA compliant output",
          "Built a drag-and-drop page builder with dnd-kit, custom block editing, and 10+ animated landing sections powered by Framer Motion and Lenis smooth scrolling",
          "Integrated AI-assisted features for resume content parsing, job description tailoring, and content suggestions via 15+ RESTful API endpoints",
          "Developed a runtime theme engine with dynamic color/font/dark-mode configuration, Recharts analytics dashboard, and 25+ Radix UI components ensuring responsive, accessible experience",
          "Created blog management, project showcase, service listings, testimonials, contact form with bulk operations, media library, and site-wide theme/visibility settings",
        ],
        techStack: [
          "Next.js 16",
          "React 19",
          "TypeScript",
          "Tailwind CSS 4",
          "Neon PostgreSQL",
          "Puppeteer",
          "Framer Motion",
          "dnd-kit",
          "Radix UI",
          "Recharts",
          "Zod",
          "React Hook Form",
        ],
        url: "",
        repoUrl: "",
        startDate: "",
        endDate: "",
        isCurrent: true,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(data.projects || []).map((p: any) => ({
        id: String(p.id),
        enabled: true,
        title: p.title || "",
        role: p.role || "",
        description: p.short_description || p.description || "",
        achievements: p.achievements || [],
        techStack: p.tech_stack || [],
        url: p.live_url || "",
        repoUrl: p.github_url || "",
        startDate: formatDate(p.start_date),
        endDate: formatDate(p.end_date),
        isCurrent: p.is_current || false,
      })),
    ],
    customSections: [],
    template: "classic",
    accentColor: "#2563eb",
    fontSize: "medium",
    sectionOrder: [
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "custom",
    ],
    showProfileImage: false,
    sidebarWidth: 220,
    pagePadding: 32,
  }
}

// ─── Sortable Item (whole item is draggable) ───
function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 50 : "auto",
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

// ─── Sortable Item with drag handle (only handle triggers drag) ───
function SortableHandleItem({ id, children }: { id: string; children: (handleProps: Record<string, unknown>) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 50 : "auto",
  }
  return (
    <div ref={setNodeRef} style={style}>
      {children({ ...attributes, ...listeners })}
    </div>
  )
}

// Collapsible Section Wrapper
function CollapsibleSection({
  title,
  icon: Icon,
  children,
  count,
  defaultOpen = true,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  count?: number
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Card className="border-border/50">
      <CardHeader
        className="cursor-pointer select-none py-3 px-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-accent" />
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            {count !== undefined && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {count}
              </Badge>
            )}
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      {isOpen && <CardContent className="px-4 pb-4 pt-0">{children}</CardContent>}
    </Card>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ResumeBuilder({ data }: { data: any }) {
  const [config, setConfig] = useState<ResumeConfig>(() =>
    buildInitialConfig(data)
  )
  const [activeTab, setActiveTab] = useState("edit")
  const previewRef = useRef<HTMLDivElement>(null)
  const pdfRenderRef = useRef<HTMLDivElement>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [configId, setConfigId] = useState<number | null>(null)

  // Load saved config from DB on mount
  useEffect(() => {
    async function loadSavedConfig() {
      try {
        const res = await fetch("/api/admin/resume/config")
        const data = await res.json()
        if (data.config) {
          setConfig((prev) => ({
            ...prev,
            ...data.config,
            // Ensure new fields have defaults
            sidebarWidth: data.config.sidebarWidth ?? prev.sidebarWidth,
            pagePadding: data.config.pagePadding ?? prev.pagePadding,
          }))
          setConfigId(data.id)
        }
      } catch {
        // No saved config, use defaults from data
      }
    }
    loadSavedConfig()
  }, [])

  // Save config to DB
  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/resume/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: configId,
          name: `${config.profile.fullName || "Default"} Resume`,
          config,
          isDefault: true,
        }),
      })
      const result = await res.json()
      if (result.id) setConfigId(result.id)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error("Save failed:", err)
    } finally {
      setSaving(false)
    }
  }, [config, configId])

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const updateProfile = useCallback(
    (field: keyof ResumeProfile, value: string | null) => {
      setConfig((prev) => ({
        ...prev,
        profile: { ...prev.profile, [field]: value },
      }))
    },
    []
  )

  const updateExperience = useCallback(
    (
      id: string,
      field: keyof ResumeExperience,
      value: string | boolean | string[]
    ) => {
      setConfig((prev) => ({
        ...prev,
        experiences: prev.experiences.map((e) =>
          e.id === id ? { ...e, [field]: value } : e
        ),
      }))
    },
    []
  )

  const addExperience = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: generateId(),
          enabled: true,
          company: "",
          title: "",
          location: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          description: "",
          achievements: [],
        },
      ],
    }))
  }, [])

  const removeExperience = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }))
  }, [])

  const updateEducation = useCallback(
    (
      id: string,
      field: keyof ResumeEducation,
      value: string | boolean | string[]
    ) => {
      setConfig((prev) => ({
        ...prev,
        education: prev.education.map((e) =>
          e.id === id ? { ...e, [field]: value } : e
        ),
      }))
    },
    []
  )

  const addEducation = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: generateId(),
          enabled: true,
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          description: "",
          achievements: [],
        },
      ],
    }))
  }, [])

  const removeEducation = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }))
  }, [])

  const updateCertification = useCallback(
    (id: string, field: keyof ResumeCertification, value: string | boolean) => {
      setConfig((prev) => ({
        ...prev,
        certifications: prev.certifications.map((c) =>
          c.id === id ? { ...c, [field]: value } : c
        ),
      }))
    },
    []
  )

  const addCertification = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          id: generateId(),
          enabled: true,
          name: "",
          issuer: "",
          date: "",
          credentialId: "",
          url: "",
        },
      ],
    }))
  }, [])

  const removeCertification = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }))
  }, [])

  const updateSkillCategory = useCallback(
    (id: string, field: "name" | "skills", value: string | string[]) => {
      setConfig((prev) => ({
        ...prev,
        skillCategories: prev.skillCategories.map((s) =>
          s.id === id ? { ...s, [field]: value } : s
        ),
      }))
    },
    []
  )

  const addSkillCategory = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      skillCategories: [
        ...prev.skillCategories,
        { id: generateId(), name: "", skills: [] },
      ],
    }))
  }, [])

  const removeSkillCategory = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.filter((s) => s.id !== id),
    }))
  }, [])

  const updateProject = useCallback(
    (
      id: string,
      field: keyof ResumeProject,
      value: string | boolean | string[]
    ) => {
      setConfig((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === id ? { ...p, [field]: value } : p
        ),
      }))
    },
    []
  )

  const addProject = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: generateId(),
          enabled: true,
          title: "",
          role: "",
          description: "",
          achievements: [],
          techStack: [],
          url: "",
          repoUrl: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
        },
      ],
    }))
  }, [])

  const removeProject = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }))
  }, [])

  const addCustomSection = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      customSections: [
        ...prev.customSections,
        { id: generateId(), title: "Custom Section", items: [] },
      ],
    }))
  }, [])

  const removeCustomSection = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((s) => s.id !== id),
    }))
  }, [])

  const updateCustomSection = useCallback(
    (id: string, title: string) => {
      setConfig((prev) => ({
        ...prev,
        customSections: prev.customSections.map((s) =>
          s.id === id ? { ...s, title } : s
        ),
      }))
    },
    []
  )

  const addCustomItem = useCallback((sectionId: string) => {
    setConfig((prev) => ({
      ...prev,
      customSections: prev.customSections.map((s) =>
        s.id === sectionId
          ? { ...s, items: [...s.items, { id: generateId(), content: "" }] }
          : s
      ),
    }))
  }, [])

  const updateCustomItem = useCallback(
    (sectionId: string, itemId: string, content: string) => {
      setConfig((prev) => ({
        ...prev,
        customSections: prev.customSections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                items: s.items.map((i) =>
                  i.id === itemId ? { ...i, content } : i
                ),
              }
            : s
        ),
      }))
    },
    []
  )

  const removeCustomItem = useCallback((sectionId: string, itemId: string) => {
    setConfig((prev) => ({
      ...prev,
      customSections: prev.customSections.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.filter((i) => i.id !== itemId) }
          : s
      ),
    }))
  }, [])

  // ─── Drag-and-drop handlers ───
  const handleSectionDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setConfig((prev) => {
      const oldIndex = prev.sectionOrder.indexOf(String(active.id))
      const newIndex = prev.sectionOrder.indexOf(String(over.id))
      if (oldIndex === -1 || newIndex === -1) return prev
      return { ...prev, sectionOrder: arrayMove(prev.sectionOrder, oldIndex, newIndex) }
    })
  }, [])

  const handleExpDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setConfig((prev) => {
      const oldIndex = prev.experiences.findIndex((e) => e.id === active.id)
      const newIndex = prev.experiences.findIndex((e) => e.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev
      return { ...prev, experiences: arrayMove(prev.experiences, oldIndex, newIndex) }
    })
  }, [])

  const handleEduDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setConfig((prev) => {
      const oldIndex = prev.education.findIndex((e) => e.id === active.id)
      const newIndex = prev.education.findIndex((e) => e.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev
      return { ...prev, education: arrayMove(prev.education, oldIndex, newIndex) }
    })
  }, [])

  const handleProjDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setConfig((prev) => {
      const oldIndex = prev.projects.findIndex((p) => p.id === active.id)
      const newIndex = prev.projects.findIndex((p) => p.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev
      return { ...prev, projects: arrayMove(prev.projects, oldIndex, newIndex) }
    })
  }, [])

  const handleCertDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setConfig((prev) => {
      const oldIndex = prev.certifications.findIndex((c) => c.id === active.id)
      const newIndex = prev.certifications.findIndex((c) => c.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev
      return { ...prev, certifications: arrayMove(prev.certifications, oldIndex, newIndex) }
    })
  }, [])

  const [exporting, setExporting] = useState<"pdf" | "docx" | null>(null)
  const [showPdfPreview, setShowPdfPreview] = useState(false)

  const handleDownloadPDF = useCallback(async () => {
    if (exporting) return
    setExporting("pdf")
    try {
      const el = pdfRenderRef.current || document.createElement("div")
      await downloadPDF(el, `${config.profile.fullName || "Resume"} - Resume`, config)
    } catch (err) {
      console.error("PDF export failed:", err)
    } finally {
      setExporting(null)
    }
  }, [config.profile.fullName, exporting])

  const handleDownloadDOCX = useCallback(async () => {
    if (exporting) return
    setExporting("docx")
    try {
      await downloadDOCX(config, `${config.profile.fullName || "Resume"} - Resume`)
    } catch (err) {
      console.error("DOCX export failed:", err)
    } finally {
      setExporting(null)
    }
  }, [config, exporting])

  // AI tailor handler — applies AI-generated changes to config
  const handleAIApply = useCallback((updates: Partial<{
    summary: string
    experiences: Array<{ id: string; description: string; achievements: string[] }>
    skillCategories: Array<{ name: string; skills: string[] }>
  }>) => {
    setConfig((prev) => {
      const next = { ...prev }

      if (updates.summary) {
        next.profile = { ...next.profile, summary: updates.summary }
      }

      if (updates.experiences) {
        next.experiences = next.experiences.map((exp) => {
          const update = updates.experiences!.find((u) => u.id === exp.id)
          if (update) {
            return {
              ...exp,
              description: update.description ?? exp.description,
              achievements: update.achievements ?? exp.achievements,
            }
          }
          return exp
        })
      }

      if (updates.skillCategories) {
        next.skillCategories = updates.skillCategories.map((cat) => ({
          id: generateId(),
          name: cat.name,
          skills: cat.skills,
        }))
      }

      return next
    })
  }, [])

  // Import handler — replaces entire sections with AI-parsed data
  const handleImport = useCallback((data: Partial<ResumeConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...(data.profile && { profile: data.profile }),
      ...(data.experiences && { experiences: data.experiences }),
      ...(data.education && { education: data.education }),
      ...(data.certifications && { certifications: data.certifications }),
      ...(data.skillCategories && { skillCategories: data.skillCategories }),
      ...(data.projects && { projects: data.projects }),
      ...(data.customSections && { customSections: data.customSections }),
    }))
  }, [])

  const sectionLabels: Record<string, string> = {
    summary: "Professional Summary",
    experience: "Work Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certifications: "Certifications",
    custom: "Custom Sections",
  }

  const sectionIcons: Record<string, React.ElementType> = {
    summary: User,
    experience: Briefcase,
    education: GraduationCap,
    skills: Code,
    projects: FolderKanban,
    certifications: Award,
    custom: Sparkles,
  }

  const isSidebarTemplate = ["modern", "healthcare", "elegant", "slate"].includes(config.template)

  return (
    <div className="flex flex-col gap-6">
      {/* Top Toolbar */}
      <Card className="border-border/50">
        <CardContent className="py-3 px-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              <span className="font-semibold text-foreground">
                {config.profile.fullName || "Untitled"} &mdash; Resume
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setActiveTab(activeTab === "edit" ? "preview" : "edit")
                }
              >
                <Eye className="h-4 w-4 mr-1" />
                {activeTab === "edit" ? "Preview" : "Edit"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowPdfPreview(true)}>
                <Eye className="h-4 w-4 mr-1" />
                PDF Preview
              </Button>
              <Button size="sm" onClick={handleDownloadPDF} disabled={exporting !== null}>
                {exporting === "pdf" ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <FileDown className="h-4 w-4 mr-1" />}
                {exporting === "pdf" ? "Generating..." : "Download PDF"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownloadDOCX} disabled={exporting !== null}>
                {exporting === "docx" ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <FileType className="h-4 w-4 mr-1" />}
                {exporting === "docx" ? "Generating..." : "Download DOCX"}
              </Button>
              <Button size="sm" variant={saved ? "default" : "outline"} onClick={handleSave} disabled={saving} className={saved ? "bg-green-600 hover:bg-green-600" : ""}>
                {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : saved ? <Check className="h-4 w-4 mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                {saving ? "Saving..." : saved ? "Saved!" : "Save"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="edit" className="gap-1.5">
            <Settings2 className="h-3.5 w-3.5" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            Live Preview
          </TabsTrigger>
          <TabsTrigger value="design" className="gap-1.5">
            <Palette className="h-3.5 w-3.5" />
            Design
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            AI Tailor
          </TabsTrigger>
          <TabsTrigger value="import" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Import
          </TabsTrigger>
        </TabsList>

        {/* ─── EDITOR TAB ─── */}
        <TabsContent value="edit">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left: Form Controls */}
            <div className="space-y-4">
              {/* Profile Section */}
              <CollapsibleSection title="Personal Information" icon={User}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Label className="text-xs">Full Name</Label>
                      <Input
                        value={config.profile.fullName}
                        onChange={(e) =>
                          updateProfile("fullName", e.target.value)
                        }
                        placeholder="John Doe"
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Professional Title</Label>
                      <Input
                        value={config.profile.title}
                        onChange={(e) => updateProfile("title", e.target.value)}
                        placeholder="Full-Stack Developer"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs flex items-center gap-1">
                        <Mail className="h-3 w-3" /> Email
                      </Label>
                      <Input
                        value={config.profile.email}
                        onChange={(e) => updateProfile("email", e.target.value)}
                        placeholder="john@example.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs flex items-center gap-1">
                        <Phone className="h-3 w-3" /> Phone
                      </Label>
                      <Input
                        value={config.profile.phone}
                        onChange={(e) => updateProfile("phone", e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Location
                      </Label>
                      <Input
                        value={config.profile.location}
                        onChange={(e) =>
                          updateProfile("location", e.target.value)
                        }
                        placeholder="San Francisco, CA"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs flex items-center gap-1">
                        <Globe className="h-3 w-3" /> Website
                      </Label>
                      <Input
                        value={config.profile.website}
                        onChange={(e) =>
                          updateProfile("website", e.target.value)
                        }
                        placeholder="yoursite.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs flex items-center gap-1">
                        <Linkedin className="h-3 w-3" /> LinkedIn
                      </Label>
                      <Input
                        value={config.profile.linkedin}
                        onChange={(e) =>
                          updateProfile("linkedin", e.target.value)
                        }
                        placeholder="linkedin.com/in/..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs flex items-center gap-1">
                        <Github className="h-3 w-3" /> GitHub
                      </Label>
                      <Input
                        value={config.profile.github}
                        onChange={(e) =>
                          updateProfile("github", e.target.value)
                        }
                        placeholder="github.com/..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Professional Summary</Label>
                      <AIWriteButton
                        value={config.profile.summary}
                        onApply={(text) => updateProfile("summary", text)}
                        context="professional summary for resume/portfolio"
                      />
                    </div>
                    <Textarea
                      value={config.profile.summary}
                      onChange={(e) => updateProfile("summary", e.target.value)}
                      placeholder="A brief professional summary..."
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Experience Section - Drag & Drop */}
              <CollapsibleSection
                title="Work Experience"
                icon={Briefcase}
                count={config.experiences.filter((e) => e.enabled).length}
              >
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleExpDragEnd}>
                  <SortableContext items={config.experiences.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {config.experiences.map((exp, idx) => (
                        <SortableHandleItem key={exp.id} id={exp.id}>
                          {(dragHandleProps: Record<string, unknown>) => (
                            <div className="border border-border/50 rounded-lg p-3 space-y-3 bg-muted/30">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <button {...dragHandleProps} className="cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-muted" aria-label="Drag to reorder">
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                  <span className="text-xs font-medium text-muted-foreground">#{idx + 1}</span>
                                  <span className="text-sm font-medium truncate max-w-[200px]">{exp.title || exp.company || "Untitled"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch checked={exp.enabled} onCheckedChange={(v) => updateExperience(exp.id, "enabled", v)} />
                                  <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)} className="h-7 w-7 p-0 text-destructive hover:text-destructive">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                              {exp.enabled && (
                                <>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <Label className="text-xs">Job Title</Label>
                                      <Input value={exp.title} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} className="mt-1 h-8 text-sm" />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Company</Label>
                                      <Input value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} className="mt-1 h-8 text-sm" />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Location</Label>
                                      <Input value={exp.location} onChange={(e) => updateExperience(exp.id, "location", e.target.value)} className="mt-1 h-8 text-sm" />
                                    </div>
                                    <div className="flex items-end gap-2">
                                      <div className="flex-1">
                                        <Label className="text-xs">Start Date</Label>
                                        <Input type="date" value={exp.startDate} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} className="mt-1 h-8 text-sm" />
                                      </div>
                                    </div>
                                    {!exp.isCurrent && (
                                      <div>
                                        <Label className="text-xs">End Date</Label>
                                        <Input type="date" value={exp.endDate} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} className="mt-1 h-8 text-sm" />
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2 pt-4">
                                      <Switch checked={exp.isCurrent} onCheckedChange={(v) => updateExperience(exp.id, "isCurrent", v)} />
                                      <Label className="text-xs">Current Role</Label>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs">Description</Label>
                                      <AIWriteButton
                                        value={exp.description}
                                        onApply={(text) => updateExperience(exp.id, "description", text)}
                                        context={`${exp.title} at ${exp.company}`}
                                      />
                                    </div>
                                    <Textarea value={exp.description} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} className="mt-1 min-h-[60px] text-sm" />
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs">Key Achievements (one per line)</Label>
                                      <AIAchievementsButton
                                        role={`${exp.title} at ${exp.company}`}
                                        description={exp.description}
                                        onApply={(achievements) => updateExperience(exp.id, "achievements", achievements)}
                                      />
                                    </div>
                                    <Textarea
                                      value={exp.achievements.join("\n")}
                                      onChange={(e) => updateExperience(exp.id, "achievements", e.target.value.split("\n").filter((a) => a.trim()))}
                                      placeholder="Led team of 5 engineers&#10;Increased performance by 40%"
                                      className="mt-1 min-h-[60px] text-sm"
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </SortableHandleItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                <Button variant="outline" size="sm" onClick={addExperience} className="w-full mt-4">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Experience
                </Button>
              </CollapsibleSection>

              {/* Education Section - Drag & Drop */}
              <CollapsibleSection
                title="Education"
                icon={GraduationCap}
                count={config.education.filter((e) => e.enabled).length}
                defaultOpen={false}
              >
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEduDragEnd}>
                  <SortableContext items={config.education.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {config.education.map((edu, idx) => (
                        <SortableHandleItem key={edu.id} id={edu.id}>
                          {(dragHandleProps: Record<string, unknown>) => (
                            <div className="border border-border/50 rounded-lg p-3 space-y-3 bg-muted/30">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <button {...dragHandleProps} className="cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-muted" aria-label="Drag to reorder">
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                  <span className="text-xs font-medium text-muted-foreground">#{idx + 1}</span>
                                  <span className="text-sm font-medium truncate max-w-[200px]">{edu.degree || edu.institution || "Untitled"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch checked={edu.enabled} onCheckedChange={(v) => updateEducation(edu.id, "enabled", v)} />
                                  <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)} className="h-7 w-7 p-0 text-destructive hover:text-destructive">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                              {edu.enabled && (
                                <>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="col-span-2">
                                      <Label className="text-xs">Institution</Label>
                                      <Input value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} className="mt-1 h-8 text-sm" />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Degree</Label>
                                      <Input value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} className="mt-1 h-8 text-sm" />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Field of Study</Label>
                                      <Input value={edu.field} onChange={(e) => updateEducation(edu.id, "field", e.target.value)} className="mt-1 h-8 text-sm" />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Start Date</Label>
                                      <Input type="date" value={edu.startDate} onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)} className="mt-1 h-8 text-sm" />
                                    </div>
                                    <div>
                                      <Label className="text-xs">End Date</Label>
                                      <Input type="date" value={edu.endDate} onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)} className="mt-1 h-8 text-sm" />
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-xs">Description</Label>
                                    <Textarea value={edu.description} onChange={(e) => updateEducation(edu.id, "description", e.target.value)} className="mt-1 min-h-[50px] text-sm" />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Achievements (one per line)</Label>
                                    <Textarea
                                      value={(edu.achievements || []).join("\n")}
                                      onChange={(e) => updateEducation(edu.id, "achievements", e.target.value.split("\n").filter((a) => a.trim()))}
                                      className="mt-1 min-h-[50px] text-sm"
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </SortableHandleItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                <Button variant="outline" size="sm" onClick={addEducation} className="w-full mt-4">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Education
                </Button>
              </CollapsibleSection>

              {/* Skills Section */}
              <CollapsibleSection
                title="Skills"
                icon={Code}
                count={config.skillCategories.length}
                defaultOpen={false}
              >
                <div className="space-y-4">
                  {config.skillCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="border border-border/50 rounded-lg p-3 space-y-2 bg-muted/30"
                    >
                      <div className="flex items-center justify-between">
                        <Input
                          value={cat.name}
                          onChange={(e) =>
                            updateSkillCategory(cat.id, "name", e.target.value)
                          }
                          placeholder="Category name"
                          className="h-8 text-sm font-medium max-w-[200px]"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkillCategory(cat.id)}
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div>
                        <Label className="text-xs">
                          Skills (comma-separated)
                        </Label>
                        <Input
                          value={cat.skills.join(", ")}
                          onChange={(e) =>
                            updateSkillCategory(
                              cat.id,
                              "skills",
                              e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean)
                            )
                          }
                          placeholder="React, TypeScript, Node.js"
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cat.skills.map((skill, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-[10px]"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addSkillCategory}
                    className="w-full"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Skill Category
                  </Button>
                </div>
              </CollapsibleSection>

              {/* Projects Section - Drag & Drop */}
              <CollapsibleSection
                title="Projects"
                icon={FolderKanban}
                count={config.projects.filter((p) => p.enabled).length}
                defaultOpen={false}
              >
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleProjDragEnd}>
                  <SortableContext items={config.projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {config.projects.map((proj, idx) => (
                        <SortableHandleItem key={proj.id} id={proj.id}>
                          {(dragHandleProps: Record<string, unknown>) => (
                            <div className="border border-border/50 rounded-lg p-3 space-y-3 bg-muted/30">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <button {...dragHandleProps} className="cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-muted" aria-label="Drag to reorder">
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                  <span className="text-xs font-medium text-muted-foreground">#{idx + 1}</span>
                                  <span className="text-sm font-medium truncate max-w-[200px]">{proj.title || "Untitled Project"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch checked={proj.enabled} onCheckedChange={(v) => updateProject(proj.id, "enabled", v)} />
                                  <Button variant="ghost" size="sm" onClick={() => removeProject(proj.id)} className="h-7 w-7 p-0 text-destructive hover:text-destructive">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                              {proj.enabled && (
                                <>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <Label className="text-xs">Project Title</Label>
                                      <Input value={proj.title} onChange={(e) => updateProject(proj.id, "title", e.target.value)} className="mt-1 h-8 text-sm" />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Your Role</Label>
                                      <Input value={proj.role || ""} onChange={(e) => updateProject(proj.id, "role", e.target.value)} placeholder="Lead Developer, Architect..." className="mt-1 h-8 text-sm" />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <Label className="text-xs">Live URL</Label>
                                      <Input value={proj.url} onChange={(e) => updateProject(proj.id, "url", e.target.value)} placeholder="https://..." className="mt-1 h-8 text-sm" />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Repo URL</Label>
                                      <Input value={proj.repoUrl || ""} onChange={(e) => updateProject(proj.id, "repoUrl", e.target.value)} placeholder="github.com/..." className="mt-1 h-8 text-sm" />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-end gap-2">
                                      <div className="flex-1">
                                        <Label className="text-xs">Start Date</Label>
                                        <Input type="date" value={proj.startDate || ""} onChange={(e) => updateProject(proj.id, "startDate", e.target.value)} className="mt-1 h-8 text-sm" />
                                      </div>
                                    </div>
                                    {!proj.isCurrent && (
                                      <div>
                                        <Label className="text-xs">End Date</Label>
                                        <Input type="date" value={proj.endDate || ""} onChange={(e) => updateProject(proj.id, "endDate", e.target.value)} className="mt-1 h-8 text-sm" />
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2 pt-4">
                                      <Switch checked={proj.isCurrent || false} onCheckedChange={(v) => updateProject(proj.id, "isCurrent", v)} />
                                      <Label className="text-xs">Ongoing</Label>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs">Description</Label>
                                      <AIWriteButton
                                        value={proj.description}
                                        onApply={(text) => updateProject(proj.id, "description", text)}
                                        context={`project: ${proj.title}`}
                                      />
                                    </div>
                                    <Textarea value={proj.description} onChange={(e) => updateProject(proj.id, "description", e.target.value)} className="mt-1 min-h-[50px] text-sm" />
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs">Key Highlights (one per line)</Label>
                                      <AIAchievementsButton
                                        role={`${proj.title} project`}
                                        description={proj.description}
                                        onApply={(achievements) => updateProject(proj.id, "achievements", achievements)}
                                      />
                                    </div>
                                    <Textarea
                                      value={(proj.achievements || []).join("\n")}
                                      onChange={(e) => updateProject(proj.id, "achievements", e.target.value.split("\n").filter((a) => a.trim()))}
                                      placeholder="Built microservices architecture handling 10K req/s&#10;Reduced deployment time by 60% with CI/CD pipeline&#10;Led team of 4 engineers"
                                      className="mt-1 min-h-[60px] text-sm"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Tech Stack (comma-separated)</Label>
                                    <Input
                                      value={proj.techStack.join(", ")}
                                      onChange={(e) => updateProject(proj.id, "techStack", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                                      className="mt-1 h-8 text-sm"
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </SortableHandleItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                <Button variant="outline" size="sm" onClick={addProject} className="w-full mt-4">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Project
                </Button>
              </CollapsibleSection>

              {/* Certifications Section - Drag & Drop */}
              <CollapsibleSection
                title="Certifications"
                icon={Award}
                count={config.certifications.filter((c) => c.enabled).length}
                defaultOpen={false}
              >
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCertDragEnd}>
                  <SortableContext items={config.certifications.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {config.certifications.map((cert, idx) => (
                        <SortableHandleItem key={cert.id} id={cert.id}>
                          {(dragHandleProps: Record<string, unknown>) => (
                            <div className="border border-border/50 rounded-lg p-3 space-y-3 bg-muted/30">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <button {...dragHandleProps} className="cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-muted" aria-label="Drag to reorder">
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                  <span className="text-xs font-medium text-muted-foreground">#{idx + 1}</span>
                                  <span className="text-sm font-medium truncate max-w-[200px]">{cert.name || "Untitled"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch checked={cert.enabled} onCheckedChange={(v) => updateCertification(cert.id, "enabled", v)} />
                                  <Button variant="ghost" size="sm" onClick={() => removeCertification(cert.id)} className="h-7 w-7 p-0 text-destructive hover:text-destructive">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                              {cert.enabled && (
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label className="text-xs">Certification Name</Label>
                                    <Input value={cert.name} onChange={(e) => updateCertification(cert.id, "name", e.target.value)} className="mt-1 h-8 text-sm" />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Issuer</Label>
                                    <Input value={cert.issuer} onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)} className="mt-1 h-8 text-sm" />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Issue Date</Label>
                                    <Input type="date" value={cert.date} onChange={(e) => updateCertification(cert.id, "date", e.target.value)} className="mt-1 h-8 text-sm" />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Credential ID</Label>
                                    <Input value={cert.credentialId} onChange={(e) => updateCertification(cert.id, "credentialId", e.target.value)} className="mt-1 h-8 text-sm" />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </SortableHandleItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                <Button variant="outline" size="sm" onClick={addCertification} className="w-full mt-4">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Certification
                </Button>
              </CollapsibleSection>

              {/* Custom Sections */}
              <CollapsibleSection
                title="Custom Sections"
                icon={Sparkles}
                count={config.customSections.length}
                defaultOpen={false}
              >
                <div className="space-y-4">
                  {config.customSections.map((section) => (
                    <div
                      key={section.id}
                      className="border border-border/50 rounded-lg p-3 space-y-3 bg-muted/30"
                    >
                      <div className="flex items-center justify-between">
                        <Input
                          value={section.title}
                          onChange={(e) =>
                            updateCustomSection(section.id, e.target.value)
                          }
                          placeholder="Section title"
                          className="h-8 text-sm font-medium max-w-[200px]"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomSection(section.id)}
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      {section.items.map((item) => (
                        <div key={item.id} className="flex gap-2">
                          <Input
                            value={item.content}
                            onChange={(e) =>
                              updateCustomItem(
                                section.id,
                                item.id,
                                e.target.value
                              )
                            }
                            placeholder="Item content"
                            className="h-8 text-sm flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeCustomItem(section.id, item.id)
                            }
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addCustomItem(section.id)}
                        className="w-full"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Item
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addCustomSection}
                    className="w-full"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Custom Section
                  </Button>
                </div>
              </CollapsibleSection>
            </div>

            {/* Right: Mini Preview */}
            <div className="hidden xl:block sticky top-6">
              <Card className="border-border/50 overflow-hidden">
                <CardHeader className="py-2 px-4 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-medium text-muted-foreground">
                      Live Preview
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => setActiveTab("preview")}
                    >
                      Full View
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="transform scale-[0.38] origin-top-left w-[263%] h-[1120px] overflow-hidden">
                    <div ref={previewRef}>
                      <ResumePreview config={config} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ─── PREVIEW TAB ─── */}
        <TabsContent value="preview">
          <div className="flex justify-center">
            <div className="w-full max-w-[900px]">
              <div ref={activeTab === "preview" ? previewRef : undefined}>
                <ResumePreview config={config} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ─── DESIGN TAB ─── */}
        <TabsContent value="design">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Template Selection */}
              <Card className="border-border/50">
                <CardHeader className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <LayoutTemplate className="h-4 w-4 text-accent" />
                    <CardTitle className="text-sm font-semibold">
                      Resume Template
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        id: "classic",
                        name: "Classic",
                        desc: "Traditional clean layout",
                      },
                      {
                        id: "modern",
                        name: "Modern",
                        desc: "Contemporary sidebar design",
                      },
                      {
                        id: "minimal",
                        name: "Minimal",
                        desc: "Clean and simple",
                      },
                      {
                        id: "executive",
                        name: "Executive",
                        desc: "Bold and professional",
                      },
                      {
                        id: "healthcare",
                        name: "Healthcare",
                        desc: "Medical & nursing style",
                      },
                      {
                        id: "elegant",
                        name: "Elegant",
                        desc: "Grand header, two-column",
                      },
                      {
                        id: "compact",
                        name: "Compact",
                        desc: "Dense professional layout",
                      },
                      {
                        id: "bold",
                        name: "Bold",
                        desc: "Timeline with accent stripes",
                      },
                      {
                        id: "creative",
                        name: "Creative",
                        desc: "Asymmetric modern layout",
                      },
                      {
                        id: "professional",
                        name: "Professional",
                        desc: "Dark header, two-column",
                      },
                      {
                        id: "technical",
                        name: "Technical",
                        desc: "Code-style tech layout",
                      },
                      {
                        id: "metro",
                        name: "Metro",
                        desc: "Tile-based flat design",
                      },
                      {
                        id: "newspaper",
                        name: "Newspaper",
                        desc: "Editorial two-column",
                      },
                      {
                        id: "infographic",
                        name: "Infographic",
                        desc: "Data-viz timeline",
                      },
                      {
                        id: "nordic",
                        name: "Nordic",
                        desc: "Scandinavian minimal",
                      },
                      {
                        id: "cascade",
                        name: "Cascade",
                        desc: "Waterfall stepped headers",
                      },
                      {
                        id: "horizon",
                        name: "Horizon",
                        desc: "Alternating band layout",
                      },
                      {
                        id: "mosaic",
                        name: "Mosaic",
                        desc: "Multi-column masonry",
                      },
                      {
                        id: "apex",
                        name: "Apex",
                        desc: "Angular geometric design",
                      },
                      {
                        id: "slate",
                        name: "Slate",
                        desc: "Dark sidebar corporate",
                      },
                      {
                        id: "glass",
                        name: "Glass",
                        desc: "Frosted glassmorphism",
                      },
                      {
                        id: "gradient",
                        name: "Gradient",
                        desc: "Bold gradient accents",
                      },
                      {
                        id: "mono",
                        name: "Mono",
                        desc: "Brutalist monochrome",
                      },
                      {
                        id: "timelinepro",
                        name: "Timeline Pro",
                        desc: "Centered timeline layout",
                      },
                      {
                        id: "carddeck",
                        name: "Card Deck",
                        desc: "Elevated card sections",
                      },
                      {
                        id: "dualtone",
                        name: "Dual Tone",
                        desc: "Split dark/light layout",
                      },
                      {
                        id: "magazine",
                        name: "Magazine",
                        desc: "Editorial multi-column",
                      },
                      {
                        id: "neon",
                        name: "Neon",
                        desc: "Dark cyberpunk glow",
                      },
                      {
                        id: "paper",
                        name: "Paper",
                        desc: "Warm parchment classic",
                      },
                      {
                        id: "stacked",
                        name: "Stacked",
                        desc: "Full-width horizontal bands",
                      },
                      {
                        id: "retro",
                        name: "Retro",
                        desc: "70s vintage warm tones",
                      },
                      {
                        id: "origami",
                        name: "Origami",
                        desc: "Folded paper panels",
                      },
                      {
                        id: "terminal",
                        name: "Terminal",
                        desc: "Command-line hacker",
                      },
                      {
                        id: "ribbon",
                        name: "Ribbon",
                        desc: "Banner ribbon accents",
                      },
                      {
                        id: "zen",
                        name: "Zen",
                        desc: "Japanese minimalism",
                      },
                      {
                        id: "diagonal",
                        name: "Diagonal",
                        desc: "Dynamic angled accents",
                      },
                      {
                        id: "circuit",
                        name: "Circuit",
                        desc: "Tech circuit board",
                      },
                      {
                        id: "waterfall",
                        name: "Waterfall",
                        desc: "Cascading indent flow",
                      },
                      {
                        id: "polaroid",
                        name: "Polaroid",
                        desc: "Photo frame playful",
                      },
                      {
                        id: "architect",
                        name: "Architect",
                        desc: "Blueprint precision",
                      },
                    ].map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            template: tmpl.id,
                          }))
                        }
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          config.template === tmpl.id
                            ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                            : "border-border/50 hover:border-border"
                        }`}
                      >
                        <div className="text-sm font-medium">{tmpl.name}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {tmpl.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Accent Color */}
              <Card className="border-border/50">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-semibold">
                    Accent Color
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[
                      "#2563eb",
                      "#7c3aed",
                      "#db2777",
                      "#dc2626",
                      "#ea580c",
                      "#ca8a04",
                      "#16a34a",
                      "#0d9488",
                      "#0284c7",
                      "#1e293b",
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            accentColor: color,
                          }))
                        }
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          config.accentColor === color
                            ? "border-foreground scale-110"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Custom:</Label>
                    <input
                      type="color"
                      value={config.accentColor}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          accentColor: e.target.value,
                        }))
                      }
                      className="w-8 h-8 rounded cursor-pointer border-0"
                    />
                    <span className="text-xs text-muted-foreground">
                      {config.accentColor}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Font Size */}
              <Card className="border-border/50">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-semibold">
                    Font Size
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <Select
                    value={config.fontSize}
                    onValueChange={(v) =>
                      setConfig((prev) => ({ ...prev, fontSize: v }))
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Layout Controls */}
              <Card className="border-border/50">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-semibold">
                    Layout Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0 space-y-4">
                  {/* Sidebar Width (only for sidebar templates) */}
                  {isSidebarTemplate && (
                    <div>
                      <Label className="text-xs mb-2 block">Sidebar Width: {config.sidebarWidth}px</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => setConfig((prev) => ({ ...prev, sidebarWidth: Math.max(160, prev.sidebarWidth - 10) }))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <input
                          type="range"
                          min={160}
                          max={300}
                          step={5}
                          value={config.sidebarWidth}
                          onChange={(e) => setConfig((prev) => ({ ...prev, sidebarWidth: Number(e.target.value) }))}
                          className="flex-1 h-2 accent-accent"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => setConfig((prev) => ({ ...prev, sidebarWidth: Math.min(300, prev.sidebarWidth + 10) }))}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Page Padding */}
                  <div>
                    <Label className="text-xs mb-2 block">Page Padding: {config.pagePadding}px</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setConfig((prev) => ({ ...prev, pagePadding: Math.max(16, prev.pagePadding - 4) }))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <input
                        type="range"
                        min={16}
                        max={56}
                        step={4}
                        value={config.pagePadding}
                        onChange={(e) => setConfig((prev) => ({ ...prev, pagePadding: Number(e.target.value) }))}
                        className="flex-1 h-2 accent-accent"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setConfig((prev) => ({ ...prev, pagePadding: Math.min(56, prev.pagePadding + 4) }))}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section Order - Drag & Drop */}
              <Card className="border-border/50">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-semibold">
                    Section Order (Drag to Reorder)
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
                    <SortableContext items={config.sectionOrder} strategy={verticalListSortingStrategy}>
                      <div className="space-y-1.5">
                        {config.sectionOrder.map((section) => {
                          const SIcon = sectionIcons[section] || Sparkles
                          return (
                            <SortableItem key={section} id={section}>
                              <div className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2 cursor-grab active:cursor-grabbing hover:bg-muted/80 transition-colors border border-transparent hover:border-border/50">
                                <div className="flex items-center gap-2">
                                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                                  <SIcon className="h-3.5 w-3.5 text-accent" />
                                  <span className="text-sm">
                                    {sectionLabels[section] || section}
                                  </span>
                                </div>
                              </div>
                            </SortableItem>
                          )
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
                </CardContent>
              </Card>

              {/* Options */}
              <Card className="border-border/50">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-semibold">
                    Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Show Profile Image</Label>
                    <Switch
                      checked={config.showProfileImage}
                      onCheckedChange={(v) =>
                        setConfig((prev) => ({
                          ...prev,
                          showProfileImage: v,
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Design Preview */}
            <div className="sticky top-6">
              <Card className="border-border/50 overflow-hidden">
                <CardHeader className="py-2 px-4 bg-muted/50">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Design Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="transform scale-[0.42] origin-top-left w-[238%] h-[1000px] overflow-hidden">
                    <ResumePreview config={config} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        {/* ─── AI TAB ─── */}
        <TabsContent value="ai">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <AITailorPanel config={config} onApply={handleAIApply} />
              <AISettingsPanel />
            </div>

            {/* AI Preview */}
            <div className="sticky top-6">
              <Card className="border-border/50 overflow-hidden">
                <CardHeader className="py-2 px-4 bg-muted/50">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Live Preview (updates as AI applies changes)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="transform scale-[0.42] origin-top-left w-[238%] h-[1000px] overflow-hidden">
                    <ResumePreview config={config} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ─── IMPORT TAB ─── */}
        <TabsContent value="import">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card className="border-border/50">
                <CardHeader className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-accent" />
                    <CardTitle className="text-sm font-semibold">Import & AI Resume Builder</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <ResumeImportPanel config={config} onImport={handleImport} />
                </CardContent>
              </Card>
              <AISettingsPanel />
            </div>

            {/* Import Preview */}
            <div className="sticky top-6">
              <Card className="border-border/50 overflow-hidden">
                <CardHeader className="py-2 px-4 bg-muted/50">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Live Preview (updates as content imports)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="transform scale-[0.42] origin-top-left w-[238%] h-[1000px] overflow-hidden">
                    <ResumePreview config={config} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Off-screen render target for PDF export — must be fully laid out at A4 width */}
      <div
        ref={pdfRenderRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "210mm",
          overflow: "visible",
          pointerEvents: "none",
          visibility: "hidden",
        }}
      >
        <ResumePreview config={config} />
      </div>

      {/* PDF Preview Modal */}
      <ResumePdfPreview isOpen={showPdfPreview} onClose={() => setShowPdfPreview(false)} previewRef={previewRef} fileName={config.profile.fullName || "resume"} />
    </div>
  )
}
