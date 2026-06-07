ALTER TABLE "tenants" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;