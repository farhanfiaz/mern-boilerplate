import express from "express";
import { MenuController } from "./menus.controller";

const menuRoutes = express.Router();
const menuController = new MenuController();

menuRoutes.get("/get-menus", menuController.getAllMenus);

menuRoutes.get("/get-user-menus", menuController.getSuperAdminMenus);

export default menuRoutes;