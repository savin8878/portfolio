import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM section_visibility ORDER BY page, display_order
    `
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching visibility:", error)
    return NextResponse.json(
      { error: "Failed to fetch visibility settings" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { page, section, is_visible } = body

    if (!page || !section || typeof is_visible !== "boolean") {
      return NextResponse.json(
        { error: "page, section, and is_visible (boolean) are required" },
        { status: 400 }
      )
    }

    await sql`
      INSERT INTO section_visibility (page, section, is_visible, updated_at)
      VALUES (${page}, ${section}, ${is_visible}, NOW())
      ON CONFLICT (page, section) DO UPDATE SET
        is_visible = ${is_visible},
        updated_at = NOW()
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving visibility:", error)
    return NextResponse.json(
      { error: "Failed to save visibility setting" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { updates } = body as {
      updates: Array<{ page: string; section: string; is_visible: boolean }>
    }

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: "updates array is required" },
        { status: 400 }
      )
    }

    for (const { page, section, is_visible } of updates) {
      await sql`
        INSERT INTO section_visibility (page, section, is_visible, updated_at)
        VALUES (${page}, ${section}, ${is_visible}, NOW())
        ON CONFLICT (page, section) DO UPDATE SET
          is_visible = ${is_visible},
          updated_at = NOW()
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error bulk saving visibility:", error)
    return NextResponse.json(
      { error: "Failed to save visibility settings" },
      { status: 500 }
    )
  }
}
