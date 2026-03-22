"use client"

import { useState, useCallback } from "react"
import {
  Sparkles,
  Loader2,
  Wand2,
  RefreshCw,
  Target,
  BookOpen,
  Languages,
  TrendingUp,
  Lightbulb,
  ChevronDown,
  Check,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

// ─── Inline AI Button — add next to any text field ───
// Usage: <AIWriteButton value={text} onApply={(newText) => setText(newText)} context="project description" />

interface AIWriteButtonProps {
  value: string
  onApply: (text: string) => void
  context?: string
  className?: string
}

export function AIWriteButton({ value, onApply, context, className }: AIWriteButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")
  const [instructions, setInstructions] = useState("")

  const callAI = useCallback(async (action: string) => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, content: value, context, instructions }),
      })
      const data = await res.json()
      if (data.error) {
        setResult(`Error: ${data.error}`)
      } else {
        setResult(data.result)
      }
    } catch {
      setResult("Failed to connect to AI")
    } finally {
      setLoading(false)
    }
  }, [value, context, instructions])

  const applyResult = () => {
    onApply(result)
    setOpen(false)
    setResult("")
    setInstructions("")
  }

  if (!open) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={`h-6 px-2 text-xs text-accent hover:text-accent gap-1 ${className || ""}`}
        onClick={() => setOpen(true)}
      >
        <Sparkles className="h-3 w-3" />
        AI
      </Button>
    )
  }

  return (
    <div className="mt-2 border border-accent/30 rounded-lg p-3 bg-accent/5 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-medium text-accent">AI Assistant</span>
        </div>
        <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => { setOpen(false); setResult(""); }}>
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => callAI("generate")} disabled={loading}>
          <Wand2 className="h-3 w-3" /> Generate
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => callAI("rewrite")} disabled={loading || !value}>
          <RefreshCw className="h-3 w-3" /> Rewrite
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => callAI("improve")} disabled={loading || !value}>
          <TrendingUp className="h-3 w-3" /> Improve
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => callAI("seo_optimize")} disabled={loading || !value}>
          <Target className="h-3 w-3" /> SEO
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => callAI("summarize")} disabled={loading || !value}>
          <BookOpen className="h-3 w-3" /> Summarize
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => callAI("insights")} disabled={loading || !value}>
          <Lightbulb className="h-3 w-3" /> Insights
        </Button>
      </div>

      <input
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        placeholder="Optional: specific instructions for AI..."
        className="w-full h-7 text-xs px-2 border rounded bg-background"
      />

      {loading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          AI is thinking...
        </div>
      )}

      {result && !loading && (
        <div className="space-y-2">
          <div className="p-2 bg-background border rounded text-xs max-h-[200px] overflow-y-auto whitespace-pre-wrap">
            {result}
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="h-7 text-xs gap-1" onClick={applyResult}>
              <Check className="h-3 w-3" /> Apply
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setResult("")}>
              Discard
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── AI Generate Achievements Button ───
interface AIAchievementsButtonProps {
  role: string
  description: string
  onApply: (achievements: string[]) => void
}

export function AIAchievementsButton({ role, description, onApply }: AIAchievementsButtonProps) {
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_achievements",
          context: role,
          content: description,
        }),
      })
      const data = await res.json()
      if (data.result) {
        const achievements = data.result.split("\n").map((a: string) => a.replace(/^[-•*]\s*/, "").trim()).filter(Boolean)
        onApply(achievements)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-6 px-2 text-xs text-accent hover:text-accent gap-1"
      onClick={generate}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
      {loading ? "Generating..." : "AI Generate"}
    </Button>
  )
}

// ─── AI Description Generator Button ───
interface AIDescriptionButtonProps {
  title: string
  currentDescription: string
  onApply: (description: string) => void
  instructions?: string
}

export function AIDescriptionButton({ title, currentDescription, onApply, instructions }: AIDescriptionButtonProps) {
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_description",
          context: title,
          content: currentDescription,
          instructions,
        }),
      })
      const data = await res.json()
      if (data.result) {
        onApply(data.result)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-6 px-2 text-xs text-accent hover:text-accent gap-1"
      onClick={generate}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
      {loading ? "Writing..." : "AI Write"}
    </Button>
  )
}
