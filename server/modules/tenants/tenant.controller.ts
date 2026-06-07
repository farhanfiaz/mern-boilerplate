import { sendResponse } from "@server/utils/apiResponse";
import { TenantService } from "./tenant.service";
import { HttpStatusCode } from "@server/utils/httpStatusCode";
import { Response } from "express";
import { Request } from "express";

export class TenantController {
    private tenantService: TenantService;
    constructor() {
        this.tenantService = new TenantService();
    }

    getCurrentActiveTenant = async (req: Request, res: Response) => {
        const tenant = await this.tenantService.getCurrentActiveTenant();
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant fetched successfully", tenant);
    }

    getTenant = async (req: Request, res: Response) => {
        const { page = 1, limit = 10, search = '' } = req.query;
        const isSystemAdmin = req?.user?.isSystemAdmin;
        const userId = req?.user?.userId ?? '';
        let AllTenant: any = [];
        if (isSystemAdmin) {
            AllTenant = await this.tenantService.getAllTenants(Number(page), Number(limit), search);
        } else {
            AllTenant = await this.tenantService.getUserAllTenants(Number(page), Number(limit), userId, search);
        }
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant fetched successfully", AllTenant);
    }

    createTenant = async (req: Request, res: Response) => {
        const tenant = req.body;

        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant created successfully", []);
    }

    updateTenant = async (req: Request, res: Response) => {
        const { id } = req.params;
        const tenant = req.body;
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant updated successfully", []);
    }

    deleteTenant = async (req: Request, res: Response) => {
        const { id } = req.params;
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant deleted successfully", []);
    }
    inActiveTenant = async (req: Request, res: Response) => {
        const { id } = req.params;
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant inactivated successfully", []);
    }
}