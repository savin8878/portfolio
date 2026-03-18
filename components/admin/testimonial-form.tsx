"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, Trash2, Star } from "lucide-react"
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
import { cn } from "@/lib/utils"

interface Testimonial {
  id?: number
  client_name: string
  client_title?: string
  client_company?: string
  testimonial_text: string
  rating: number
  project_id?: number
  is_active: boolean
  is_featured: boolean
}

interface Project {
  id: number
  title: string
}

export function TestimonialForm({
  testimonial,
  projects,
}: {
  testimonial?: Testimonial
  projects: Project[]
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<Testimonial>({
    client_name: testimonial?.client_name || "",
    client_title: testimonial?.client_title || "",
    client_company: testimonial?.client_company || "",
    testimonial_text: testimonial?.testimonial_text || "",
    rating: testimonial?.rating || 5,
    project_id: testimonial?.project_id,
    is_active: testimonial?.is_active ?? true,
    is_featured: testimonial?.is_featured || false,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const method = testimonial?.id ? "PATCH" : "POST"
      const body = {
        ...formData,
        id: testimonial?.id,
      }

      await fetch("/api/admin/testimonials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      router.push("/admin/testimonials")
      router.refresh()
    } catch (error) {
      console.error("Failed to save testimonial:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!testimonial?.id || !confirm("Are you sure you want to delete this testimonial?")) {
      return
    }

    setIsDeleting(true)
    try {
      await fetch(`/api/admin/testimonials?id=${testimonial.id}`, {
        method: "DELETE",
      })
      router.push("/admin/testimonials")
      router.refresh()
    } catch (error) {
      console.error("Failed to delete testimonial:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-medium text-foreground">Client Information</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name *</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) =>
                  setFormData({ ...formData, client_name: e.target.value })
                }
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_title">Job Title</Label>
              <Input
                id="client_title"
                value={formData.client_title}
                onChange={(e) =>
                  setFormData({ ...formData, client_title: e.target.value })
                }
                placeholder="CEO, CTO, Product Manager..."
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client_company">Company</Label>
              <Input
                id="client_company"
                value={formData.client_company}
                onChange={(e) =>
                  setFormData({ ...formData, client_company: e.target.value })
                }
                placeholder="Acme Inc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project_id">Related Project</Label>
              <Select
                value={formData.project_id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    project_id: value ? parseInt(value) : undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-medium text-foreground">Testimonial</h3>

          <div className="space-y-2">
            <Label htmlFor="testimonial_text">Testimonial Content *</Label>
            <Textarea
              id="testimonial_text"
              value={formData.testimonial_text}
              onChange={(e) =>
                setFormData({ ...formData, testimonial_text: e.target.value })
              }
              placeholder="What did the client say about working with you?"
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1"
                >
                  <Star
                    className={cn(
                      "h-6 w-6 transition-colors",
                      star <= formData.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-medium text-foreground">Visibility</h3>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_active">Active</Label>
              <p className="text-sm text-muted-foreground">
                Show this testimonial on your site
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_featured">Featured</Label>
              <p className="text-sm text-muted-foreground">
                Show prominently on your homepage
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
        {testimonial?.id ? (
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
            Delete Testimonial
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
          {testimonial?.id ? "Update Testimonial" : "Add Testimonial"}
        </Button>
      </div>
    </form>
  )
}
