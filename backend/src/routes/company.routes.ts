import { Router } from "express";
import { companyController } from "../controllers/company.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", requireAuth, (req, res) => companyController.getReadiness(req, res));
router.get("/readiness", requireAuth, (req, res) => companyController.getReadiness(req, res));

export default router;
