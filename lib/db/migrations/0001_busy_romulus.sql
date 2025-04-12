DROP TABLE "Tokens" CASCADE;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "has_access" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "e" varchar(64);