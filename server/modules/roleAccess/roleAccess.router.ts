import express from "express";
import { RoleAccessController } from "./roleAccess.controller";

const roleAccessRoutes = express.Router();
const roleAccessController = new RoleAccessController();

roleAccessRoutes.post("/save-role-access", roleAccessController.saveRoleAccess);
roleAccessRoutes.get("/get-all-menu-by-role-id/:roleId", roleAccessController.getAllMenuByRoleId);

export default roleAccessRoutes;