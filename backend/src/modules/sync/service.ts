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
        const user = await this.userService.getUserByGithubId(userId.toString()); // Wait, by ID or GithubID? userService.getUserByGithubId expects githubId (string)
        // But here userId passed is likely DB ID. We need DB ID to get User model.
        // Let's assume passed ID is DB ID. But we don't have getUserById exposed in service?
        // UserService has getAllUsers, createUser, getUserByGithubId.
        // We need getUserById. Or pass the User object directly.
        // Let's fetch using finder methods we have or add one.
        // Actually, let's change signature to accept User model directly or handle it.
        // For simplicity, let's use what we have or add getUserById.

        // Let's assume we pass full user object or fetch it.
        // I will add getUserById to UserService later if needed, but for now let's query Repository directly? No, use Service.

        // REFACTOR: Accept User object to avoid extra DB call if controller has it.
    }

    async syncUser(user: User): Promise<void> {
        if (!user.access_token) {
            console.error(`User ${user.username} has no access token`);
            return;
        }

        try {
            await this.syncRepositories(user);
            await this.syncActivities(user);

            // Update last_synced_at
            user.last_synced_at = new Date();
            await user.save();
        } catch (error) {
            console.error(`Error syncing user ${user.username}:`, error);
            throw error;
        }
    }

    private async syncRepositories(user: User): Promise<void> {
        // Fetch all repos
        // Need to add getRepositories to GithubService
        // Use direct axios for now or update GithubService

        const response = await axios.get(`https://api.github.com/users/${user.username}/repos?per_page=100`, {
            headers: { Authorization: `Bearer ${user.access_token}` }
        });

        const repos = response.data;
        console.log("repos : ", repos.length)

        for (const repo of repos) {
            // Fetch languages for each repo
            const langResponse = await axios.get(repo.languages_url, {
                headers: { Authorization: `Bearer ${user.access_token}` }
            });
            const languages = langResponse.data;

            // Create or Update Repository in DB
            // We need a method in RepositoryService to Upsert
            // Or assume create. RepositoryService has createRepository.
            // Check if exists? RepositoryService doesn't have find logic exposed well.
            // Let's use Repository model directly or expand service.
            // Expanding Service is correct way.

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
        // Fetch events
        const response = await axios.get(`https://api.github.com/users/${user.username}/events?per_page=100`, {
            headers: { Authorization: `Bearer ${user.access_token}` }
        });

        const events = response.data;
        console.log("events : ", events.length)

        // Filter PushEvents
        const pushEvents = events.filter((e: any) => e.type === 'PushEvent');

        for (const event of pushEvents) {
            const repoFullName = event.repo.name; // e.g., "owner/repo"
            const repoName = repoFullName.split('/')[1];

            // Try matching by the name we store
            const repo = await this.repositoryService.findByNameAndUser(repoName, user.id);

            if (repo) {
                const date = new Date(event.created_at);
                date.setUTCHours(0, 0, 0, 0);

                // payload.size is most reliable for commits in a push
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
