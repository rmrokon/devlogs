import { RepositoryRepository } from "./repository";
import { GithubRepository } from "./model";
import { CreateRepositoryInput } from "./validation";

export class RepositoryService {
    private static instance: RepositoryService;
    private repositoryRepository: RepositoryRepository;

    private constructor(repositoryRepository: RepositoryRepository) {
        this.repositoryRepository = repositoryRepository;
    }

    public static getInstance(): RepositoryService {
        if (!RepositoryService.instance) {
            RepositoryService.instance = new RepositoryService(RepositoryRepository.getInstance());
        }
        return RepositoryService.instance;
    }

    async getAllRepositories(): Promise<GithubRepository[]> {
        return await this.repositoryRepository.findAll();
    }

    async createRepository(data: CreateRepositoryInput): Promise<GithubRepository> {
        return await this.repositoryRepository.create(data);
    }

    async getRepositoriesByUser(userId: number): Promise<GithubRepository[]> {
        return await this.repositoryRepository.findByUserId(userId);
    }
}
