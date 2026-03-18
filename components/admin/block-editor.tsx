"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Code,
  Quote,
  List,
  ListOrdered,
  Minus,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Copy,
  MoreHorizontal,
  AlertCircle,
  Info,
  CheckCircle2,
  XCircle,
  Upload,
  Link,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type BlockType =
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "image"
  | "code"
  | "quote"
  | "list"
  | "ordered-list"
  | "divider"
  | "callout"

export interface ContentBlock {
  id: string
  type: BlockType
  content: string
  metadata?: {
    alt?: string
    caption?: string
    language?: string
    alignment?: "left" | "center" | "right"
    items?: string[]
    variant?: "info" | "warning" | "success" | "error"
    link?: string
  }
}

interface BlockEditorProps {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
}

const blockCategories = [
  {
    name: "Text",
    blocks: [
      { type: "paragraph" as BlockType, label: "Paragraph", icon: Type, description: "Plain text content" },
      { type: "heading1" as BlockType, label: "Heading 1", icon: Heading1, description: "Large section heading" },
      { type: "heading2" as BlockType, label: "Heading 2", icon: Heading2, description: "Medium section heading" },
      { type: "heading3" as BlockType, label: "Heading 3", icon: Heading3, description: "Small section heading" },
    ],
  },
  {
    name: "Media",
    blocks: [
      { type: "image" as BlockType, label: "Image", icon: Image, description: "Upload or link an image" },
      { type: "code" as BlockType, label: "Code Block", icon: Code, description: "Syntax highlighted code" },
    ],
  },
  {
    name: "Structure",
    blocks: [
      { type: "quote" as BlockType, label: "Quote", icon: Quote, description: "Blockquote with attribution" },
      { type: "list" as BlockType, label: "Bullet List", icon: List, description: "Unordered list" },
      { type: "ordered-list" as BlockType, label: "Numbered List", icon: ListOrdered, description: "Ordered list" },
      { type: "callout" as BlockType, label: "Callout", icon: AlertCircle, description: "Highlighted info box" },
      { type: "divider" as BlockType, label: "Divider", icon: Minus, description: "Horizontal separator" },
    ],
  },
]

const allBlockTypes = blockCategories.flatMap((cat) => cat.blocks)

const generateId = () => Math.random().toString(36).substring(2, 9)

const calloutVariants = [
  { value: "info", label: "Info", icon: Info, color: "text-blue-500" },
  { value: "warning", label: "Warning", icon: AlertCircle, color: "text-yellow-500" },
  { value: "success", label: "Success", icon: CheckCircle2, color: "text-green-500" },
  { value: "error", label: "Error", icon: XCircle, color: "text-red-500" },
]

