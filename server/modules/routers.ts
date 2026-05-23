import { authMiddleware } from "@server/middleware";
import authRoutes from "./auth/auth.routes";
import express, { Request, Response } from "express";
import { sendResponse } from "@server/utils/apiResponse";
import { HttpStatusCode } from "@server/utils/httpStatusCode";

const router = express.Router();

router.use("/auth", authRoutes);
router.use(
    "/employee",
    authMiddleware.authenticateToken,
    (req: Request, res: Response) => {
        return sendResponse(
            res,
            HttpStatusCode.OK,
            true,
            "successfully..!"
        );
    }
);

export default router;