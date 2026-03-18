import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      developer_name,
      professional_title,
      site_description,
      email,
      phone,
      location,
      github_url,
      linkedin_url,
      twitter_url,
    } = body

    // Check if settings exist
    const existing = await sql`SELECT id FROM site_settings WHERE id = 1`

    if (existing.length > 0) {
      // Update existing settings
      await sql`
        UPDATE site_settings SET
          developer_name = ${developer_name},
          professional_title = ${professional_title},
          site_description = ${site_description},
          email = ${email},
          phone = ${phone || null},
          location = ${location || null},
          github_url = ${github_url || null},
          linkedin_url = ${linkedin_url || null},
          twitter_url = ${twitter_url || null},
          updated_at = NOW()
        WHERE id = 1
      `
    } else {
      // Insert new settings
      await sql`
        INSERT INTO site_settings (id, developer_name, professional_title, site_description, email, phone, location, github_url, linkedin_url, twitter_url)
        VALUES (1, ${developer_name}, ${professional_title}, ${site_description}, ${email}, ${phone || null}, ${location || null}, ${github_url || null}, ${linkedin_url || null}, ${twitter_url || null})
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    )
  }
}
