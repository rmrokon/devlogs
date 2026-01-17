import { UserRepository } from "./repository";
import { User } from "./model";
import { CreateUserInput } from "./validation";

export class UserService {
    private static instance: UserService;
    private userRepository: UserRepository;

    private constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService(UserRepository.getInstance());
        }
        return UserService.instance;
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.findAll();
    }

    async createUser(data: CreateUserInput): Promise<User> {
        const existingUser = await this.userRepository.findByGithubId(data.github_id);
        if (existingUser) {
            throw new Error("User already exists");
        }
        return await this.userRepository.create(data);
    }

    async getUserByGithubId(githubId: string): Promise<User | null> {
        return await this.userRepository.findByGithubId(githubId);
    }
}
