ALTER TABLE "book_chunks" RENAME COLUMN "book" TO "bookName";--> statement-breakpoint
ALTER TABLE "book_chunks" ALTER COLUMN "relatedSubject" SET DEFAULT 'fisiologia';