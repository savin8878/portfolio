import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeSettingsForm } from "@/components/admin/theme-settings-form"

export default function AdminThemePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Theme Settings</h2>
        <p className="text-muted-foreground">
          Customize the look and feel of your portfolio
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Configure colors, typography, and visual styles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeSettingsForm />
        </CardContent>
      </Card>
    </div>
  )
}
