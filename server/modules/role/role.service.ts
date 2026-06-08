import { db } from "@server/db/connection";
import { roles } from "@server/db/schema";
import { count, desc, eq, ilike, or } from "drizzle-orm";

export class RoleService {
    constructor() {

    }

    getAllRole = async (tenantId: string) => {
        const rolesList = await db.select().from(roles).where(eq(roles.tenantId, tenantId));
        return rolesList;
    }

    getRole = async (page: number, limit: number, search: string, tenantId: string) => {
        const offset = (page - 1) * limit;

        const searchTerm =
            search && search.trim() !== '' ? `%${search.trim()}%` : null;

        const baseFilter = searchTerm
            ? or(
                ilike(roles.name, searchTerm)
            )
            : undefined;

        const [data, totalResult] = await Promise.all([
            db
                .select()
                .from(roles)
                .where(baseFilter)
                .orderBy(desc(roles.createdAt))
                .limit(limit)
                .offset(offset),

            db
                .select({ count: count() })
                .from(roles)
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

    getRoleById = async (id: string) => {
        return {};
    }

    createRole = async (role: any) => {
        return [];
    }

    updateRole = async (id: string, role: any) => {
        return [];
    }

    deleteRole = async (id: string) => {
        return [];
    }

    inActiveRole = async (id: string) => {
        return [];
    }
}