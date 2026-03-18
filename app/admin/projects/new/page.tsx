import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { sql } from "@/lib/db"
import { ProjectForm } from "@/components/admin/project-form"

async function getCategories() {
  const categories = await sql`
    SELECT id, name, slug FROM project_categories WHERE is_active = true ORDER BY display_order
  `
  return categories
}

export default async function NewProjectPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
        <h2 className="text-2xl font-bold text-foreground">New Project</h2>
        <p className="text-muted-foreground">
          Create a new portfolio project or case study
        </p>
      </div>

      <ProjectForm categories={categories} />
    </div>
  )
}
