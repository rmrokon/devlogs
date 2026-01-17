import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import userRoutes from "./modules/users";
import repositoryRoutes from "./modules/repositories";
import activityRoutes from "./modules/activities";
import authRoutes from "./modules/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/repositories", repositoryRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/auth", authRoutes);

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
