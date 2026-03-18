import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { sql } from "@/lib/db"
import { ProjectForm } from "@/components/admin/project-form"

interface EditProjectPageProps {
  params: Promise<{ id: string }>
}

async function getProject(id: string) {
  const projects = await sql`
    SELECT * FROM projects WHERE id = ${id}
  `
  return projects[0] || null
}

async function getCategories() {
  const categories = await sql`
    SELECT id, name, slug FROM project_categories WHERE is_active = true ORDER BY display_order
  `
  return categories
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params
  const [project, categories] = await Promise.all([
    getProject(id),
    getCategories()
  ])

  if (!project) {
    notFound()
  }

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
        <h2 className="text-2xl font-bold text-foreground">Edit Project</h2>
        <p className="text-muted-foreground">
          Update the details of {project.title}
        </p>
      </div>

      <ProjectForm project={project} categories={categories} />
    </div>
  )
}
