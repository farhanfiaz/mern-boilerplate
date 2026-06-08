import { sendResponse } from "@server/utils/apiResponse";
import { HttpStatusCode } from "@server/utils/httpStatusCode";
import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {
    private userService: UserService;
    constructor() {
        this.userService = new UserService();
    }

    getAllUserByTenant = async (req: Request, res: Response) => {
        const { page = 1, limit = 10, search = '', status = '', roleId = '' } = req.query as any;
        const tenantId = req.user?.tenantId;
        const isSystemAdmin = req.user?.isSystemAdmin;
        const result = await this.userService.getAllUserByTenant(Number(page), Number(limit), search, status, roleId, tenantId);
        return sendResponse(res as Response, HttpStatusCode.OK, true, "User list fetched successfully", result);
    }

    createUser = async (req: Request, res: Response) => {
        const { firstName, lastName, email, username, phone, roleId } = req.body;
        const tenantId = req.user?.tenantId;
        const result = await this.userService.createUser(firstName, lastName, email, username, phone, roleId, tenantId);
        return sendResponse(res as Response, HttpStatusCode.OK, true, "User created successfully", result);
    }

    updateUser = async (req: Request, res: Response) => {
        const { id, firstName, lastName, email, username, phone, roleId } = req.body;
        const result = await this.userService.updateUser(id, firstName, lastName, email, username, phone, roleId);
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
}