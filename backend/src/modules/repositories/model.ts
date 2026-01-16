import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { IGithubRepository } from "./types";

interface RepositoryCreationAttributes extends Optional<IGithubRepository, "id" | "stars" | "language"> { }

export class GithubRepository extends Model<IGithubRepository, RepositoryCreationAttributes> implements IGithubRepository {
    public id!: number;
    public user_id!: number;
    public name!: string;
    public url!: string;
    public stars!: number;
    public language!: string | null;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

GithubRepository.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        stars: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        language: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "repositories",
        timestamps: true,
        underscored: true,
    }
);
