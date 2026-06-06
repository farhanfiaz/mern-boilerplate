import logger from "@/utils/logger";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "@server/utils/apiResponse";
import { HttpStatusCode } from "@server/utils/httpStatusCode";
import jwt, { Secret } from "jsonwebtoken";
import { AuthService } from "@server/modules/auth/auth.service";
import appConfig from "@server/config/app.config";

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return sendResponse(res, HttpStatusCode.UNAUTHORIZED, false, "Access token required");
    }

    try {
        const decoded = jwt.verify(token, appConfig.security.jwtSecret as Secret) as any;
        // Ensure we have a valid userId
        if (!decoded.userId || typeof decoded.userId !== "number") {
            return sendResponse(res, HttpStatusCode.UNAUTHORIZED, false, "Invalid token format");
        }

        const headerUserId = req.headers["user-id"];
        if (!headerUserId) {
            return sendResponse(res, HttpStatusCode.UNAUTHORIZED, false, "User-ID header is missing");
        }

        if (parseInt(headerUserId as string, 10) !== decoded.userId) {
            logger.log(
                `token user Id: ${decoded.userId} | header user id: ${headerUserId} `
            );
            return sendResponse(res, HttpStatusCode.UNAUTHORIZED, false, "User-ID header does not match token");
        }
        const user = await new AuthService().userInfoByUserId(decoded.userId);
        if (!user) {
            return sendResponse(res, HttpStatusCode.UNAUTHORIZED, false, "User not found");
        }

        const isSystemAdmin = user.role.some(r => r.isSystem);
        const tenantId = req.headers["tenant-id"];

        if (!tenantId && !isSystemAdmin) {
            return sendResponse(res, HttpStatusCode.UNAUTHORIZED, false, "Tenant-ID header is missing");
        }

        const parsedTenantId = isSystemAdmin ? 0 : parseInt(tenantId as string, 10);
        // const isCompanyDeleted = await systemConfigService.isCompanyDeleted(parsedCompanyId);
        // if (isCompanyDeleted) {
        //     return res.status(401).json({
        //         status: 401,
        //         message: "Company has been deleted",
        //         data: null,
        //     });
        // }

        // const userCompanies = await systemConfigService.getOnlyCompanies(decoded.userId);
        // if (userCompanies?.length === 0) {
        //     return res.status(401).json({
        //         status: 401,
        //         message: "User is not assigned to any company",
        //         data: null,
        //     });
        // } else if (
        //     !userCompanies?.some((company: any) => company.id == companyId) && decoded.role.some((role: any) => role.roleName.toLowerCase() !== "superadmin")
        // ) {
        //     return res.status(401).json({
        //         status: 401,
        //         message: "User is not assigned to selected company",
        //         data: null,
        //     });
        // }
        // const isCompanyActive = await systemConfigService.isCompanyActive(parseInt(companyId as string, 0));
        // if (!isCompanyActive) {
        //     return res.status(401).json({
        //         status: 401,
        //         message: "Company is not active",
        //         data: null,
        //     });
        // }
        // console.log("----------userCompanies-------------", companyId);

        req.user = { ...user, isSystemAdmin: isSystemAdmin, tenantId: parsedTenantId };
        next();
    } catch (error) {
        logger.error("JWT verification error:", error);
        if (error instanceof jwt.TokenExpiredError) {
            return sendResponse(res, HttpStatusCode.UNAUTHORIZED, false, "Token expired..!");
        } else if (error instanceof jwt.JsonWebTokenError) {
            return sendResponse(res, HttpStatusCode.UNAUTHORIZED, false, "Invalid token..!");
        }
        return sendResponse(res, HttpStatusCode.FORBIDDEN, false, "Token verification failed..!");
    }
};