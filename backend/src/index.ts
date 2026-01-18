import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./config/database";

// Import Routes
import userRoutes from "./modules/users";
import repositoryRoutes from "./modules/repositories";
import activityRoutes from "./modules/activities";
import authRoutes from "./modules/auth";
import syncRoutes from "./modules/sync";
import statsRoutes from "./modules/stats";

// Import Models for Associations
import { Activity } from "./modules/activities/model";
import { GithubRepository } from "./modules/repositories/model";
import { User } from "./modules/users/model";

// Define Associations
User.hasMany(GithubRepository, { foreignKey: "user_id" });
GithubRepository.belongsTo(User, { foreignKey: "user_id" });

GithubRepository.hasMany(Activity, { foreignKey: "repo_id" });
Activity.belongsTo(GithubRepository, { foreignKey: "repo_id" });

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(helmet());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/repositories", repositoryRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/stats", statsRoutes);

// Root Route
app.get("/", (req, res) => {
    res.send("DevLogs API is running with Sequelize & Modular Architecture");
});

// Initialize Database and Server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Database initialization:", err);
    });
