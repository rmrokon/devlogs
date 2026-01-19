import { Request, Response } from "express";
import { SyncService } from "./service";
import { User } from "../users/model";

export class SyncController {
    private syncService: SyncService;

    constructor() {
        this.syncService = SyncService.getInstance();
    }

    public sync = async (req: Request, res: Response) => {
        try {
            const user = (req as any).user as User;

            if (!user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            await this.syncService.syncUser(user);

            return res.status(200).json({ message: "Sync successful", last_synced_at: new Date() });
        } catch (error) {
            console.error("Sync failed:", error);
            return res.status(500).json({ message: "Sync failed" });
        }
    };
}
