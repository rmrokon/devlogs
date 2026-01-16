import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

export const UserRepository = AppDataSource.getRepository(User).extend({
    async findByGithubId(githubId: string) {
        return this.findOneBy({ github_id: githubId });
    }
});
