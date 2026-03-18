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

interface Service {
  id?: number
  title: string
  slug?: string
  short_description?: string
  full_description?: string
  icon?: string
  features?: string[]
  price_range?: string
  delivery_time?: string
  display_order: number
  is_active: boolean
  is_featured?: boolean
}

const iconOptions = [
  { value: "Code", label: "Code" },
  { value: "Rocket", label: "Rocket" },
  { value: "Zap", label: "Zap" },
  { value: "Server", label: "Server" },
  { value: "Database", label: "Database" },
  { value: "Cloud", label: "Cloud" },
  { value: "Shield", label: "Shield" },
  { value: "Settings", label: "Settings" },
  { value: "Globe", label: "Globe" },
  { value: "Smartphone", label: "Smartphone" },
]

export function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<Service>({
    title: service?.title || "",
    slug: service?.slug || "",
    short_description: service?.short_description || "",
    full_description: service?.full_description || "",
    icon: service?.icon || "Code",
    features: service?.features || [],
    price_range: service?.price_range || "",
    delivery_time: service?.delivery_time || "",
    display_order: service?.display_order || 0,
    is_active: service?.is_active ?? true,
    is_featured: service?.is_featured ?? false,
  })

  const [featuresInput, setFeaturesInput] = useState(
    (service?.features || []).join("\n")
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const features = featuresInput
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean)

    try {
      const method = service?.id ? "PATCH" : "POST"
      const body = {
        ...formData,
        id: service?.id,
        features,
      }

      await fetch("/api/admin/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      router.push("/admin/services")
      router.refresh()
    } catch (error) {
      console.error("Failed to save service:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!service?.id || !confirm("Are you sure you want to delete this service?")) {
      return
    }

    setIsDeleting(true)
    try {
      await fetch(`/api/admin/services?id=${service.id}`, {
        method: "DELETE",
      })
      router.push("/admin/services")
      router.refresh()
    } catch (error) {
      console.error("Failed to delete service:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-medium text-foreground">Service Details</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Service Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="SaaS Development"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formData.icon || "Code"}
                onValueChange={(value) =>
                  setFormData({ ...formData, icon: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Textarea
              id="short_description"
              value={formData.short_description}
              onChange={(e) =>
                setFormData({ ...formData, short_description: e.target.value })
              }
              placeholder="A brief description of this service..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_description">Full Description</Label>
            <Textarea
              id="full_description"
              value={formData.full_description}
              onChange={(e) =>
                setFormData({ ...formData, full_description: e.target.value })
              }
              placeholder="Detailed description of the service..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-medium text-foreground">Features & Pricing</h3>

          <div className="space-y-2">
            <Label htmlFor="features">Features</Label>
            <Textarea
              id="features"
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              Enter each feature on a new line
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price_range">Price Range</Label>
              <Input
                id="price_range"
                value={formData.price_range}
                onChange={(e) =>
                  setFormData({ ...formData, price_range: e.target.value })
                }
                placeholder="$5,000 - $15,000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display_order: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first
              </p>
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
                Show this service on your site
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
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        {service?.id ? (
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
            Delete Service
          </Button>
        ) : (
          <div />
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {service?.id ? "Update Service" : "Add Service"}
        </Button>
      </div>
    </form>
  )
}
