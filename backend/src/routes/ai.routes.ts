import { Router } from "express";
import { aiController, hintRequestSchema, debugRequestSchema, failureAnalysisSchema } from "../controllers/ai.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { optionalAuth } from "../middlewares/auth.middleware";
import { aiLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();

router.post("/hint", aiLimiter, validateBody(hintRequestSchema), optionalAuth, (req, res) => aiController.getHint(req, res));
router.post("/debug", aiLimiter, validateBody(debugRequestSchema), optionalAuth, (req, res) => aiController.getDebug(req, res));
router.post("/analyze-failure", aiLimiter, validateBody(failureAnalysisSchema), optionalAuth, (req, res) => aiController.analyzeFailure(req, res));

export default router;
