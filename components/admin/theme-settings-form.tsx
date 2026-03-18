"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Monitor, Moon, Sun, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const colorSchemes = [
  { name: "Blue", value: "blue", color: "#3b82f6" },
  { name: "Emerald", value: "emerald", color: "#10b981" },
  { name: "Violet", value: "violet", color: "#8b5cf6" },
  { name: "Rose", value: "rose", color: "#f43f5e" },
  { name: "Orange", value: "orange", color: "#f97316" },
  { name: "Cyan", value: "cyan", color: "#06b6d4" },
]

export function ThemeSettingsForm() {
  const { theme, setTheme } = useTheme()
  const [selectedColor, setSelectedColor] = useState("blue")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSave() {
    setIsLoading(true)
    // In a real app, this would save to the database
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsLoading(false)
  }

  return (
    <div className="space-y-8">
      {/* Theme Mode */}
      <div className="space-y-4">
        <Label>Theme Mode</Label>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors",
              theme === "light"
                ? "border-accent bg-accent/10"
                : "border-border hover:border-muted-foreground"
            )}
          >
            <Sun className="h-6 w-6" />
            <span className="text-sm font-medium">Light</span>
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors",
              theme === "dark"
                ? "border-accent bg-accent/10"
                : "border-border hover:border-muted-foreground"
            )}
          >
            <Moon className="h-6 w-6" />
            <span className="text-sm font-medium">Dark</span>
          </button>
          <button
            onClick={() => setTheme("system")}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors",
              theme === "system"
                ? "border-accent bg-accent/10"
                : "border-border hover:border-muted-foreground"
            )}
          >
            <Monitor className="h-6 w-6" />
            <span className="text-sm font-medium">System</span>
          </button>
        </div>
      </div>

      {/* Accent Color */}
      <div className="space-y-4">
        <Label>Accent Color</Label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.value}
              onClick={() => setSelectedColor(scheme.value)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors",
                selectedColor === scheme.value
                  ? "border-accent"
                  : "border-border hover:border-muted-foreground"
              )}
            >
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: scheme.color }}
              />
              <span className="text-xs font-medium">{scheme.name}</span>
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Note: Color scheme changes require code updates to take effect. This
          preview shows available options.
        </p>
      </div>

      {/* Save */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Theme
        </Button>
      </div>
    </div>
  )
}
