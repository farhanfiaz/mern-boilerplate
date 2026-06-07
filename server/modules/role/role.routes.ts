import express from "express";
import { RoleController } from "./role.controller";

const roleRoutes = express.Router();
const roleController = new RoleController();

roleRoutes.get("/get-all-roles", roleController.getRole);

roleRoutes.get("/get-role-by-id/:id", roleController.getRoleById);

roleRoutes.post("/create-role", roleController.createRole);

roleRoutes.put("/edit-role/:id", roleController.updateRole);

roleRoutes.delete("/delete-role/:id", roleController.deleteRole);

roleRoutes.put("/in-active-role/:id", roleController.inActiveRole);

export default roleRoutes;