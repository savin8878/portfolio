import { sql } from "@/lib/db"
import { ResumeBuilder } from "@/components/admin/resume-builder"

async function getResumeData() {
  const [
    settings,
    experiences,
    education,
    certifications,
    techStack,
    projects,
    socialLinks,
  ] = await Promise.all([
    sql`SELECT * FROM site_settings LIMIT 1`,
    sql`SELECT * FROM experiences WHERE is_active = true ORDER BY display_order`,
    sql`SELECT * FROM education WHERE is_active = true ORDER BY display_order`,
    sql`SELECT * FROM certifications WHERE is_active = true ORDER BY display_order`,
    sql`SELECT * FROM tech_stack WHERE is_active = true ORDER BY display_order`,
    sql`SELECT * FROM projects WHERE is_published = true ORDER BY display_order LIMIT 10`,
    sql`SELECT * FROM social_links WHERE is_active = true ORDER BY display_order`,
  ])

  return {
    settings: settings[0] || null,
    experiences,
    education,
    certifications,
    techStack,
    projects,
    socialLinks,
  }
}

export default async function ResumeBuilderPage() {
  const data = await getResumeData()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Resume Builder</h2>
        <p className="text-muted-foreground">
          Build and customize your professional resume using your site data
        </p>
      </div>
      <ResumeBuilder data={data} />
    </div>
  )
}
