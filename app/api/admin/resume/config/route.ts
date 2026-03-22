import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

// Ensure table exists on first call
async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS resume_configs (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL DEFAULT 'Default Resume',
      config JSONB NOT NULL,
      is_default BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
}

// GET — load saved resume config
export async function GET(request: Request) {
  try {
    await ensureTable()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    let result
    if (id) {
      result = await sql`SELECT * FROM resume_configs WHERE id = ${id} LIMIT 1`
    } else {
      result = await sql`SELECT * FROM resume_configs WHERE is_default = true ORDER BY updated_at DESC LIMIT 1`
      if (result.length === 0) {
        result = await sql`SELECT * FROM resume_configs ORDER BY updated_at DESC LIMIT 1`
      }
    }

    if (result.length === 0) {
      return NextResponse.json({ config: null })
    }

    return NextResponse.json({
      id: result[0].id,
      name: result[0].name,
      config: result[0].config,
      isDefault: result[0].is_default,
      updatedAt: result[0].updated_at,
    })
  } catch (error) {
    console.error("Error loading resume config:", error)
    return NextResponse.json({ error: "Failed to load resume config" }, { status: 500 })
  }
}

// POST — save or update resume config
export async function POST(request: Request) {
  try {
    await ensureTable()
    const body = await request.json()
    const { id, name, config, isDefault } = body

    if (!config) {
      return NextResponse.json({ error: "Config is required" }, { status: 400 })
    }

    const configJson = JSON.stringify(config)

    if (isDefault) {
      await sql`UPDATE resume_configs SET is_default = false WHERE is_default = true`
    }

    let result
    if (id) {
      result = await sql`
        UPDATE resume_configs
        SET config = ${configJson}::jsonb,
            name = ${name || "Default Resume"},
            is_default = ${isDefault ?? false},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING id, name, is_default, updated_at
      `
    } else {
      result = await sql`
        INSERT INTO resume_configs (name, config, is_default)
        VALUES (${name || "Default Resume"}, ${configJson}::jsonb, ${isDefault ?? true})
        RETURNING id, name, is_default, updated_at
      `
    }

    return NextResponse.json({
      id: result[0].id,
      name: result[0].name,
      isDefault: result[0].is_default,
      updatedAt: result[0].updated_at,
      message: id ? "Resume config updated" : "Resume config saved",
    })
  } catch (error) {
    console.error("Error saving resume config:", error)
    return NextResponse.json({ error: "Failed to save resume config" }, { status: 500 })
  }
}

// PUT — list all saved configs
export async function PUT() {
  try {
    await ensureTable()
    const configs = await sql`
      SELECT id, name, is_default, created_at, updated_at
      FROM resume_configs ORDER BY updated_at DESC
    `
    return NextResponse.json({ configs })
  } catch (error) {
    console.error("Error listing resume configs:", error)
    return NextResponse.json({ error: "Failed to list configs" }, { status: 500 })
  }
}

// DELETE a saved config
export async function DELETE(request: Request) {
  try {
    await ensureTable()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }
    await sql`DELETE FROM resume_configs WHERE id = ${id}`
    return NextResponse.json({ message: "Resume config deleted" })
  } catch (error) {
    console.error("Error deleting resume config:", error)
    return NextResponse.json({ error: "Failed to delete config" }, { status: 500 })
  }
}
