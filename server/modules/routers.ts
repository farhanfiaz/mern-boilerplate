import { authMiddleware } from "@server/middleware";
import authRoutes from "./auth/auth.routes";
import express from "express";
import tenantRoutes from "./tenants/tenant.routes";
import menuRoutes from "./menus/menus.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/menus", authMiddleware.authenticateToken, menuRoutes);
router.use("/tenant", authMiddleware.authenticateToken, tenantRoutes);

export default router;