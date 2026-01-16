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
}
