"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { generateSlug } from "@/lib/utils"
import { AIWriteButton } from "@/components/admin/ai-assistant"

interface Project {
  id?: number
  title: string
  slug: string
  short_description: string
  full_description?: string
  problem_statement?: string
  solution?: string
  tech_stack?: string[]
  category_id?: number | null
  results_metrics?: Record<string, string>
  live_url?: string
  github_url?: string
  is_published: boolean
  is_featured: boolean
}

interface ProjectCategory {
  id: number
  name: string
  slug: string
}

export function ProjectForm({ 
  project,
  categories = []
}: { 
  project?: Project
  categories?: ProjectCategory[]
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<Project>({
    title: project?.title || "",
    slug: project?.slug || "",
    short_description: project?.short_description || "",
    full_description: project?.full_description || "",
    problem_statement: project?.problem_statement || "",
    solution: project?.solution || "",
    tech_stack: project?.tech_stack || [],
    category_id: project?.category_id || null,
    results_metrics: project?.results_metrics || {},
    live_url: project?.live_url || "",
    github_url: project?.github_url || "",
    is_published: project?.is_published || false,
    is_featured: project?.is_featured || false,
  })

  const [techStackInput, setTechStackInput] = useState(
    (project?.tech_stack || []).join(", ")
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const techStack = techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    try {
      const method = project?.id ? "PATCH" : "POST"
      const body = {
        ...formData,
        id: project?.id,
        tech_stack: techStack,
      }

      await fetch("/api/admin/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      router.push("/admin/projects")
      router.refresh()
    } catch (error) {
      console.error("Failed to save project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!project?.id || !confirm("Are you sure you want to delete this project?")) {
      return
    }

    setIsDeleting(true)
    try {
      await fetch(`/api/admin/projects?id=${project.id}`, {
        method: "DELETE",
      })
      router.push("/admin/projects")
      router.refresh()
    } catch (error) {
      console.error("Failed to delete project:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    title: e.target.value,
                    slug: project?.id ? formData.slug : generateSlug(e.target.value),
                  })
                }}
                placeholder="My Awesome Project"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="my-awesome-project"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="short_description">Short Description *</Label>
              <AIWriteButton value={formData.short_description} onApply={(t) => setFormData({ ...formData, short_description: t })} context={`project: ${formData.title}`} />
            </div>
            <Textarea
              id="short_description"
              value={formData.short_description}
              onChange={(e) =>
                setFormData({ ...formData, short_description: e.target.value })
              }
              placeholder="A brief description of the project..."
              rows={2}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <Select
                value={formData.category_id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, category_id: value ? parseInt(value) : null })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech_stack">Tech Stack</Label>
              <Input
                id="tech_stack"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                placeholder="React, Next.js, TypeScript, PostgreSQL"
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated list of technologies
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-medium text-foreground">Case Study Details</h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="problem_statement">The Challenge</Label>
              <AIWriteButton value={formData.problem_statement || ""} onApply={(t) => setFormData({ ...formData, problem_statement: t })} context={`challenge for project: ${formData.title}`} />
            </div>
            <Textarea
              id="problem_statement"
              value={formData.problem_statement}
              onChange={(e) =>
                setFormData({ ...formData, problem_statement: e.target.value })
              }
              placeholder="What problem did this project solve?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="solution">The Solution</Label>
              <AIWriteButton value={formData.solution || ""} onApply={(t) => setFormData({ ...formData, solution: t })} context={`solution for project: ${formData.title}`} />
            </div>
            <Textarea
              id="solution"
              value={formData.solution}
              onChange={(e) =>
                setFormData({ ...formData, solution: e.target.value })
              }
              placeholder="How did you solve the problem?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="full_description">Full Description</Label>
              <AIWriteButton value={formData.full_description || ""} onApply={(t) => setFormData({ ...formData, full_description: t })} context={`full description for project: ${formData.title}`} />
            </div>
            <Textarea
              id="full_description"
              value={formData.full_description}
              onChange={(e) =>
                setFormData({ ...formData, full_description: e.target.value })
              }
              placeholder="Detailed project description..."
              rows={5}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-medium text-foreground">Links</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="live_url">Live Demo URL</Label>
              <Input
                id="live_url"
                type="url"
                value={formData.live_url}
                onChange={(e) =>
                  setFormData({ ...formData, live_url: e.target.value })
                }
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                type="url"
                value={formData.github_url}
                onChange={(e) =>
                  setFormData({ ...formData, github_url: e.target.value })
                }
                placeholder="https://github.com/user/repo"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-medium text-foreground">Visibility</h3>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_published">Published</Label>
              <p className="text-sm text-muted-foreground">
                Make this project visible on your portfolio
              </p>
            </div>
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_published: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_featured">Featured</Label>
              <p className="text-sm text-muted-foreground">
                Show this project prominently on your homepage
              </p>
            </div>
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_featured: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        {project?.id ? (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete Project
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {project?.id ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  )
}
