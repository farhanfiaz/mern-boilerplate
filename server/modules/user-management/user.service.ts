import { db } from "@server/db/connection";
import { users } from "@server/db/schema";
import { count, desc, ilike, or } from "drizzle-orm";

export class UserService {
    constructor() {

    }

    getAllUserByTenant = async (page: number, limit: number, search: string | undefined, status: string | undefined, roleId: string | undefined, tenantId: string | undefined) => {
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
                .where(baseFilter)
                .orderBy(desc(users.createdAt))
                .limit(limit)
                .offset(offset),

            db
                .select({ count: count() })
                .from(users)
                .where(baseFilter),
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

    createUser = async (firstName: string, lastName: string, email: string, username: string | undefined, phone: string | undefined, roleId: string | undefined, tenantId: string | undefined) => {
        return [];
    }

    updateUser = async (id: string, firstName: string, lastName: string, email: string, username: string | undefined, phone: string | undefined, roleId: string | undefined) => {
        return [];
    }

    deleteUser = async (id: string) => {
        return [];
    }

    inActiveUser = async (id: string) => {
        return [];
    }

    getUserById = async (id: string) => {
        return [];
    }
}