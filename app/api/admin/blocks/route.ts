import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS custom_blocks (
      id SERIAL PRIMARY KEY,
      page VARCHAR(50) NOT NULL,
      block_type VARCHAR(20) NOT NULL DEFAULT 'text',
      content JSONB NOT NULL DEFAULT '{}',
      position_x FLOAT DEFAULT 0,
      position_y FLOAT DEFAULT 0,
      width FLOAT DEFAULT 300,
      height FLOAT DEFAULT 100,
      z_index INT DEFAULT 1,
      styles JSONB DEFAULT '{}',
      parent_section VARCHAR(100) DEFAULT NULL,
      is_visible BOOLEAN DEFAULT true,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
}

// GET blocks for a page
export async function GET(request: Request) {
  try {
    await ensureTable()
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page") || "home"

    const blocks = await sql`
      SELECT * FROM custom_blocks
      WHERE page = ${page} AND is_visible = true
      ORDER BY z_index, display_order
    `
    return NextResponse.json({ blocks })
  } catch (error) {
    console.error("Error fetching blocks:", error)
    return NextResponse.json({ error: "Failed to fetch blocks" }, { status: 500 })
  }
}

// POST — create a new block
export async function POST(request: Request) {
  try {
    await ensureTable()
    const body = await request.json()
    const { page, block_type, content, position_x, position_y, width, height, z_index, styles, parent_section } = body

    const result = await sql`
      INSERT INTO custom_blocks (page, block_type, content, position_x, position_y, width, height, z_index, styles, parent_section)
      VALUES (
        ${page || "home"},
        ${block_type || "text"},
        ${JSON.stringify(content || {})}::jsonb,
        ${position_x ?? 0},
        ${position_y ?? 0},
        ${width ?? 300},
        ${height ?? 100},
        ${z_index ?? 1},
        ${JSON.stringify(styles || {})}::jsonb,
        ${parent_section || null}
      )
      RETURNING *
    `
    return NextResponse.json({ block: result[0] })
  } catch (error) {
    console.error("Error creating block:", error)
    return NextResponse.json({ error: "Failed to create block" }, { status: 500 })
  }
}

// PATCH — update a block
export async function PATCH(request: Request) {
  try {
    await ensureTable()
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) return NextResponse.json({ error: "Block ID required" }, { status: 400 })

    const sets: string[] = []
    const vals: unknown[] = []

    if (updates.content !== undefined) { sets.push("content"); vals.push(JSON.stringify(updates.content)) }
    if (updates.position_x !== undefined) { sets.push("position_x"); vals.push(updates.position_x) }
    if (updates.position_y !== undefined) { sets.push("position_y"); vals.push(updates.position_y) }
    if (updates.width !== undefined) { sets.push("width"); vals.push(updates.width) }
    if (updates.height !== undefined) { sets.push("height"); vals.push(updates.height) }
    if (updates.z_index !== undefined) { sets.push("z_index"); vals.push(updates.z_index) }
    if (updates.styles !== undefined) { sets.push("styles"); vals.push(JSON.stringify(updates.styles)) }
    if (updates.is_visible !== undefined) { sets.push("is_visible"); vals.push(updates.is_visible) }
    if (updates.block_type !== undefined) { sets.push("block_type"); vals.push(updates.block_type) }

    // Use individual update queries since neon doesn't support dynamic SET clauses easily
    if (updates.content !== undefined) await sql`UPDATE custom_blocks SET content = ${JSON.stringify(updates.content)}::jsonb, updated_at = NOW() WHERE id = ${id}`
    if (updates.position_x !== undefined || updates.position_y !== undefined) {
      await sql`UPDATE custom_blocks SET position_x = ${updates.position_x ?? 0}, position_y = ${updates.position_y ?? 0}, updated_at = NOW() WHERE id = ${id}`
    }
    if (updates.width !== undefined || updates.height !== undefined) {
      await sql`UPDATE custom_blocks SET width = ${updates.width ?? 300}, height = ${updates.height ?? 100}, updated_at = NOW() WHERE id = ${id}`
    }
    if (updates.z_index !== undefined) await sql`UPDATE custom_blocks SET z_index = ${updates.z_index}, updated_at = NOW() WHERE id = ${id}`
    if (updates.styles !== undefined) await sql`UPDATE custom_blocks SET styles = ${JSON.stringify(updates.styles)}::jsonb, updated_at = NOW() WHERE id = ${id}`
    if (updates.is_visible !== undefined) await sql`UPDATE custom_blocks SET is_visible = ${updates.is_visible}, updated_at = NOW() WHERE id = ${id}`

    return NextResponse.json({ message: "Block updated" })
  } catch (error) {
    console.error("Error updating block:", error)
    return NextResponse.json({ error: "Failed to update block" }, { status: 500 })
  }
}

// DELETE a block
export async function DELETE(request: Request) {
  try {
    await ensureTable()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })
    await sql`DELETE FROM custom_blocks WHERE id = ${id}`
    return NextResponse.json({ message: "Block deleted" })
  } catch (error) {
    console.error("Error deleting block:", error)
    return NextResponse.json({ error: "Failed to delete block" }, { status: 500 })
  }
}
