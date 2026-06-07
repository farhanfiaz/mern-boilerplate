CREATE TYPE "public"."override_type" AS ENUM('allow', 'deny');--> statement-breakpoint
CREATE TABLE "menus" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"parent_id" varchar(21),
	"group_label" varchar(50),
	"icon" varchar(50),
	"url" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_action" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_menus" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"role_id" varchar(21) NOT NULL,
	"menu_id" varchar(21) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_menus" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"menu_id" varchar(21) NOT NULL,
	"override_type" "override_type" DEFAULT 'allow' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "menus" ADD CONSTRAINT "menus_parent_id_menus_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."menus"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_menus" ADD CONSTRAINT "role_menus_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_menus" ADD CONSTRAINT "role_menus_menu_id_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_menus" ADD CONSTRAINT "user_menus_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_menus" ADD CONSTRAINT "user_menus_menu_id_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "menu_parent_name_unique" ON "menus" USING btree ("parent_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "role_menu_unique" ON "role_menus" USING btree ("role_id","menu_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_menu_unique" ON "user_menus" USING btree ("user_id","menu_id");