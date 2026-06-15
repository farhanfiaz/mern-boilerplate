import { db } from "@server/db/connection";
import { tenants, users } from "@server/db/schema";
import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { ActiveTenant } from "./tenant.types";
import * as fs from 'fs/promises';
import * as path from 'path';
import logger from "@/utils/logger";

export class TenantService {
    constructor() {

    }

    async getTenantId(): Promise<string | null> {
        const tenant = await db.query.tenants.findFirst({
            where: (tenants, { eq }) =>
                and(
                    eq(tenants.isActive, true),
                    eq(tenants.isDeleted, false)
                ),
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
    async getCurrentUserActiveTenant(ownerId: string): Promise<ActiveTenant[]> {
        const result = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, ownerId),
            with: {
                tenant: {
                    columns: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!result?.tenant) {
            return [];
        }

        return [result.tenant];
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

    async createTenant(
        tenant: any
    ): Promise<any> {
        const file = tenant.logo;
        if (file) {
            const uploadDir = path.join(process.cwd(), 'uploads', 'tenants');

            await fs.mkdir(uploadDir, { recursive: true });

            // Handle data:image/png;base64,... format
            const matches = file.match(
                /^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/
            );

            if (!matches) {
                throw new Error('Invalid base64 image format');
            }

            const mimeType = matches[1];
            const base64Data = matches[2];

            const extension = mimeType.split('/')[1];
            const fileName = `${Date.now()}.${extension}`;
            const filePath = path.join(uploadDir, fileName);

            const buffer = Buffer.from(base64Data, 'base64');

            await fs.writeFile(filePath, buffer);

            // Save relative path in DB
            tenant.logo = `/uploads/tenants/${fileName}`;
        }

        const [createdTenant] = await db
            .insert(tenants)
            .values(tenant)
            .returning();

        return createdTenant;
    }

    async updateTenant(tenantId: string, tenant: any): Promise<any> {
        const file = tenant.logo;
        if (file) {
            const uploadDir = path.join(process.cwd(), 'uploads', 'tenants');

            await fs.mkdir(uploadDir, { recursive: true });

            // Handle data:image/png;base64,... format
            const matches = file.match(
                /^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/
            );

            if (!matches) {
                throw new Error('Invalid base64 image format');
            }

            const mimeType = matches[1];
            const base64Data = matches[2];

            const extension = mimeType.split('/')[1];
            const fileName = `${Date.now()}.${extension}`;
            const filePath = path.join(uploadDir, fileName);

            const buffer = Buffer.from(base64Data, 'base64');

            await fs.writeFile(filePath, buffer);

            // Save relative path in DB
            tenant.logo = `/uploads/tenants/${fileName}`;
        }

        const [updatedTenant] = await db
            .update(tenants)
            .set(tenant)
            .where(and(eq(tenants.id, tenantId), eq(tenants.isDeleted, false)))
            .returning();

        return updatedTenant;
    }

    async deleteTenant(tenantId: string): Promise<any> {
        const [deletedTenant] = await db
            .update(tenants)
            .set({ isActive: false, isDeleted: true })
            .where(eq(tenants.id, tenantId))
            .returning();

        return deletedTenant;
    }

    async inActiveTenant(tenantId: string): Promise<any> {
        const tenant = await db.query.tenants.findFirst({
            where: eq(tenants.id, tenantId),
        });

        if (tenant && tenant?.isDeleted) {
            throw new Error("This tenant is deleted so you can't change its status.");
        }

        const oldIsActive = tenant?.isActive;

        const [updatedTenant] = await db
            .update(tenants)
            .set({
                isActive: !oldIsActive,
            })
            .where(eq(tenants.id, tenantId))
            .returning();

        logger.info(`Old: ${oldIsActive}, New: ${updatedTenant.isActive}`);

        return updatedTenant;
    }

}