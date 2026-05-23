import { db } from "@server/db/connection";
import { AuthResponse, JWTTokenUserInfo, LoginDto, RegisterDto } from "./auth.types";
import { users } from "@server/db/schema";
import { eq, and } from "drizzle-orm";
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
        const userInfo: JWTTokenUserInfo = {
            userId: userDetail?.id ?? '',
            email: userDetail?.email ?? '',
            name: userDetail.username ?? '',
            userIamge: userDetail.avatarUrl ?? ''
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
        const userInfo: JWTTokenUserInfo = {
            userId: userDetail?.id ?? '',
            email: userDetail?.email ?? '',
            name: userDetail?.username ?? '',
            userIamge: userDetail?.avatarUrl ?? ''
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
        const userInfo: JWTTokenUserInfo = {
            userId: newUser.id,
            email: newUser.email,
            name: newUser.username ?? '',
            userIamge: newUser.avatarUrl ?? ''
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