import { Request, Response } from "express";
import { UserService } from "./service";
import { createUserSchema } from "./validation";

export class UserController {
    private static instance: UserController;
    private userService: UserService;

    private constructor(userService: UserService) {
        this.userService = userService;
    }

    public static getInstance(): UserController {
        if (!UserController.instance) {
            UserController.instance = new UserController(UserService.getInstance());
        }
        return UserController.instance;
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Error fetching users", error });
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const validationResult = createUserSchema.safeParse(req.body);

            if (!validationResult.success) {
                res.status(400).json({ errors: validationResult.error.issues });
                return;
            }

            const user = await this.userService.createUser(validationResult.data);
            res.status(201).json(user);
        } catch (error: any) {
            if (error.message === "User already exists") {
                res.status(409).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Error creating user", error });
            }
        }
    }
}
