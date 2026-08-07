CREATE TABLE "smile_events" (
	"device_hash" text NOT NULL,
	"success_date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "smile_events_device_hash_success_date_pk" PRIMARY KEY("device_hash","success_date")
);
