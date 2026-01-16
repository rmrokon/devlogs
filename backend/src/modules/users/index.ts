import { Router } from "express";
import { UserController } from "./controller";

const router = Router();
const userController = UserController.getInstance();

// Bind methods to controller instance to avoid scope issues
router.get("/", (req, res) => userController.getUsers(req, res));
router.post("/", (req, res) => userController.createUser(req, res));

export default router;
