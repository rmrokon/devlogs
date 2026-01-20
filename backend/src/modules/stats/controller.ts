import { Request, Response } from "express";
import { StatsService } from "./service";
import { UserService } from "../users/service";
import { User } from "../users/model";

export class StatsController {
    private statsService: StatsService;
    private userService: UserService;

    constructor() {
        this.statsService = StatsService.getInstance();
        this.userService = UserService.getInstance();
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

    public getPublicStats = async (req: Request, res: Response) => {
        try {
            const { username } = req.params;
            const user = await this.userService.getUserByUsername(username as string);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const stats = await this.statsService.getDashboardStats(user);
            res.json(stats);
        } catch (error) {
            console.error("Error fetching public stats:", error);
            res.status(500).json({ message: "Failed to fetch stats" });
        }
    };
}
