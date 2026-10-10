import { Router } from "express";
import { codeController, runCodeSchema, submitCodeSchema } from "../controllers/code.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { requireAuth, optionalAuth } from "../middlewares/auth.middleware";
import { codeRunLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();

router.post("/run", codeRunLimiter, validateBody(runCodeSchema), optionalAuth, (req, res) => codeController.runCode(req, res));
router.post("/submit", codeRunLimiter, validateBody(submitCodeSchema), requireAuth, (req, res) => codeController.submitCode(req, res));

export default router;
