import {
  date,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

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
