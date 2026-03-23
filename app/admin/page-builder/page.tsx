import { sql } from "@/lib/db"
import { PageBuilderClient } from "./client"

async function getAllPageData() {
  const [contentRows, visibilityRows] = await Promise.all([
    sql`SELECT * FROM section_content`,
    sql`SELECT * FROM section_visibility ORDER BY display_order`,
  ])

  const contentMap: Record<string, Record<string, Record<string, string>>> = {}
  for (const row of contentRows) {
    const pg = row.page as string
    const sec = row.section as string
    if (!contentMap[pg]) contentMap[pg] = {}
    contentMap[pg][sec] = (row.content || {}) as Record<string, string>
  }

  const visMap: Record<string, Record<string, { isVisible: boolean; order: number }>> = {}
  for (const row of visibilityRows) {
    const pg = row.page as string
    const sec = row.section as string
    if (!visMap[pg]) visMap[pg] = {}
    visMap[pg][sec] = { isVisible: row.is_visible as boolean, order: (row.display_order as number) || 0 }
  }

  return { contentMap, visMap }
}

export default async function PageBuilderPage() {
  const { contentMap, visMap } = await getAllPageData()
  return <PageBuilderClient contentMap={contentMap} visMap={visMap} />
}
