"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AIWriteButton } from "@/components/admin/ai-assistant"

interface SiteSettings {
  id?: number
  developer_name: string
  professional_title: string
  site_description: string
  email: string
  phone: string | null
  location: string | null
  github_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
}

export function SiteSettingsForm({
  settings,
}: {
  settings: SiteSettings | null
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<SiteSettings>({
    developer_name: settings?.developer_name || "",
    professional_title: settings?.professional_title || "",
    site_description: settings?.site_description || "",
    email: settings?.email || "",
    phone: settings?.phone || "",
    location: settings?.location || "",
    github_url: settings?.github_url || "",
    linkedin_url: settings?.linkedin_url || "",
    twitter_url: settings?.twitter_url || "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to save settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="developer_name">Full Name</Label>
          <Input
            id="developer_name"
            value={formData.developer_name}
            onChange={(e) =>
              setFormData({ ...formData, developer_name: e.target.value })
            }
            placeholder="Akash Vishwakarma"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="professional_title">Professional Title</Label>
          <Input
            id="professional_title"
            value={formData.professional_title}
            onChange={(e) =>
              setFormData({ ...formData, professional_title: e.target.value })
            }
            placeholder="Full-Stack Product Engineer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="site_description">Bio / Site Description</Label>
          <AIWriteButton value={formData.site_description} onApply={(t) => setFormData({ ...formData, site_description: t })} context={`professional bio for ${formData.developer_name}, ${formData.professional_title}`} />
        </div>
        <Textarea
          id="site_description"
          value={formData.site_description}
          onChange={(e) =>
            setFormData({ ...formData, site_description: e.target.value })
          }
          placeholder="A brief description of yourself and what you do..."
          rows={4}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="hello@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input
            id="phone"
            value={formData.phone || ""}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location || ""}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="San Francisco, CA"
        />
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="font-medium text-foreground mb-4">Social Links</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              value={formData.github_url || ""}
              onChange={(e) =>
                setFormData({ ...formData, github_url: e.target.value })
              }
              placeholder="https://github.com/username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              value={formData.linkedin_url || ""}
              onChange={(e) =>
                setFormData({ ...formData, linkedin_url: e.target.value })
              }
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter_url">Twitter URL</Label>
            <Input
              id="twitter_url"
              value={formData.twitter_url || ""}
              onChange={(e) =>
                setFormData({ ...formData, twitter_url: e.target.value })
              }
              placeholder="https://twitter.com/username"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Settings
        </Button>
      </div>
    </form>
  )
}
