import { db } from "@server/db/connection";
import { roles } from "@server/db/schema";
import { count, desc, eq, ilike, or, and } from "drizzle-orm";

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
                .where(and(eq(roles.tenantId, tenantId), baseFilter))
                .orderBy(desc(roles.createdAt))
                .limit(limit)
                .offset(offset),

            db
                .select({ count: count() })
                .from(roles)
                .where(and(eq(roles.tenantId, tenantId), baseFilter)),
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
        const [role] = await db.select().from(roles).where(eq(roles.id, id));
        if (!role) {
            throw new Error("Role not found");
        }
        return role;
    }

    createRole = async (role: any) => {
        const [roleExist] = await db.select().from(roles).where(eq(roles.name, role.name));
        if (roleExist) {
            throw new Error("Role already exists");
        }
        const [createdRole] = await db.insert(roles).values(role).returning();
        return createdRole;
    }

    updateRole = async (id: string, role: any) => {
        const [updatedRole] = await db.update(roles).set(role).where(eq(roles.id, id)).returning();
        return updatedRole;
    }

    deleteRole = async (id: string) => {
        const [deletedRole] = await db.update(roles).set({ isDeleted: true }).where(eq(roles.id, id)).returning();
        return deletedRole;
    }

    inActiveRole = async (id: string) => {
        const [role] = await db.select().from(roles).where(eq(roles.id, id));
        if (!role) {
            throw new Error("Role not found");
        }

        const [inactiveRole] = await db.update(roles).set({ isActive: !role.isActive }).where(eq(roles.id, id)).returning();
        return inactiveRole;
    }
}