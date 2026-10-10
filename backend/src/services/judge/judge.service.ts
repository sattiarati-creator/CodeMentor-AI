import { execSync } from "child_process";
import { config } from "../../config/env";
import { logger } from "../../utils/logger";
import { DockerJudgeRunner } from "./docker-runner";
import { LocalJudgeRunner } from "./local-runner";
import {
  ExecutionRequest,
  ExecutionVerdict,
  IJudgeRunner,
  RawExecutionResult,
  SubmissionResult,
  TestCaseEvaluation
} from "./judge.interface";

export class JudgeService {
  private runner: IJudgeRunner;
  private isDockerAvailable = false;

  constructor() {
    if (config.enableDockerJudge && process.env.NODE_ENV !== "test") {
      this.checkDockerSupport();
    }
    if (this.isDockerAvailable && config.enableDockerJudge) {
      logger.info(" Online Judge initialized with Docker container isolation");
      this.runner = new DockerJudgeRunner();
    } else {
      logger.info(" Online Judge initialized with local isolated Python runner");
      this.runner = new LocalJudgeRunner();
    }
  }

  private checkDockerSupport() {
    try {
      execSync("docker info", { stdio: "ignore", timeout: 2000 });
      this.isDockerAvailable = true;
    } catch {
      this.isDockerAvailable = false;
    }
  }

  /**
   * Run custom code against single custom input
   */
  async runCustomCode(code: string, input: string): Promise<RawExecutionResult & { verdict?: ExecutionVerdict }> {
    const res = await this.runner.execute({
      code,
      language: "python",
      input
    });

    let verdict: ExecutionVerdict = "Accepted";
    if (res.status === "COMPILATION_ERROR") {
      verdict = "Compilation Error";
    } else if (res.status === "RUNTIME_ERROR") {
      verdict = "Runtime Error";
    } else if (res.status === "TIMEOUT") {
      verdict = "Time Limit Exceeded";
    }

    return {
      ...res,
      verdict
    };
  }

  /**
   * Submit code against an array of test cases
   */
  async evaluateSubmission(
    code: string,
    testCases: Array<{ id?: string; input: string; expectedOutput: string; isSample: boolean; explanation?: string | null }>
  ): Promise<SubmissionResult> {
    const testCaseResults: TestCaseEvaluation[] = [];
    let passedCount = 0;
    let totalRuntime = 0;
    let peakMemory = 0;
    let overallVerdict: ExecutionVerdict = "Accepted";
    let firstFailed: TestCaseEvaluation | undefined;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const execRes = await this.runner.execute({
        code,
        language: "python",
        input: tc.input
      });

      totalRuntime += execRes.runtime_ms;
      if (execRes.memory_kb > peakMemory) {
        peakMemory = execRes.memory_kb;
      }

      let verdict: ExecutionVerdict;
      let passed = false;

      if (execRes.status === "COMPILATION_ERROR") {
        verdict = "Compilation Error";
      } else if (execRes.status === "RUNTIME_ERROR") {
        verdict = "Runtime Error";
      } else if (execRes.status === "TIMEOUT") {
        verdict = "Time Limit Exceeded";
      } else {
        // Compare normalized output
        const cleanActual = this.normalizeOutput(execRes.output);
        const cleanExpected = this.normalizeOutput(tc.expectedOutput);

        if (cleanActual === cleanExpected) {
          verdict = "Accepted";
          passed = true;
        } else {
          verdict = "Wrong Answer";
        }
      }

      const evaluation: TestCaseEvaluation = {
        testCaseIndex: i + 1,
        isSample: tc.isSample,
        passed,
        verdict,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: execRes.output,
        runtimeMs: execRes.runtime_ms,
        memoryKb: execRes.memory_kb,
        error: execRes.error
      };

      testCaseResults.push(evaluation);

      if (passed) {
        passedCount++;
      } else if (!firstFailed) {
        firstFailed = evaluation;
        overallVerdict = verdict;
      }
    }

    const avgRuntime = testCases.length > 0 ? Math.round((totalRuntime / testCases.length) * 100) / 100 : 0;

    return {
      verdict: overallVerdict,
      totalTestCases: testCases.length,
      passedTestCases: passedCount,
      runtimeMs: avgRuntime,
      memoryKb: Math.round(peakMemory * 100) / 100,
      testCaseResults,
      firstFailedTestCase: firstFailed
    };
  }

  private normalizeOutput(raw: string): string {
    return raw
      .replace(/\r\n/g, "\n")
      .trim()
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n");
  }
}

export const judgeService = new JudgeService();
