import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      client_name,
      client_title,
      client_company,
      testimonial_text,
      rating,
      project_id,
      is_active,
      is_featured,
    } = body

    const result = await sql`
      INSERT INTO testimonials (
        client_name, client_title, client_company, testimonial_text,
        rating, project_id, is_active, is_featured
      ) VALUES (
        ${client_name}, ${client_title || null}, ${client_company || null},
        ${testimonial_text}, ${rating || 5}, ${project_id || null},
        ${is_active ?? true}, ${is_featured || false}
      )
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error creating testimonial:", error)
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      client_name,
      client_title,
      client_company,
      testimonial_text,
      rating,
      project_id,
      is_active,
      is_featured,
    } = body

    await sql`
      UPDATE testimonials SET
        client_name = ${client_name},
        client_title = ${client_title || null},
        client_company = ${client_company || null},
        testimonial_text = ${testimonial_text},
        rating = ${rating || 5},
        project_id = ${project_id || null},
        is_active = ${is_active ?? true},
        is_featured = ${is_featured || false}
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating testimonial:", error)
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    await sql`DELETE FROM testimonials WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    )
  }
}
