import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { topicsData, problemsData } from "./seedData";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting CodeMentor AI database seeding...");

  // 1. Seed Topics
  console.log("Creating DSA Topics...");
  const topicMap = new Map<string, string>();
  for (const topic of topicsData) {
    const upserted = await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: { name: topic.name, description: topic.description, order: topic.order },
      create: {
        id: topic.id,
        name: topic.name,
        slug: topic.slug,
        description: topic.description,
        order: topic.order
      }
    });
    topicMap.set(topic.slug, upserted.id);
  }

  // 2. Seed Problems, TestCases, Hints
  console.log("Seeding 22 Problem Bank items, test cases, and Socratic hints...");
  for (const prob of problemsData) {
    const topicId = topicMap.get(prob.topicSlug);
    if (!topicId) continue;

    const upsertedProblem = await prisma.problem.upsert({
      where: { slug: prob.slug },
      update: {
        title: prob.title,
        difficulty: prob.difficulty,
        description: prob.description,
        inputFormat: prob.inputFormat,
        outputFormat: prob.outputFormat,
        constraints: prob.constraints,
        examples: prob.examples as any,
        starterCode: prob.starterCode,
        topicId: topicId,
        order: prob.order
      },
      create: {
        id: prob.id,
        title: prob.title,
        slug: prob.slug,
        difficulty: prob.difficulty,
        description: prob.description,
        inputFormat: prob.inputFormat,
        outputFormat: prob.outputFormat,
        constraints: prob.constraints,
        examples: prob.examples as any,
        starterCode: prob.starterCode,
        topicId: topicId,
        order: prob.order
      }
    });

    // Seed Test Cases
    await prisma.testCase.deleteMany({ where: { problemId: upsertedProblem.id } });
    for (const tc of prob.testCases) {
      await prisma.testCase.create({
        data: {
          problemId: upsertedProblem.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isSample: tc.isSample,
          explanation: tc.explanation || null
        }
      });
    }

    // Seed Hints
    await prisma.hint.deleteMany({ where: { problemId: upsertedProblem.id } });
    for (const hint of prob.hints) {
      await prisma.hint.create({
        data: {
          problemId: upsertedProblem.id,
          level: hint.level,
          title: hint.title,
          content: hint.content
        }
      });
    }
  }

  // 3. Seed Demo Users
  console.log("Creating Demo Users...");
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@codementor.ai" },
    update: { name: "Alex Chen (Placement Candidate)" },
    create: {
      id: "usr-demo-1",
      email: "demo@codementor.ai",
      name: "Alex Chen (Placement Candidate)",
      passwordHash: hashedPassword,
      role: "student"
    }
  });

  // 4. Seed Learning DNA for Demo User
  console.log("Seeding Learning DNA analytics...");
  const topicMasteryPresets: Record<string, { mastery: number; attempted: number; solved: number; hints: number; retries: number }> = {
    "arrays": { mastery: 88, attempted: 5, solved: 5, hints: 2, retries: 4 },
    "strings": { mastery: 82, attempted: 4, solved: 4, hints: 3, retries: 3 },
    "hashing": { mastery: 85, attempted: 4, solved: 4, hints: 1, retries: 2 },
    "two-pointers": { mastery: 78, attempted: 4, solved: 3, hints: 4, retries: 5 },
    "sliding-window": { mastery: 72, attempted: 3, solved: 2, hints: 5, retries: 6 },
    "stack": { mastery: 75, attempted: 3, solved: 3, hints: 2, retries: 2 },
    "queue": { mastery: 70, attempted: 2, solved: 2, hints: 1, retries: 1 },
    "linked-list": { mastery: 68, attempted: 3, solved: 2, hints: 4, retries: 5 },
    "binary-search": { mastery: 64, attempted: 4, solved: 2, hints: 6, retries: 7 },
    "trees": { mastery: 58, attempted: 5, solved: 2, hints: 7, retries: 9 },
    "graphs": { mastery: 45, attempted: 4, solved: 1, hints: 8, retries: 11 },
    "dynamic-programming": { mastery: 42, attempted: 6, solved: 1, hints: 12, retries: 15 }
  };

  for (const [slug, preset] of Object.entries(topicMasteryPresets)) {
    const tId = topicMap.get(slug);
    if (!tId) continue;
    await prisma.learningDNA.upsert({
      where: { userId_topicId: { userId: demoUser.id, topicId: tId } },
      update: {
        masteryScore: preset.mastery,
        problemsAttempted: preset.attempted,
        problemsSolved: preset.solved,
        hintsUsedCount: preset.hints,
        retriesCount: preset.retries
      },
      create: {
        userId: demoUser.id,
        topicId: tId,
        masteryScore: preset.mastery,
        problemsAttempted: preset.attempted,
        problemsSolved: preset.solved,
        hintsUsedCount: preset.hints,
        retriesCount: preset.retries
      }
    });
  }

  // 5. Seed Sample Submissions for Demo User
  console.log("Seeding sample submissions history...");
  const firstProblem = await prisma.problem.findUnique({ where: { slug: "target-sum-pair-finder" } });
  if (firstProblem) {
    await prisma.submission.create({
      data: {
        userId: demoUser.id,
        problemId: firstProblem.id,
        code: firstProblem.starterCode,
        language: "python",
        verdict: "Accepted",
        runtimeMs: 14.2,
        memoryKb: 512.0,
        passedTestCases: 4,
        totalTestCases: 4
      }
    });
  }

  // 6. Seed Company Readiness Scores
  console.log("Seeding Company Readiness benchmark scores...");
  const companies = [
    { name: "Google", score: 72, breakdown: { algorithmicRigor: 70, graphDepth: 55, systemThinking: 75, consistency: 85 } },
    { name: "Microsoft", score: 78, breakdown: { treeGraphCoverage: 72, arrayStringMastery: 85, edgeCaseHandling: 80, speed: 75 } },
    { name: "Amazon", score: 84, breakdown: { coreDSAMastery: 86, implementationSpeed: 88, behavioralSignals: 80, treeBreadth: 82 } },
    { name: "Meta", score: 69, breakdown: { speedInEasyMedium: 80, dpProficiency: 45, graphAlgorithms: 55, cleanCode: 85 } },
    { name: "Atlassian", score: 76, breakdown: { modularArchitecture: 80, dsaFoundations: 75, testCaseThinking: 78, clarity: 80 } },
    { name: "Adobe", score: 79, breakdown: { mathLogic: 82, stringsArrays: 85, dpGraphs: 60, timeComplexity: 80 } }
  ];

  for (const c of companies) {
    await prisma.companyScore.upsert({
      where: { userId_companyName: { userId: demoUser.id, companyName: c.name } },
      update: { score: c.score, breakdown: c.breakdown as any },
      create: {
        userId: demoUser.id,
        companyName: c.name,
        score: c.score,
        breakdown: c.breakdown as any
      }
    });
  }

  // 7. Seed Roadmap
  console.log("Seeding Personalized Roadmap...");
  const roadmap = await prisma.roadmap.create({
    data: {
      userId: demoUser.id,
      title: "Target FAANG Placement Sprint",
      targetCompany: "Google",
      summary: "Focus on bridging deep algorithmic knowledge gaps in Graphs and Dynamic Programming, while polishing Tree invariants.",
      items: {
        create: [
          {
            topicId: topicMap.get("graphs")!,
            weekNumber: 1,
            title: "Graph Fundamentals & Traversals",
            description: "Master Adjacency representations, BFS level-order, DFS connected components, and cycle detection in DAGs.",
            status: "in_progress",
            targetProblemIds: ["prob-14", "prob-15"] as any
          },
          {
            topicId: topicMap.get("trees")!,
            weekNumber: 2,
            title: "Binary Tree & BST Invariants",
            description: "Solidify BST properties, recursive range inheritance, and BFS level order processing.",
            status: "pending",
            targetProblemIds: ["prob-11", "prob-12", "prob-13"] as any
          },
          {
            topicId: topicMap.get("dynamic-programming")!,
            weekNumber: 3,
            title: "1D & 2D Dynamic Programming Patterns",
            description: "Overlapping subproblems, Memoization vs Tabulation, and Coin Change unbounded knapsack variants.",
            status: "pending",
            targetProblemIds: ["prob-16", "prob-17", "prob-18", "prob-19"] as any
          },
          {
            topicId: topicMap.get("sliding-window")!,
            weekNumber: 4,
            title: "Advanced Sliding Window & Monotonic Structures",
            description: "Monotonic deques, substring frequency windows, and boundary narrowing.",
            status: "pending",
            targetProblemIds: ["prob-6", "prob-21"] as any
          }
        ]
      }
    }
  });

  console.log("🎉 Seeding completed successfully!");
  console.log(`Demo user: demo@codementor.ai / Password123!`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
