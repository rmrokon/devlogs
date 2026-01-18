import { Activity } from "./model";
import { ICreateActivityDTO } from "./types";

export class ActivityRepository {
    private static instance: ActivityRepository;

    private constructor() { }

    public static getInstance(): ActivityRepository {
        if (!ActivityRepository.instance) {
            ActivityRepository.instance = new ActivityRepository();
        }
        return ActivityRepository.instance;
    }

    async findAll(): Promise<Activity[]> {
        return await Activity.findAll();
    }

    async create(data: ICreateActivityDTO): Promise<Activity> {
        return await Activity.create(data);
    }

    async findByRepoId(repoId: number): Promise<Activity[]> {
        return await Activity.findAll({ where: { repo_id: repoId } });
    }

    async findByRepoTypeDate(repoId: number, type: string, date: Date): Promise<Activity | null> {
        return await Activity.findOne({ where: { repo_id: repoId, type, date } });
    }
}
