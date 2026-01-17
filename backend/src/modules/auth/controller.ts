import { Request, Response } from "express";
import { AuthService } from "./service";

export class AuthController {
    private static instance: AuthController;
    private authService: AuthService;

    private constructor(authService: AuthService) {
        this.authService = authService;
    }

    public static getInstance(): AuthController {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController(AuthService.getInstance());
        }
        return AuthController.instance;
    }

    login(req: Request, res: Response) {
        const url = this.authService.getGithubLoginUrl();
        res.redirect(url);
    }

    async callback(req: Request, res: Response) {
        const { code } = req.query;

        if (!code || typeof code !== "string") {
            res.status(400).json({ message: "Invalid code" });
            return;
        }

        try {
            const authResponse = await this.authService.handleGithubLogin(code);

            // Redirect to frontend with token
            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
            res.redirect(`${frontendUrl}?token=${authResponse.token}`);

            // alternatively return JSON for testing if frontend not ready
            // res.json(authResponse);
        } catch (error: any) {
            console.error("Auth Error:", error);
            res.status(500).json({ message: "Authentication failed", error: error.message });
        }
    }
}
