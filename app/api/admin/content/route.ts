import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM section_content ORDER BY page, section
    `
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching section content:", error)
    return NextResponse.json(
      { error: "Failed to fetch section content" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { page, section, content } = body

    if (!page || !section) {
      return NextResponse.json(
        { error: "page and section are required" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO section_content (page, section, content, updated_at)
      VALUES (${page}, ${section}, ${JSON.stringify(content)}, NOW())
      ON CONFLICT (page, section) DO UPDATE SET
        content = ${JSON.stringify(content)},
        updated_at = NOW()
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error saving section content:", error)
    return NextResponse.json(
      { error: "Failed to save section content" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page")
    const section = searchParams.get("section")

    if (!page || !section) {
      return NextResponse.json(
        { error: "page and section are required" },
        { status: 400 }
      )
    }

    await sql`
      DELETE FROM section_content
      WHERE page = ${page} AND section = ${section}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting section content:", error)
    return NextResponse.json(
      { error: "Failed to delete section content" },
      { status: 500 }
    )
  }
}
