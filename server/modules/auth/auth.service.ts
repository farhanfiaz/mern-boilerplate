import { db } from "@server/db/connection";
import { AuthResponse, JWTTokenUserInfo, LoginDto, RegisterDto } from "./auth.types";
import { menus, roleMenus, roles, userRoles, users } from "@server/db/schema";
import { eq, and, asc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import appConfig from "@server/config/app.config";
import { RoleName } from "@server/enums/role.enum";
import { TenantService } from "@server/modules/tenants/tenant.service";

export class AuthService {
    private tenantService: TenantService;
    constructor() {
        this.tenantService = new TenantService();
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
        let tenantId: string = '';
        if (userRoles.some(role => role.role.isSystem)) {
            tenantId = await this.tenantService.getTenantId() ?? '';
        } else {
            tenantId = userDetail?.tenantId ?? '';
        }
        const userInfo: JWTTokenUserInfo = {
            userId: userDetail?.id ?? '',
            email: userDetail?.email ?? '',
            name: userDetail.username ?? '',
            userIamge: userDetail.avatarUrl ?? '',
            role: userRoles.map((role) => role.role),
            tenantId: tenantId,
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
        let tenantId: string = '';
        if (userRoles.some(role => role.role.isSystem)) {
            tenantId = await this.tenantService.getTenantId() ?? '';
        } else {
            tenantId = userDetail?.tenantId ?? '';
        }
        const userInfo: JWTTokenUserInfo = {
            userId: userDetail?.id ?? '',
            email: userDetail?.email ?? '',
            name: userDetail?.username ?? '',
            userIamge: userDetail?.avatarUrl ?? '',
            role: userRoles.map((role) => role.role),
            tenantId: tenantId,
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
            where: (role, { eq }) => (eq(role.name, RoleName.Admin))
        });
        if (!defaultRole) {
            throw new Error("Default role not found");
        }
        const [newRole] = await db.insert(roles).values({
            tenantId: data.tenantId,
            name: defaultRole.name,
            description: defaultRole.description,
            isActive: true,
            isDeleted: false,
            isSystem: false
        }).returning();
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const [newUser] = await db
            .insert(users)
            .values({
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                avatarUrl: data.file?.filename ?? null,
                username: data.email,
                tenantId: data.tenantId
            })
            .returning();
        await db.insert(userRoles).values({
            userId: newUser.id,
            roleId: newRole.id,
            assignedAt: new Date()
        });
        const menusIds = await db
            .select({
                id: menus.id,
            })
            .from(menus)
            .where(eq(menus.isActive, true));

        await Promise.all(
            menusIds.map((menu) =>
                db.insert(roleMenus).values({
                    roleId: newRole.id,
                    menuId: menu.id,
                    isActive: true,
                })
            )
        );

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
        let tenantId: string = '';
        if (userRoleList.some(role => role.role.isSystem)) {
            tenantId = await this.tenantService.getTenantId() ?? '';
        } else {
            tenantId = newUser?.tenantId ?? '';
        }
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
    async emailIsExist(email: string): Promise<boolean> {
        const [tenant] = await db.select({ email: users.email }).from(users).where(eq(users.email, email));
        return tenant?.email == null;
    }
}