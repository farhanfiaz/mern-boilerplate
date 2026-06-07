import logger from "@server/utils/logger";
import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import { RoleName } from "@server/enums/role.enum";
import { db } from "@server/db/connection";
import { roles, userRoles, users } from "@server/db/schema";

export async function superAdminSeed() {
    logger.info("🗄️ Super Admin Seeding database...");

    const [superAdminRole] = await db
        .select()
        .from(roles)
        .where(eq(roles.name, RoleName.SuperAdmin))
        .limit(1);

    if (!superAdminRole) {
        throw new Error("Role 'super_admin' not found. Run seedRoles first.");
    }

    const [adminRole] = await db
        .select()
        .from(roles)
        .where(eq(roles.name, RoleName.Admin))
        .limit(1);

    if (!adminRole) {
        throw new Error("Role 'admin' not found. Run seedRoles first.");
    }

    const superAdminEmail = "superadmin@admin.com";
    const superAdminPassword = "comfortable";

    const superAdminHashedPassword = await bcrypt.hash(superAdminPassword, 10);

    // ✅ FIX: always define user properly
    let superAdminUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, superAdminEmail),
    });

    // Create user if not exists
    if (!superAdminUser) {
        const insertedUser = await db
            .insert(users)
            .values({
                email: superAdminEmail,
                password: superAdminHashedPassword,
                username: "super_admin",
                firstName: "super_admin",
                lastName: "super_admin",
            })
            .returning();

        superAdminUser = insertedUser[0];

        logger.info(
            `👤 super admin user created Email: ${superAdminEmail} & Password: ${superAdminPassword}`
        );
    }

    // -------------------------
    // Ensure SUPER_ADMIN role
    // -------------------------
    const existingSuperAdminRole = await db
        .select()
        .from(userRoles)
        .where(
            and(
                eq(userRoles.userId, superAdminUser.id),
                eq(userRoles.roleId, superAdminRole.id)
            )
        )
        .limit(1);

    if (existingSuperAdminRole.length === 0) {
        await db.insert(userRoles).values({
            userId: superAdminUser.id,
            roleId: superAdminRole.id,
        });

        logger.info("🔗 super admin role assigned");
    } else {
        logger.info("🔗 super admin role already exists");
    }

    // -------------------------
    // Ensure ADMIN role
    // -------------------------
    const existingAdminRole = await db
        .select()
        .from(userRoles)
        .where(
            and(
                eq(userRoles.userId, superAdminUser.id),
                eq(userRoles.roleId, adminRole.id)
            )
        )
        .limit(1);

    if (existingAdminRole.length === 0) {
        await db.insert(userRoles).values({
            userId: superAdminUser.id,
            roleId: adminRole.id,
        });

        logger.info("🔗 admin role assigned");
    } else {
        logger.info("🔗 admin role already exists");
    }

    logger.info("✅ super admin seeding completed");
}