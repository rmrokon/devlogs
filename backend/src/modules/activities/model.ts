import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { IActivity } from "./types";

interface ActivityCreationAttributes extends Optional<IActivity, "id" | "count"> { }

export class Activity extends Model<IActivity, ActivityCreationAttributes> implements IActivity {
    public id!: number;
    public repo_id!: number;
    public type!: string;
    public date!: Date;
    public count!: number;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Activity.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        repo_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: "activities",
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["repo_id", "type", "date"],
            },
        ],
    }
);
