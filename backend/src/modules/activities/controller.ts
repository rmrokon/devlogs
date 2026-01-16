import { Request, Response } from "express";
import { ActivityService } from "./service";
import { createActivitySchema } from "./validation";

export class ActivityController {
    private static instance: ActivityController;
    private activityService: ActivityService;

    private constructor(activityService: ActivityService) {
        this.activityService = activityService;
    }

    public static getInstance(): ActivityController {
        if (!ActivityController.instance) {
            ActivityController.instance = new ActivityController(ActivityService.getInstance());
        }
        return ActivityController.instance;
    }

    async getActivities(req: Request, res: Response): Promise<void> {
        try {
            const activities = await this.activityService.getAllActivities();
            res.status(200).json(activities);
        } catch (error) {
            res.status(500).json({ message: "Error fetching activities", error });
        }
    }

    async createActivity(req: Request, res: Response): Promise<void> {
        try {
            const validationResult = createActivitySchema.safeParse(req.body);

            if (!validationResult.success) {
                res.status(400).json({ errors: validationResult.error.issues });
                return;
            }

            const activity = await this.activityService.createActivity(validationResult.data);
            res.status(201).json(activity);
        } catch (error) {
            res.status(500).json({ message: "Error creating activity", error });
        }
    }
}
