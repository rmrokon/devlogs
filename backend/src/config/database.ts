import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbHost = process.env.DB_HOST || "postgres";
const dbPort = parseInt(process.env.DB_PORT || "5432");
const dbUser = process.env.DB_USERNAME || "postgres";
const dbPassword = process.env.DB_PASSWORD || "postgres";
const dbName = process.env.DB_NAME || "devlogs";

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: "postgres",
    logging: false,
    ssl: true,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: true,
            ca: process.env.CA_CERT,
        },
    },
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        // Sync models
        await sequelize.sync({ alter: true });
        console.log("Database synchronized.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};
