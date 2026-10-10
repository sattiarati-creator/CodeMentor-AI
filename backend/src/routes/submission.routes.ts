import { Router } from "express";
import { submissionController } from "../controllers/submission.controller";
import { codeController, submitCodeSchema } from "../controllers/code.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { codeRunLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();

router.get("/", requireAuth, (req, res) => submissionController.listUserSubmissions(req, res));
router.get("/:id", requireAuth, (req, res) => submissionController.getSubmissionById(req, res));
router.post("/", codeRunLimiter, validateBody(submitCodeSchema), requireAuth, (req, res) => codeController.submitCode(req, res));

export default router;
