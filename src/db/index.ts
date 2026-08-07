import { attachDatabasePool } from "@vercel/functions";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as relations from "./relations";
import * as schema from "./schema";

type DatabaseSchema = typeof schema & typeof relations;
type Database = NodePgDatabase<DatabaseSchema>;

const globalForDatabase = globalThis as typeof globalThis & {
  smileDatabase?: Database;
  smilePool?: Pool;
  smilePoolAttached?: boolean;
};

/**
 * Validates the runtime URL without logging it. Vercel's Neon integration sets
 * DATABASE_URL to the pooled endpoint and includes TLS parameters.
 */
function getRuntimeDatabaseUrl(): string {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Database configuration is unavailable.");
  }

  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    throw new Error("Database configuration is invalid.");
  }

  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error("Database configuration uses an unsupported protocol.");
  }

  if (
    process.env.NODE_ENV === "production" &&
    url.hostname.endsWith(".neon.tech") &&
    !url.hostname.includes("-pooler.")
  ) {
    throw new Error("The production runtime requires a pooled Neon endpoint.");
  }

  const sslMode = url.searchParams.get("sslmode") ?? "";
  if (
    process.env.NODE_ENV === "production" &&
    !["require", "verify-ca", "verify-full"].includes(sslMode)
  ) {
    throw new Error("A secure database connection is required in production.");
  }

  // pg 8 treats these modes as verify-full; make that behavior explicit so a
  // future pg major upgrade cannot silently weaken certificate verification.
  if (sslMode === "require" || sslMode === "verify-ca") {
    url.searchParams.set("sslmode", "verify-full");
  }

  return url.toString();
}

/** Returns the process-wide Drizzle client and creates at most one pg pool. */
export function getDb(): Database {
  if (globalForDatabase.smileDatabase) {
    return globalForDatabase.smileDatabase;
  }

  const pool =
    globalForDatabase.smilePool ??
    new Pool({
      connectionString: getRuntimeDatabaseUrl(),
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 5_000,
      max: 5,
    });

  globalForDatabase.smilePool = pool;

  if (!globalForDatabase.smilePoolAttached) {
    attachDatabasePool(pool);
    globalForDatabase.smilePoolAttached = true;
  }

  const database = drizzle(pool, {
    schema: { ...schema, ...relations },
  });
  globalForDatabase.smileDatabase = database;

  return database;
}

/** A lightweight readiness check for diagnostics and deployment verification. */
export async function checkDatabaseConnection(): Promise<void> {
  await getDb().execute("select 1");
}

/** Logs actionable diagnostics without exposing connection strings or queries. */
export function reportDatabaseError(operation: string, error: unknown): void {
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : undefined;

  console.error(`[database] ${operation} failed`, {
    code,
    type: error instanceof Error ? error.name : "UnknownError",
  });
}
