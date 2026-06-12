import { db } from "@server/db/connection";
import { userRoles, users } from "@server/db/schema";
import { count, desc, eq, ilike, and, or } from "drizzle-orm";

export class UserService {
    constructor() {

    }

    getAllUserByTenant = async (page: number, limit: number, search: string | undefined, status: string | undefined, roleId: string | undefined, tenantId: string | null) => {
        const offset = (page - 1) * limit;

        const searchTerm =
            search && search.trim() !== '' ? `%${search.trim()}%` : null;

        const baseFilter = searchTerm
            ? or(
                ilike(users.firstName, searchTerm),
                ilike(users.lastName, searchTerm),
                ilike(users.email, searchTerm),
                ilike(users.username, searchTerm),
                ilike(users.phone, searchTerm)
            )
            : undefined;

        const [data, totalResult] = await Promise.all([
            db
                .select()
                .from(users)
                .where(and(eq(users.tenantId, tenantId!), baseFilter))
                .orderBy(desc(users.createdAt))
                .limit(limit)
                .offset(offset),

            db
                .select({ count: count() })
                .from(users)
                .where(and(eq(users.tenantId, tenantId!), baseFilter)),
        ]);

        const total = Number(totalResult[0].count);

        return {
            users: data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    createUser = async (userInfo: any): Promise<any> => {
        const { firstName, lastName, email, username, phone, roleId, tenantId } = userInfo;

        const [user] = await db.select().from(users).where(eq(users.email, email));
        if (user) {
            throw new Error("User already exists");
        }

        const [newUser] = await db.insert(users).values({
            firstName,
            lastName,
            email,
            username,
            phone,
            tenantId
        }).returning();

        if (roleId) {
            await db.insert(userRoles).values({
                userId: newUser.id,
                roleId
            });
        }
        return newUser;
    }

    updateUser = async (id: string, userInfo: any): Promise<any> => {
        const { firstName, lastName, email, username, phone, roleId } = userInfo;
        const [user] = await db.select().from(users).where(eq(users.id, id));
        if (!user) {
            throw new Error("User not found");
        }

        const [updatedUser] = await db.update(users).set({
            firstName,
            lastName,
            email,
            username,
            phone,
        }).where(eq(users.id, id)).returning();

        if (roleId) {
            await db.update(userRoles).set({
                roleId
            }).where(eq(userRoles.userId, id));
        }
        return updatedUser;
    }

    deleteUser = async (id: string) => {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        if (!user) {
            throw new Error("User not found");
        }

        const [deletedUser] = await db.update(users).set({ isDeleted: true }).where(eq(users.id, id)).returning();
        return deletedUser;
    }

    inActiveUser = async (id: string) => {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        if (!user) {
            throw new Error("User not found");
        }

        const [inactiveUser] = await db.update(users).set({
            isActive: false
        }).where(eq(users.id, id)).returning();
        return inactiveUser;
    }

    getUserById = async (id: string) => {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}