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

    async getGithubUser(accessToken: string): Promise<any> {
        const response = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    }
}
