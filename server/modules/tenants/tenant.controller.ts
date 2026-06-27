import { sendResponse } from "@server/utils/apiResponse";
import { TenantService } from "./tenant.service";
import { HttpStatusCode } from "@server/utils/httpStatusCode";
import { Response } from "express";
import { Request } from "express";
import logger from "@/utils/logger";

export class TenantController {
    private tenantService: TenantService;
    constructor() {
        this.tenantService = new TenantService();
    }

    getTenantWithPagination = async (req: Request, res: Response) => {
        const { page = 1, limit = 10, search = '' } = req.query;
        const isSystemAdmin = req?.user?.isSystemAdmin;
        const userId = req?.user?.userId ?? '';
        const selectedRole = req?.user?.selectedRole ?? '';
        let tenants: any = [];
        if (isSystemAdmin) {
            tenants = await this.tenantService.getTenantWithPagination(Number(page), Number(limit), String(search), selectedRole);
        } else {
            tenants = await this.tenantService.getUserTenantsWithPagination(Number(page), Number(limit), userId, String(search), selectedRole);
        }
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenants fetched successfully", tenants);
    }

    getCurrentActiveTenant = async (req: Request, res: Response) => {
        const isSystemAdmin = req?.user?.isSystemAdmin;
        const ownerId = req?.user?.userId;
        let tenant: any = [];
        if (isSystemAdmin) {
            tenant = await this.tenantService.getCurrentActiveTenant();
        } else {
            tenant = await this.tenantService.getCurrentUserActiveTenant(ownerId as string);
        }
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant fetched successfully", tenant);
    }

    getTenant = async (req: Request, res: Response) => {
        const { page = 1, limit = 10, search = '' } = req.query;
        const isSystemAdmin = req?.user?.isSystemAdmin;
        const userId = req?.user?.userId ?? '';
        let AllTenant: any = [];
        if (isSystemAdmin) {
            AllTenant = await this.tenantService.getAllTenants(Number(page), Number(limit), String(search));
        } else {
            AllTenant = await this.tenantService.getUserAllTenants(Number(page), Number(limit), userId, String(search));
        }
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant fetched successfully", AllTenant);
    }

    createTenant = async (req: Request, res: Response) => {
        const tenant = req.body;

        if (!tenant.name || !tenant.slug || !tenant.website) {
            return sendResponse(res as Response, HttpStatusCode.BAD_REQUEST, false, "Tenant name, slug and type are required", []);
        }
        const isTenantNameExist = await this.tenantService.tenantNameIsExist(tenant.name);
        if (!isTenantNameExist) {
            return sendResponse(res as Response, HttpStatusCode.BAD_REQUEST, false, "Tenant name already exist.", []);
        }
        const isTenantSlugExist = await this.tenantService.tenantNameIsExist(tenant.slug);
        if (!isTenantSlugExist) {
            return sendResponse(res as Response, HttpStatusCode.BAD_REQUEST, false, "Tenant slug already exist.", []);
        }
        const createdTenant = await this.tenantService.createTenant(tenant);
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant created successfully", createdTenant);
    }

    updateTenant = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            return sendResponse(res as Response, HttpStatusCode.BAD_REQUEST, false, "Tenant id is required", []);
        }
        const tenant = req.body;
        const updatedTenant = await this.tenantService.updateTenant(id as string, tenant);
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant updated successfully", updatedTenant);
    }

    deleteTenant = async (req: Request, res: Response) => {
        const { id } = req.params;
        const selectedTenantId = req.user?.tenantId;
        const isSystemAdmin = req?.user?.isSystemAdmin;
        if (!isSystemAdmin) {
            if (selectedTenantId == id) {
                return sendResponse(res as Response, HttpStatusCode.BAD_REQUEST, false, "You can't delete your own tenant", []);
            }
        }
        if (!id) {
            return sendResponse(res as Response, HttpStatusCode.BAD_REQUEST, false, "Tenant id is required", []);
        }
        const deletedTenant = await this.tenantService.deleteTenant(id as string);
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant deleted successfully", deletedTenant);
    }
    inActiveTenant = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id) {
                return sendResponse(res as Response, HttpStatusCode.BAD_REQUEST, false, "Tenant id is required", []);
            }
            const inActiveTenant = await this.tenantService.inActiveTenant(id as string);
            return sendResponse(res as Response, HttpStatusCode.OK, true, "Tenant inactivated successfully", inActiveTenant);
        } catch (err: any) {
            logger.error(err);
            return sendResponse(res as Response, HttpStatusCode.BAD_REQUEST, false, err?.message, []);
        }
    }
}