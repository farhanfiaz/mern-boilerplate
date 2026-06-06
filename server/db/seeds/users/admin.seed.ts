import logger from "@server/utils/logger";

import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import { RoleName } from "@server/enums/role.enum";
import { db } from "@server/db/connection";
import { roles, tenants, userRoles, users } from "@server/db/schema";

export async function adminSeed() {
    logger.info("🗄️ Admin Seeding database...");

    const superTenant = await db.query.tenants.findFirst({
        where: eq(tenants.slug, "super-tenant"),
    });

    if (!superTenant) {
        logger.error("❌ Tenant not found: super-tenant");
        return;
    }

    const [adminRole] = await db
        .select()
        .from(roles)
        .where(and(eq(roles.name, RoleName.Admin), eq(roles.tenantId, superTenant.id)))
        .limit(1);

    if (!adminRole) {
        logger.info(`🔥 admin role not found. `);
        throw new Error("Role 'admin' not found. Run seedRoles first.");
    }
    const adminEmail = "admin@admin.com";
    const adminPassword = "comfortable";

    const adminHashedPassword = await bcrypt.hash(adminPassword, 10);

    let adminUser = await db.query.users.findFirst(
        {
            where: (users, { eq }) => (eq(users.email, adminEmail))
        }
    );

    if (!adminUser) {
        const insertedUser = await db.insert(users).values({
            email: adminEmail,
            password: adminHashedPassword,
            username: "admin",
            firstName: "admin",
            lastName: "admin",
            tenantId: superTenant.id,
        }).returning();
        logger.info(`👤 admin user created Email: ${adminEmail} & Password: ${adminPassword}`);
        adminUser = insertedUser[0];

        const existingUserRole = await db
            .select()
            .from(userRoles)
            .where(
                and(
                    eq(userRoles.userId, adminUser.id),
                    eq(userRoles.roleId, adminRole.id),
                )
            )
            .limit(1);

        if (existingUserRole.length === 0) {
            await db.insert(userRoles).values({
                userId: adminUser.id,
                roleId: adminRole.id,
            });

            logger.info("🔗 Role assigned to admin user");
        } else {
            logger.info("🔗 admin already has admin role");
        }
    }

    logger.info("✅ admin Seeding completed");

}