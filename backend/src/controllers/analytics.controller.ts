import { Response } from "express";
import { prisma } from "../config/database";
import { learningDnaService } from "../services/analytics/learning-dna.service";
import { companyReadinessService } from "../services/analytics/company-readiness.service";
import { successResponse, errorResponse } from "../utils/response";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class AnalyticsController {
  async getDashboardSummary(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, "Unauthorized", 401);
      }

      const userId = req.user.userId;

      // 1. Fetch user submissions
      const submissions = await prisma.submission.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          problem: {
            select: { id: true, title: true, slug: true, difficulty: true, topic: { select: { name: true } } }
          }
        }
      });

      const totalSubmissions = submissions.length;
      const acceptedSubmissions = submissions.filter((s) => s.verdict === "Accepted");
      const acceptanceRate = totalSubmissions > 0 ? Math.round((acceptedSubmissions.length / totalSubmissions) * 100) : 0;

      // Unique problems solved
      const solvedProblemIds = new Set(acceptedSubmissions.map((s) => s.problemId));
      const problemsSolved = solvedProblemIds.size;

      // 2. Calculate streak (consecutive days with at least one submission)
      const streak = this.calculateStreak(submissions.map((s) => s.createdAt));

      // 3. Learning DNA
      const dna = await learningDnaService.getUserLearningDna(userId);

      // 4. Company Readiness Snapshot
      const companyScores = await companyReadinessService.getCompanyReadiness(userId);

      // 5. Recommended Next Problem
      // Pick the first unsolved problem from the user's weakest topic
      let recommendedProblem = null;
      if (dna.weakestTopics.length > 0) {
        const weakest = dna.weakestTopics[0];
        recommendedProblem = await prisma.problem.findFirst({
          where: {
            topicId: weakest.topicId,
            id: { notIn: Array.from(solvedProblemIds) }
          },
          select: { id: true, title: true, slug: true, difficulty: true, topic: { select: { name: true } } }
        });
      }

      if (!recommendedProblem) {
        recommendedProblem = await prisma.problem.findFirst({
          where: { id: { notIn: Array.from(solvedProblemIds) } },
          select: { id: true, title: true, slug: true, difficulty: true, topic: { select: { name: true } } }
        });
      }

      return successResponse(res, {
        metrics: {
          problemsSolved,
          totalSubmissions,
          acceptanceRate,
          currentStreakDays: streak,
          overallMasteryScore: dna.overallScore
        },
        learningDna: dna,
        companyReadiness: companyScores,
        recentSubmissions: submissions.slice(0, 5),
        recommendedProblem
      });
    } catch (error: any) {
      return errorResponse(res, error.message || "Failed to generate dashboard summary", 500);
    }
  }

  async getLearningDna(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, "Unauthorized", 401);
      }

      const dna = await learningDnaService.getUserLearningDna(req.user.userId);
      return successResponse(res, dna);
    } catch (error: any) {
      return errorResponse(res, error.message || "Failed to retrieve Learning DNA", 500);
    }
  }

  private calculateStreak(dates: Date[]): number {
    if (dates.length === 0) return 0;

    const uniqueDays = Array.from(
      new Set(
        dates.map((d) => {
          const dateObj = new Date(d);
          return `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
        })
      )
    );

    uniqueDays.sort().reverse();

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const yesterday = new Date(Date.now() - 86400000);
    const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

    // If no submission today or yesterday, streak is broken
    if (uniqueDays[0] !== todayStr && uniqueDays[0] !== yesterdayStr) {
      return 0;
    }

    let count = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const prev = new Date(uniqueDays[i - 1]);
      const curr = new Date(uniqueDays[i]);
      const diffDays = Math.round((prev.getTime() - curr.getTime()) / 86400000);

      if (diffDays === 1) {
        count++;
      } else {
        break;
      }
    }

    return count;
  }
}

export const analyticsController = new AnalyticsController();
