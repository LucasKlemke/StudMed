CREATE EXTENSION vector;

CREATE TABLE IF NOT EXISTS "email_verification_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(64) NOT NULL,
	"password" varchar(64) NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guyton_chunks" (
	"id" uuid PRIMARY KEY NOT NULL,
	"document" text NOT NULL,
	"page" integer NOT NULL,
	"embedding" vector(1536) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "username" DROP DEFAULT;