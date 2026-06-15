import { Request, Response } from "express";
import logger from "../../utils/logger";
import { RoleAccessService } from "./roleAccess.service";
import { sendResponse } from "@server/utils/apiResponse";
import { HttpStatusCode } from "@server/utils/httpStatusCode";

export class RoleAccessController {
    private roleAccessService: RoleAccessService;

    constructor() {
        this.roleAccessService = new RoleAccessService();
    }

    saveRoleAccess = async (req: Request, res: Response) => {
        try {
            const { roleId, menuIds } = req.body;

            const tenantId = req.user?.tenantId;
            const userId = req.user?.userId;

            logger.info("Saving role access", {
                roleId,
                menuCount: menuIds?.length,
                tenantId,
                userId,
            });

            const result = await this.roleAccessService.saveRoleAccess({
                roleId,
                menuIds,
                tenantId,
            });

            return sendResponse(
                res,
                HttpStatusCode.OK,
                true,
                "Role access saved successfully",
                result
            );
        } catch (error: any) {
            logger.error("Error in saveRoleAccess controller", {
                message: error?.message,
                stack: error?.stack,
            });

            return sendResponse(
                res,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                false,
                "Internal server error",
                []
            );
        }
    };

    getAllMenuByRoleId = async (req: Request, res: Response) => {
        try {
            const { roleId } = req.params;

            logger.info(`Fetching menus for role: ${roleId}`);

            const result = await this.roleAccessService.getAllMenuByRoleId(roleId as string);

            return sendResponse(res, HttpStatusCode.OK, true, "Menus fetched successfully", result);
        } catch (error: any) {
            logger.error("Error in getAllMenuByRoleId controller", {
                message: error?.message,
                stack: error?.stack,
            });

            return sendResponse(
                res,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                false,
                "Internal server error",
                []
            );
        }
    };
}