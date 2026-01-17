import { Router } from "express";
import { AuthController } from "./controller";

const router = Router();
const authController = AuthController.getInstance();

router.get("/github", (req, res) => authController.login(req, res));
router.get("/github/callback", (req, res) => authController.callback(req, res));

export default router;
