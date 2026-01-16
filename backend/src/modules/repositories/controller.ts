import { Request, Response } from "express";
import { RepositoryService } from "./service";
import { createRepositorySchema } from "./validation";

export class RepositoryController {
    private static instance: RepositoryController;
    private repositoryService: RepositoryService;

    private constructor(repositoryService: RepositoryService) {
        this.repositoryService = repositoryService;
    }

    public static getInstance(): RepositoryController {
        if (!RepositoryController.instance) {
            RepositoryController.instance = new RepositoryController(RepositoryService.getInstance());
        }
        return RepositoryController.instance;
    }

    async getRepositories(req: Request, res: Response): Promise<void> {
        try {
            const repositories = await this.repositoryService.getAllRepositories();
            res.status(200).json(repositories);
        } catch (error) {
            res.status(500).json({ message: "Error fetching repositories", error });
        }
    }

    async createRepository(req: Request, res: Response): Promise<void> {
        try {
            const validationResult = createRepositorySchema.safeParse(req.body);

            if (!validationResult.success) {
                res.status(400).json({ errors: validationResult.error.issues });
                return;
            }

            const repository = await this.repositoryService.createRepository(validationResult.data);
            res.status(201).json(repository);
        } catch (error) {
            res.status(500).json({ message: "Error creating repository", error });
        }
    }
}
