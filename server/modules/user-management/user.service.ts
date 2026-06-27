import { db } from "@server/db/connection";
import { userRoles, users } from "@server/db/schema";
import bcrypt from "bcryptjs";
import { count, desc, eq, ilike, and, or, ne } from "drizzle-orm";

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
                .where(and(eq(users.tenantId, tenantId!), eq(users.isDeleted, false), baseFilter))
                .orderBy(desc(users.createdAt))
                .limit(limit)
                .offset(offset),

            db
                .select({ count: count() })
                .from(users)
                .where(and(eq(users.tenantId, tenantId!), eq(users.isDeleted, false), baseFilter)),
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
        const [userEmailValidate] = await db.select().from(users).where(and(ne(users.id, id), eq(users.email, email)));
        if (userEmailValidate) {
            throw new Error("email already exist.");
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

    changePassword = async ({
        userId,
        currentPassword,
        confirmPassword,
        newPassword,
    }: {
        userId: string;
        currentPassword: string;
        confirmPassword: string;
        newPassword: string;
    }) => {
        if (!currentPassword) {
            throw new Error("Current password is required.");
        }

        if (!newPassword || !confirmPassword) {
            throw new Error("New password and confirm password are required.");
        }

        if (newPassword !== confirmPassword) {
            throw new Error("New password and confirm password do not match.");
        }

        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId),
        });

        if (!user) {
            throw new Error("User not found.");
        }

        // Verify current password
        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password ?? ""
        );

        if (!isPasswordCorrect) {
            throw new Error("Current password is incorrect.");
        }

        // Optional: prevent using the same password again
        const isSamePassword = await bcrypt.compare(
            newPassword,
            user.password ?? ""
        );

        if (isSamePassword) {
            throw new Error("New password must be different from the current password.");
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db
            .update(users)
            .set({
                password: hashedPassword,
            })
            .where(eq(users.id, userId));

    };

    resetPassword = async (userId: string): Promise<string> => {
        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId),
        });

        if (!user) {
            throw new Error("User not found.");
        }

        const temporaryPassword = Math.random().toString(36).slice(-10);

        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        await db
            .update(users)
            .set({
                password: hashedPassword,
            })
            .where(eq(users.id, userId));

        return temporaryPassword;
    }
}