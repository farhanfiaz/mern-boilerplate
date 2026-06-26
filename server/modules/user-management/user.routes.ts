import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();
const userController = new UserController();

router.get("/get-all-users", userController.getAllUserByTenant);
router.post("/create-user", userController.createUser);
router.put("/update-user/:id", userController.updateUser);
router.delete("/delete-user/:id", userController.deleteUser);
router.put("/in-active-user/:id", userController.inActiveUser);
router.get("/get-user-by-id/:id", userController.getUserById);
router.post("/change-password/:id", userController.changePassword);
router.post("/reset-password/:id",userController.resetPassword);



export default router;
