import { aiClient } from "./ai.client";

export interface FailureAnalysisRequest {
  problemTitle: string;
  difficulty: string;
  topic: string;
  studentCode: string;
  verdict: string;
  failedInput: string;
  expectedOutput: string;
  actualOutput: string;
}

export interface FailureAnalysisResponse {
  result: string;
  rootCause: string;
  edgeCasesToCheck: string[];
  complexityAnalysis: {
    currentEstimatedTime: string;
    currentEstimatedSpace: string;
    targetOptimalTime: string;
    targetOptimalSpace: string;
    explanation: string;
  };
  suggestedNextStep: string;
  disclaimer: string;
}

export class FailureAnalysisService {
  async analyzeFailure(req: FailureAnalysisRequest): Promise<FailureAnalysisResponse> {
    const template = aiClient.loadPrompt("failure-analyzer.prompt.txt");
    const prompt = aiClient.interpolatePrompt(template, {
      problemTitle: req.problemTitle,
      difficulty: req.difficulty,
      topic: req.topic,
      studentCode: req.studentCode,
      verdict: req.verdict,
      failedInput: req.failedInput || "N/A",
      expectedOutput: req.expectedOutput || "N/A",
      actualOutput: req.actualOutput || "N/A"
    });

    const disclaimer =
      "Note: The Online Judge establishes ground truth execution verdicts. AI diagnostics provide hypothesis and edge case guidance.";

    const rawResponse = await aiClient.generateText(prompt, () => {
      // Deterministic pedagogical heuristic analysis
      let rootCause = "The algorithm produced an output discrepancy compared to the expected test oracle.";
      let edgeCases = ["Empty or single-element inputs", "Duplicate elements", "Negative numbers or zero"];
      let curTime = "O(N²)";
      let curSpace = "O(1)";
      let targetTime = "O(N)";
      let targetSpace = "O(N)";
      let explanation = "Nested iteration over the input can be optimized to linear time using a hash table or two pointers.";

      if (req.verdict === "Time Limit Exceeded") {
        rootCause = "The submission exceeded the execution time limit (3000ms), likely due to an O(N²) or exponential time complexity on large test inputs.";
        curTime = "O(N²)";
        edgeCases = ["Large arrays (N >= 10^5)", "Worst-case skewed inputs", "Repeated nested scans"];
        explanation = "Replace repeated scans with a linear or logarithmic lookup technique (e.g., hash map, two pointers, binary search).";
      } else if (req.verdict === "Runtime Error") {
        rootCause = "The program terminated unexpectedly due to an unhandled exception (e.g. index out of bounds or null reference).";
        edgeCases = ["Empty inputs", "Arrays of length 1", "Odd vs even length lists"];
      } else if (req.failedInput && req.failedInput.includes("-")) {
        rootCause = "Your solution may assume non-negative numbers; negative numbers can invalidate greedy or prefix assertions.";
      } else if (req.actualOutput && req.actualOutput.length === 0) {
        rootCause = "The solution did not print any output to stdout, or returned before writing results.";
      }

      return JSON.stringify({
        result: req.verdict,
        rootCause,
        edgeCasesToCheck: edgeCases,
        complexityAnalysis: {
          currentEstimatedTime: curTime,
          currentEstimatedSpace: curSpace,
          targetOptimalTime: targetTime,
          targetOptimalSpace: targetSpace,
          explanation
        },
        suggestedNextStep: "Trace the first failing test case with pen and paper, focusing on loop boundary conditions and edge cases."
      });
    });

    try {
      // Clean JSON if fences were included
      const cleaned = rawResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);

      return {
        result: req.verdict,
        rootCause: parsed.rootCause || "Logic invariant failure on edge case.",
        edgeCasesToCheck: parsed.edgeCasesToCheck || [
          "Single-element input",
          "Duplicate values",
          "Extreme boundary values"
        ],
        complexityAnalysis: parsed.complexityAnalysis || {
          currentEstimatedTime: "O(N²)",
          currentEstimatedSpace: "O(1)",
          targetOptimalTime: "O(N)",
          targetOptimalSpace: "O(N)",
          explanation: "Use linear time scanning with state memoization or two pointers."
        },
        suggestedNextStep: parsed.suggestedNextStep || "Trace execution against the failing input manually.",
        disclaimer
      };
    } catch {
      return {
        result: req.verdict,
        rootCause: "Output mismatch on edge cases or boundary values.",
        edgeCasesToCheck: ["Empty input", "Duplicate values", "Negative numbers"],
        complexityAnalysis: {
          currentEstimatedTime: "O(N²)",
          currentEstimatedSpace: "O(1)",
          targetOptimalTime: "O(N)",
          targetOptimalSpace: "O(N)",
          explanation: "Consider using an optimal data structure to reduce time complexity."
        },
        suggestedNextStep: "Check loop termination conditions and compare with the expected output.",
        disclaimer
      };
    }
  }
}

export const failureAnalysisService = new FailureAnalysisService();
