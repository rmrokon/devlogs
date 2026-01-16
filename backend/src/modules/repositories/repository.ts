import { GithubRepository } from "./model";
import { IGithubRepository, ICreateRepositoryDTO } from "./types";

export class RepositoryRepository {
    private static instance: RepositoryRepository;

    private constructor() { }

    public static getInstance(): RepositoryRepository {
        if (!RepositoryRepository.instance) {
            RepositoryRepository.instance = new RepositoryRepository();
        }
        return RepositoryRepository.instance;
    }

    async findAll(): Promise<GithubRepository[]> {
        return await GithubRepository.findAll();
    }

    async create(data: ICreateRepositoryDTO): Promise<GithubRepository> {
        return await GithubRepository.create(data);
    }

    async findByUserId(userId: number): Promise<GithubRepository[]> {
        return await GithubRepository.findAll({ where: { user_id: userId } });
    }
}
