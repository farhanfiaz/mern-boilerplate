import logger from "@server/utils/logger";
import { db } from "../connection";
import { roles } from "../schema";
import { eq } from "drizzle-orm";
import {RoleName} from "../../enums/role.enum";

const defaultRoles = [
    {
        name: RoleName.Admin,
        description: "Full system access",
    },
    {
        name: RoleName.User,
        description: "Default user with limited access",
    },
];

export async function seedRoles() {
    logger.info(`👤 Role Seeding Starting`);
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
            });

            logger.info(`Seeded role: ${role.name}`);
        }
    }
    logger.info(`👤 Role Seeding Ending`);
}