import { Router } from "express";
import { UserController } from "./controller";

import { authenticateJWT } from "../../middlewares/auth.middleware";

const router = Router();
const userController = UserController.getInstance();

// Bind methods to controller instance
router.get("/me", authenticateJWT, (req, res) => userController.getMe(req, res));
router.get("/", (req, res) => userController.getUsers(req, res));
router.post("/", (req, res) => userController.createUser(req, res));

export default router;
