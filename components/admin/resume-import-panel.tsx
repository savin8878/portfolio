"use client"

import { useState, useCallback, useRef } from "react"
import {
  Upload, FileText, Sparkles, Loader2, Check, AlertCircle, Wand2,
  ClipboardPaste, Zap, ArrowRight, RotateCw, X, Brain,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ResumeConfig } from "./resume-builder"

interface ResumeImportPanelProps {
  config: ResumeConfig
  onImport: (data: Partial<ResumeConfig>) => void
}

function generateId() {
  return Math.random().toString(36).substring(2, 11)
}

export function ResumeImportPanel({ config, onImport }: ResumeImportPanelProps) {
  const [mode, setMode] = useState<"paste" | "upload" | null>(null)
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const processAI = useCallback(async (action: string, text: string) => {
    if (!text.trim()) { setError("Please paste or upload content first"); return }
    setLoading(action)
    setError("")
    setSuccess("")

    try {
      const body = action === "enhance_resume"
        ? { action, content: JSON.stringify(config) }
        : { action, content: text }

      const res = await fetch("/api/admin/resume/ai-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed"); return }

      const result = data.result
      if (!result) { setError("No data returned"); return }

      // Map parsed data to ResumeConfig format
      const updates: Partial<ResumeConfig> = {}

      if (result.profile) {
        updates.profile = {
          fullName: result.profile.fullName || config.profile.fullName,
          title: result.profile.title || config.profile.title,
          email: result.profile.email || config.profile.email,
          phone: result.profile.phone || config.profile.phone,
          location: result.profile.location || config.profile.location,
          website: result.profile.website || config.profile.website,
          linkedin: result.profile.linkedin || config.profile.linkedin,
          github: result.profile.github || config.profile.github,
          summary: result.profile.summary || config.profile.summary,
          profileImage: config.profile.profileImage,
        }
      }

      if (result.experiences?.length > 0) {
        updates.experiences = result.experiences.map((exp: Record<string, unknown>) => ({
          id: (exp.id as string) || generateId(),
          enabled: true,
          title: exp.title || "",
          company: exp.company || "",
          location: exp.location || "",
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
          isCurrent: exp.isCurrent || false,
          description: exp.description || "",
          achievements: Array.isArray(exp.achievements) ? exp.achievements : [],
        }))
      }

      if (result.education?.length > 0) {
        updates.education = result.education.map((edu: Record<string, unknown>) => ({
          id: (edu.id as string) || generateId(),
          enabled: true,
          degree: edu.degree || "",
          field: edu.field || "",
          institution: edu.institution || "",
          startDate: edu.startDate || "",
          endDate: edu.endDate || "",
          description: edu.description || "",
          achievements: Array.isArray(edu.achievements) ? edu.achievements : [],
        }))
      }

      if (result.certifications?.length > 0) {
        updates.certifications = result.certifications.map((c: Record<string, unknown>) => ({
          id: (c.id as string) || generateId(),
          enabled: true,
          name: c.name || "",
          issuer: c.issuer || "",
          date: c.date || "",
          credentialId: c.credentialId || "",
          url: c.url || "",
        }))
      }

      if (result.skillCategories?.length > 0) {
        updates.skillCategories = result.skillCategories.map((cat: Record<string, unknown>) => ({
          id: generateId(),
          name: cat.name || "Skills",
          skills: Array.isArray(cat.skills) ? cat.skills : [],
        }))
      }

      if (result.projects?.length > 0) {
        updates.projects = result.projects.map((p: Record<string, unknown>) => ({
          id: (p.id as string) || generateId(),
          enabled: true,
          title: p.title || "",
          description: p.description || "",
          techStack: Array.isArray(p.techStack) ? p.techStack : [],
          url: p.url || "",
        }))
      }

      onImport(updates)

      const counts = []
      if (updates.profile) counts.push("profile")
      if (updates.experiences) counts.push(`${updates.experiences.length} experiences`)
      if (updates.education) counts.push(`${updates.education.length} education`)
      if (updates.certifications) counts.push(`${updates.certifications.length} certifications`)
      if (updates.skillCategories) counts.push(`${updates.skillCategories.length} skill groups`)
      if (updates.projects) counts.push(`${updates.projects.length} projects`)

      setSuccess(`Imported: ${counts.join(", ")}`)
      setContent("")
      setMode(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed")
    } finally {
      setLoading(null)
    }
  }, [config, onImport])

  // Handles PDF, images, and text files — sends to server for AI extraction
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ""

    const isPdfOrImage = file.type === "application/pdf" || file.type.startsWith("image/")

    if (isPdfOrImage) {
      // Upload to server for AI extraction (PDF text parse or vision AI for images)
      setLoading("upload")
      setError("")
      setSuccess("")
      try {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/admin/resume/upload", { method: "POST", body: formData })
        const data = await res.json()

        if (!res.ok) { setError(data.error || "Upload failed"); setLoading(null); return }

        const result = data.result
        if (!result) { setError("No data extracted"); setLoading(null); return }

        // Map to config — same logic as processAI
        const updates: Partial<ResumeConfig> = {}
        if (result.profile) {
          updates.profile = {
            fullName: result.profile.fullName || config.profile.fullName,
            title: result.profile.title || config.profile.title,
            email: result.profile.email || config.profile.email,
            phone: result.profile.phone || config.profile.phone,
            location: result.profile.location || config.profile.location,
            website: result.profile.website || config.profile.website,
            linkedin: result.profile.linkedin || config.profile.linkedin,
            github: result.profile.github || config.profile.github,
            summary: result.profile.summary || config.profile.summary,
            profileImage: config.profile.profileImage,
          }
        }
        if (result.experiences?.length > 0) {
          updates.experiences = result.experiences.map((exp: Record<string, unknown>) => ({
            id: (exp.id as string) || generateId(), enabled: true,
            title: exp.title || "", company: exp.company || "", location: exp.location || "",
            startDate: exp.startDate || "", endDate: exp.endDate || "", isCurrent: exp.isCurrent || false,
            description: exp.description || "", achievements: Array.isArray(exp.achievements) ? exp.achievements : [],
          }))
        }
        if (result.education?.length > 0) {
          updates.education = result.education.map((edu: Record<string, unknown>) => ({
            id: (edu.id as string) || generateId(), enabled: true,
            degree: edu.degree || "", field: edu.field || "", institution: edu.institution || "",
            startDate: edu.startDate || "", endDate: edu.endDate || "",
            description: edu.description || "", achievements: Array.isArray(edu.achievements) ? edu.achievements : [],
          }))
        }
        if (result.certifications?.length > 0) {
          updates.certifications = result.certifications.map((c: Record<string, unknown>) => ({
            id: (c.id as string) || generateId(), enabled: true,
            name: c.name || "", issuer: c.issuer || "", date: c.date || "", credentialId: c.credentialId || "", url: c.url || "",
          }))
        }
        if (result.skillCategories?.length > 0) {
          updates.skillCategories = result.skillCategories.map((cat: Record<string, unknown>) => ({
            id: generateId(), name: cat.name || "Skills", skills: Array.isArray(cat.skills) ? cat.skills : [],
          }))
        }
        if (result.projects?.length > 0) {
          updates.projects = result.projects.map((p: Record<string, unknown>) => ({
            id: (p.id as string) || generateId(), enabled: true,
            title: p.title || "", description: p.description || "",
            techStack: Array.isArray(p.techStack) ? p.techStack : [], url: p.url || "",
          }))
        }

        onImport(updates)
        const counts = []
        if (updates.profile) counts.push("profile")
        if (updates.experiences) counts.push(`${updates.experiences.length} experiences`)
        if (updates.education) counts.push(`${updates.education.length} education`)
        if (updates.certifications) counts.push(`${updates.certifications.length} certifications`)
        if (updates.skillCategories) counts.push(`${updates.skillCategories.length} skill groups`)
        if (updates.projects) counts.push(`${updates.projects.length} projects`)
        setSuccess(`Extracted from ${file.type.startsWith("image/") ? "image" : "PDF"}: ${counts.join(", ")}`)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed")
      } finally {
        setLoading(null)
      }
    } else {
      // Text files — read and put into paste mode
      const reader = new FileReader()
      reader.onload = (ev) => {
        const text = ev.target?.result as string
        if (text) { setContent(text); setMode("paste") }
      }
      reader.readAsText(file)
    }
  }, [config, onImport])

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      {!mode && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {/* Paste Resume */}
            <button
              onClick={() => setMode("paste")}
              className="flex items-start gap-3 p-4 rounded-xl border-2 border-dashed border-border hover:border-accent/50 hover:bg-accent/5 transition-all text-left group"
            >
              <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                <ClipboardPaste className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">Paste Resume Content</div>
                <div className="text-xs text-muted-foreground mt-0.5">Paste your existing resume text, LinkedIn profile, or any career notes. AI will parse and structure everything.</div>
              </div>
            </button>

            {/* Upload File */}
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-start gap-3 p-4 rounded-xl border-2 border-dashed border-border hover:border-accent/50 hover:bg-accent/5 transition-all text-left group"
            >
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">Upload Resume (PDF, Image, or Text)</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {loading === "upload" ? "AI is extracting resume data..." : "Upload PDF, screenshot/photo of resume (PNG, JPG), or text file. AI vision extracts everything automatically."}
                </div>
              </div>
            </button>
            <input ref={fileRef} type="file" accept=".pdf,.txt,.md,.text,.csv,.png,.jpg,.jpeg,.webp,.heic" className="hidden" onChange={handleFileUpload} />

            {/* Enhance Current */}
            <button
              onClick={() => processAI("enhance_resume", "")}
              disabled={loading !== null}
              className="flex items-start gap-3 p-4 rounded-xl border-2 border-accent/30 bg-accent/5 hover:bg-accent/10 transition-all text-left group"
            >
              <div className="p-2 rounded-lg bg-accent/20 text-accent">
                {loading === "enhance_resume" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
              </div>
              <div>
                <div className="font-semibold text-sm flex items-center gap-1.5">
                  AI Enhance Current Resume
                  <Badge variant="secondary" className="text-[9px]">AI</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {loading === "enhance_resume" ? "AI is enhancing your resume..." : "Improve all descriptions, strengthen achievements, optimize for ATS. Uses your current resume data."}
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Paste/Edit Mode */}
      {mode === "paste" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">Paste Your Content</Label>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setMode(null); setContent("") }}>
              <X className="h-3 w-3 mr-1" /> Cancel
            </Button>
          </div>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Paste anything here:\n\n• Your existing resume text\n• LinkedIn profile copy\n• Job descriptions and achievements\n• Bullet points and notes\n• Any career-related content\n\nAI will intelligently extract and structure everything into a professional resume.`}
            className="min-h-[200px] text-sm font-mono"
          />

          <div className="flex gap-2">
            <Button
              className="flex-1 gap-1.5"
              onClick={() => processAI("parse_resume", content)}
              disabled={loading !== null || !content.trim()}
            >
              {loading === "parse_resume" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
              {loading === "parse_resume" ? "Parsing Resume..." : "Parse & Import Resume"}
            </Button>

            <Button
              variant="outline"
              className="flex-1 gap-1.5"
              onClick={() => processAI("infer_content", content)}
              disabled={loading !== null || !content.trim()}
            >
              {loading === "infer_content" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {loading === "infer_content" ? "Generating..." : "AI Generate from Notes"}
            </Button>
          </div>

          <p className="text-[10px] text-muted-foreground">
            <strong>Parse:</strong> Extracts exact content from a formatted resume. <strong>Generate:</strong> Creates polished resume content from rough notes/bullet points.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}
    </div>
  )
}
