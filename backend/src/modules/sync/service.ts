import { GithubService } from "../auth/github.service";
import { UserService } from "../users/service";
import { RepositoryService } from "../repositories/service";
import { ActivityService } from "../activities/service";
import { User } from "../users/model";
import axios from "axios";

export class SyncService {
    private static instance: SyncService;
    private githubService: GithubService;
    private userService: UserService;
    private repositoryService: RepositoryService;
    private activityService: ActivityService;

    private constructor() {
        this.githubService = GithubService.getInstance();
        this.userService = UserService.getInstance();
        this.repositoryService = RepositoryService.getInstance();
        this.activityService = ActivityService.getInstance();
    }

    public static getInstance(): SyncService {
        if (!SyncService.instance) {
            SyncService.instance = new SyncService();
        }
        return SyncService.instance;
    }

    async syncUserData(userId: number): Promise<void> {
        const user = await this.userService.getUserByGithubId(userId.toString());
    }

    async syncUser(user: User): Promise<void> {
        if (!user.access_token) {
            console.error(`User ${user.username} has no access token`);
            return;
        }

        try {
            await this.syncRepositories(user);
            await this.syncActivities(user);

            user.last_synced_at = new Date();
            await user.save();
        } catch (error) {
            console.error(`Error syncing user ${user.username}:`, error);
            throw error;
        }
    }

    private async syncRepositories(user: User): Promise<void> {
        const response = await axios.get(`https://api.github.com/users/${user.username}/repos?per_page=100`, {
            headers: { Authorization: `Bearer ${user.access_token}` }
        });

        const repos = response.data;

        for (const repo of repos) {
            const langResponse = await axios.get(repo.languages_url, {
                headers: { Authorization: `Bearer ${user.access_token}` }
            });
            const languages = langResponse.data;

            await this.repositoryService.upsertRepository({
                user_id: user.id,
                name: repo.name,
                url: repo.html_url,
                stars: repo.stargazers_count,
                language: repo.language,
                languages: languages
            });
        }
    }

    private async syncActivities(user: User): Promise<void> {
        const response = await axios.get(`https://api.github.com/users/${user.username}/events?per_page=100`, {
            headers: { Authorization: `Bearer ${user.access_token}` }
        });

        const events = response.data;

        const pushEvents = events.filter((e: any) => e.type === 'PushEvent');

        for (const event of pushEvents) {
            const repoFullName = event.repo.name;
            const repoName = repoFullName.split('/')[1];

            const repo = await this.repositoryService.findByNameAndUser(repoName, user.id);

            if (repo) {
                const date = new Date(event.created_at);
                date.setUTCHours(0, 0, 0, 0);

                const commitCount = event.payload.size || (event.payload.commits ? event.payload.commits.length : 1);

                await this.activityService.trackActivity({
                    repo_id: repo.id,
                    type: 'commit',
                    date: date,
                    count: commitCount
                });
            } else {
                console.log(`Repo not found in sync: ${repoName} for user ${user.id}`);
            }
        }
    }
}
