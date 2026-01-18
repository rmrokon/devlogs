import jwt from "jsonwebtoken";
import { GithubService } from "./github.service";
import { UserService } from "../users/service";
import { IAuthResponse } from "./types";

export class AuthService {
    private static instance: AuthService;
    private githubService: GithubService;
    private userService: UserService;
    private readonly jwtSecret: string;

    private constructor() {
        this.githubService = GithubService.getInstance();
        this.userService = UserService.getInstance();
        this.jwtSecret = process.env.JWT_SECRET || "default_secret";
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async handleGithubLogin(code: string): Promise<IAuthResponse> {
        // 1. Exchange code for access token
        const accessToken = await this.githubService.getAccessToken(code);

        // 2. Get user details from GitHub
        const githubUser = await this.githubService.getGithubUser(accessToken);

        // 3. Find or Create User in DB
        let user;
        try {
            user = await this.userService.getUserByGithubId(githubUser.id.toString());

            if (!user) {
                user = await this.userService.createUser({
                    github_id: githubUser.id.toString(),
                    username: githubUser.login,
                    access_token: accessToken,
                });
            } else {
                // Update access token if needed (optional)
                // user.access_token = accessToken;
                // await user.save();
            }

        } catch (error) {
            throw error;
        }

        // 4. Generate JWT
        const token = jwt.sign(
            { userId: user.id, githubId: user.github_id },
            this.jwtSecret,
            { expiresIn: "7d" }
        );

        // Fetch Stats
        const stats = await this.githubService.getGithubStats(accessToken, user.username);

        return {
            token,
            user: {
                id: user.id!,
                username: user.username,
                github_id: user.github_id,
                ...stats,
            },
        };
    }

    getGithubLoginUrl(): string {
        const clientId = process.env.GITHUB_CLIENT_ID;
        const redirectUri = process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/api/auth/github/callback";
        return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user`;
    }
}