const codeLanguages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "bash", label: "Bash" },
  { value: "sql", label: "SQL" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "java", label: "Java" },
  { value: "php", label: "PHP" },
]

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(
    new Set(blocks.map((b) => b.id))
  )
  const [focusedBlock, setFocusedBlock] = useState<string | null>(null)

  const addBlock = useCallback(
    (type: BlockType, afterId?: string) => {
      const newBlock: ContentBlock = {
        id: generateId(),
        type,
        content: "",
        metadata: 
          type === "list" || type === "ordered-list" 
            ? { items: [""] } 
            : type === "callout" 
            ? { variant: "info" }
            : type === "code"
            ? { language: "javascript" }
            : {},
      }

      if (afterId) {
        const index = blocks.findIndex((b) => b.id === afterId)
        const newBlocks = [...blocks]
        newBlocks.splice(index + 1, 0, newBlock)
        onChange(newBlocks)
      } else {
        onChange([...blocks, newBlock])
      }

      setExpandedBlocks((prev) => new Set([...prev, newBlock.id]))
      setFocusedBlock(newBlock.id)
    },
    [blocks, onChange]
  )

  const updateBlock = useCallback(
    (id: string, updates: Partial<ContentBlock>) => {
      onChange(
        blocks.map((block) =>
          block.id === id ? { ...block, ...updates } : block
        )
      )
    },
    [blocks, onChange]
  )

  const deleteBlock = useCallback(
    (id: string) => {
      onChange(blocks.filter((block) => block.id !== id))
      setExpandedBlocks((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    },
    [blocks, onChange]
  )

  const duplicateBlock = useCallback(
    (id: string) => {
      const index = blocks.findIndex((b) => b.id === id)
      if (index === -1) return
      
      const block = blocks[index]
      const newBlock: ContentBlock = {
        ...block,
        id: generateId(),
        metadata: block.metadata ? { ...block.metadata } : undefined,
      }
      
      const newBlocks = [...blocks]
      newBlocks.splice(index + 1, 0, newBlock)
      onChange(newBlocks)
      setExpandedBlocks((prev) => new Set([...prev, newBlock.id]))
    },
    [blocks, onChange]
  )

  const toggleExpanded = (id: string) => {
    setExpandedBlocks((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((b) => b.id === id)
    if (index === -1) return
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === blocks.length - 1) return

    const newBlocks = [...blocks]
    const newIndex = direction === "up" ? index - 1 : index + 1
    ;[newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]]
    onChange(newBlocks)
  }

  const renderBlockContent = (block: ContentBlock) => {
    const isExpanded = expandedBlocks.has(block.id)

    switch (block.type) {
      case "paragraph":
        return (
          <Textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Start writing your content..."
            className="min-h-[100px] resize-none border-0 focus-visible:ring-0 bg-transparent text-foreground leading-relaxed"
            onFocus={() => setFocusedBlock(block.id)}
          />
        )

      case "heading1":
      case "heading2":
      case "heading3":
        return (
          <Input
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder={`Enter ${block.type === "heading1" ? "main" : block.type === "heading2" ? "section" : "sub"} heading...`}
            className={cn(
              "border-0 focus-visible:ring-0 bg-transparent font-bold",
              block.type === "heading1" && "text-2xl sm:text-3xl",
              block.type === "heading2" && "text-xl sm:text-2xl",
              block.type === "heading3" && "text-lg sm:text-xl"
            )}
            onFocus={() => setFocusedBlock(block.id)}
          />
        )

      case "image":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Input
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  placeholder="Paste image URL or upload..."
                  className="w-full"
                />
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
            
            {isExpanded && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Alt Text</Label>
                  <Input
                    value={block.metadata?.alt || ""}
                    onChange={(e) =>
                      updateBlock(block.id, {
                        metadata: { ...block.metadata, alt: e.target.value },
                      })
                    }
                    placeholder="Describe the image for accessibility"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Caption</Label>
                  <Input
                    value={block.metadata?.caption || ""}
                    onChange={(e) =>
                      updateBlock(block.id, {
                        metadata: { ...block.metadata, caption: e.target.value },
                      })
                    }
                    placeholder="Optional image caption"
                  />
                </div>
              </div>
            )}
            
            {block.content && (
              <div className="mt-3 rounded-lg overflow-hidden border border-border bg-muted/30">
                <img
                  src={block.content}
                  alt={block.metadata?.alt || ""}
                  className="w-full h-auto max-h-64 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    target.parentElement?.classList.add("hidden")
                  }}
                />
                {block.metadata?.caption && (
                  <p className="text-xs text-center text-muted-foreground p-2 border-t">
                    {block.metadata.caption}
                  </p>
                )}
              </div>
            )}
          </div>
        )

      case "code":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Select
                value={block.metadata?.language || "javascript"}
                onValueChange={(value) =>
                  updateBlock(block.id, {
                    metadata: { ...block.metadata, language: value },
                  })
                }
              >
                <SelectTrigger className="w-36 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {codeLanguages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="outline" className="text-xs">
                {block.metadata?.language || "javascript"}
              </Badge>
            </div>
            <Textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="// Paste or write your code here..."
              className="min-h-[150px] font-mono text-sm bg-muted/50 resize-none"
              onFocus={() => setFocusedBlock(block.id)}
            />
          </div>
        )

      case "quote":
        return (
          <div className="border-l-4 border-primary pl-4 space-y-3">
            <Textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="Enter your quote..."
              className="min-h-[80px] resize-none border-0 focus-visible:ring-0 bg-transparent italic text-lg leading-relaxed"
              onFocus={() => setFocusedBlock(block.id)}
            />
            {isExpanded && (
              <Input
                value={block.metadata?.caption || ""}
                onChange={(e) =>
                  updateBlock(block.id, {
                    metadata: { ...block.metadata, caption: e.target.value },
                  })
                }
                placeholder="— Attribution (e.g., John Doe, CEO)"
                className="text-sm text-muted-foreground border-0 focus-visible:ring-0 bg-transparent"
              />
            )}
          </div>
        )

      case "callout":
        const selectedVariant = calloutVariants.find(
          (v) => v.value === (block.metadata?.variant || "info")
        ) || calloutVariants[0]
        const VariantIcon = selectedVariant.icon

        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Type:</Label>
              <Select
                value={block.metadata?.variant || "info"}
                onValueChange={(value) =>
                  updateBlock(block.id, {
                    metadata: { ...block.metadata, variant: value as "info" | "warning" | "success" | "error" },
                  })
                }
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {calloutVariants.map((variant) => {
                    const Icon = variant.icon
                    return (
                      <SelectItem key={variant.value} value={variant.value}>
                        <div className="flex items-center gap-2">
                          <Icon className={cn("h-4 w-4", variant.color)} />
                          {variant.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className={cn(
              "flex gap-3 p-4 rounded-lg border",
              block.metadata?.variant === "warning" && "bg-yellow-500/10 border-yellow-500/30",
              block.metadata?.variant === "success" && "bg-green-500/10 border-green-500/30",
              block.metadata?.variant === "error" && "bg-red-500/10 border-red-500/30",
              (!block.metadata?.variant || block.metadata?.variant === "info") && "bg-blue-500/10 border-blue-500/30"
            )}>
              <VariantIcon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", selectedVariant.color)} />
              <Textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Write your callout content..."
                className="min-h-[60px] resize-none border-0 focus-visible:ring-0 bg-transparent p-0"
                onFocus={() => setFocusedBlock(block.id)}
              />
            </div>
          </div>
        )

      case "list":
      case "ordered-list":
        const items = block.metadata?.items || [""]
        return (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-muted-foreground w-6 text-center flex-shrink-0">
                  {block.type === "ordered-list" ? `${index + 1}.` : "•"}
                </span>
                <Input
                  value={item}
                  onChange={(e) => {
                    const newItems = [...items]
                    newItems[index] = e.target.value
                    updateBlock(block.id, {
                      metadata: { ...block.metadata, items: newItems },
                    })
                  }}
                  placeholder="List item"
                  className="flex-1 border-0 focus-visible:ring-0 bg-transparent"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const newItems = [...items]
                      newItems.splice(index + 1, 0, "")
                      updateBlock(block.id, {
                        metadata: { ...block.metadata, items: newItems },
                      })
                    } else if (
                      e.key === "Backspace" &&
                      item === "" &&
                      items.length > 1
                    ) {
                      e.preventDefault()
                      const newItems = items.filter((_, i) => i !== index)
                      updateBlock(block.id, {
                        metadata: { ...block.metadata, items: newItems },
                      })
                    }
                  }}
                  onFocus={() => setFocusedBlock(block.id)}
                />
                {items.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                    onClick={() => {
                      const newItems = items.filter((_, i) => i !== index)
                      updateBlock(block.id, {
                        metadata: { ...block.metadata, items: newItems },
                      })
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground ml-6"
              onClick={() => {
                updateBlock(block.id, {
                  metadata: { ...block.metadata, items: [...items, ""] },
                })
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add item
            </Button>
          </div>
        )

      case "divider":
        return (
          <div className="py-4">
            <hr className="border-border" />
          </div>
        )

      default:
        return null
    }
  }

  const getBlockIcon = (type: BlockType) => {
    const blockType = allBlockTypes.find((b) => b.type === type)
    return blockType?.icon || Type
  }

  const getBlockLabel = (type: BlockType) => {
    const blockType = allBlockTypes.find((b) => b.type === type)
    return blockType?.label || "Block"
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {blocks.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center border-dashed">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Type className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Start writing your content</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add blocks to build your blog post. Mix text, images, code, and more.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {blockCategories[0].blocks.slice(0, 3).map((bt) => {
                const Icon = bt.icon
                return (
                  <Button
                    key={bt.type}
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock(bt.type)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {bt.label}
                  </Button>
                )
              })}
            </div>
          </Card>
        ) : (
          <Reorder.Group
            axis="y"
            values={blocks}
            onReorder={onChange}
            className="space-y-3"
          >
            <AnimatePresence>
              {blocks.map((block, index) => {
                const Icon = getBlockIcon(block.type)
                const isExpanded = expandedBlocks.has(block.id)
                const isFocused = focusedBlock === block.id

                return (
                  <Reorder.Item
                    key={block.id}
                    value={block}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className={cn(
                      "group relative overflow-hidden transition-all",
                      isFocused ? "border-primary/50 shadow-sm" : "border-border/50 hover:border-border"
                    )}>
                      <div className="flex items-start">
                        {/* Drag Handle */}
                        <div className="hidden sm:flex flex-col items-center justify-center w-10 py-3 cursor-grab active:cursor-grabbing border-r border-border/50 bg-muted/30 touch-none">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>

                        {/* Block Content */}
                        <div className="flex-1 p-3 sm:p-4 min-w-0">
                          {/* Block Header */}
                          <div className="flex items-center justify-between mb-3 gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="flex items-center justify-center w-7 h-7 rounded bg-primary/10 flex-shrink-0">
                                <Icon className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-sm font-medium text-muted-foreground truncate">
                                {getBlockLabel(block.type)}
                              </span>
                              {block.type === "code" && block.metadata?.language && (
                                <Badge variant="secondary" className="text-[10px]">
                                  {block.metadata.language}
                                </Badge>
                              )}
                            </div>

                            {/* Desktop Actions */}
                            <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {block.type !== "divider" && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => toggleExpanded(block.id)}
                                    >
                                      {isExpanded ? (
                                        <ChevronUp className="h-3 w-3" />
                                      ) : (
                                        <ChevronDown className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {isExpanded ? "Collapse" : "Expand"}
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                  {blockCategories.map((category) => (
                                    <div key={category.name}>
                                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                        {category.name}
                                      </div>
                                      {category.blocks.map((bt) => {
                                        const BIcon = bt.icon
                                        return (
                                          <DropdownMenuItem
                                            key={bt.type}
                                            onClick={() => addBlock(bt.type, block.id)}
                                          >
                                            <BIcon className="h-4 w-4 mr-2" />
                                            <div>
                                              <div>{bt.label}</div>
                                              <div className="text-xs text-muted-foreground">
                                                {bt.description}
                                              </div>
                                            </div>
                                          </DropdownMenuItem>
                                        )
                                      })}
                                      {category !== blockCategories[blockCategories.length - 1] && (
                                        <DropdownMenuSeparator />
                                      )}
                                    </div>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => duplicateBlock(block.id)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Duplicate</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                    onClick={() => deleteBlock(block.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete</TooltipContent>
                              </Tooltip>
                            </div>

                            {/* Mobile Actions */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild className="sm:hidden">
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => moveBlock(block.id, "up")} disabled={index === 0}>
                                  <ChevronUp className="h-4 w-4 mr-2" />
                                  Move Up
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => moveBlock(block.id, "down")} disabled={index === blocks.length - 1}>
                                  <ChevronDown className="h-4 w-4 mr-2" />
                                  Move Down
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => duplicateBlock(block.id)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => deleteBlock(block.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Block Editor */}
                          {renderBlockContent(block)}
                        </div>
                      </div>
                    </Card>
                  </Reorder.Item>
                )
              })}
            </AnimatePresence>
          </Reorder.Group>
        )}

        {/* Add New Block Button */}
        {blocks.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-dashed hover:border-solid hover:border-primary/50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Block
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              {blockCategories.map((category) => (
                <div key={category.name}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {category.name}
                  </div>
                  {category.blocks.map((bt) => {
                    const BIcon = bt.icon
                    return (
                      <DropdownMenuItem key={bt.type} onClick={() => addBlock(bt.type)}>
                        <BIcon className="h-4 w-4 mr-2" />
                        <div>
                          <div>{bt.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {bt.description}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    )
                  })}
                  {category !== blockCategories[blockCategories.length - 1] && (
                    <DropdownMenuSeparator />
                  )}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </TooltipProvider>
  )
}
// --------------------- Add at the bottom of block-editor.tsx ---------------------

export function blocksToHtml(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      const { type, content, metadata = {} } = block;

      switch (type) {
        case "paragraph":
          return `<p>${content}</p>`;

        case "heading1":
          return `<h1>${content}</h1>`;
        case "heading2":
          return `<h2>${content}</h2>`;
        case "heading3":
          return `<h3>${content}</h3>`;

        case "image": {
          const alt = metadata.alt || "";
          const caption = metadata.caption ? `<figcaption>${metadata.caption}</figcaption>` : "";
          return `<figure><img src="${content}" alt="${alt}" />${caption}</figure>`;
        }

        case "code": {
          const lang = metadata.language || "text";
          return `<pre><code class="language-${lang}">${content}</code></pre>`;
        }

        case "quote": {
          const cite = metadata.caption ? `<cite>${metadata.caption}</cite>` : "";
          return `<blockquote>${content}${cite ? `<footer>${cite}</footer>` : ""}</blockquote>`;
        }

        case "list":
        case "ordered-list": {
          const tag = type === "ordered-list" ? "ol" : "ul";
          const items = (metadata.items || []).map((item) => `<li>${item}</li>`).join("");
          return `<${tag}>${items}</${tag}>`;
        }

        case "callout": {
          const variant = metadata.variant || "info";
          return `<div class="callout callout-${variant}">${content}</div>`;
        }

        case "divider":
          return `<hr />`;

        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n");
}

export function htmlToBlocks(html: string): ContentBlock[] {
  // Very basic / safe fallback implementation
  // In production you should use a real HTML → JSON blocks parser
  // (e.g. DOMParser + custom logic, or turndown + custom mapping, or @tiptap/html)

  if (!html.trim()) return [];

  // Naive split by common block-level tags (not robust – improve later)
  const blocks: ContentBlock[] = [];
  let idCounter = 0;

  // Very simple example – you should expand this significantly
  const div = document.createElement("div");
  div.innerHTML = html;

  Array.from(div.children).forEach((el) => {
    const tag = el.tagName.toLowerCase();
    idCounter++;

    let type: BlockType = "paragraph";
    let content = el.innerHTML;
    let metadata: any = {};

    if (tag === "h1") type = "heading1";
    else if (tag === "h2") type = "heading2";
    else if (tag === "h3") type = "heading3";
    else if (tag === "pre") {
      type = "code";
      const codeEl = el.querySelector("code");
      if (codeEl) {
        const langClass = [...codeEl.classList].find((c) => c.startsWith("language-"));
        metadata.language = langClass ? langClass.replace("language-", "") : "text";
        content = codeEl.textContent || "";
      }
    }
    else if (tag === "blockquote") {
      type = "quote";
      const cite = el.querySelector("cite, footer");
      if (cite) metadata.caption = cite.textContent?.trim() || "";
      content = el.firstChild?.textContent?.trim() || "";
    }
    else if (tag === "ul" || tag === "ol") {
      type = tag === "ol" ? "ordered-list" : "list";
      metadata.items = Array.from(el.children).map((li) => li.textContent?.trim() || "");
    }
    else if (tag === "hr") {
      type = "divider";
      content = "";
    }
    else if (tag === "figure" || tag === "img") {
      type = "image";
      const img = tag === "img" ? el : el.querySelector("img");
      content = img?.getAttribute("src") || "";
      metadata.alt = img?.getAttribute("alt") || "";
      const figcaption = el.querySelector("figcaption");
      if (figcaption) metadata.caption = figcaption.textContent?.trim();
    }
    // callout → you would need class matching logic

    blocks.push({
      id: `block-${idCounter}`,
      type,
      content: content.trim(),
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    });
  });

  return blocks.length > 0 ? blocks : [{ id: "fallback", type: "paragraph", content: html }];
}