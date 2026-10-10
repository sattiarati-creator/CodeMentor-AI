import { prisma } from "../../config/database";
import { aiClient } from "./ai.client";
import { learningDnaService } from "../analytics/learning-dna.service";

export interface GenerateRoadmapRequest {
  userId: string;
  targetCompany?: string;
  targetRole?: string;
}

export class RoadmapService {
  async generatePersonalizedRoadmap(req: GenerateRoadmapRequest) {
    const { userId, targetCompany = "General Tech Placement" } = req;

    // 1. Fetch current Learning DNA
    const dnaSummary = await learningDnaService.getUserLearningDna(userId);
    const sortedWeakest = [...dnaSummary.topics].sort((a, b) => a.masteryScore - b.masteryScore);

    // Pick top 4 topics that need the most practice
    const priorityTopics = sortedWeakest.slice(0, 4);

    // 2. Fetch problems for each priority topic
    const topicProblems = await prisma.problem.findMany({
      where: {
        topicId: { in: priorityTopics.map((t) => t.topicId) }
      },
      select: {
        id: true,
        title: true,
        difficulty: true,
        slug: true,
        topicId: true
      }
    });

    // 3. Formulate structured multi-week plan
    const roadmapTitle = `${targetCompany} Placement Readiness Roadmap`;
    const summary = `Tailored 4-week algorithmic study progression focused on strengthening high-impact knowledge gaps in ${priorityTopics.map((t) => t.topicName).join(", ")}.`;

    // Save or update roadmap
    const createdRoadmap = await prisma.roadmap.create({
      data: {
        userId,
        title: roadmapTitle,
        targetCompany,
        summary
      }
    });

    const itemsToCreate = priorityTopics.map((topic, index) => {
      const weekNumber = index + 1;
      const relatedProbs = topicProblems.filter((p) => p.topicId === topic.topicId);
      const probIds = relatedProbs.map((p) => p.id);

      return {
        roadmapId: createdRoadmap.id,
        topicId: topic.topicId,
        weekNumber,
        title: `Week ${weekNumber}: ${topic.topicName} Mastery Sprint`,
        description: `Focus on ${topic.topicName} invariants, pattern identification, and completing ${relatedProbs.length} targeted problems. Current mastery is ${topic.masteryScore}%.`,
        status: weekNumber === 1 ? "in_progress" : "pending",
        targetProblemIds: probIds
      };
    });

    for (const item of itemsToCreate) {
      await prisma.roadmapItem.create({ data: item });
    }

    return await prisma.roadmap.findUnique({
      where: { id: createdRoadmap.id },
      include: {
        items: {
          include: { topic: true },
          orderBy: { weekNumber: "asc" }
        }
      }
    });
  }

  async getLatestRoadmap(userId: string) {
    const roadmap = await prisma.roadmap.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { topic: true },
          orderBy: { weekNumber: "asc" }
        }
      }
    });

    if (!roadmap) {
      return null;
    }

    // Attach problem details for targetProblemIds
    const allProblemIds: string[] = [];
    for (const item of roadmap.items) {
      if (Array.isArray(item.targetProblemIds)) {
        allProblemIds.push(...(item.targetProblemIds as string[]));
      }
    }

    const problems = await prisma.problem.findMany({
      where: { id: { in: allProblemIds } },
      select: { id: true, title: true, difficulty: true, slug: true }
    });

    const problemMap = new Map(problems.map((p) => [p.id, p]));

    const enrichedItems = roadmap.items.map((item) => {
      const ids = Array.isArray(item.targetProblemIds) ? (item.targetProblemIds as string[]) : [];
      const linked = ids.map((id) => problemMap.get(id)).filter(Boolean);
      return {
        ...item,
        problems: linked
      };
    });

    return {
      ...roadmap,
      items: enrichedItems
    };
  }
}

export const roadmapService = new RoadmapService();
