import { db } from "@server/db/connection";
import { roleMenus } from "@server/db/schema";
import { eq } from "drizzle-orm";
import logger from "../../utils/logger";

export class RoleAccessService {
    async saveRoleAccess(data: {
        roleId: string;
        menuIds: string[];
        tenantId?: string;
    }) {
        if (!data.roleId) throw new Error("roleId is required");
        if (!Array.isArray(data.menuIds)) {
            throw new Error("menuIds must be an array");
        }

        try {
            return await db.transaction(async (tx) => {
                // 1. Delete existing mappings (optionally tenant-safe)
                await tx
                    .delete(roleMenus)
                    .where(eq(roleMenus.roleId, data.roleId));

                // 2. Insert new mappings
                if (data.menuIds.length > 0) {
                    await tx.insert(roleMenus).values(
                        data.menuIds.map((menuId) => ({
                            roleId: data.roleId,
                            menuId,
                            isActive: true,
                            // tenantId: data.tenantId, // enable if schema supports it
                        }))
                    );
                }

                return {
                    roleId: data.roleId,
                    menuIds: data.menuIds,
                };
            });
        } catch (error: any) {
            logger.error("Error saving role access", {
                message: error?.message,
                stack: error?.stack,
            });
            throw new Error("Error saving role access");
        }
    }
    async getAllMenuByRoleId(roleId: string) {
        if (!roleId) throw new Error("roleId is required");

        try {
            const result = await db
                .select({
                    roleId: roleMenus.roleId,
                    menuId: roleMenus.menuId,
                    isActive: roleMenus.isActive,
                })
                .from(roleMenus)
                .where(eq(roleMenus.roleId, roleId));

            return {
                roleId,
                menuIds: result.map((r) => r.menuId)
            };
        } catch (error: any) {
            logger.error("Error fetching role menus", {
                message: error?.message,
                stack: error?.stack,
            });
            throw new Error("Error fetching role menus");
        }
    }

}