import { sendResponse } from "@server/utils/apiResponse";
import { HttpStatusCode } from "@server/utils/httpStatusCode";
import { Request, Response } from "express";
import { UserService } from "./user.service";
import logger from "@/utils/logger";

export class UserController {
    private userService: UserService;
    constructor() {
        this.userService = new UserService();
    }

    getAllUserByTenant = async (req: Request, res: Response) => {
        const { page = 1, limit = 10, search = '', status = '', roleId = '' } = req.query as any;
        const tenantId = req.user?.tenantId ?? null;
        const isSystemAdmin = req.user?.isSystemAdmin;
        const result = await this.userService.getAllUserByTenant(Number(page), Number(limit), search, status, roleId, tenantId);
        return sendResponse(res as Response, HttpStatusCode.OK, true, "User list fetched successfully", result);
    }

    createUser = async (req: Request, res: Response) => {
        try {
            const { firstName, lastName, email, username, phone, roleId } = req.body;
            const tenantId = req.user?.tenantId ?? null;
            const result = await this.userService.createUser({
                firstName,
                lastName,
                email,
                username,
                phone,
                roleId,
                tenantId
            });
            return sendResponse(res as Response, HttpStatusCode.OK, true, "User created successfully", result);
        } catch (error) {
            return sendResponse(res as Response, HttpStatusCode.INTERNAL_SERVER_ERROR, false, (error as Error).message, null);
        }
    }

    updateUser = async (req: Request, res: Response) => {
        const { id, firstName, lastName, email, username, phone, roleId } = req.body;
        const result = await this.userService.updateUser(id, {
            firstName,
            lastName,
            email,
            username,
            phone,
            roleId
        });
        return sendResponse(res as Response, HttpStatusCode.OK, true, "User updated successfully", result);
    }

    deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.userService.deleteUser(String(id));
        return sendResponse(res as Response, HttpStatusCode.OK, true, "User deleted successfully", result);
    }

    inActiveUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.userService.inActiveUser(String(id));
        return sendResponse(res as Response, HttpStatusCode.OK, true, "User in-active successfully", result);
    }

    getUserById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.userService.getUserById(String(id));
        return sendResponse(res as Response, HttpStatusCode.OK, true, "User fetched successfully", result);
    }

    changePassword = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { currentPassword, confirmPassword, newPassword } = req.body;
        logger.info(`User: ${id} has been request to password changed. currentPassword: ${currentPassword} | confirmPassword: ${confirmPassword} | newPassword: ${newPassword}`);
        const result = await this.userService.changePassword({
            userId: String(id),
            currentPassword,
            confirmPassword,
            newPassword,
        });
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Password successfully changed..!", result);
    }

    resetPassword = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { resetPassword } = req.body;
        logger.info(`User: ${id} has been request to reset password. resetPassword: ${resetPassword}`);
        const result = await this.userService.resetPassword(String(id));
        return sendResponse(res as Response, HttpStatusCode.OK, true, "Password successfully reset..!", result);
    }
}