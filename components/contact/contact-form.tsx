"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"

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

interface ContactFormProps {
  fields: FormField[]
}

export function ContactForm({ fields }: ContactFormProps) {
  const [formData, setFormData] = useState<Record<string, string | boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const activeFields = fields.filter((f) => f.is_active)

  const validateField = (field: FormField, value: string | boolean): string | null => {
    if (field.is_required) {
      if (typeof value === "boolean") {
        if (!value) return `${field.field_label} is required`
      } else if (!value || !value.trim()) {
        return `${field.field_label} is required`
      }
    }

    if (typeof value === "string" && value) {
      if (field.field_type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return "Please enter a valid email address"
      }

      if (field.field_type === "phone") {
        const phoneRegex = /^[\d\s\-+()]{7,}$/
        if (!phoneRegex.test(value)) return "Please enter a valid phone number"
      }

      if (field.field_type === "url") {
        try {
          new URL(value)
        } catch {
          return "Please enter a valid URL"
        }
      }
    }

    return null
  }

  const handleChange = (fieldName: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    for (const field of activeFields) {
      const value = formData[field.field_name]
      const error = validateField(field, value ?? "")
      if (error) {
        newErrors[field.field_name] = error
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to submit")

      setSubmitStatus("success")
      setFormData({})
    } catch {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldWidth = (width?: string) => {
    switch (width) {
      case "half":
        return "sm:col-span-1"
      case "third":
        return "lg:col-span-1"
      case "two-thirds":
        return "lg:col-span-2"
      default:
        return "sm:col-span-2 lg:col-span-3"
    }
  }

  const renderField = (field: FormField) => {
    const value = formData[field.field_name] ?? ""
    const error = errors[field.field_name]
    const widthClass = getFieldWidth(field.field_width)

    const fieldContent = () => {
      switch (field.field_type) {
        case "textarea":
          return (
            <Textarea
              id={field.field_name}
              value={value as string}
              onChange={(e) => handleChange(field.field_name, e.target.value)}
              placeholder={field.placeholder || ""}
              className={`min-h-[120px] resize-none ${error ? "border-destructive" : ""}`}
              required={field.is_required}
            />
          )

        case "select":
          return (
            <Select
              value={value as string}
              onValueChange={(val) => handleChange(field.field_name, val)}
            >
              <SelectTrigger className={error ? "border-destructive" : ""}>
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {(field.options || []).map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )

        case "checkbox":
          return (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id={field.field_name}
                checked={value as boolean}
                onCheckedChange={(checked) =>
                  handleChange(field.field_name, checked as boolean)
                }
                className={error ? "border-destructive" : ""}
              />
              <label
                htmlFor={field.field_name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {field.placeholder || field.field_label}
              </label>
            </div>
          )

        case "date":
          return (
            <Input
              type="date"
              id={field.field_name}
              value={value as string}
              onChange={(e) => handleChange(field.field_name, e.target.value)}
              className={error ? "border-destructive" : ""}
              required={field.is_required}
            />
          )

        case "number":
          return (
            <Input
              type="number"
              id={field.field_name}
              value={value as string}
              onChange={(e) => handleChange(field.field_name, e.target.value)}
              placeholder={field.placeholder || ""}
              className={error ? "border-destructive" : ""}
              required={field.is_required}
            />
          )

        default:
          return (
            <Input
              type={field.field_type}
              id={field.field_name}
              value={value as string}
              onChange={(e) => handleChange(field.field_name, e.target.value)}
              placeholder={field.placeholder || ""}
              className={error ? "border-destructive" : ""}
              required={field.is_required}
            />
          )
      }
    }

    return (
      <motion.div
        key={field.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: field.display_order * 0.05 }}
        className={`space-y-2 ${widthClass}`}
      >
        {field.field_type !== "checkbox" && (
          <Label htmlFor={field.field_name} className="text-foreground">
            {field.field_label}
            {field.is_required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        {fieldContent()}
        {field.help_text && !error && (
          <p className="text-xs text-muted-foreground">{field.help_text}</p>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </motion.div>
    )
  }

  if (submitStatus === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6 bg-card rounded-2xl border border-border"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Message Sent!</h3>
        <p className="text-muted-foreground mb-6">
          Thank you for reaching out. I'll get back to you within 24-48 hours.
        </p>
        <Button variant="outline" onClick={() => setSubmitStatus("idle")}>
          Send Another Message
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="p-8 rounded-2xl bg-card border border-border"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {activeFields.map(renderField)}
      </div>

      {submitStatus === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 mt-6 rounded-lg bg-destructive/10 text-destructive"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">
            Something went wrong. Please try again or email me directly.
          </p>
        </motion.div>
      )}

      <Button type="submit" size="lg" className="w-full mt-6" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </>
        )}
      </Button>
    </motion.form>
  )
}
