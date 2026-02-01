CREATE TABLE IF NOT EXISTS "tokens" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer,
  "refresh_token" varchar(255) NOT NULL,
  "expires_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "tokens_refresh_token_unique" UNIQUE("refresh_token")
);
--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_users_id_fk"
  FOREIGN KEY ("user_id")
  REFERENCES "public"."users"("id")
  ON DELETE no action
  ON UPDATE no action;
