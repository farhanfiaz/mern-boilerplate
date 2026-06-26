import { sendResponse } from "@server/utils/apiResponse";
import { AuthService } from "./auth.service";
import { HttpStatusCode } from "@server/utils/httpStatusCode";
import { Response } from "express";
import { Request } from "express";
import { TenantService } from "../tenants/tenant.service";

export class AuthController {
    private authService: AuthService;
    private tenantService: TenantService;
    constructor() {
        this.authService = new AuthService();
        this.tenantService = new TenantService();
    }
    login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return sendResponse(res as Response, HttpStatusCode.BAD_REQUEST, false, "Email and password are required");
        }
        const user = await this.authService.login({ email, password });
        if (!user) {
            return sendResponse(res as Response, HttpStatusCode.UNAUTHORIZED, false, "Invalid email or password");
        }
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Login successful", user);
    }
    register = async (req: Request, res: Response) => {
        const { email, password, firstName, lastName, tenantName, tenantDescription, tenantWebsite,tenantSlug } = req.body;
        const userImage = req.file;
        if (!tenantName || !tenantDescription || !tenantWebsite || !tenantSlug) {
            return sendResponse(res as Response, HttpStatusCode.BAD_REQUEST, false, "Tenant name, slug and type are required", []);
        }
        const tenant = await this.tenantService.createTenant({
            name: tenantName,
            slug: tenantSlug,
            description: tenantDescription,
            website: tenantWebsite,
            logo: '',
        });
        const user = await this.authService.register({
            email,
            file: userImage ?? null,
            firstName,
            lastName,
            password,
            tenantId: tenant.id ?? null
        });
        return sendResponse(res as Response, HttpStatusCode.OK, true, "User register successful", user);
    }

    refreshToken = async (req: Request, res: Response) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return sendResponse(res as Response, HttpStatusCode.BAD_REQUEST, false, "Refresh token is required");
        }
        const data = await this.authService.refreshToken(refreshToken);
        if (!data) {
            return sendResponse(res as Response, HttpStatusCode.UNAUTHORIZED, false, "Invalid refresh token");
        }
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Refresh token successful", data);
    }
}