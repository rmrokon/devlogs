import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { GithubRepository } from "./GithubRepository";

@Entity({ name: "activities" })
export class Activity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    repo_id!: number;

    @Column()
    type!: string;

    @Column()
    date!: Date;

    @Column({ default: 0 })
    count!: number;

    @ManyToOne(() => GithubRepository, (repository) => repository.activities)
    @JoinColumn({ name: "repo_id" })
    repository!: GithubRepository;
}
