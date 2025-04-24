CREATE TABLE "email_verification_token" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" VARCHAR(256) NOT NULL,
  "email" VARCHAR(64) NOT NULL,
  "password" VARCHAR(64) NOT NULL,
  "token" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT now(),
  "expires_at" TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "username" DROP DEFAULT;