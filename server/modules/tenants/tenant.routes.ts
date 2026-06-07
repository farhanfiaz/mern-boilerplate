import express from "express";
import { TenantController } from "./tenant.controller";

const tenantRoutes = express.Router();
const tenantController = new TenantController();

tenantRoutes.get("/current-active", tenantController.getCurrentActiveTenant);

tenantRoutes.get("/", tenantController.getTenant);

tenantRoutes.post("/", tenantController.createTenant);

tenantRoutes.get("/", tenantController.getTenants);

tenantRoutes.put("/:id", tenantController.updateTenant);

tenantRoutes.delete("/:id", tenantController.deleteTenant);

export default tenantRoutes;