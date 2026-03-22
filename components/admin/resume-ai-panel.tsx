"use client"

import { useState, useCallback } from "react"
import {
  Sparkles,
  Key,
  Wand2,
  FileText,
  Briefcase,
  Layers,
  Zap,
  Loader2,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Settings2,
  Brain,
  Trash2,
  PenLine,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ResumeConfig } from "./resume-builder"

// ─── AI Provider Configuration Panel ───
const PROVIDERS = [
  { id: "google", name: "Google AI Studio", models: ["gemini-2.0-flash", "gemini-2.5-flash-preview-05-20", "gemini-2.5-pro-preview-05-06"] },
  { id: "groq", name: "Groq", models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768", "gemma2-9b-it"] },
  { id: "openai", name: "OpenAI", models: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo"] },
  { id: "anthropic", name: "Anthropic", models: ["claude-sonnet-4-20250514", "claude-haiku-4-5-20251001"] },
]

interface ProviderState {
  apiKey: string
  model: string
  isActive: boolean
  saved: boolean
}

export function AISettingsPanel() {
  const [providers, setProviders] = useState<Record<string, ProviderState>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(true)

  const updateProvider = (id: string, field: keyof ProviderState, value: string | boolean) => {
    setProviders((prev) => ({
      ...prev,
      [id]: { ...prev[id], apiKey: prev[id]?.apiKey || "", model: prev[id]?.model || "", isActive: prev[id]?.isActive ?? false, saved: prev[id]?.saved ?? false, [field]: value },
    }))
  }

  const saveProvider = async (id: string) => {
    const p = providers[id]
    if (!p?.apiKey) return

    setSaving(id)
    try {
      const providerConfig = PROVIDERS.find((pr) => pr.id === id)
      await fetch("/api/admin/resume/ai-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: id,
          apiKey: p.apiKey,
          model: p.model || providerConfig?.models[0] || "",
          isActive: p.isActive,
        }),
      })
      updateProvider(id, "saved", true)
      setTimeout(() => updateProvider(id, "saved", false), 2000)
    } catch {
      // error handled silently
    } finally {
      setSaving(null)
    }
  }

  const removeProvider = async (id: string) => {
    await fetch(`/api/admin/resume/ai-settings?provider=${id}`, { method: "DELETE" })
    setProviders((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  return (
    <Card className="border-border/50">
      <CardHeader
        className="py-3 px-4 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-sm font-semibold">AI Provider Settings</CardTitle>
          </div>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="px-4 pb-4 pt-0 space-y-4">
          <p className="text-xs text-muted-foreground">
            Add API keys from any provider below. The active provider will be used for AI resume tailoring.
          </p>
          {PROVIDERS.map((provider) => {
            const state = providers[provider.id]
            return (
              <div key={provider.id} className="border border-border/50 rounded-lg p-3 space-y-2 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-3.5 w-3.5 text-accent" />
                    <span className="text-sm font-medium">{provider.name}</span>
                    {state?.saved && <Badge variant="secondary" className="text-[9px] bg-green-100 text-green-700">Saved</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={state?.isActive ?? false}
                      onCheckedChange={(v) => updateProvider(provider.id, "isActive", v)}
                    />
                    {state?.apiKey && (
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => removeProvider(provider.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-xs">API Key</Label>
                  <Input
                    type="password"
                    value={state?.apiKey || ""}
                    onChange={(e) => updateProvider(provider.id, "apiKey", e.target.value)}
                    placeholder={`Enter ${provider.name} API key`}
                    className="mt-1 h-8 text-sm font-mono"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">Model</Label>
                    <Select
                      value={state?.model || provider.models[0]}
                      onValueChange={(v) => updateProvider(provider.id, "model", v)}
                    >
                      <SelectTrigger className="h-8 text-sm mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {provider.models.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    size="sm"
                    className="mt-5 h-8"
                    onClick={() => saveProvider(provider.id)}
                    disabled={!state?.apiKey || saving === provider.id}
                  >
                    {saving === provider.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                    <span className="ml-1">Save</span>
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      )}
    </Card>
  )
}

// ─── AI Resume Tailoring Panel ───
interface AITailorPanelProps {
  config: ResumeConfig
  onApply: (updates: Partial<{
    summary: string
    experiences: Array<{ id: string; description: string; achievements: string[] }>
    skillCategories: Array<{ name: string; skills: string[] }>
  }>) => void
}

export function AITailorPanel({ config, onApply }: AITailorPanelProps) {
  const [jobTitle, setJobTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [coverLetter, setCoverLetter] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(true)

  const callAI = useCallback(async (action: string) => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description")
      return
    }

    setLoading(action)
    setError("")
    setResult(null)

    try {
      const currentResume = {
        profile: config.profile,
        summary: config.profile.summary,
        skills: config.skillCategories.flatMap((c) => c.skills),
        skillCategories: config.skillCategories,
        experiences: config.experiences.filter((e) => e.enabled).map((e) => ({
          id: e.id,
          title: e.title,
          company: e.company,
          description: e.description,
          achievements: e.achievements,
        })),
      }

      const res = await fetch("/api/admin/resume/ai-tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, jobDescription, companyName, currentResume, action }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "AI processing failed")
        return
      }

      if (action === "generate_cover_letter") {
        setCoverLetter(typeof data.result === "string" ? data.result : JSON.stringify(data.result))
        return
      }

      if (action === "tailor_summary" && typeof data.result === "string") {
        setResult(data.result)
        onApply({ summary: data.result })
      } else if (action === "tailor_experience" && Array.isArray(data.result)) {
        onApply({ experiences: data.result })
        setResult(`Updated ${data.result.length} experience entries`)
      } else if (action === "tailor_skills" && Array.isArray(data.result)) {
        onApply({ skillCategories: data.result })
        setResult(`Reorganized skills into ${data.result.length} categories`)
      } else if (action === "full_tailor" && data.result) {
        const r = data.result
        onApply({
          summary: r.summary,
          experiences: r.experiences,
          skillCategories: r.skillCategories,
        })
        setResult("Full resume tailored successfully!")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process")
    } finally {
      setLoading(null)
    }
  }, [jobTitle, companyName, jobDescription, config, onApply])

  return (
    <Card className="border-border/50 border-accent/30">
      <CardHeader
        className="py-3 px-4 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <CardTitle className="text-sm font-semibold">AI Resume Tailor</CardTitle>
            <Badge variant="secondary" className="text-[9px]">AI</Badge>
          </div>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="px-4 pb-4 pt-0 space-y-4">
          {/* Job Info Inputs */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Target Job Title</Label>
              <Input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Senior Frontend Developer"
                className="mt-1 h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Company Name</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Google, Meta, etc."
                className="mt-1 h-8 text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Job Description (paste the full JD)</Label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here. The AI will analyze it and tailor your resume content to match..."
              className="mt-1 min-h-[120px] text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Tailor specific sections:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => callAI("tailor_summary")}
                disabled={loading !== null}
                className="justify-start"
              >
                {loading === "tailor_summary" ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <PenLine className="h-3.5 w-3.5 mr-1.5" />}
                Rewrite Summary
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => callAI("tailor_experience")}
                disabled={loading !== null}
                className="justify-start"
              >
                {loading === "tailor_experience" ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Briefcase className="h-3.5 w-3.5 mr-1.5" />}
                Tailor Experience
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => callAI("tailor_skills")}
                disabled={loading !== null}
                className="justify-start"
              >
                {loading === "tailor_skills" ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Layers className="h-3.5 w-3.5 mr-1.5" />}
                Optimize Skills
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => callAI("generate_cover_letter")}
                disabled={loading !== null}
                className="justify-start"
              >
                {loading === "generate_cover_letter" ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <FileText className="h-3.5 w-3.5 mr-1.5" />}
                Cover Letter
              </Button>
            </div>

            <Button
              size="sm"
              onClick={() => callAI("full_tailor")}
              disabled={loading !== null}
              className="w-full bg-accent hover:bg-accent/90"
            >
              {loading === "full_tailor" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {loading === "full_tailor" ? "AI is tailoring your resume..." : "Full AI Tailor (Summary + Experience + Skills)"}
            </Button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Success */}
          {result && (
            <div className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-green-600 dark:text-green-400">{result}</p>
            </div>
          )}

          {/* Cover Letter Result */}
          {coverLetter && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Generated Cover Letter</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(coverLetter)
                  }}
                >
                  Copy
                </Button>
              </div>
              <div className="p-3 bg-muted/50 rounded-md border border-border/50 max-h-[300px] overflow-y-auto">
                <p className="text-xs whitespace-pre-wrap leading-relaxed">{coverLetter}</p>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
