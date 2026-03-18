import { getAllSectionContent } from "@/lib/data"
import { ContentManager } from "@/components/admin/content-manager"

export default async function AdminContentPage() {
  const sections = await getAllSectionContent()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Page Content</h2>
        <p className="text-muted-foreground">
          Manage all section text, headings, and descriptions across the site
        </p>
      </div>

      <ContentManager initialSections={sections} />
    </div>
  )
}
