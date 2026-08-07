import {
  bigint,
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
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

/** Private praise journal entries, partitioned by a one-way anonymous device hash. */
export const praiseJournalEntries = pgTable(
  "praise_journal_entries",
  {
    deviceHash: varchar("device_hash", { length: 64 }).notNull(),
    entryDate: date("entry_date", { mode: "string" }).notNull(),
    content: varchar("content", { length: 200 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.deviceHash, table.entryDate] })],
);

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    name: varchar("name", { length: 80 }).notNull(),
    image: text("image"),
    plan: varchar("plan", { length: 16 }).default("free").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)],
);

/** One canonical activity row per signed-in user and local calendar day. */
export const userDailyActivities = pgTable(
  "user_daily_activities",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    activityDate: date("activity_date", { mode: "string" }).notNull(),
    missionId: varchar("mission_id", { length: 80 }).notNull(),
    targetId: varchar("target_id", { length: 32 }),
    journal: varchar("journal", { length: 200 }),
    completed: boolean("completed").default(false).notNull(),
    pointsEarned: integer("points_earned").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.activityDate] }),
    index("user_daily_activities_date_idx").on(table.activityDate),
  ],
);

export const userStats = pgTable("user_stats", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  peopleSmiled: integer("people_smiled").default(0).notNull(),
  points: integer("points").default(0).notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  completedMissions: integer("completed_missions").default(0).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const userBadges = pgTable(
  "user_badges",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    badgeId: varchar("badge_id", { length: 80 }).notNull(),
    earnedAt: timestamp("earned_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.badgeId] })],
);

export const userPreferences = pgTable("user_preferences", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  notifications: boolean("notifications").default(false).notNull(),
  reminderTime: varchar("reminder_time", { length: 5 })
    .default("20:00")
    .notNull(),
  timezone: varchar("timezone", { length: 64 }).default("Asia/Seoul").notNull(),
  vibration: boolean("vibration").default(true).notNull(),
  sound: boolean("sound").default(true).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const aiUsage = pgTable(
  "ai_usage",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    usageDate: date("usage_date", { mode: "string" }).notNull(),
    requestCount: integer("request_count").default(0).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.usageDate] })],
);

export const weeklyReports = pgTable(
  "weekly_reports",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    weekStart: date("week_start", { mode: "string" }).notNull(),
    summary: text("summary").notNull(),
    metrics: jsonb("metrics")
      .$type<Record<string, number | string>>()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("weekly_reports_user_week_unique").on(
      table.userId,
      table.weekStart,
    ),
  ],
);

export const familyGroups = pgTable("family_groups", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 60 }).notNull(),
  inviteCode: varchar("invite_code", { length: 10 }).notNull().unique(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const familyMembers = pgTable(
  "family_members",
  {
    familyId: text("family_id")
      .notNull()
      .references(() => familyGroups.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 16 }).default("member").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.familyId, table.userId] }),
    uniqueIndex("family_members_one_family_per_user").on(table.userId),
  ],
);

export const friendInvites = pgTable(
  "friend_invites",
  {
    id: text("id").primaryKey(),
    code: varchar("code", { length: 10 }).notNull().unique(),
    inviterId: text("inviter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    acceptedById: text("accepted_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("friend_invites_inviter_idx").on(table.inviterId)],
);

export const friendships = pgTable(
  "friendships",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    friendId: text("friend_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.friendId] })],
);
