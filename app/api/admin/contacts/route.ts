import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      )
    }

    // Update status if provided
    if (status !== undefined) {
      await sql`
        UPDATE contact_submissions 
        SET status = ${status}, updated_at = NOW()
        WHERE id = ${id}
      `
    }

    // Update notes if provided
    if (notes !== undefined) {
      await sql`
        UPDATE contact_submissions 
        SET notes = ${notes}, updated_at = NOW()
        WHERE id = ${id}
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating contact:", error)
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      )
    }

    await sql`DELETE FROM contact_submissions WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting contact:", error)
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    )
  }
}
