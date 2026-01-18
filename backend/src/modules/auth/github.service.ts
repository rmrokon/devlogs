import axios from "axios";

export class GithubService {
    private static instance: GithubService;
    private readonly clientId: string;
    private readonly clientSecret: string;

    private constructor() {
        this.clientId = process.env.GITHUB_CLIENT_ID || "";
        this.clientSecret = process.env.GITHUB_CLIENT_SECRET || "";

        if (!this.clientId || !this.clientSecret) {
            console.warn("GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is not set");
        }
    }

    public static getInstance(): GithubService {
        if (!GithubService.instance) {
            GithubService.instance = new GithubService();
        }
        return GithubService.instance;
    }

    async getAccessToken(code: string): Promise<string> {
        const response = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code,
            },
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );

        if (response.data.error) {
            throw new Error(`GitHub OAuth Error: ${response.data.error_description}`);
        }

        return response.data.access_token;
    }

    async getGithubStats(accessToken: string, username: string): Promise<{ totalCommits: number }> {
        try {
            // Fetch events to estimate recent activity
            // Note: This only gets public events for the last 90 days / 300 events
            const response = await axios.get(`https://api.github.com/users/${username}/events`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const pushEvents = response.data.filter((event: any) => event.type === "PushEvent");
            const totalCommits = pushEvents.reduce((acc: number, event: any) => {
                return acc + (event.payload.size || 0);
            }, 0);

            return { totalCommits };
        } catch (error) {
            console.error("Error fetching GitHub stats:", error);
            return { totalCommits: 0 };
        }
    }

    async getGithubUser(accessToken: string): Promise<any> {
        const response = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    }
}
