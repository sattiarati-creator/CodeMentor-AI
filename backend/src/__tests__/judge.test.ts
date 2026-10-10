import { judgeService } from "../services/judge/judge.service";

describe("Online Judge Execution Service", () => {
  test("successfully executes valid Python code and captures output", async () => {
    const code = "print('Hello CodeMentor')";
    const result = await judgeService.runCustomCode(code, "");

    expect(result.status).toBe("SUCCESS");
    expect(result.output.trim()).toBe("Hello CodeMentor");
    expect(result.runtime_ms).toBeGreaterThanOrEqual(0);
  });

  test("handles syntax error as Compilation Error", async () => {
    const code = "def broken(\n  return 42";
    const result = await judgeService.runCustomCode(code, "");

    expect(result.status).toBe("COMPILATION_ERROR");
    expect(result.verdict).toBe("Compilation Error");
  });

  test("handles runtime exception (ZeroDivisionError) gracefully", async () => {
    const code = "print(10 / 0)";
    const result = await judgeService.runCustomCode(code, "");

    expect(result.status).toBe("RUNTIME_ERROR");
    expect(result.verdict).toBe("Runtime Error");
    expect(result.error).toContain("ZeroDivisionError");
  });

  test("evaluates test cases correctly against expected outputs", async () => {
    const code = `
import sys
x = int(sys.stdin.read().strip())
print(x * 2)
`;
    const testCases = [
      { input: "5", expectedOutput: "10", isSample: true },
      { input: "3", expectedOutput: "6", isSample: false }
    ];

    const submission = await judgeService.evaluateSubmission(code, testCases);
    expect(submission.verdict).toBe("Accepted");
    expect(submission.passedTestCases).toBe(2);
    expect(submission.totalTestCases).toBe(2);
  });

  test("correctly flags Wrong Answer when output differs", async () => {
    const code = "print('42')";
    const testCases = [
      { input: "", expectedOutput: "100", isSample: true }
    ];

    const submission = await judgeService.evaluateSubmission(code, testCases);
    expect(submission.verdict).toBe("Wrong Answer");
    expect(submission.passedTestCases).toBe(0);
    expect(submission.firstFailedTestCase).toBeDefined();
  });
});
