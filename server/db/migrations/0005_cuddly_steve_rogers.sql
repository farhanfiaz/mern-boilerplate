ALTER TABLE "roles" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "roles" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;