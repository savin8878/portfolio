"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  GripVertical,
  Plus,
  Trash2,
  Settings,
  Eye,
  EyeOff,
  Type,
  Mail,
  Phone,
  AlignLeft,
  List,
  CheckSquare,
  Calendar,
  Hash,
  Globe,
  Building,
  DollarSign,
  Clock,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Copy,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FormField {
  id: number
  field_name: string
  field_label: string
  field_type: string
  placeholder?: string
  is_required: boolean
  is_active: boolean
  display_order: number
  options?: string[]
  validation_rules?: Record<string, unknown>
  field_width?: string
  help_text?: string
}

const fieldTypeIcons: Record<string, React.ReactNode> = {
  text: <Type className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  phone: <Phone className="h-4 w-4" />,
  textarea: <AlignLeft className="h-4 w-4" />,
  select: <List className="h-4 w-4" />,
  checkbox: <CheckSquare className="h-4 w-4" />,
  date: <Calendar className="h-4 w-4" />,
  number: <Hash className="h-4 w-4" />,
  url: <Globe className="h-4 w-4" />,
  company: <Building className="h-4 w-4" />,
  budget: <DollarSign className="h-4 w-4" />,
  timeline: <Clock className="h-4 w-4" />,
}

const fieldTypes = [
  { value: "text", label: "Text Input", icon: Type },
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "textarea", label: "Text Area", icon: AlignLeft },
  { value: "select", label: "Dropdown", icon: List },
  { value: "checkbox", label: "Checkbox", icon: CheckSquare },
  { value: "date", label: "Date Picker", icon: Calendar },
  { value: "number", label: "Number", icon: Hash },
  { value: "url", label: "URL", icon: Globe },
]

const fieldWidthOptions = [
  { value: "full", label: "Full Width" },
  { value: "half", label: "Half Width" },
  { value: "third", label: "One Third" },
  { value: "two-thirds", label: "Two Thirds" },
]

