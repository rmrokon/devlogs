import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { GithubRepository } from "./GithubRepository";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    github_id!: string;

    @Column()
    username!: string;

    @Column({ nullable: true })
    access_token!: string;

    @OneToMany(() => GithubRepository, (repository) => repository.user)
    repositories!: GithubRepository[];
}
