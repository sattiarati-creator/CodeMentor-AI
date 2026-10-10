import { Request, Response } from "express";
import { prisma } from "../config/database";
import { cache } from "../config/redis";
import { successResponse, errorResponse } from "../utils/response";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class ProblemController {
  async listProblems(req: AuthenticatedRequest, res: Response) {
    try {
      const { difficulty, topic, search } = req.query;
      const cacheKey = `problems:list:${difficulty || "all"}:${topic || "all"}:${search || "all"}`;

      // Check cache if no user-specific submission state is requested
      const cached = await cache.get(cacheKey);
      if (cached && !req.user) {
        return successResponse(res, JSON.parse(cached));
      }

      const whereClause: any = {};
      if (difficulty && typeof difficulty === "string") {
        whereClause.difficulty = difficulty;
      }
      if (topic && typeof topic === "string") {
        whereClause.topic = { slug: topic };
      }
      if (search && typeof search === "string") {
        whereClause.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } }
        ];
      }

      const problems = await prisma.problem.findMany({
        where: whereClause,
        include: {
          topic: { select: { id: true, name: true, slug: true } },
          _count: { select: { testCases: true, hints: true } }
        },
        orderBy: { order: "asc" }
      });

      // If user is authenticated, attach user's completion status
      let userSubmissionsMap = new Map<string, string>();
      if (req.user) {
        const userSubs = await prisma.submission.findMany({
          where: { userId: req.user.userId },
          select: { problemId: true, verdict: true }
        });
        for (const sub of userSubs) {
          if (sub.verdict === "Accepted" || !userSubmissionsMap.has(sub.problemId)) {
            userSubmissionsMap.set(sub.problemId, sub.verdict);
          }
        }
      }

      const formatted = problems.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        difficulty: p.difficulty,
        topic: p.topic,
        totalTestCases: p._count.testCases,
        totalHints: p._count.hints,
        userStatus: userSubmissionsMap.get(p.id) || "Unsolved"
      }));

      // Cache problem list for 60 seconds
      if (!req.user) {
        await cache.set(cacheKey, JSON.stringify(formatted), 60);
      }

      return successResponse(res, formatted);
    } catch (error: any) {
      return errorResponse(res, error.message || "Failed to list problems", 500);
    }
  }

  async getProblemById(req: AuthenticatedRequest, res: Response) {
    try {
      const { idOrSlug } = req.params;

      const cacheKey = `problem:${idOrSlug}`;
      const cached = await cache.get(cacheKey);
      if (cached) {
        return successResponse(res, JSON.parse(cached));
      }

      const problem = await prisma.problem.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }]
        },
        include: {
          topic: true,
          testCases: {
            where: { isSample: true },
            select: {
              id: true,
              input: true,
              expectedOutput: true,
              isSample: true,
              explanation: true
            }
          },
          hints: {
            select: { level: true, title: true },
            orderBy: { level: "asc" }
          }
        }
      });

      if (!problem) {
        return errorResponse(res, "Problem not found", 404);
      }

      await cache.set(cacheKey, JSON.stringify(problem), 120);

      return successResponse(res, problem);
    } catch (error: any) {
      return errorResponse(res, error.message || "Failed to retrieve problem", 500);
    }
  }

  async listTopics(req: Request, res: Response) {
    try {
      const cacheKey = "topics:all";
      const cached = await cache.get(cacheKey);
      if (cached) {
        return successResponse(res, JSON.parse(cached));
      }

      const topics = await prisma.topic.findMany({
        orderBy: { order: "asc" },
        include: {
          _count: { select: { problems: true } }
        }
      });

      await cache.set(cacheKey, JSON.stringify(topics), 300);

      return successResponse(res, topics);
    } catch (error: any) {
      return errorResponse(res, error.message || "Failed to list topics", 500);
    }
  }
}

export const problemController = new ProblemController();
