import { sendResponse } from "@server/utils/apiResponse";
import { AuthService } from "./auth.service";
import { HttpStatusCode } from "@server/utils/httpStatusCode";
import { Response } from "express";
import { Request } from "express";

export class AuthController {
    private authService: AuthService;
    constructor() {
        this.authService = new AuthService();
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
        const { email, password, firstName, lastName } = req.body;
        const userImage = req.file;
        const user = await this.authService.register({
            email,
            file: userImage ?? null,
            firstName,
            lastName,
            password
        });
        return sendResponse(res as Response, HttpStatusCode.OK, true, "User register successful", user);
    }
}