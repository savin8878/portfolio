import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Fetch all data needed for resume building
    const [
      settings,
      experiences,
      education,
      certifications,
      techStack,
      projects,
      services,
      socialLinks,
    ] = await Promise.all([
      sql`SELECT * FROM site_settings LIMIT 1`,
      sql`SELECT * FROM experiences WHERE is_active = true ORDER BY display_order`,
      sql`SELECT * FROM education WHERE is_active = true ORDER BY display_order`,
      sql`SELECT * FROM certifications WHERE is_active = true ORDER BY display_order`,
      sql`SELECT * FROM tech_stack WHERE is_active = true ORDER BY display_order`,
      sql`SELECT * FROM projects WHERE is_published = true ORDER BY display_order`,
      sql`SELECT * FROM services WHERE is_active = true ORDER BY display_order`,
      sql`SELECT * FROM social_links WHERE is_active = true ORDER BY display_order`,
    ])

    return NextResponse.json({
      settings: settings[0] || null,
      experiences,
      education,
      certifications,
      techStack,
      projects,
      services,
      socialLinks,
    })
  } catch (error) {
    console.error("Error fetching resume data:", error)
    return NextResponse.json(
      { error: "Failed to fetch resume data" },
      { status: 500 }
    )
  }
}
