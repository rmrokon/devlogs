import { Router } from "express";
import { RepositoryController } from "./controller";

const router = Router();
const repositoryController = RepositoryController.getInstance();

router.get("/", (req, res) => repositoryController.getRepositories(req, res));
router.post("/", (req, res) => repositoryController.createRepository(req, res));

export default router;
