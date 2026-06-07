import { db } from "@server/db/connection";
import { tenants, users } from "@server/db/schema";
import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
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

    async getAllTenants(page: number = 1, limit: number = 10, search?: any) {
        const offset = (page - 1) * limit;

        const searchTerm =
            search && search.trim() !== '' ? `%${search.trim()}%` : null;

        const baseFilter = searchTerm
            ? or(
                ilike(tenants.name, searchTerm),
                ilike(tenants.description, searchTerm)
            )
            : undefined;

        const [data, totalResult] = await Promise.all([
            db
                .select()
                .from(tenants)
                .where(baseFilter)
                .orderBy(desc(tenants.createdAt))
                .limit(limit)
                .offset(offset),

            db
                .select({ count: count() })
                .from(tenants)
                .where(baseFilter),
        ]);

        const total = Number(totalResult[0].count);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getUserAllTenants(page: number = 1, limit: number = 10, userId: string, search?: any) {
        const offset = (page - 1) * limit;

        const user = await db
            .select({ tenantId: users.tenantId })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        const tenantId = user[0]?.tenantId;

        if (!tenantId) {
            return { data: [], pagination: { page, limit, total: 0, totalPages: 0 } };
        }

        const searchTerm =
            search && search.trim() !== '' ? `%${search.trim()}%` : null;

        const baseFilter = and(
            eq(tenants.id, tenantId),
            searchTerm
                ? or(
                    ilike(tenants.name, searchTerm),
                    ilike(tenants.description, searchTerm)
                )
                : undefined
        );

        const [data, totalResult] = await Promise.all([
            db
                .select()
                .from(tenants)
                .where(baseFilter)
                .orderBy(desc(tenants.createdAt))
                .limit(limit)
                .offset(offset),

            db
                .select({ count: sql<number>`count(*)` })
                .from(tenants)
                .where(baseFilter),
        ]);

        const total = Number(totalResult[0].count);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
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