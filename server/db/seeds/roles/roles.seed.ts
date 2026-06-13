import logger from "@server/utils/logger";
import { and, eq } from "drizzle-orm";
import { RoleName } from "@server/enums/role.enum";
import { roles, tenants } from "@server/db/schema";
import { db } from "@server/db/connection";

const defaultRoles = [
    {
        name: RoleName.Admin,
        description: "Full system access",
        isSystem: false,
        isDeleted: false,
        isActive: true,
    },
    {
        name: RoleName.User,
        description: "Default user with limited access",
        isSystem: false,
        isDeleted: false,
        isActive: true,
    },
];

export async function seedRoles() {
    logger.info(`👤 Role Seeding Starting`);

    const superTenant = await db.query.tenants.findFirst({
        where: eq(tenants.slug, "super-tenant"),
    });

    if (!superTenant) {
        logger.error("❌ Tenant not found: super-tenant");
        return;
    }

    for (const role of defaultRoles) {
        const existing = await db
            .select()
            .from(roles)
            .where(and(eq(roles.name, role.name), eq(roles.tenantId, superTenant.id)))
            .limit(1);

        if (existing.length === 0) {
            await db.insert(roles).values({
                name: role.name,
                description: role.description,
                isSystem: role.isSystem,
                tenantId: superTenant.id,
                isDeleted: role.isDeleted,
                isActive: role.isActive,
            });

            logger.info(`Seeded role: ${role.name}`);
        } else {
            logger.info(`Role already exists: ${role.name}`);
        }
    }
    logger.info(`👤 Role Seeding Ending`);
}