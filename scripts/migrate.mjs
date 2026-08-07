import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

const { Pool } = pg;
const connectionString =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

function validateConnectionString(value) {
  if (!value) {
    throw new Error(
      "DATABASE_URL_UNPOOLED or DATABASE_URL is required for migrations.",
    );
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("The migration database URL is invalid.");
  }

  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error("The migration database URL uses an unsupported protocol.");
  }

  if (
    url.hostname.endsWith(".neon.tech") &&
    url.hostname.includes("-pooler.")
  ) {
    throw new Error("Migrations require a direct Neon endpoint.");
  }

  const sslMode = url.searchParams.get("sslmode") ?? "";
  if (!["require", "verify-ca", "verify-full"].includes(sslMode)) {
    throw new Error("Migrations require a TLS-enabled database URL.");
  }

  if (sslMode === "require" || sslMode === "verify-ca") {
    url.searchParams.set("sslmode", "verify-full");
  }

  return url.toString();
}

let pool;

function sanitizeErrorMessage(error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  return message.replace(/postgres(?:ql)?:\/\/[^\s]+/gi, "[database-url]");
}

try {
  pool = new Pool({
    connectionString: validateConnectionString(connectionString),
    connectionTimeoutMillis: 15_000,
    max: 1,
  });

  const database = drizzle(pool);
  await migrate(database, { migrationsFolder: "src/db/migrations" });
  console.log("Database migrations completed successfully.");
} catch (error) {
  console.error(`Database migration failed: ${sanitizeErrorMessage(error)}`);
  process.exitCode = 1;
} finally {
  await pool?.end().catch(() => undefined);
}
