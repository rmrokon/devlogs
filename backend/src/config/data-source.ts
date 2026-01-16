import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { GithubRepository } from "../entities/GithubRepository";
import { Activity } from "../entities/Activity";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "devlogs",
    synchronize: true, // Set to false in production and use migrations
    logging: false,
    entities: [User, GithubRepository, Activity],
    migrations: [],
    subscribers: [],
});
