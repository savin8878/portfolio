import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { generateSlug } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      short_description,
      full_description,
      icon,
      features,
      price_range,
      delivery_time,
      display_order,
      is_active,
      is_featured,
    } = body

    const serviceSlug = slug || generateSlug(title)

    const result = await sql`
      INSERT INTO services (
        title, slug, short_description, full_description, icon,
        features, price_range, delivery_time, display_order, is_active, is_featured
      ) VALUES (
        ${title}, ${serviceSlug}, ${short_description || null}, ${full_description || null},
        ${icon || null}, ${features || []}, ${price_range || null},
        ${delivery_time || null}, ${display_order || 0}, ${is_active ?? true}, ${is_featured || false}
      )
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      title,
      slug,
      short_description,
      full_description,
      icon,
      features,
      price_range,
      delivery_time,
      display_order,
      is_active,
      is_featured,
    } = body

    const serviceSlug = slug || generateSlug(title)

    await sql`
      UPDATE services SET
        title = ${title},
        slug = ${serviceSlug},
        short_description = ${short_description || null},
        full_description = ${full_description || null},
        icon = ${icon || null},
        features = ${features || []},
        price_range = ${price_range || null},
        delivery_time = ${delivery_time || null},
        display_order = ${display_order || 0},
        is_active = ${is_active ?? true},
        is_featured = ${is_featured || false}
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json(
      { error: "Failed to update service" },
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

    await sql`DELETE FROM services WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    )
  }
}
