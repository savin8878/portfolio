import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { sql } from "@/lib/db"
import { TestimonialForm } from "@/components/admin/testimonial-form"

interface EditTestimonialPageProps {
  params: Promise<{ id: string }>
}

async function getTestimonial(id: string) {
  const testimonials = await sql`
    SELECT * FROM testimonials WHERE id = ${id}
  `
  return testimonials[0] || null
}

async function getProjects() {
  const projects = await sql`SELECT id, title FROM projects ORDER BY title`
  return projects
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  const { id } = await params
  const [testimonial, projects] = await Promise.all([
    getTestimonial(id),
    getProjects(),
  ])

  if (!testimonial) {
    notFound()
  }

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
        <h2 className="text-2xl font-bold text-foreground">Edit Testimonial</h2>
        <p className="text-muted-foreground">
          Update testimonial from {testimonial.client_name}
        </p>
      </div>

      <TestimonialForm testimonial={testimonial} projects={projects} />
    </div>
  )
}
