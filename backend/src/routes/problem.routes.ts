import { Router } from "express";
import { problemController } from "../controllers/problem.controller";
import { optionalAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", optionalAuth, (req, res) => problemController.listProblems(req, res));
router.get("/topics", (req, res) => problemController.listTopics(req, res));
router.get("/:idOrSlug", optionalAuth, (req, res) => problemController.getProblemById(req, res));

export default router;
