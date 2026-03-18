import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { ids, status } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "IDs array is required" },
        { status: 400 }
      )
    }

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }

    // Update all contacts with the specified IDs
    await sql`
      UPDATE contact_submissions 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ANY(${ids}::int[])
    `

    return NextResponse.json({ success: true, updated: ids.length })
  } catch (error) {
    console.error("Error bulk updating contacts:", error)
    return NextResponse.json(
      { error: "Failed to bulk update contacts" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "IDs array is required" },
        { status: 400 }
      )
    }

    await sql`DELETE FROM contact_submissions WHERE id = ANY(${ids}::int[])`

    return NextResponse.json({ success: true, deleted: ids.length })
  } catch (error) {
    console.error("Error bulk deleting contacts:", error)
    return NextResponse.json(
      { error: "Failed to bulk delete contacts" },
      { status: 500 }
    )
  }
}
