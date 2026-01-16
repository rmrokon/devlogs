import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();
const userController = new UserController();

router.get("/", (req, res) => userController.getUsers(req, res));
router.post("/", (req, res) => userController.createUser(req, res));

export default router;
