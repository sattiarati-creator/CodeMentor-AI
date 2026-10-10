import { Response } from "express";
import { z } from "zod";
import { roadmapService } from "../services/ai/roadmap.service";
import { successResponse, errorResponse } from "../utils/response";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const generateRoadmapSchema = z.object({
  targetCompany: z.string().optional().default("General Tech Placement"),
  targetRole: z.string().optional().default("Software Engineer (SDE-1)")
});

export class RoadmapController {
  async getRoadmap(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, "Unauthorized", 401);
      }

      const roadmap = await roadmapService.getLatestRoadmap(req.user.userId);
      return successResponse(res, roadmap);
    } catch (error: any) {
      return errorResponse(res, error.message || "Failed to retrieve roadmap", 500);
    }
  }

  async generateRoadmap(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, "Unauthorized", 401);
      }

      const { targetCompany, targetRole } = req.body;
      const roadmap = await roadmapService.generatePersonalizedRoadmap({
        userId: req.user.userId,
        targetCompany,
        targetRole
      });

      return successResponse(res, roadmap, "Personalized roadmap generated successfully", 201);
    } catch (error: any) {
      return errorResponse(res, error.message || "Failed to generate roadmap", 500);
    }
  }
}

export const roadmapController = new RoadmapController();
