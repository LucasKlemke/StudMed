CREATE TABLE "Tokens" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp NOT NULL,
	"promptTokens" numeric NOT NULL,
	"completionTokens" numeric NOT NULL,
	"totalTokens" numeric NOT NULL,
	"totalPrice" numeric,
	"userId" uuid NOT NULL,
	CONSTRAINT "Tokens_id_createdAt_pk" PRIMARY KEY("id","createdAt")
);
--> statement-breakpoint
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;