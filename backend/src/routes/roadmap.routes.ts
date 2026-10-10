import { Router } from "express";
import { roadmapController, generateRoadmapSchema } from "../controllers/roadmap.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", requireAuth, (req, res) => roadmapController.getRoadmap(req, res));
router.post("/generate", requireAuth, validateBody(generateRoadmapSchema), (req, res) => roadmapController.generateRoadmap(req, res));

export default router;
