import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { sql } from "@/lib/db"
import { TestimonialForm } from "@/components/admin/testimonial-form"

async function getProjects() {
  const projects = await sql`SELECT id, title FROM projects ORDER BY title`
  return projects
}

export default async function NewTestimonialPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link
          href="/admin/testimonials"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Testimonials
        </Link>
        <h2 className="text-2xl font-bold text-foreground">New Testimonial</h2>
        <p className="text-muted-foreground">
          Add a new client testimonial
        </p>
      </div>

      <TestimonialForm projects={projects} />
    </div>
  )
}
