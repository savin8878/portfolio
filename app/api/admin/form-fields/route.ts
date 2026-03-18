import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

interface FormField {
  id: number
  field_name: string
  field_label: string
  field_type: string
  placeholder?: string
  is_required: boolean
  is_active: boolean
  display_order: number
  options?: string[]
  validation_rules?: Record<string, unknown>
  field_width?: string
  help_text?: string
}

export async function GET() {
  try {
    const fields = await sql`
      SELECT * FROM contact_form_fields ORDER BY display_order ASC
    `
    return NextResponse.json(fields)
  } catch (error) {
    console.error("Error fetching form fields:", error)
    return NextResponse.json(
      { error: "Failed to fetch form fields" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { fields } = await request.json() as { fields: FormField[] }

    // Start a transaction - delete all existing fields and insert new ones
    await sql`DELETE FROM contact_form_fields`

    for (const field of fields) {
      await sql`
        INSERT INTO contact_form_fields (
          field_name, field_label, field_type, placeholder,
          is_required, is_active, display_order, options,
          validation_rules, field_width, help_text
        ) VALUES (
          ${field.field_name},
          ${field.field_label},
          ${field.field_type},
          ${field.placeholder || null},
          ${field.is_required},
          ${field.is_active},
          ${field.display_order},
          ${field.options || []},
          ${field.validation_rules ? JSON.stringify(field.validation_rules) : null},
          ${field.field_width || 'full'},
          ${field.help_text || null}
        )
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving form fields:", error)
    return NextResponse.json(
      { error: "Failed to save form fields" },
      { status: 500 }
    )
  }
}
