import { db } from "@server/db/connection";
import { AuthResponse, JWTTokenUserInfo, LoginDto, RegisterDto } from "./auth.types";
import { userRoles, users } from "@server/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import appConfig from "@server/config/app.config";

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
                    },
                },
            },
        });
        const userInfo: JWTTokenUserInfo = {
            userId: userDetail?.id ?? '',
            email: userDetail?.email ?? '',
            name: userDetail.username ?? '',
            userIamge: userDetail.avatarUrl ?? '',
            role: userRoles.map((role) => role.role)
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
                    },
                },
            },
        });
        const userInfo: JWTTokenUserInfo = {
            userId: userDetail?.id ?? '',
            email: userDetail?.email ?? '',
            name: userDetail?.username ?? '',
            userIamge: userDetail?.avatarUrl ?? '',
            role: userRoles.map((role) => role.role)
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
    async register(data: RegisterDto): Promise<AuthResponse> {
        /** check email is unique */
        const isEmailExist = await db.query.users.findFirst(
            {
                where: (users, { eq }) => eq(users.email, data.email)
            }
        );
        if (isEmailExist) {
            throw new Error("user email already used..!");
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const [newUser] = await db
            .insert(users)
            .values({
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                avatarUrl: data.file?.filename ?? null
            })
            .returning();
        const defaultRole = await db.query.roles.findFirst({
            where: (role, { eq }) => (eq(role.name, 'User'))
        });
        if (!defaultRole) {
            throw new Error("Default role not found");
        }
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
                    },
                },
            },
        });
        const userInfo: JWTTokenUserInfo = {
            userId: newUser.id,
            email: newUser.email,
            name: newUser.username ?? '',
            userIamge: newUser.avatarUrl ?? '',
            role: userRoleList.map((role) => role.role)
        };
        const accessToken = this.generateAccessToken(userInfo);
        const refreshToken = this.generateRefreshToken(userInfo);

        return {
            user: userInfo,
            token: accessToken,
            refreshToken: refreshToken,
        };
    }
}