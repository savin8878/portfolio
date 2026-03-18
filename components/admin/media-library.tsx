"use client"

import { useState, useCallback } from "react"
import { Upload, Image, FileText, X, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MediaFile {
  id: string
  name: string
  url: string
  type: "image" | "file"
  size: number
  uploadedAt: Date
}

export function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // File upload logic would go here
    // For now, this is a placeholder
  }, [])

  const copyToClipboard = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-12 text-center transition-colors",
          isDragging
            ? "border-accent bg-accent/10"
            : "border-border hover:border-muted-foreground"
        )}
      >
        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-foreground font-medium mb-2">
          Drop files here to upload
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          PNG, JPG, GIF, SVG, PDF up to 10MB
        </p>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Choose Files
        </Button>
      </div>

      {/* Files Grid */}
      {files.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="relative group rounded-xl border border-border overflow-hidden bg-card"
            >
              {file.type === "image" ? (
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <Image className="h-12 w-12 text-muted-foreground" />
                </div>
              ) : (
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => copyToClipboard(file.url, file.id)}
                >
                  {copiedId === file.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button size="sm" variant="destructive">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* File Info */}
              <div className="p-3">
                <p className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Image className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="font-medium">No files uploaded yet</p>
          <p className="text-sm">
            Upload images and files to use them across your portfolio
          </p>
        </div>
      )}
    </div>
  )
}
