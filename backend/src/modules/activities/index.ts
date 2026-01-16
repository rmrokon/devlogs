import { Router } from "express";
import { ActivityController } from "./controller";

const router = Router();
const activityController = ActivityController.getInstance();

router.get("/", (req, res) => activityController.getActivities(req, res));
router.post("/", (req, res) => activityController.createActivity(req, res));

export default router;
