import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

export default defineConfig({
  dialect: "postgresql",
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});
