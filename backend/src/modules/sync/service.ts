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
            // syncActivities is deprecated for commit frequency, using direct commit sync in syncRepositories
            // await this.syncActivities(user); 

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
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sinceDateString = thirtyDaysAgo.toISOString();

        for (const repo of repos) {
            // 1. Fetch languages for each repo
            const langResponse = await axios.get(repo.languages_url, {
                headers: { Authorization: `Bearer ${user.access_token}` }
            });
            const languages = langResponse.data;

            // 2. Create or Update Repository in DB
            const dbRepo = await this.repositoryService.upsertRepository({
                user_id: user.id,
                name: repo.name,
                url: repo.html_url,
                stars: repo.stargazers_count,
                language: repo.language,
                languages: languages
            });

            // 3. Fetch Commits directly for accuracy (Last 30 days)
            // repo.commits_url is e.g. "https://api.github.com/repos/octocat/Hello-World/commits{/sha}"
            const commitsUrl = repo.commits_url.replace('{/sha}', '');
            try {
                const commitsResponse = await axios.get(`${commitsUrl}?since=${sinceDateString}&per_page=100`, {
                    headers: { Authorization: `Bearer ${user.access_token}` }
                });

                const commits = commitsResponse.data;
                const commitsByDate: Record<string, number> = {};

                for (const commitData of commits) {
                    // commitData.commit.committer.date
                    const dateStr = commitData.commit.committer.date;
                    const date = new Date(dateStr);
                    date.setUTCHours(0, 0, 0, 0);
                    const isoDate = date.toISOString().split('T')[0];

                    commitsByDate[isoDate] = (commitsByDate[isoDate] || 0) + 1;
                }

                // 4. Update Activity (Daily counts)
                for (const [dateStr, count] of Object.entries(commitsByDate)) {
                    await this.activityService.upsertActivity({
                        repo_id: dbRepo.id,
                        type: 'commit',
                        date: new Date(dateStr),
                        count: count
                    });
                }
            } catch (err: any) {
                console.warn(`Could not sync commits for ${repo.name}: ${err.message}`);
            }
        }
    }

    private async syncActivities(user: User): Promise<void> {
        // Deprecated for commit tracking, but kept for future event types (PRs, issues) if needed.
        // For now, it doesn't do anything to avoid duplicate counts.
    }
}
