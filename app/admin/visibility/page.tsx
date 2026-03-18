import { getAllSectionVisibility } from "@/lib/data"
import { VisibilityManager } from "@/components/admin/visibility-manager"

export default async function AdminVisibilityPage() {
  const sections = await getAllSectionVisibility()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Section Visibility</h2>
        <p className="text-muted-foreground">
          Toggle sections on or off for each page of your site
        </p>
      </div>

      <VisibilityManager initialSections={sections} />
    </div>
  )
}
