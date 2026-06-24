import express from "express";
import { TenantController } from "./tenant.controller";
import { authMiddleware } from "@server/middleware";

const tenantRoutes = express.Router();
const tenantController = new TenantController();

tenantRoutes.get("/current-active", tenantController.getCurrentActiveTenant);

tenantRoutes.get("/get-all-tenants", tenantController.getTenant);

tenantRoutes.post("/create-tenant", authMiddleware.uploadSingleFile, authMiddleware.checkTotalSize(1), tenantController.createTenant);

tenantRoutes.put("/edit-tenant/:id", tenantController.updateTenant);

tenantRoutes.delete("/delete-tenant/:id", tenantController.deleteTenant);

tenantRoutes.put("/in-active-tenant/:id", tenantController.inActiveTenant);

tenantRoutes.get("/current-active-with-pagination", tenantController.getTenantWithPagination);

export default tenantRoutes;