import { MenusService } from "./menus.service";
import { Request, Response } from "express";
import { getMenusDto } from "./menus.types";
import { sendResponse } from "@server/utils/apiResponse";
import { HttpStatusCode } from "axios";

export class MenuController {

    private menusService: MenusService;
    constructor() {
        this.menusService = new MenusService();
    }

    async getAllMenus(req: Request, res: Response) {
        const result: getMenusDto = await this.menusService.getAllMenus();
        return sendResponse(res, HttpStatusCode.Ok, true, "Menus fetched successfully", result);
    }
    getSuperAdminMenus = async (req: Request, res: Response) => {
        const { userId, roleId } = req.query;
        let userMenus;
        if (req.user?.isSystemAdmin) {
            userMenus = await this.menusService.getSuperAdminMenus();
        } else {
            if (!userId || !roleId) {
                return sendResponse(res as Response, HttpStatusCode.BadRequest, false, "Missing required parameters");
            }
            userMenus = await this.menusService.getUserMenus(userId as string, roleId as string);
        }

        return sendResponse(res as Response, HttpStatusCode.Ok, true, "User menus", userMenus);
    }
}
