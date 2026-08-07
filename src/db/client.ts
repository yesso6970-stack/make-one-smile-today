import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to access smile statistics.");
}

const globalForDatabase = globalThis as unknown as {
  smilePool?: Pool;
  smilePoolAttached?: boolean;
};
const pool =
  globalForDatabase.smilePool ??
  new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 5_000,
  });

globalForDatabase.smilePool = pool;

if (!globalForDatabase.smilePoolAttached) {
  attachDatabasePool(pool);
  globalForDatabase.smilePoolAttached = true;
}

export const db = drizzle(pool, { schema });
