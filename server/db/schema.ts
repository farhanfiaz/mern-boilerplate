import { nanoid } from "nanoid";
import { pgTable, varchar, text, timestamp, boolean, uniqueIndex, integer, AnyPgColumn, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const tenants = pgTable("tenants", {
  id: varchar("id", { length: 21 })
    .$defaultFn(() => nanoid())
    .primaryKey(),

  name: varchar("name", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  description: text("description"),
  website: varchar("website", { length: 100 }),
  logo: text("logo"),
  isActive: boolean("is_active")
    .default(true)
    .notNull(),
  isDeleted: boolean("is_deleted")
    .default(false)
    .notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id", { length: 21 })
    .$defaultFn(() => nanoid())
    .primaryKey(),

  tenantId: varchar("tenant_id", { length: 21 })
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  plan: varchar("plan", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  currentPeriodStart: timestamp("current_period_start", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  currentPeriodEnd: timestamp("current_period_end", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  renewsAt: timestamp("renews_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
});

export const users = pgTable("users", {
  id: varchar("id", { length: 21 })
    .$defaultFn(() => nanoid())
    .primaryKey(),
  firstName: varchar("first_name", { length: 100 })
    .notNull(),
  lastName: varchar("last_name", { length: 100 })
    .notNull(),
  username: varchar("username", { length: 50 })
    .unique(),
  email: varchar("email", { length: 255 })
    .notNull()
    .unique(),
  phone: varchar("phone", { length: 20 }),
  avatarUrl: text("avatar_url"),
  password: text("password"),
  emailVerified: boolean("email_verified")
    .default(false)
    .notNull(),
  phoneVerified: boolean("phone_verified")
    .default(false)
    .notNull(),
  isActive: boolean("is_active")
    .default(true)
    .notNull(),
  isDeleted: boolean("is_deleted")
    .default(false)
    .notNull(),
  lastLoginAt: timestamp("last_login_at", {
    withTimezone: true,
    mode: "date",
  }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),

  tenantId: varchar("tenant_id", { length: 21 })
    .references(() => tenants.id, { onDelete: "cascade" }),
});

export const roles = pgTable("roles", {
  id: varchar("id", { length: 21 })
    .$defaultFn(() => nanoid())
    .primaryKey(),

  name: varchar("name", { length: 50 }).notNull(),
  // e.g. "admin", "user", "moderator"
  isSystem: boolean("is_system")
    .default(false)
    .notNull(),

  description: text("description"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),

  tenantId: varchar("tenant_id", { length: 21 })
    .references(() => tenants.id, { onDelete: "cascade" }),
},
  (table) => ({
    uniqueRolePerTenant: uniqueIndex("unique_role_per_tenant").on(
      table.tenantId,
      table.name
    ),
  }));

/* ---------------- ENUM ---------------- */

export const overrideTypeEnum = pgEnum("override_type", [
  "allow",
  "deny",
]);

/* ---------------- MENUS ---------------- */

export const menus = pgTable(
  "menus",
  {
    id: varchar("id", { length: 21 })
      .$defaultFn(() => nanoid())
      .primaryKey(),

    name: varchar("name", { length: 50 }).notNull(),

    parentId: varchar("parent_id", { length: 21 }).references(
      (): AnyPgColumn => menus.id,
      { onDelete: "cascade" }
    ),

    groupLabel: varchar("group_label", { length: 50 }),
    icon: varchar("icon", { length: 50 }),
    url: varchar("url", { length: 255 }),

    sortOrder: integer("sort_order").default(0).notNull(),

    isActive: boolean("is_active").default(true).notNull(),
    isAction: boolean("is_action").default(false).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    // prevents duplicate menu names under same parent
    parentNameUnique: uniqueIndex("menu_parent_name_unique").on(
      table.parentId,
      table.name
    ),
  })
);

/* ---------------- ROLE MENUS ---------------- */

export const roleMenus = pgTable(
  "role_menus",
  {
    id: varchar("id", { length: 21 })
      .$defaultFn(() => nanoid())
      .primaryKey(),

    roleId: varchar("role_id", { length: 21 })
      .references(() => roles.id, { onDelete: "cascade" })
      .notNull(),

    menuId: varchar("menu_id", { length: 21 })
      .references(() => menus.id, { onDelete: "cascade" })
      .notNull(),

    isActive: boolean("is_active").default(true).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    roleMenuUnique: uniqueIndex("role_menu_unique").on(
      table.roleId,
      table.menuId
    ),
  })
);

/* ---------------- USER MENUS ---------------- */

export const userMenus = pgTable(
  "user_menus",
  {
    id: varchar("id", { length: 21 })
      .$defaultFn(() => nanoid())
      .primaryKey(),

    userId: varchar("user_id", { length: 21 })
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    menuId: varchar("menu_id", { length: 21 })
      .references(() => menus.id, { onDelete: "cascade" })
      .notNull(),

    overrideType: overrideTypeEnum("override_type")
      .default("allow")
      .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userMenuUnique: uniqueIndex("user_menu_unique").on(
      table.userId,
      table.menuId
    ),
  })
);

export const userRoles = pgTable(
  "user_roles",
  {
    id: varchar("id", { length: 21 })
      .$defaultFn(() => nanoid())
      .primaryKey(),

    userId: varchar("user_id", { length: 21 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    roleId: varchar("role_id", { length: 21 })
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),

    assignedAt: timestamp("assigned_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    uniqueUserRole: uniqueIndex("unique_user_role").on(
      table.userId,
      table.roleId
    ),
  })
);

export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  roles: many(roles),
  subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(
  subscriptions,
  ({ one }) => ({
    tenant: one(tenants, {
      fields: [subscriptions.tenantId],
      references: [tenants.id],
    }),
  })
);

export const rolesRelations = relations(
  roles,
  ({ one, many }) => ({
    tenant: one(tenants, {
      fields: [roles.tenantId],
      references: [tenants.id],
    }),

    userRoles: many(userRoles),
  })
);

export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),

  userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),

  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
}));