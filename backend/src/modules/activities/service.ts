import { ActivityRepository } from "./repository";
import { Activity } from "./model";
import { CreateActivityInput } from "./validation";

export class ActivityService {
    private static instance: ActivityService;
    private activityRepository: ActivityRepository;

    private constructor(activityRepository: ActivityRepository) {
        this.activityRepository = activityRepository;
    }

    public static getInstance(): ActivityService {
        if (!ActivityService.instance) {
            ActivityService.instance = new ActivityService(ActivityRepository.getInstance());
        }
        return ActivityService.instance;
    }

    async getAllActivities(): Promise<Activity[]> {
        return await this.activityRepository.findAll();
    }

    async createActivity(data: CreateActivityInput): Promise<Activity> {
        return await this.activityRepository.create(data);
    }

    async getActivitiesByRepo(repoId: number): Promise<Activity[]> {
        return await this.activityRepository.findByRepoId(repoId);
    }

    async trackActivity(data: CreateActivityInput): Promise<Activity> {
        const existing = await this.activityRepository.findByRepoTypeDate(data.repo_id, data.type, data.date);
        if (existing) {
            // If exists, update count?
            // Since we are syncing from scratch or incrementing?
            // SyncService logic sums payload.size. 
            // If we run sync multiple times for same day, we might double count if we just add.
            // If we overwrite, we might lose other events if we don't aggregate locally first.
            // SyncService aggregates locally? No, it processes event by event.
            // "Activity model: id, repo_id, type, date, count."
            // If multiple PushEvents in one day, we should sum them.
            // So here we should update: existing.count += data.count.

            // Wait, Sequelize Model update syntax:
            existing.count += data.count;
            return await existing.save();
        }
        return await this.activityRepository.create(data);
    }

    async upsertActivity(data: CreateActivityInput): Promise<Activity> {
        return await this.activityRepository.upsert(data);
    }
}
