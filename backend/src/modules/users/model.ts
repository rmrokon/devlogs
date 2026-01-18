import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { IUser } from "./types";

interface UserCreationAttributes extends Optional<IUser, "id"> { }

export class User extends Model<IUser, UserCreationAttributes> implements IUser {
    public id!: number;
    public github_id!: string;
    public username!: string;
    public access_token!: string | null;
    public last_synced_at!: Date | null;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        github_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        access_token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        last_synced_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "users",
        timestamps: true,
        underscored: true,
    }
);