function SortableFieldItem({
  field,
  onEdit,
  onToggleActive,
  onDelete,
  onDuplicate,
}: {
  field: FormField
  onEdit: (field: FormField) => void
  onToggleActive: (id: number, isActive: boolean) => void
  onDelete: (id: number) => void
  onDuplicate: (field: FormField) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-card border rounded-lg transition-all ${
        isDragging ? "opacity-50 shadow-lg scale-[1.02] z-50" : ""
      } ${!field.is_active ? "opacity-60 bg-muted/30" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none flex-shrink-0"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary flex-shrink-0">
          {fieldTypeIcons[field.field_type] || <Type className="h-4 w-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground truncate text-sm sm:text-base">
              {field.field_label}
            </span>
            {field.is_required && (
              <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0">
                Required
              </Badge>
            )}
            {!field.is_active && (
              <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0">
                Hidden
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground mt-0.5">
            <span className="capitalize">{field.field_type}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{field.field_name}</span>
            {field.field_width && field.field_width !== "full" && (
              <>
                <span>•</span>
                <span className="capitalize">{field.field_width.replace("-", " ")}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Actions */}
      <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleActive(field.id, !field.is_active)}
          className="h-8 w-8"
          title={field.is_active ? "Hide field" : "Show field"}
        >
          {field.is_active ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDuplicate(field)}
          className="h-8 w-8"
          title="Duplicate field"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(field)}
          className="h-8 w-8"
          title="Edit field"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(field.id)}
          className="h-8 w-8 text-destructive hover:text-destructive"
          title="Delete field"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="sm:hidden">
          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(field)}>
            <Settings className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDuplicate(field)}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleActive(field.id, !field.is_active)}>
            {field.is_active ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(field.id)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function FormBuilder({ initialFields }: { initialFields: FormField[] }) {
  const router = useRouter()
  const [fields, setFields] = useState<FormField[]>(initialFields)
  const [editingField, setEditingField] = useState<FormField | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [deleteFieldId, setDeleteFieldId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [activeTab, setActiveTab] = useState("fields")

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          display_order: index,
        }))
        setHasChanges(true)
        return newItems
      })
    }
  }, [])

  const handleToggleActive = useCallback((id: number, isActive: boolean) => {
    setFields((items) =>
      items.map((item) =>
        item.id === id ? { ...item, is_active: isActive } : item
      )
    )
    setHasChanges(true)
  }, [])

  const handleEdit = useCallback((field: FormField) => {
    setEditingField({ ...field })
    setIsAddingNew(false)
    setIsSheetOpen(true)
  }, [])

  const handleDuplicate = useCallback((field: FormField) => {
    const newField: FormField = {
      ...field,
      id: Date.now(),
      field_name: `${field.field_name}_copy`,
      field_label: `${field.field_label} (Copy)`,
      display_order: fields.length,
    }
    setFields((items) => [...items, newField])
    setHasChanges(true)
  }, [fields.length])

  const handleAddNew = useCallback(() => {
    const newField: FormField = {
      id: Date.now(),
      field_name: "",
      field_label: "",
      field_type: "text",
      placeholder: "",
      is_required: false,
      is_active: true,
      display_order: fields.length,
      options: [],
      validation_rules: {},
      field_width: "full",
      help_text: "",
    }
    setEditingField(newField)
    setIsAddingNew(true)
    setIsSheetOpen(true)
  }, [fields.length])

  const handleSaveField = useCallback(() => {
    if (!editingField) return

    if (!editingField.field_label || !editingField.field_name) {
      return
    }

    if (isAddingNew) {
      setFields((items) => [...items, editingField])
    } else {
      setFields((items) =>
        items.map((item) =>
          item.id === editingField.id ? editingField : item
        )
      )
    }
    setHasChanges(true)
    setIsSheetOpen(false)
    setEditingField(null)
  }, [editingField, isAddingNew])

  const handleDeleteField = useCallback(async () => {
    if (deleteFieldId === null) return

    setFields((items) => items.filter((item) => item.id !== deleteFieldId))
    setHasChanges(true)
    setDeleteFieldId(null)
  }, [deleteFieldId])

  const handleSaveAll = useCallback(async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/form-fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      })

      if (!response.ok) throw new Error("Failed to save")

      setHasChanges(false)
      router.refresh()
    } catch (error) {
      console.error("Error saving fields:", error)
    } finally {
      setIsSaving(false)
    }
  }, [fields, router])

  const generateFieldName = useCallback((label: string) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/(^_|_$)/g, "")
  }, [])

  const activeFields = fields.filter((f) => f.is_active)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="lg:hidden">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fields">Fields ({fields.length})</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Field List */}
        <div className={`space-y-4 ${activeTab === "preview" ? "hidden lg:block" : ""}`}>
          <Card>
            <CardHeader className="pb-3 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base sm:text-lg">Form Fields</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Drag to reorder. {fields.length} field{fields.length !== 1 ? "s" : ""}.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {hasChanges && (
                    <Badge variant="secondary" className="text-xs">
                      Unsaved
                    </Badge>
                  )}
                  <Button onClick={handleAddNew} size="sm" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Field
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 px-4 sm:px-6">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={fields.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {fields.map((field) => (
                    <SortableFieldItem
                      key={field.id}
                      field={field}
                      onEdit={handleEdit}
                      onToggleActive={handleToggleActive}
                      onDelete={(id) => setDeleteFieldId(id)}
                      onDuplicate={handleDuplicate}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <AlignLeft className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No fields yet</p>
                  <p className="text-sm">Click "Add Field" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {hasChanges && (
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setFields(initialFields)
                  setHasChanges(false)
                }}
                className="w-full sm:w-auto"
              >
                <X className="h-4 w-4 mr-1" />
                Discard
              </Button>
              <Button onClick={handleSaveAll} disabled={isSaving} className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-1" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>

        {/* Live Preview */}
        <div className={`space-y-4 ${activeTab === "fields" ? "hidden lg:block" : ""}`}>
          <Card>
            <CardHeader className="pb-3 px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Live Preview</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                How your form appears to visitors
              </p>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="p-4 sm:p-6 border rounded-xl bg-muted/20">
                <div className="grid gap-4 sm:grid-cols-2">
                  {activeFields.map((field) => {
                    const widthClass = 
                      field.field_width === "half" ? "sm:col-span-1" :
                      field.field_width === "third" ? "sm:col-span-1" :
                      field.field_width === "two-thirds" ? "sm:col-span-2" :
                      "sm:col-span-2"
                    
                    return (
                      <div key={field.id} className={widthClass}>
                        <div className="space-y-2">
                          <Label className="text-sm">
                            {field.field_label}
                            {field.is_required && (
                              <span className="text-destructive ml-1">*</span>
                            )}
                          </Label>
                          {field.field_type === "textarea" ? (
                            <Textarea
                              placeholder={field.placeholder || ""}
                              disabled
                              className="resize-none bg-background"
                            />
                          ) : field.field_type === "select" ? (
                            <Select disabled>
                              <SelectTrigger className="bg-background">
                                <SelectValue
                                  placeholder={field.placeholder || "Select an option"}
                                />
                              </SelectTrigger>
                            </Select>
                          ) : field.field_type === "checkbox" ? (
                            <div className="flex items-center gap-2 pt-1">
                              <input
                                type="checkbox"
                                disabled
                                className="h-4 w-4 rounded"
                              />
                              <span className="text-sm text-muted-foreground">
                                {field.placeholder || field.field_label}
                              </span>
                            </div>
                          ) : (
                            <Input
                              type={field.field_type}
                              placeholder={field.placeholder || ""}
                              disabled
                              className="bg-background"
                            />
                          )}
                          {field.help_text && (
                            <p className="text-xs text-muted-foreground">
                              {field.help_text}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {activeFields.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No active fields to preview
                  </p>
                )}
                {activeFields.length > 0 && (
                  <Button className="w-full mt-6" disabled>
                    Send Message
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Field Type Legend */}
          <Card>
            <CardHeader className="pb-3 px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Available Field Types</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {fieldTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <div
                      key={type.value}
                      className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-xs sm:text-sm"
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      <span>{type.label}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Field Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg p-4 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {isAddingNew ? "Add New Field" : "Edit Field"}
            </SheetTitle>
            <SheetDescription>
              Configure the field settings below
            </SheetDescription>
          </SheetHeader>

          {editingField && (
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="field_label">Field Label *</Label>
                <Input
                  id="field_label"
                  value={editingField.field_label}
                  onChange={(e) => {
                    const label = e.target.value
                    setEditingField({
                      ...editingField,
                      field_label: label,
                      field_name: isAddingNew
                        ? generateFieldName(label)
                        : editingField.field_name,
                    })
                  }}
                  placeholder="e.g., Full Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field_name">Field Name (ID) *</Label>
                <Input
                  id="field_name"
                  value={editingField.field_name}
                  onChange={(e) =>
                    setEditingField({
                      ...editingField,
                      field_name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"),
                    })
                  }
                  placeholder="e.g., full_name"
                />
                <p className="text-xs text-muted-foreground">
                  Used for database storage. Use snake_case.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="field_type">Field Type</Label>
                  <Select
                    value={editingField.field_type}
                    onValueChange={(value) =>
                      setEditingField({ ...editingField, field_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypes.map((type) => {
                        const Icon = type.icon
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field_width">Field Width</Label>
                  <Select
                    value={editingField.field_width || "full"}
                    onValueChange={(value) =>
                      setEditingField({ ...editingField, field_width: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldWidthOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeholder">Placeholder Text</Label>
                <Input
                  id="placeholder"
                  value={editingField.placeholder || ""}
                  onChange={(e) =>
                    setEditingField({
                      ...editingField,
                      placeholder: e.target.value,
                    })
                  }
                  placeholder="e.g., Enter your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="help_text">Help Text</Label>
                <Input
                  id="help_text"
                  value={editingField.help_text || ""}
                  onChange={(e) =>
                    setEditingField({
                      ...editingField,
                      help_text: e.target.value,
                    })
                  }
                  placeholder="Additional info shown below the field"
                />
              </div>

              {editingField.field_type === "select" && (
                <div className="space-y-2">
                  <Label>Dropdown Options</Label>
                  <Textarea
                    value={(editingField.options || []).join("\n")}
                    onChange={(e) =>
                      setEditingField({
                        ...editingField,
                        options: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    placeholder="One option per line"
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter each option on a new line
                  </p>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Required Field</Label>
                    <p className="text-xs text-muted-foreground">
                      User must fill this field
                    </p>
                  </div>
                  <Switch
                    checked={editingField.is_required}
                    onCheckedChange={(checked) =>
                      setEditingField({ ...editingField, is_required: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Active</Label>
                    <p className="text-xs text-muted-foreground">
                      Show this field on the form
                    </p>
                  </div>
                  <Switch
                    checked={editingField.is_active}
                    onCheckedChange={(checked) =>
                      setEditingField({ ...editingField, is_active: checked })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsSheetOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveField}
                  disabled={!editingField.field_label || !editingField.field_name}
                  className="flex-1"
                >
                  {isAddingNew ? "Add Field" : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteFieldId !== null} onOpenChange={() => setDeleteFieldId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Field?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the field from your form. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteField}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
