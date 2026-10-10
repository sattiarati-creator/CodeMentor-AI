import { hintService } from "../services/ai/hint.service";
import { debugService } from "../services/ai/debug.service";
import { failureAnalysisService } from "../services/ai/failure-analysis.service";

describe("AI Socratic & Failure Analysis Services", () => {
  test("generates progressive Socratic hints from Level 1 to Level 5 without spoiler", async () => {
    const hintL1 = await hintService.getSocraticHint({
      problemId: "",
      problemTitle: "Target Sum Pair Finder",
      problemDescription: "Find two numbers in array summing to target",
      studentCode: "def solve(): pass",
      hintLevel: 1
    });

    expect(hintL1.level).toBe(1);
    expect(hintL1.title).toContain("Level 1");
    expect(hintL1.content.length).toBeGreaterThan(15);
    // Should NOT contain a complete solution code snippet
    expect(hintL1.content).not.toContain("def solve():");

    const hintL3 = await hintService.getSocraticHint({
      problemId: "",
      problemTitle: "Target Sum Pair Finder",
      problemDescription: "Find two numbers in array summing to target",
      studentCode: "def solve(): pass",
      hintLevel: 3
    });
    expect(hintL3.level).toBe(3);
  });

  test("debug tutor provides actionable bug category and guidance", async () => {
    const debug = await debugService.debugCode({
      problemTitle: "Reverse String Vowels",
      problemDescription: "Reverse vowels",
      studentCode: "chars = list(s)\nprint(chars[999])",
      testInput: "hello",
      expectedOutput: "holle",
      actualOutput: "IndexError: list index out of range"
    });

    expect(debug.likelyCategory).toContain("Boundary");
    expect(debug.questionsToConsider.length).toBeGreaterThanOrEqual(1);
  });

  test("failure analyzer returns structured root cause and complexity gap", async () => {
    const analysis = await failureAnalysisService.analyzeFailure({
      problemTitle: "Maximum Subarray Sum",
      difficulty: "Medium",
      topic: "Dynamic Programming",
      studentCode: "for i in nums: for j in nums: pass",
      verdict: "Time Limit Exceeded",
      failedInput: "100000 integers",
      expectedOutput: "1500",
      actualOutput: "Timeout after 3000ms"
    });

    expect(analysis.result).toBe("Time Limit Exceeded");
    expect(analysis.rootCause).toBeDefined();
    expect(analysis.edgeCasesToCheck).toBeInstanceOf(Array);
    expect(analysis.complexityAnalysis.currentEstimatedTime).toBe("O(N²)");
    expect(analysis.complexityAnalysis.targetOptimalTime).toBe("O(N)");
    expect(analysis.disclaimer).toContain("Online Judge establishes ground truth");
  });
});
