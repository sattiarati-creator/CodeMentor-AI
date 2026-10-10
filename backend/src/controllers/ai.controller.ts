import { Response } from "express";
import { z } from "zod";
import { hintService } from "../services/ai/hint.service";
import { debugService } from "../services/ai/debug.service";
import { failureAnalysisService } from "../services/ai/failure-analysis.service";
import { successResponse, errorResponse } from "../utils/response";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const hintRequestSchema = z.object({
  problemId: z.string().optional().default(""),
  problemTitle: z.string().min(1, "problemTitle is required"),
  problemDescription: z.string().default(""),
  constraints: z.string().optional().default(""),
  studentCode: z.string().default(""),
  errorOutput: z.string().optional().default(""),
  hintLevel: z.number().int().min(1).max(6).default(1)
});

export const debugRequestSchema = z.object({
  problemTitle: z.string().min(1),
  problemDescription: z.string().default(""),
  studentCode: z.string().min(1),
  testInput: z.string().default(""),
  expectedOutput: z.string().default(""),
  actualOutput: z.string().default("")
});

export const failureAnalysisSchema = z.object({
  problemTitle: z.string().min(1),
  difficulty: z.string().default("Medium"),
  topic: z.string().default("Algorithms"),
  studentCode: z.string().default(""),
  verdict: z.string().min(1),
  failedInput: z.string().default(""),
  expectedOutput: z.string().default(""),
  actualOutput: z.string().default("")
});

export class AiController {
  async getHint(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await hintService.getSocraticHint(req.body);
      return successResponse(res, result, `Retrieved Socratic Hint Level ${result.level}`);
    } catch (error: any) {
      return errorResponse(res, error.message || "Failed to generate Socratic hint", 500);
    }
  }

  async getDebug(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await debugService.debugCode(req.body);
      return successResponse(res, result, "Debug guidance generated");
    } catch (error: any) {
      return errorResponse(res, error.message || "Failed to generate debug guidance", 500);
    }
  }

  async analyzeFailure(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await failureAnalysisService.analyzeFailure(req.body);
      return successResponse(res, result, "Failure root cause analysis complete");
    } catch (error: any) {
      return errorResponse(res, error.message || "Failed to analyze failure", 500);
    }
  }
}

export const aiController = new AiController();
