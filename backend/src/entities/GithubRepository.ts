import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Activity } from "./Activity";

@Entity({ name: "repositories" })
export class GithubRepository {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    user_id!: number;

    @Column()
    name!: string;

    @Column()
    url!: string;

    @Column({ default: 0 })
    stars!: number;

    @Column({ nullable: true })
    language!: string;

    @ManyToOne(() => User, (user) => user.repositories)
    @JoinColumn({ name: "user_id" })
    user!: User;

    @OneToMany(() => Activity, (activity) => activity.repository)
    activities!: Activity[];
}
