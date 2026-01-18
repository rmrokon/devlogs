import { Router } from "express";
import { StatsController } from "./controller";
import { authenticateJWT } from "../../middlewares/auth.middleware";

const router = Router();
const controller = new StatsController();

router.get("/", authenticateJWT, controller.getStats);

export default router;
