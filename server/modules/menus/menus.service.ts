import { eq, asc, and } from "drizzle-orm";
import { getMenusDto } from "./menus.types";
import { db } from "@server/db/connection";
import { menus, roleMenus, userMenus, userRoles, users } from "@server/db/schema";

export class MenusService {
    constructor() {
    }

    async getAllMenus(): Promise<getMenusDto> {
        const getMenus = await db.select()
            .from(menus)
            .where(eq(menus.isActive, true))
            .orderBy(asc(menus.sortOrder));
        return {
            menus: getMenus,
        };
    }
    async getUserMenusByRoleId(userId: string, roleId: string): Promise<getMenusDto> {
        const getUserMenus = await db.selectDistinct(
            {
                id: menus.id,
                name: menus.name,
                parentId: menus.parentId,
                groupLabel: menus.groupLabel,
                icon: menus.icon,
                url: menus.url,
                sortOrder: menus.sortOrder,
                isActive: menus.isActive,
                isAction: menus.isAction
            }
        )
            .from(userMenus)
            .innerJoin(menus, and(eq(menus.id, userMenus.menuId), eq(userMenus.userId, userId)))
            .innerJoin(users, and(eq(users.id, userMenus.userId), eq(users.isActive, true)))
            .where(and(eq(menus.isActive, true), eq(userMenus.overrideType, "allow")))
            .orderBy(asc(menus.sortOrder));
        if (getUserMenus) {
            return {
                menus: getUserMenus,
            };
        }
        const getMenus = await db.selectDistinct(
            {
                id: menus.id,
                name: menus.name,
                parentId: menus.parentId,
                groupLabel: menus.groupLabel,
                icon: menus.icon,
                url: menus.url,
                sortOrder: menus.sortOrder,
                isActive: menus.isActive,
                isAction: menus.isAction
            }
        )
            .from(roleMenus)
            .innerJoin(menus, and(eq(menus.id, roleMenus.menuId), eq(roleMenus.roleId, roleId)))
            .innerJoin(userRoles, and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleMenus.roleId)))
            .innerJoin(users, and(eq(users.id, userRoles.userId), eq(users.isActive, true)))
            .where(and(eq(menus.isActive, true), eq(roleMenus.isActive, true)))
            .orderBy(asc(menus.sortOrder));
        return {
            menus: getMenus,
        };
    }
    getSuperAdminMenus = async () => {
        return await this.getAllMenus();
    }
    getUserMenus = async (userId: string, roleId: string) => {
        return await this.getUserMenusByRoleId(userId, roleId);
    }
}