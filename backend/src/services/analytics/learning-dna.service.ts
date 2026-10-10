import { prisma } from "../../config/database";

export interface TopicMasteryDetail {
  topicId: string;
  topicName: string;
  topicSlug: string;
  masteryScore: number; // 0 to 100
  problemsAttempted: number;
  problemsSolved: number;
  hintsUsedCount: number;
  retriesCount: number;
  status: "Mastered" | "Proficient" | "Needs Practice" | "Critical Gap";
  prerequisites?: string[];
  recommendedProblems?: Array<{ id: string; title: string; difficulty: string; slug: string }>;
}

export interface LearningDnaSummary {
  overallScore: number;
  methodology: string;
  topics: TopicMasteryDetail[];
  strongestTopics: TopicMasteryDetail[];
  weakestTopics: TopicMasteryDetail[];
  criticalGaps: Array<{ topic: string; score: number; advice: string; prerequisites: string[] }>;
}

export class LearningDnaService {
  private topicPrerequisitesMap: Record<string, string[]> = {
    "graphs": ["Breadth-First Search (BFS)", "Depth-First Search (DFS)", "Adjacency Lists & Matrix Representation", "Queue & Recursion"],
    "trees": ["Binary Tree Node Traversal", "Recursion Invariants", "Stack & Queue mechanics"],
    "dynamic-programming": ["Recursion & Memoization", "Subproblem Overlap", "1D State Formulation", "Space Optimization"],
    "binary-search": ["Sorted Array Invariants", "Two Pointers", "Floor / Ceil Boundary Arithmetic"],
    "sliding-window": ["Two Pointers", "Hash Map Frequency Counting", "Window Expansion/Shrinking"],
    "linked-list": ["Pointer Operations", "Dummy Head Technique", "Floyd's Tortoise & Hare"],
    "stack": ["LIFO Invariant", "Monotonic Stack Pattern", "Parentheses Balancing"],
    "queue": ["FIFO Invariant", "Deque Operations", "BFS Level Processing"],
    "hashing": ["Hash Tables", "Collision Handling Concepts", "O(1) Set Membership"],
    "two-pointers": ["Sorted Array Scanning", "Left/Right Invariants", "In-place Array Swaps"],
    "strings": ["Character Encodings", "Prefixes & Suffixes", "Palindrome Invariants"],
    "arrays": ["Index Arithmetic", "Contiguous Subarrays", "Prefix Sum Arrays"]
  };

  /**
   * Transparent Heuristic Formula:
   * Mastery = clamp(0, 100,
   *   (solvedRatio * 65) +
   *   (difficultyBonus * 25) -
   *   (hintsPenalty * 2) -
   *   (retriesPenalty * 1.5)
   * )
   */
  calculateMasteryScore(attempted: number, solved: number, hintsUsed: number, retries: number): number {
    if (attempted === 0) return 0;

    const solvedRatio = Math.min(1.0, solved / Math.max(1, attempted));
    let baseScore = solvedRatio * 65;

    // Volume/Difficulty scaling
    const volumeBonus = Math.min(25, solved * 5);
    const hintsDeduction = Math.min(15, hintsUsed * 1.5);
    const retriesDeduction = Math.min(15, Math.max(0, retries - solved) * 1.0);

    const calculated = baseScore + volumeBonus - hintsDeduction - retriesDeduction;
    return Math.round(Math.min(100, Math.max(0, calculated)) * 10) / 10;
  }

  async getUserLearningDna(userId: string): Promise<LearningDnaSummary> {
    const allTopics = await prisma.topic.findMany({
      orderBy: { order: "asc" },
      include: {
        problems: {
          select: { id: true, title: true, difficulty: true, slug: true }
        }
      }
    });

    const userDnaRecords = await prisma.learningDNA.findMany({
      where: { userId }
    });

    const dnaMap = new Map(userDnaRecords.map((d) => [d.topicId, d]));

    const topicDetails: TopicMasteryDetail[] = allTopics.map((topic) => {
      const record = dnaMap.get(topic.id);
      const attempted = record?.problemsAttempted || 0;
      const solved = record?.problemsSolved || 0;
      const hints = record?.hintsUsedCount || 0;
      const retries = record?.retriesCount || 0;
      const score = record?.masteryScore ?? this.calculateMasteryScore(attempted, solved, hints, retries);

      let status: TopicMasteryDetail["status"] = "Needs Practice";
      if (score >= 80) status = "Mastered";
      else if (score >= 60) status = "Proficient";
      else if (score < 40) status = "Critical Gap";

      return {
        topicId: topic.id,
        topicName: topic.name,
        topicSlug: topic.slug,
        masteryScore: score,
        problemsAttempted: attempted,
        problemsSolved: solved,
        hintsUsedCount: hints,
        retriesCount: retries,
        status,
        prerequisites: this.topicPrerequisitesMap[topic.slug] || ["Core Programming Fundamentals"],
        recommendedProblems: topic.problems.slice(0, 3)
      };
    });

    // Sort by mastery
    const sorted = [...topicDetails].sort((a, b) => b.masteryScore - a.masteryScore);
    const strongestTopics = sorted.slice(0, 3);
    const weakestTopics = sorted.slice(-3).reverse();

    const criticalGaps = topicDetails
      .filter((t) => t.masteryScore < 60)
      .map((t) => ({
        topic: t.topicName,
        score: t.masteryScore,
        advice: `${t.topicName} fundamentals need reinforcement. Focus on understanding the core invariant before diving into Medium/Hard problems.`,
        prerequisites: t.prerequisites || []
      }));

    const totalScore = topicDetails.reduce((acc, t) => acc + t.masteryScore, 0);
    const overallScore = topicDetails.length > 0 ? Math.round((totalScore / topicDetails.length) * 10) / 10 : 0;

    return {
      overallScore,
      methodology:
        "Learning DNA evaluates your topic mastery on a transparent 0-100 scale based on: (1) Problem completion ratio [65% weight], (2) Problem volume & difficulty [25% weight], (3) Hint independence [-1.5 pts per hint], and (4) Retry efficiency [-1.0 pt per excess retry]. Scores reflect your readiness to solve unseen variants without assistance.",
      topics: topicDetails,
      strongestTopics,
      weakestTopics,
      criticalGaps
    };
  }

  async recordSubmissionEvent(
    userId: string,
    topicId: string,
    verdict: string,
    hintsUsed: number
  ): Promise<void> {
    const isAccepted = verdict === "Accepted";

    const current = await prisma.learningDNA.findUnique({
      where: { userId_topicId: { userId, topicId } }
    });

    const attempted = (current?.problemsAttempted || 0) + 1;
    const solved = (current?.problemsSolved || 0) + (isAccepted ? 1 : 0);
    const totalHints = (current?.hintsUsedCount || 0) + hintsUsed;
    const retries = (current?.retriesCount || 0) + (isAccepted ? 0 : 1);
    const newMastery = this.calculateMasteryScore(attempted, solved, totalHints, retries);

    await prisma.learningDNA.upsert({
      where: { userId_topicId: { userId, topicId } },
      update: {
        problemsAttempted: attempted,
        problemsSolved: solved,
        hintsUsedCount: totalHints,
        retriesCount: retries,
        masteryScore: newMastery
      },
      create: {
        userId,
        topicId,
        problemsAttempted: attempted,
        problemsSolved: solved,
        hintsUsedCount: totalHints,
        retriesCount: retries,
        masteryScore: newMastery
      }
    });
  }
}

export const learningDnaService = new LearningDnaService();
