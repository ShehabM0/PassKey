ALTER TABLE "credentials" RENAME COLUMN "icon" TO "platform_icon";--> statement-breakpoint
ALTER TABLE "credentials" RENAME COLUMN "title" TO "platform_title";--> statement-breakpoint
DROP INDEX "title_idx";--> statement-breakpoint
CREATE INDEX "title_idx" ON "credentials" USING btree ("platform_title");