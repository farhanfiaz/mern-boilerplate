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
        logger.info(`🔥 super admin role not found. `);
        throw new Error("Role 'super_admin' not found. Run seedRoles first.");
    }
    const superAdminEmail = "superadmin@admin.com";
    const superAdminPassword = "comfortable";

    const superAdminHashedPassword = await bcrypt.hash(superAdminPassword, 10);

    let superAdminUser = await db.query.users.findFirst(
        {
            where: (users, { eq, isNull }) => (eq(users.email, superAdminEmail))
        }
    );

    if (!superAdminUser) {
        const insertedUser = await db.insert(users).values({
            email: superAdminEmail,
            password: superAdminHashedPassword,
            username: "super_admin",
            firstName: "super_admin",
            lastName: "super_admin"
        }).returning();
        logger.info(`👤 super admin user created Email: ${superAdminEmail} & Password: ${superAdminPassword}`);
        superAdminUser = insertedUser[0];

        const existingUserRole = await db
            .select()
            .from(userRoles)
            .where(
                and(
                    eq(userRoles.userId, superAdminUser.id),
                    eq(userRoles.roleId, superAdminRole.id)
                )
            )
            .limit(1);

        if (existingUserRole.length === 0) {
            await db.insert(userRoles).values({
                userId: superAdminUser.id,
                roleId: superAdminRole.id,
            });

            logger.info("🔗 super admin role assigned to super admin user");
        } else {
            logger.info("🔗 super admin already has super admin role");
        }
    }

    logger.info("✅ super admin Seeding completed");

}