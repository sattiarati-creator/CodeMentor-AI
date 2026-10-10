import { prisma } from "../../config/database";
import { aiClient } from "./ai.client";

export interface HintRequest {
  problemId: string;
  problemTitle: string;
  problemDescription: string;
  constraints?: string;
  studentCode: string;
  errorOutput?: string;
  hintLevel: number; // 1 to 5
}

export class HintService {
  async getSocraticHint(req: HintRequest): Promise<{ level: number; title: string; content: string; isAiGenerated: boolean }> {
    const level = Math.max(1, Math.min(6, req.hintLevel || 1));

    // 1. Check if database has a curated Socratic hint for this problem and level
    if (req.problemId) {
      try {
        const dbHint = await prisma.hint.findUnique({
          where: {
            problemId_level: {
              problemId: req.problemId,
              level: level
            }
          }
        });
        if (dbHint) {
          return {
            level: dbHint.level,
            title: dbHint.title,
            content: dbHint.content,
            isAiGenerated: false
          };
        }
      } catch {}
    }

    // 2. Generate progressive hint via AI / Prompt Template
    const template = aiClient.loadPrompt("socratic-hint.prompt.txt");
    const prompt = aiClient.interpolatePrompt(template, {
      problemTitle: req.problemTitle,
      problemDescription: req.problemDescription,
      constraints: req.constraints || "None specified",
      studentCode: req.studentCode || "# No code provided yet",
      errorOutput: req.errorOutput || "None",
      hintLevel: level
    });

    const content = await aiClient.generateText(prompt, () => {
      switch (level) {
        case 1:
          return `Think carefully about the inputs and required outputs. For "${req.problemTitle}", what key conditions must hold true for an answer to be valid? Consider tracing with a small example on paper.`;
        case 2:
          return `Consider the structure of this problem: do you notice any repeated sub-computations, monotonic properties, or boundary limits that hint at a common pattern like Two Pointers, Sliding Window, or Dynamic Programming?`;
        case 3:
          return `What data structure allows you to query previously seen elements or maintain order with minimal time complexity? For instance, would a Hash Map provide O(1) lookups, or does a Stack preserve the right ordering?`;
        case 4:
          return `Plan your loop invariants: What state should you update at each iteration? Make sure to identify both the initialization step and the condition under which your search or accumulation terminates.`;
        case 5:
          return `Structured Pseudocode:\n1. Initialize data structures and pointers\n2. Iterate through input elements while maintaining your invariant\n3. Check target condition\n4. Return the aggregated result or terminate gracefully`;
        case 6:
          return `Full Solution Walkthrough (Explicit Request):\n\nApproach:\nAnalyze the problem constraints and maintain the appropriate state. Trace with optimal time and space complexity.\n\nCode Pattern:\n\`\`\`python\nimport sys\n\ndef solve():\n    # Process input according to problem constraints\n    pass\n\nif __name__ == '__main__':\n    solve()\n\`\`\`\n\nTake time to internalize the invariants and verify against edge cases before moving on to the next practice question.`;
        default:
          return "Start by breaking down the problem into smaller, testable sub-cases.";
      }
    });

    const titles = [
      "Level 1: Problem Comprehension",
      "Level 2: Pattern Recognition",
      "Level 3: Data Structure & Technique",
      "Level 4: Step-by-Step Approach",
      "Level 5: Structured Invariant / Pseudocode",
      "Level 6: Full Solution Walkthrough (Explicit Request)"
    ];

    return {
      level,
      title: titles[level - 1] || `Hint Level ${level}`,
      content: content.trim(),
      isAiGenerated: true
    };
  }
}

export const hintService = new HintService();
