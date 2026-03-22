"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Save, Trash2, Eye, EyeOff, Sparkles } from "lucide-react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BlockEditor, ContentBlock, blocksToHtml, htmlToBlocks } from "./block-editor"
import { generateSlug } from "@/lib/utils"
import { AIWriteButton } from "@/components/admin/ai-assistant"

interface BlogPost {
  id?: number
  title: string
  slug: string
  excerpt?: string
  content: string
  category_id?: number
  tags?: string[]
  meta_description?: string
  reading_time?: number
  is_published: boolean
  is_featured: boolean
  featured_image?: string
}

interface Category {
  id: number
  name: string
}

export function BlogPostForm({
  post,
  categories,
}: {
  post?: BlogPost
  categories: Category[]
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState("content")
  const [showPreview, setShowPreview] = useState(false)
  
  const [formData, setFormData] = useState<BlogPost>({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    category_id: post?.category_id,
    tags: post?.tags || [],
    meta_description: post?.meta_description || "",
    reading_time: post?.reading_time || 5,
    is_published: post?.is_published || false,
    is_featured: post?.is_featured || false,
    featured_image: post?.featured_image || "",
  })

  const [blocks, setBlocks] = useState<ContentBlock[]>(() => 
    htmlToBlocks(post?.content || "")
  )

  const [tagsInput, setTagsInput] = useState((post?.tags || []).join(", "))

  // Update content when blocks change
  useEffect(() => {
    const html = blocksToHtml(blocks)
    setFormData(prev => ({ ...prev, content: html }))
  }, [blocks])

  function estimateReadingTime(content: string) {
    const wordsPerMinute = 200
    const text = content.replace(/<[^>]*>/g, " ")
    const wordCount = text.split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    try {
      const method = post?.id ? "PATCH" : "POST"
      const body = {
        ...formData,
        id: post?.id,
        tags,
        reading_time: estimateReadingTime(formData.content),
      }

      await fetch("/api/admin/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      router.push("/admin/blog")
      router.refresh()
    } catch (error) {
      console.error("Failed to save blog post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!post?.id || !confirm("Are you sure you want to delete this post?")) {
      return
    }

    setIsDeleting(true)
    try {
      await fetch(`/api/admin/blog?id=${post.id}`, {
        method: "DELETE",
      })
      router.push("/admin/blog")
      router.refresh()
    } catch (error) {
      console.error("Failed to delete blog post:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const wordCount = formData.content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length
  const charCount = formData.content.replace(/<[^>]*>/g, "").length

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header with quick info */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Badge variant={formData.is_published ? "default" : "secondary"}>
            {formData.is_published ? "Published" : "Draft"}
          </Badge>
          {formData.is_featured && (
            <Badge variant="outline" className="border-amber-500 text-amber-500">
              <Sparkles className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          <span className="text-sm text-muted-foreground">
            {wordCount} words | {estimateReadingTime(formData.content)} min read
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="meta">Meta & SEO</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Post Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        title: e.target.value,
                        slug: post?.id ? formData.slug : generateSlug(e.target.value),
                      })
                    }}
                    placeholder="My Blog Post Title"
                    required
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">/blog/</span>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      placeholder="my-blog-post-title"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <AIWriteButton value={formData.excerpt || ""} onApply={(t) => setFormData({ ...formData, excerpt: t })} context={`blog post excerpt for: ${formData.title}`} />
                </div>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="A brief summary of the post that will appear in listings..."
                  rows={2}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="featured_image">Featured Image URL</Label>
                <Input
                  id="featured_image"
                  value={formData.featured_image}
                  onChange={(e) =>
                    setFormData({ ...formData, featured_image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
                {formData.featured_image && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-border max-w-md">
                    <img
                      src={formData.featured_image}
                      alt="Featured"
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none"
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Editor</CardTitle>
            </CardHeader>
            <CardContent>
              {showPreview ? (
                <div className="prose prose-invert max-w-none min-h-[400px] p-4 rounded-lg bg-muted/30">
                  <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                </div>
              ) : (
                <BlockEditor blocks={blocks} onChange={setBlocks} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meta & SEO Tab */}
        <TabsContent value="meta" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories & Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category</Label>
                  <Select
                    value={formData.category_id?.toString() || ""}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        category_id: value ? parseInt(value) : undefined,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="React, TypeScript, Web Development"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of tags
                  </p>
                </div>
              </div>

              {tagsInput && (
                <div className="flex flex-wrap gap-2">
                  {tagsInput.split(",").filter(t => t.trim()).map((tag) => (
                    <Badge key={tag.trim()} variant="secondary">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <AIWriteButton value={formData.meta_description || ""} onApply={(t) => setFormData({ ...formData, meta_description: t })} context={`SEO meta description for blog: ${formData.title}`} />
                </div>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData({ ...formData, meta_description: e.target.value })
                  }
                  placeholder="A short description for search engines (recommended: 150-160 characters)"
                  rows={3}
                  className="resize-none"
                />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    Recommended: 150-160 characters
                  </span>
                  <span className={formData.meta_description && formData.meta_description.length > 160 ? "text-destructive" : "text-muted-foreground"}>
                    {formData.meta_description?.length || 0}/160
                  </span>
                </div>
              </div>

              {/* SEO Preview */}
              <div className="p-4 rounded-lg bg-muted/30 space-y-1">
                <p className="text-xs text-muted-foreground mb-2">Search Preview:</p>
                <p className="text-blue-400 text-lg hover:underline cursor-pointer truncate">
                  {formData.title || "Post Title"}
                </p>
                <p className="text-sm text-green-500 truncate">
                  yoursite.com/blog/{formData.slug || "post-slug"}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {formData.meta_description || formData.excerpt || "Add a meta description to improve your SEO..."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Publication Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-1">
                  <Label htmlFor="is_published" className="text-base">Published</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this post visible on your blog
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

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-1">
                  <Label htmlFor="is_featured" className="text-base">Featured Post</Label>
                  <p className="text-sm text-muted-foreground">
                    Show this post prominently on your homepage
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

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Post Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-foreground">{wordCount}</p>
                  <p className="text-sm text-muted-foreground">Words</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-foreground">{charCount}</p>
                  <p className="text-sm text-muted-foreground">Characters</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-foreground">
                    {estimateReadingTime(formData.content)}
                  </p>
                  <p className="text-sm text-muted-foreground">Min Read</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        {post?.id ? (
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
            Delete Post
          </Button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/blog")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {post?.id ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </div>
    </form>
  )
}
