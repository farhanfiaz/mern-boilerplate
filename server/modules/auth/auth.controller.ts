import { sendResponse } from "@server/utils/apiResponse";
import { AuthService } from "./auth.service";
import { HttpStatusCode } from "@server/utils/httpStatusCode";
import { Response } from "express";
import { Request } from "express";
import { TenantService } from "../tenants/tenant.service";
import logger from "@/utils/logger";
import { saveBase64Image } from "@server/utils/localStorage";

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
        const { email, password, firstName, lastName, tenantName, tenantDescription, tenantWebsite, tenantSlug, tenantLogo, avatar } = req.body;

        if (!tenantName || !tenantSlug) {
            return sendResponse(res as Response, HttpStatusCode.BAD_REQUEST, false, "Tenant name, slug are required", []);
        }
        const isTenantNameUnique = await this.tenantService.tenantNameIsExist(tenantName);
        if (!isTenantNameUnique) {
            return sendResponse(res as Response, HttpStatusCode.BAD_REQUEST, false, "Tenant name already exist.", []);
        }
        const isTenantSlugUnique = await this.tenantService.tenantSlugIsExist(tenantSlug);
        if (!isTenantSlugUnique) {
            return sendResponse(res as Response, HttpStatusCode.BAD_REQUEST, false, "Tenant slug already exist.", []);
        }
        const isEmailUnique = await this.authService.emailIsExist(email);
        if (!isEmailUnique) {
            return sendResponse(res as Response, HttpStatusCode.BAD_REQUEST, false, "email already exist.", []);
        }
        let userFile = null;
        if (avatar) {
            userFile = await saveBase64Image(avatar, "userImages");
        }
        const tenant = await this.tenantService.createTenant({
            name: tenantName,
            slug: tenantSlug,
            description: tenantDescription,
            website: tenantWebsite,
            logo: tenantLogo,
        });
        const user = await this.authService.register({
            email,
            file: userFile?.filePath ?? null,
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
    emailValidate = async (req: Request, res: Response) => {
        const { email } = req.body;
        const isEmailUnique = await this.authService.emailIsExist(email);
        if (isEmailUnique) {
            return sendResponse(res as Response, HttpStatusCode.OK, true, "email is unique", {
                isUnique: true
            });
        } else {
            return sendResponse(res as Response, HttpStatusCode.OK, false, "email already takken.", {
                isUnique: false
            });
        }
    }
    tenantSlugValidate = async (req: Request, res: Response) => {
        const { slug } = req.body;
        const isTenantSlugUnique = await this.tenantService.tenantSlugIsExist(slug);
        if (isTenantSlugUnique) {
            return sendResponse(res as Response, HttpStatusCode.OK, true, "slug is unique", {
                isUnique: true
            });
        } else {
            return sendResponse(res as Response, HttpStatusCode.OK, false, "slug already takken.", {
                isUnique: false
            });
        }
    }
    tenantNameValidate = async (req: Request, res: Response) => {
        const { name } = req.body;
        const isTenantNameUnique = await this.tenantService.tenantNameIsExist(name);
        if (isTenantNameUnique) {
            return sendResponse(res as Response, HttpStatusCode.OK, true, "tenant name is unique", {
                isUnique: true
            });
        } else {
            return sendResponse(res as Response, HttpStatusCode.BAD_REQUEST, false, "tenant name already takken.", {
                isUnique: false
            });
        }
    }
}