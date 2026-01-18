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

    async findByNameAndUserId(name: string, userId: number): Promise<GithubRepository | null> {
        return await GithubRepository.findOne({ where: { name, user_id: userId } });
    }

    async update(id: number, data: Partial<ICreateRepositoryDTO>): Promise<[number, GithubRepository[]]> {
        return await GithubRepository.update(data, { where: { id }, returning: true });
    }
}
