import "dotenv/config";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlFile = join(__dirname, "migrations", "001_auth.sql");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const sql = readFileSync(sqlFile, "utf8");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    try {
      await pool.query(statement);
      console.log(`OK: ${statement.slice(0, 60)}...`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('already exists')) {
        console.log(`SKIP (exists): ${statement.slice(0, 60)}...`);
      } else {
        throw error;
      }
    }
  }
  console.log("Auth migration complete.");
}

main()
  .then(() => pool.end())
  .catch((error) => {
    console.error("Migration failed:", error.message);
    pool.end();
    process.exit(1);
  });