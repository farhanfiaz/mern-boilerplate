import logger from "@server/utils/logger";
import { eq } from "drizzle-orm";
import { RoleName } from "@server/enums/role.enum";
import { roles } from "@server/db/schema";
import { db } from "@server/db/connection";

const defaultRoles = [
    {
        name: RoleName.SuperAdmin,
        description: "Super access to all system",
        isSystem: true,
        isDeleted: false,
        isActive: true,
    }
];

export async function seedSuperAdminRoles() {
    logger.info(`️ Super Admin Role Seeding Starting`);

    for (const role of defaultRoles) {
        const existing = await db
            .select()
            .from(roles)
            .where(eq(roles.name, role.name))
            .limit(1);

        if (existing.length === 0) {
            await db.insert(roles).values({
                name: role.name,
                description: role.description,
                isSystem: role.isSystem,
                isDeleted: role.isDeleted,
                isActive: role.isActive,
            });

            logger.info(`Role seeded: ${role.name}`);
        } else {
            logger.info(`Role already exists: ${role.name}`);
        }
    }
    logger.info(`️ Super Admin Role Seeding Ending`);
}