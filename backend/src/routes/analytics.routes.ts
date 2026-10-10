import { Router } from "express";
import { analyticsController } from "../controllers/analytics.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/dashboard", requireAuth, (req, res) => analyticsController.getDashboardSummary(req, res));
router.get("/learning-dna", requireAuth, (req, res) => analyticsController.getLearningDna(req, res));

export default router;
