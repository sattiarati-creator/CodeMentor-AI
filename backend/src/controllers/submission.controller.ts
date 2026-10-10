import { Response } from "express";
import { prisma } from "../config/database";
import { successResponse, errorResponse } from "../utils/response";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class SubmissionController {
  async listUserSubmissions(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, "Unauthorized", 401);
      }

      const { problemId } = req.query;
      const whereClause: any = { userId: req.user.userId };
      if (problemId && typeof problemId === "string") {
        whereClause.problemId = problemId;
      }

      const submissions = await prisma.submission.findMany({
        where: whereClause,
        include: {
          problem: {
            select: { id: true, title: true, slug: true, difficulty: true }
          }
        },
        orderBy: { createdAt: "desc" },
        take: 50
      });

      return successResponse(res, submissions);
    } catch (error: any) {
      return errorResponse(res, error.message || "Failed to fetch submissions", 500);
    }
  }

  async getSubmissionById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, "Unauthorized", 401);
      }

      const { id } = req.params;
      const submission = await prisma.submission.findUnique({
        where: { id },
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              slug: true,
              difficulty: true,
              topic: { select: { name: true, slug: true } }
            }
          }
        }
      });

      if (!submission) {
        return errorResponse(res, "Submission not found", 404);
      }

      if (submission.userId !== req.user.userId && req.user.role !== "admin") {
        return errorResponse(res, "Forbidden", 403);
      }

      return successResponse(res, submission);
    } catch (error: any) {
      return errorResponse(res, error.message || "Failed to retrieve submission", 500);
    }
  }
}

export const submissionController = new SubmissionController();
