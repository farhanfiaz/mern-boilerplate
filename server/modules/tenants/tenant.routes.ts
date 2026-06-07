import express from "express";
import { TenantController } from "./tenant.controller";

const tenantRoutes = express.Router();
const tenantController = new TenantController();

tenantRoutes.get("/current-active", tenantController.getCurrentActiveTenant);

tenantRoutes.get("/get-all-tenants", tenantController.getTenant);

tenantRoutes.post("/create-tenant", tenantController.createTenant);

tenantRoutes.put("/edit-tenant/:id", tenantController.updateTenant);

tenantRoutes.delete("/delete-tenant/:id", tenantController.deleteTenant);

tenantRoutes.put("/in-active-tenant/:id", tenantController.inActiveTenant);

export default tenantRoutes;