import { eq, asc } from "drizzle-orm";
import { getMenusDto } from "./menus.types";
import { db } from "@server/db/connection";
import { menus } from "@server/db/schema";

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
    getSuperAdminMenus = async (userId: string, roleId: string) => {
        return await this.getAllMenus()
    }
}