import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS ai_provider_settings (
      id SERIAL PRIMARY KEY,
      provider VARCHAR(50) NOT NULL,
      api_key TEXT NOT NULL,
      model VARCHAR(100) DEFAULT '',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(provider)
    )
  `
}

// GET all AI provider settings (keys masked)
export async function GET() {
  try {
    await ensureTable()
    const rows = await sql`SELECT id, provider, model, is_active, updated_at FROM ai_provider_settings ORDER BY provider`
    // Check which providers have keys set (without exposing them)
    const providers = rows.map((r: Record<string, unknown>) => ({
      id: r.id,
      provider: r.provider,
      model: r.model,
      isActive: r.is_active,
      hasKey: true,
      updatedAt: r.updated_at,
    }))
    return NextResponse.json({ providers })
  } catch (error) {
    console.error("Error fetching AI settings:", error)
    return NextResponse.json({ error: "Failed to fetch AI settings" }, { status: 500 })
  }
}

// POST — save/update a provider's API key
export async function POST(request: Request) {
  try {
    await ensureTable()
    const { provider, apiKey, model, isActive } = await request.json()

    if (!provider || !apiKey) {
      return NextResponse.json({ error: "Provider and API key are required" }, { status: 400 })
    }

    await sql`
      INSERT INTO ai_provider_settings (provider, api_key, model, is_active)
      VALUES (${provider}, ${apiKey}, ${model || ''}, ${isActive ?? true})
      ON CONFLICT (provider) DO UPDATE SET
        api_key = ${apiKey},
        model = ${model || ''},
        is_active = ${isActive ?? true},
        updated_at = CURRENT_TIMESTAMP
    `

    return NextResponse.json({ message: `${provider} settings saved` })
  } catch (error) {
    console.error("Error saving AI settings:", error)
    return NextResponse.json({ error: "Failed to save AI settings" }, { status: 500 })
  }
}

// DELETE — remove a provider
export async function DELETE(request: Request) {
  try {
    await ensureTable()
    const { searchParams } = new URL(request.url)
    const provider = searchParams.get("provider")
    if (!provider) {
      return NextResponse.json({ error: "Provider is required" }, { status: 400 })
    }
    await sql`DELETE FROM ai_provider_settings WHERE provider = ${provider}`
    return NextResponse.json({ message: "Provider removed" })
  } catch (error) {
    console.error("Error deleting AI settings:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
