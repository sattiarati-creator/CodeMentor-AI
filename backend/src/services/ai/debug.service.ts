import { aiClient } from "./ai.client";

export interface DebugRequest {
  problemTitle: string;
  problemDescription: string;
  studentCode: string;
  testInput: string;
  expectedOutput: string;
  actualOutput: string;
}

export interface DebugResponse {
  likelyCategory: string;
  guidance: string;
  questionsToConsider: string[];
  suggestedCheck: string;
}

export class DebugService {
  async debugCode(req: DebugRequest): Promise<DebugResponse> {
    const template = aiClient.loadPrompt("debug-tutor.prompt.txt");
    const prompt = aiClient.interpolatePrompt(template, {
      problemTitle: req.problemTitle,
      problemDescription: req.problemDescription,
      studentCode: req.studentCode,
      testInput: req.testInput,
      expectedOutput: req.expectedOutput,
      actualOutput: req.actualOutput
    });

    const aiText = await aiClient.generateText(prompt, () => {
      // Heuristic analysis of student code & error
      const code = req.studentCode || "";
      const actual = req.actualOutput || "";

      if (actual.includes("IndexError") || actual.includes("out of range")) {
        return "Category: Loop Boundary Condition\nIt looks like an index is exceeding array bounds. Check your loop termination condition (e.g. `len - 1` vs `len`) and any pointer increments inside inner loops.";
      }
      if (actual.includes("KeyError")) {
        return "Category: Missing Key Access\nYou are trying to access a dictionary key before verifying its presence. Use `.get(key)` or verify `if key in dict` first.";
      }
      if (actual.includes("RecursionError")) {
        return "Category: Missing or Faulty Base Case\nYour recursive function does not reach a terminating condition, causing a stack overflow. Ensure your base case triggers before recursive calls.";
      }
      if (actual.includes("TypeError: 'NoneType'")) {
        return "Category: Null / None Pointer Dereference\nYou are attempting to access `.next` or an attribute on a node that is None. Add a guard check `while curr and curr.next:`.";
      }

      return "Category: Logic or Edge Case Oversight\nReview how your algorithm updates state across iterations. Verify that boundary values (empty input, single elements, or duplicate values) do not prematurely terminate or corrupt the calculation.";
    });

    return {
      likelyCategory: this.extractCategory(aiText),
      guidance: aiText,
      questionsToConsider: [
        "Does your loop index stay strictly within [0, len - 1]?",
        "How does your algorithm behave when the input contains duplicates or negative numbers?",
        "Are your accumulator variables initialized with the right identity value (e.g. 0, -inf, 1)?"
      ],
      suggestedCheck: "Print the intermediate variable values right before the calculation returns to trace the mismatch."
    };
  }

  private extractCategory(text: string): string {
    const match = text.match(/Category:\s*([^\n\r]+)/i);
    return match ? match[1].trim() : "Boundary or State Invariant";
  }
}

export const debugService = new DebugService();
