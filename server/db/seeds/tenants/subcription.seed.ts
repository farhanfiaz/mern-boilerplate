import logger from "@/utils/logger";
import { db } from "@server/db/connection";
import { eq } from "drizzle-orm";
import { subscriptions, tenants } from "@server/db/schema";

export async function seedSubscriptions() {
    logger.info(`👤 Subscription Seeding Starting`);

    const now = new Date();
    const currentPeriodEnd = new Date(now);
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 3);
    const renewsAt = new Date(currentPeriodEnd);

    const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.slug, "super-tenant"),
    });

    const superTenantId = tenant?.id;

    if (!superTenantId) {
        logger.error(`Super tenant not found`);
        return;
    }

    const superTenantSubscription = [
        {
            tenantId: superTenantId,
            plan: "free",
            status: "active",
            currentPeriodStart: now,
            currentPeriodEnd: currentPeriodEnd,
            renewsAt: renewsAt
        },
    ];

    for (const tenantSubscription of superTenantSubscription) {
        const existingTenant = await db.query.subscriptions.findFirst({
            where: eq(subscriptions.tenantId, tenantSubscription.tenantId),
        });

        if (!existingTenant) {
            await db.insert(subscriptions).values(tenantSubscription);

            logger.info(`Seeded tenant subscription: ${tenantSubscription.plan}`);
        } else {
            logger.info(`Tenant subscription already exists: ${tenantSubscription.plan}`);
        }
    }

    logger.info(`👤 Subscription Seeding Ending`);
}