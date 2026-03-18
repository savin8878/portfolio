import { sql } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteSettingsForm } from "@/components/admin/site-settings-form"

async function getSiteSettings() {
  const settings = await sql`
    SELECT * FROM site_settings WHERE id = 1
  `
  return settings[0] || null
}

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Site Settings</h2>
        <p className="text-muted-foreground">
          Manage your portfolio site configuration and personal details
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your name, title, and contact information displayed on the site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SiteSettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  )
}
