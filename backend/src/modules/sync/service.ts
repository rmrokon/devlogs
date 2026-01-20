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
            // Calculate since date: use 30 days ago OR last_synced_at minus a safety buffer (e.g. 1 hour)
            // Buffer is to catch any commits that might have happened simultaneously with last sync
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            let sinceDate = thirtyDaysAgo;
            if (user.last_synced_at) {
                const lastSync = new Date(user.last_synced_at);
                // Start at the beginning of the day of last sync to ensure we refresh the full day's count
                lastSync.setUTCHours(0, 0, 0, 0);

                // We still only care about last 30 days for the dashboard frequency, 
                // but we can sync more? No, let's stick to 30 days max for now.
                if (lastSync > thirtyDaysAgo) {
                    sinceDate = lastSync;
                }
            }

            await this.syncRepositories(user, sinceDate);

            user.last_synced_at = new Date();
            await user.save();
        } catch (error) {
            console.error(`Error syncing user ${user.username}:`, error);
            throw error;
        }
    }

    private async syncRepositories(user: User, sinceDate: Date): Promise<void> {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const sinceDateString = sinceDate.toISOString();

        let repoPage = 1;
        let hasMoreRepos = true;

        while (hasMoreRepos) {
            // Sort by pushed to stop early if we hit old repos
            const response = await axios.get(`https://api.github.com/users/${user.username}/repos?per_page=100&page=${repoPage}&sort=pushed`, {
                headers: { Authorization: `Bearer ${user.access_token}` }
            });

            const repos = response.data;
            if (repos.length === 0) {
                hasMoreRepos = false;
                break;
            }

            for (const repo of repos) {
                // Check if repo has been pushed in the sync window
                const pushedPath = new Date(repo.pushed_at);
                if (pushedPath < sinceDate) {
                    hasMoreRepos = false; // Stop fetching more pages
                    break; // Stop processing this page
                }

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

                // 3. Fetch Commits directly for accuracy (sinceDate)
                const commitsUrl = repo.commits_url.replace('{/sha}', '');
                try {
                    const commitsByDate: Record<string, number> = {};
                    let page = 1;
                    let hasMoreCommits = true;

                    while (hasMoreCommits) {
                        const commitsResponse = await axios.get(`${commitsUrl}?since=${sinceDateString}&per_page=100&page=${page}`, {
                            headers: { Authorization: `Bearer ${user.access_token}` }
                        });

                        const commits = commitsResponse.data;
                        if (commits.length === 0) {
                            hasMoreCommits = false;
                            break;
                        }

                        for (const commitData of commits) {
                            const dateStr = commitData.commit.committer.date;
                            const date = new Date(dateStr);
                            date.setUTCHours(0, 0, 0, 0);
                            const isoDate = date.toISOString().split('T')[0];

                            commitsByDate[isoDate] = (commitsByDate[isoDate] || 0) + 1;
                        }

                        if (commits.length < 100) {
                            hasMoreCommits = false;
                        } else {
                            page++;
                        }
                    }

                    // 4. Update Activity (Daily counts)
                    // If we use sinceDate as the start of the day, we get the FULL count for those days
                    // and upsert will overwrite with the latest full count.
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

            if (hasMoreRepos) {
                if (repos.length < 100) {
                    hasMoreRepos = false;
                } else {
                    repoPage++;
                }
            }
        }
    }

    private async syncActivities(user: User): Promise<void> {
        // Deprecated for commit tracking, but kept for future event types (PRs, issues) if needed.
        // For now, it doesn't do anything to avoid duplicate counts.
    }
}
