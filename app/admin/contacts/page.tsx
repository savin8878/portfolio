import { sql } from "@/lib/db"
import { ContactsManager } from "@/components/admin/contacts-manager"

async function getContactSubmissions() {
  const contacts = await sql`
    SELECT id, name, email, company, project_type, budget_range, timeline, message, status, notes, created_at, updated_at
    FROM contact_submissions
    ORDER BY created_at DESC
  `
  return contacts
}

async function getContactStats() {
  const stats = await sql`
    SELECT 
      COUNT(*) FILTER (WHERE status = 'new') as new_count,
      COUNT(*) FILTER (WHERE status = 'read') as read_count,
      COUNT(*) FILTER (WHERE status = 'responded') as responded_count,
      COUNT(*) FILTER (WHERE status = 'archived') as archived_count,
      COUNT(*) as total_count
    FROM contact_submissions
  `
  return stats[0]
}

export default async function AdminContactsPage() {
  const [contacts, stats] = await Promise.all([
    getContactSubmissions(),
    getContactStats()
  ])

  return <ContactsManager initialContacts={contacts} stats={stats} />
}
