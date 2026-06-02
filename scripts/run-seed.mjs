// Runs a .sql file against DATABASE_URL using node-postgres.
// Usage: node --env-file=.env scripts/run-seed.mjs [path/to/file.sql]
import { readFileSync } from "node:fs"
import { Client } from "pg"

const file = process.argv[2] || "scripts/seed-real-data.sql"
const sql = readFileSync(file, "utf8")

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error("DATABASE_URL is not set. Run with: node --env-file=.env scripts/run-seed.mjs")
  process.exit(1)
}

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })

try {
  await client.connect()
  console.log(`Running ${file} ...`)
  await client.query(sql)
  console.log("✓ Seed completed successfully.")
} catch (err) {
  console.error("✗ Seed failed:", err.message)
  process.exitCode = 1
} finally {
  await client.end()
}
