import { authMiddleware } from "@server/middleware";
import authRoutes from "./auth/auth.routes";
import express from "express";
import tenantRoutes from "./tenants/tenant.routes";
import menuRoutes from "./menus/menus.routes";
import roleRoutes from "./role/role.routes";
import userRoutes from "./user-management/user.routes";
import roleAccessRoutes from "./roleAccess/roleAccess.router";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/menus", authMiddleware.authenticateToken, menuRoutes);
router.use("/tenant", authMiddleware.authenticateToken, tenantRoutes);
router.use("/role", authMiddleware.authenticateToken, roleRoutes);
router.use("/user", authMiddleware.authenticateToken, userRoutes);
router.use("/role-access", authMiddleware.authenticateToken, roleAccessRoutes);

export default router;