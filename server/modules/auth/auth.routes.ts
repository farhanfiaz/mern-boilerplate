import express from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from '@server/middleware'

const authRoutes = express.Router();
const authController = new AuthController();

authRoutes.post("/login",authMiddleware.authLimiter, authController.login);
/** user image is optional and also check 1MB file size */
authRoutes.post("/register",authMiddleware.authLimiter, authMiddleware.uploadSingleFile, authMiddleware.checkTotalSize(1), authController.register);

export default authRoutes;