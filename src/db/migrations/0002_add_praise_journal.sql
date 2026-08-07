CREATE TABLE "praise_journal_entries" (
	"device_hash" varchar(64) NOT NULL,
	"entry_date" date NOT NULL,
	"content" varchar(200) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "praise_journal_entries_device_hash_entry_date_pk" PRIMARY KEY("device_hash","entry_date")
);
