import logger from "@/utils/logger";
import { db } from "@server/db/connection";
import { eq } from "drizzle-orm";
import { tenants } from "@server/db/schema";

export async function seedTenants() {
    logger.info(`👤 Tenant Seeding Starting`);

    const now = new Date();
    const currentPeriodEnd = new Date(now);
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 3);
    const renewsAt = new Date(currentPeriodEnd);

    const superTenant = [
        {
            name: "Super Tenant",
            slug: "super-tenant",
            description: "Tenant for system administration",
            website: "https://www.hawklogix.com",
            logo: "https://www.hawklogix.com/logo.png"
        },
    ];

    for (const tenant of superTenant) {
        const existingTenant = await db.query.tenants.findFirst({
            where: eq(tenants.slug, tenant.slug),
        });

        if (!existingTenant) {
            await db.insert(tenants).values(tenant);

            logger.info(`Seeded tenant: ${tenant.name}`);
        } else {
            logger.info(`Tenant already exists: ${tenant.name}`);
        }
    }

    logger.info(`👤 Tenant Seeding Ending`);
}