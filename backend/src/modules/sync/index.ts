import { Router } from "express";
import { SyncController } from "./controller";
import { authenticateJWT } from "../../middlewares/auth.middleware";

const router = Router();
const controller = new SyncController();

router.post("/", authenticateJWT, controller.sync);

export default router;
