import { UserRepository } from "../repositories/user.repository";

export class UserService {
    async getAllUsers() {
        return await UserRepository.find({
            relations: ["repositories"]
        });
    }

    async createUser(data: { github_id: string; username: string; access_token?: string }) {
        const user = UserRepository.create(data);
        return await UserRepository.save(user);
    }
}
