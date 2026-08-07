CREATE TABLE "smile_counters" (
	"id" text PRIMARY KEY NOT NULL,
	"total" bigint DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "smile_counters" ("id", "total", "updated_at")
SELECT 'community', count(*)::bigint, now()
FROM "smile_events"
ON CONFLICT ("id") DO NOTHING;
