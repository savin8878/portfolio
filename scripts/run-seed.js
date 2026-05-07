const { neon } = require("@neondatabase/serverless");
const fs = require("fs");

const DB_URL = fs.readFileSync(".env", "utf8").split("\n")[0].split("=").slice(1).join("=").trim();
const sql = neon(DB_URL);

async function run() {
  const seedSQL = fs.readFileSync("./scripts/seed-real-data.sql", "utf8");

  // Split by semicolons, respecting strings
  const statements = [];
  let current = "";
  let inString = false;

  for (let i = 0; i < seedSQL.length; i++) {
    const ch = seedSQL[i];
    if (inString) {
      current += ch;
      if (ch === "'" && seedSQL[i - 1] !== "\\") inString = false;
    } else if (ch === "'") {
      inString = true;
      current += ch;
    } else if (ch === ";") {
      const stmt = current.replace(/--.*$/gm, "").trim();
      if (stmt) statements.push(stmt);
      current = "";
    } else {
      current += ch;
    }
  }

  console.log("Total statements:", statements.length);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    if (!stmt) continue;
    try {
      const result = await sql(stmt);
      const preview = stmt.substring(0, 70).replace(/\n/g, " ");
      console.log(`OK [${i + 1}/${statements.length}]: ${preview}...`);
    } catch (err) {
      console.error(`FAIL [${i + 1}]: ${err.message}`);
      console.error("Statement:", stmt.substring(0, 300));
    }
  }
  console.log("\nDone! All seed data inserted.");
}

run().catch((e) => console.error("Fatal:", e));
