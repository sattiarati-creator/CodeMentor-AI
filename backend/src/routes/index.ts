import { Router } from "express";
import authRoutes from "./auth.routes";
import problemRoutes from "./problem.routes";
import codeRoutes from "./code.routes";
import submissionRoutes from "./submission.routes";
import aiRoutes from "./ai.routes";
import analyticsRoutes from "./analytics.routes";
import roadmapRoutes from "./roadmap.routes";
import companyRoutes from "./company.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/problems", problemRoutes);
router.use("/code", codeRoutes);
router.use("/submissions", submissionRoutes);
router.use("/ai", aiRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/roadmap", roadmapRoutes);
router.use("/company", companyRoutes);
router.use("/company-readiness", companyRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "CodeMentor-AI Backend",
    timestamp: new Date().toISOString()
  });
});

export default router;
