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
        const tenantId = req.query.tenantId;
        const roles = await this.roleService.getAllRole(String(tenantId));
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant created successfully", roles);
    }
    getRole = async (req: Request, res: Response) => {
        const { page = 1, limit = 10, search = '' } = req.query;
        const tenantId = req.user?.tenantId;
        const roles = await this.roleService.getRole(Number(page), Number(limit), String(search), String(tenantId));
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant created successfully", roles);
    }

    getRoleById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const role = await this.roleService.getRoleById(String(id));
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant created successfully", role);
    }

    createRole = async (req: Request, res: Response) => {
        const role = req.body;
        const createdRole = await this.roleService.createRole(role);
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant created successfully", createdRole);
    }

    updateRole = async (req: Request, res: Response) => {
        const { id } = req.params;
        const role = req.body;
        const updatedRole = await this.roleService.updateRole(String(id), role);
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant created successfully", updatedRole);
    }

    deleteRole = async (req: Request, res: Response) => {
        const { id } = req.params;
        const deletedRole = await this.roleService.deleteRole(String(id));
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant created successfully", deletedRole);
    }

    inActiveRole = async (req: Request, res: Response) => {
        const { id } = req.params;
        const inActiveRole = await this.roleService.inActiveRole(String(id));
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant created successfully", inActiveRole);
    }
}