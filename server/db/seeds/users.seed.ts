import logger from "@server/utils/logger";
import { db } from "../connection";
import { roles, userRoles, users } from "../schema";
import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";

export async function userSeed() {
  logger.info("🗄️ Seeding database...");

  const [userRole] = await db
    .select()
    .from(roles)
    .where(eq(roles.name, "user"))
    .limit(1);

  if (!userRole) {
    logger.info(`🔥 user role not found. `);
    throw new Error("Role 'user' not found. Run seedRoles first.");
  }
  const superAdminEmail = "admin@admin.com";
  const superAdminPassword = "comfortable";

  const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

  let adminUser = await db.query.users.findFirst(
    {
      where: (users, { eq, isNull }) => (eq(users.email, superAdminEmail))
    }
  );

  if (!adminUser) {
    const insertedUser = await db.insert(users).values({
      email: superAdminEmail,
      password: hashedPassword,
      username: "admin",
      firstName: "admin",
      lastName: "admin"
    }).returning();
    logger.info(`👤 default user created Email: ${superAdminEmail} & Password: ${superAdminPassword}`);
    adminUser = insertedUser[0];
    // 3. Assign role via userRoles table (IMPORTANT PART)
    const existingUserRole = await db
      .select()
      .from(userRoles)
      .where(
        and(
          eq(userRoles.userId, adminUser.id),
          eq(userRoles.roleId, userRole.id)
        )
      )
      .limit(1);

    if (existingUserRole.length === 0) {
      await db.insert(userRoles).values({
        userId: adminUser.id,
        roleId: userRole.id,
      });

      logger.info("🔗 Role assigned to admin user");
    } else {
      logger.info("🔗 Admin already has user role");
    }
  }

  logger.info("✅ Seeding completed");
  process.exit(0);
}