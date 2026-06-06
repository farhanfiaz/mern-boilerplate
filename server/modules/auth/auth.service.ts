import { db } from "@server/db/connection";
import { AuthResponse, JWTTokenUserInfo, LoginDto, RegisterDto } from "./auth.types";
import { userRoles, users } from "@server/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import appConfig from "@server/config/app.config";
import { RoleName } from "@server/enums/role.enum";

export class AuthService {
    constructor() {

    }
    async login(data: LoginDto): Promise<AuthResponse> {
        const userDetail = await db.query.users.findFirst({
            where: (users, { eq, isNull }) =>
                and(
                    eq(users.email, data.email),
                    eq(users.isActive, true),
                    eq(users.isDeleted, false)
                ),
        });
        if (!userDetail) {
            throw new Error("User not found");
        }
        const isPasswordValid = await bcrypt.compare(data.password, userDetail?.password || "");
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        const userRoles = await db.query.userRoles.findMany({
            where: (userRoles, { eq }) => eq(userRoles.userId, userDetail?.id),
            columns: {
                userId: false,
                roleId: false,
                assignedAt: false,
            },
            with: {
                role: {
                    columns: {
                        id: true,
                        name: true,
                        isSystem: true,
                    },
                },
            },
        });
        const userInfo: JWTTokenUserInfo = {
            userId: userDetail?.id ?? '',
            email: userDetail?.email ?? '',
            name: userDetail.username ?? '',
            userIamge: userDetail.avatarUrl ?? '',
            role: userRoles.map((role) => role.role),
            tenantId: userDetail.tenantId ?? '',
            firstName: userDetail.firstName ?? '',
            lastName: userDetail.lastName ?? '',
        };
        const accessToken = this.generateAccessToken(userInfo);
        const refreshToken = this.generateRefreshToken(userInfo);

        return {
            user: userInfo,
            token: accessToken,
            refreshToken: refreshToken,
        };
    }
    async userInfoByUserId(userId: string): Promise<JWTTokenUserInfo> {
        const userDetail = await db.query.users.findFirst({
            where: (users, { eq, isNull }) =>
                and(
                    eq(users.id, userId),
                    eq(users.isActive, true),
                    eq(users.isDeleted, false)
                ),
        });
        const userRoles = await db.query.userRoles.findMany({
            where: (userRoles, { eq }) => eq(userRoles.userId, userDetail?.id ?? ''),
            columns: {
                userId: false,
                roleId: false,
                assignedAt: false,
            },
            with: {
                role: {
                    columns: {
                        id: true,
                        name: true,
                        isSystem: true,
                    },
                },
            },
        });
        const userInfo: JWTTokenUserInfo = {
            userId: userDetail?.id ?? '',
            email: userDetail?.email ?? '',
            name: userDetail?.username ?? '',
            userIamge: userDetail?.avatarUrl ?? '',
            role: userRoles.map((role) => role.role),
            tenantId: userDetail?.tenantId ?? '',
            firstName: userDetail?.firstName ?? '',
            lastName: userDetail?.lastName ?? '',
        };
        return userInfo;
    }
    generateAccessToken(user: JWTTokenUserInfo): string {
        return jwt.sign(
            user,
            appConfig.security.jwtSecret as Secret,
            {
                expiresIn: appConfig.security.jwtExpiresIn,
            } as SignOptions
        );
    }
    generateRefreshToken(user: JWTTokenUserInfo): string {
        return jwt.sign(
            user,
            appConfig.security.refreshSecret as Secret,
            {
                expiresIn: appConfig.security.refreshExpiresIn,
            } as SignOptions
        );
    }
    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        const decoded = jwt.verify(
            refreshToken,
            appConfig.security.refreshSecret as Secret
        ) as JWTTokenUserInfo;
        const userInfo = await this.userInfoByUserId(decoded.userId);
        const accessToken = this.generateAccessToken(userInfo);
        const newRefreshToken = this.generateRefreshToken(userInfo);
        return {
            user: userInfo,
            token: accessToken,
            refreshToken: newRefreshToken,
        };
    }
    async register(data: RegisterDto): Promise<AuthResponse> {
        const isEmailExist = await db.query.users.findFirst(
            {
                where: (users, { eq }) => eq(users.email, data.email)
            }
        );
        if (isEmailExist) {
            throw new Error("user email already used..!");
        }
        const defaultRole = await db.query.roles.findFirst({
            where: (role, { eq }) => (eq(role.name, RoleName.User))
        });
        if (!defaultRole) {
            throw new Error("Default role not found");
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const [newUser] = await db
            .insert(users)
            .values({
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                avatarUrl: data.file?.filename ?? null,
                username: data.email
            })
            .returning();
        await db.insert(userRoles).values({
            userId: newUser.id,
            roleId: defaultRole.id,
            assignedAt: new Date()
        });
        const userRoleList = await db.query.userRoles.findMany({
            where: (userRoles, { eq }) => eq(userRoles.userId, newUser?.id),
            columns: {
                userId: false,
                roleId: false,
                assignedAt: false,
            },
            with: {
                role: {
                    columns: {
                        id: true,
                        name: true,
                        isSystem: true,
                    },
                },
            },
        });
        const userInfo: JWTTokenUserInfo = {
            userId: newUser.id,
            email: newUser.email,
            name: newUser.username ?? '',
            userIamge: newUser.avatarUrl ?? '',
            role: userRoleList.map((role) => role.role),
            tenantId: newUser.tenantId ?? '',
            firstName: newUser.firstName ?? '',
            lastName: newUser.lastName ?? '',
        };
        const accessToken = this.generateAccessToken(userInfo);
        const refreshToken = this.generateRefreshToken(userInfo);

        return {
            user: userInfo,
            token: accessToken,
            refreshToken: refreshToken,
        };
    }
    async getSuperAdminMenus(userId: string, selectedRole: string) {
        const userDetail = await db.query.users.findFirst({
            where: (users, { eq, isNull }) =>
                and(
                    eq(users.id, userId),
                    eq(users.isActive, true),
                    eq(users.isDeleted, false)
                ),
        });
        if (!userDetail) {
            throw new Error("User not found");
        }
        const userRoles = await db.query.userRoles.findMany({
            where: (userRoles, { eq }) => (eq(userRoles.userId, userDetail?.id ?? '')),
            columns: {
                userId: false,
                roleId: false,
                assignedAt: false,
            },
            with: {
                role: {
                    columns: {
                        id: true,
                        name: true,
                        isSystem: true,
                    },
                },
            },
        });
        if (userRoles.some((role) => role.role.isSystem)) {
            return [
                {
                    id: 1,
                    name: "Dashboard",
                    parentId: null,
                    groupLabel: "Main",
                    icon: "LayoutDashboard",
                    url: "/dashboard",
                    order: 1,
                    createdAt: new Date(),
                    isActive: true,
                    isAction: false,
                }
            ];
        }
        const userRolesList = await db.query.userRoles.findMany({
            where: (userRoles, { eq }) => (eq(userRoles.userId, userDetail?.id ?? ''), eq(userRoles.roleId, selectedRole)),
            columns: {
                userId: false,
                roleId: false,
                assignedAt: false,
            },
            with: {
                role: {
                    columns: {
                        id: true,
                        name: true,
                        isSystem: true,
                    },
                },
            },
        });
        if (!userRolesList) {
            return [];
        }
    }
}