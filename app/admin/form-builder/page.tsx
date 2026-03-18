import { sql } from "@/lib/db"
import { FormBuilder } from "@/components/admin/form-builder"

export const dynamic = "force-dynamic"

async function getFormFields() {
  const fields = await sql`
    SELECT * FROM contact_form_fields ORDER BY display_order ASC
  `
  return fields
}

export default async function FormBuilderPage() {
  const fields = await getFormFields()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Form Builder</h2>
        <p className="text-muted-foreground">
          Customize your contact form fields with drag-and-drop
        </p>
      </div>

      <FormBuilder initialFields={fields} />
    </div>
  )
}
