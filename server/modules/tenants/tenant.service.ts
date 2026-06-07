import { db } from "@server/db/connection";
import { tenants, users } from "@server/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { ActiveTenant } from "./tenant.types";

export class TenantService {
    constructor() {

    }

    async getTenantId(): Promise<string | null> {
        const tenant = await db.query.tenants.findFirst({
            columns: {
                id: true,
            },
            orderBy: (tenants, { desc }) => [desc(tenants.id)],
        });

        return tenant?.id ?? null;
    }
    async getCurrentActiveTenant(): Promise<ActiveTenant[]> {
        const tenants = await db.query.tenants.findMany({
            where: (tenants, { eq }) =>
                and(
                    eq(tenants.isActive, true),
                    eq(tenants.isDeleted, false)
                ),
            columns: {
                id: true,
                name: true,
            },
        });
        return tenants;
    }

    async getAllTenants() {
        const allTenants = await db.select().from(tenants);
        return allTenants;
    }

    async getUserAllTenants(userId: string) {
        const userAllTenants = await db.select().from(tenants)
            .innerJoin(users, eq(tenants.id, users.tenantId))
            .where(eq(users.id, userId));
        return userAllTenants;
    }

    async createTenant() {

    }

    async getTenantById() {

    }

    async updateTenant() {

    }

    async deleteTenant() {

    }

}