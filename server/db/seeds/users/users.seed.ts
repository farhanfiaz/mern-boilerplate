import logger from "@server/utils/logger";

import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import { RoleName } from "@server/enums/role.enum";
import { db } from "@server/db/connection";
import { roles, tenants, userRoles, users } from "@server/db/schema";

export async function userSeed() {
  logger.info("🗄️ User Seeding database...");

  const superTenant = await db.query.tenants.findFirst({
    where: eq(tenants.slug, "super-tenant"),
  });

  if (!superTenant) {
    logger.error("❌ Tenant not found: super-tenant");
    return;
  }

  const [userRole] = await db
    .select()
    .from(roles)
    .where(and(eq(roles.name, RoleName.User), eq(roles.tenantId, superTenant.id)))
    .limit(1);

  if (!userRole) {
    logger.info(`🔥 user role not found. `);
    throw new Error("Role 'user' not found. Run seedRoles first.");
  }
  const userEmail = "user@admin.com";
  const userPassword = "comfortable";

  const userHashedPassword = await bcrypt.hash(userPassword, 10);

  let userUser = await db.query.users.findFirst(
    {
      where: (users, { eq }) => (eq(users.email, userEmail))
    }
  );

  if (!userUser) {
    const insertedUser = await db.insert(users).values({
      email: userEmail,
      password: userHashedPassword,
      username: "user",
      firstName: "user",
      lastName: "user",
      tenantId: superTenant.id,
    }).returning();
    logger.info(`👤 user created Email: ${userEmail} & Password: ${userPassword}`);
    userUser = insertedUser[0];
    // 3. Assign role via userRoles table (IMPORTANT PART)
    const existingUserRole = await db
      .select()
      .from(userRoles)
      .where(
        and(
          eq(userRoles.userId, userUser.id),
          eq(userRoles.roleId, userRole.id)
        )
      )
      .limit(1);

    if (existingUserRole.length === 0) {
      await db.insert(userRoles).values({
        userId: userUser.id,
        roleId: userRole.id,
      });

      logger.info("🔗 user role assigned to user user");
    } else {
      logger.info("🔗 user already has user role");
    }
  }

  logger.info("✅ User Seeding completed");

}