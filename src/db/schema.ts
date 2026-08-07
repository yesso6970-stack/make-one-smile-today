import {
  bigint,
  date,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const COMMUNITY_COUNTER_ID = "community";

/** One anonymous device can add one community smile per Seoul calendar day. */
export const smileEvents = pgTable(
  "smile_events",
  {
    deviceHash: text("device_hash").notNull(),
    successDate: date("success_date", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.deviceHash, table.successDate] })],
);

/** Materialized aggregate so the public total remains an O(1) lookup. */
export const smileCounters = pgTable("smile_counters", {
  id: text("id").primaryKey(),
  total: bigint("total", { mode: "bigint" })
    .default(sql`0`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
