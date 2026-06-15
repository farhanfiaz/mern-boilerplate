import { sendResponse } from "@server/utils/apiResponse";
import { HttpStatusCode } from "@server/utils/httpStatusCode";
import { Request, Response } from "express";
import { RoleService } from "./role.service";

export class RoleController {
    private roleService: RoleService;
    constructor() {
        this.roleService = new RoleService();
    }
    getAllRole = async (req: Request, res: Response) => {
        try {
            const tenantId = req.query.tenantId;
            const roles = await this.roleService.getAllRole(String(tenantId));
            return sendResponse(res as Response, HttpStatusCode.OK, true, "Roles fetched successfully", roles);
        } catch (error) {
            return sendResponse(res as Response, HttpStatusCode.INTERNAL_SERVER_ERROR, false, (error as Error).message, null);
        }
    }
    getRole = async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
            const tenantId = req.user?.tenantId;
            const roles = await this.roleService.getRole(Number(page), Number(limit), String(search), String(tenantId));
            return sendResponse(res as Response, HttpStatusCode.OK, true, "Roles fetched successfully", roles);
        } catch (error) {
            return sendResponse(res as Response, HttpStatusCode.INTERNAL_SERVER_ERROR, false, (error as Error).message, null);
        }
    }

    getRoleById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const role = await this.roleService.getRoleById(String(id));
            return sendResponse(res as Response, HttpStatusCode.OK, true, "Role fetched successfully", role);
        } catch (error) {
            return sendResponse(res as Response, HttpStatusCode.INTERNAL_SERVER_ERROR, false, (error as Error).message, null);
        }
    }

    createRole = async (req: Request, res: Response) => {
        try {
            let role = req.body;
            role.tenantId = req.user?.tenantId as string;
            role.isSystem = false;
            const createdRole = await this.roleService.createRole(role);
            return sendResponse(res as Response, HttpStatusCode.OK, true, "Role created successfully", createdRole);
        } catch (error) {
            return sendResponse(res as Response, HttpStatusCode.INTERNAL_SERVER_ERROR, false, (error as Error).message, null);
        }
    }

    updateRole = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const role = req.body;
            const updatedRole = await this.roleService.updateRole(String(id), role);
            return sendResponse(res as Response, HttpStatusCode.OK, true, "Role updated successfully", updatedRole);
        } catch (error) {
            return sendResponse(res as Response, HttpStatusCode.INTERNAL_SERVER_ERROR, false, (error as Error).message, null);
        }
    }

    deleteRole = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const deletedRole = await this.roleService.deleteRole(String(id));
            return sendResponse(res as Response, HttpStatusCode.OK, true, "Role deleted successfully", deletedRole);
        } catch (error) {
            return sendResponse(res as Response, HttpStatusCode.INTERNAL_SERVER_ERROR, false, (error as Error).message, null);
        }
    }

    inActiveRole = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const inActiveRole = await this.roleService.inActiveRole(String(id));
            return sendResponse(res as Response, HttpStatusCode.OK, true, "Role inactivated successfully", inActiveRole);
        } catch (error) {
            return sendResponse(res as Response, HttpStatusCode.INTERNAL_SERVER_ERROR, false, (error as Error).message, null);
        }
    }
}