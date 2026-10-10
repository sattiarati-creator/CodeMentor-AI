import { Router } from "express";
import { authController, registerSchema, loginSchema } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import { authLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();

router.post("/register", authLimiter, validateBody(registerSchema), (req, res) => authController.register(req, res));
router.post("/login", authLimiter, validateBody(loginSchema), (req, res) => authController.login(req, res));
router.get("/me", requireAuth, (req, res) => authController.getMe(req, res));

export default router;
