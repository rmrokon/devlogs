import { User } from "./model";
import { IUser, ICreateUserDTO } from "./types";

export class UserRepository {
    private static instance: UserRepository;

    private constructor() { }

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }

    async findAll(): Promise<User[]> {
        return await User.findAll();
    }

    async create(data: ICreateUserDTO): Promise<User> {
        return await User.create(data);
    }

    async findByGithubId(githubId: string): Promise<User | null> {
        return await User.findOne({ where: { github_id: githubId } });
    }

    async findByUsername(username: string): Promise<User | null> {
        return await User.findOne({ where: { username } });
    }
}
