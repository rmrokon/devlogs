import { Request, Response } from "express";
import { StatsService } from "./service";
import { User } from "../users/model";

export class StatsController {
    private statsService: StatsService;

    constructor() {
        this.statsService = StatsService.getInstance();
    }

    public getStats = async (req: Request, res: Response) => {
        try {
            const user = (req as any).user as User;
            if (!user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const stats = await this.statsService.getDashboardStats(user);
            res.json(stats);
        } catch (error) {
            console.error("Error fetching stats:", error);
            res.status(500).json({ message: "Failed to fetch stats" });
        }
    };
}
