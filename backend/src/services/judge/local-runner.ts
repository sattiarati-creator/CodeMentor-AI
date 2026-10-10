import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { ExecutionRequest, IJudgeRunner, RawExecutionResult } from "./judge.interface";
import { config } from "../../config/env";
import { logger } from "../../utils/logger";

export class LocalJudgeRunner implements IJudgeRunner {
  private runnerScriptPath: string;

  constructor() {
    this.runnerScriptPath = path.resolve(__dirname, "../../../../judge/runner.py");
  }

  async execute(req: ExecutionRequest): Promise<RawExecutionResult> {
    const timeoutMs = req.timeoutMs || config.judgeTimeoutMs;
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "codementor-local-"));
    const solutionFile = path.join(tempDir, "solution.py");
    const inputFile = path.join(tempDir, "input.txt");

    try {
      fs.writeFileSync(solutionFile, req.code, "utf-8");
      fs.writeFileSync(inputFile, req.input || "", "utf-8");

      return await new Promise<RawExecutionResult>((resolve) => {
        let isTimedOut = false;
        
        // Find python binary
        const pythonCmd = process.platform === "win32" ? "python" : "python3";
        const child = spawn(pythonCmd, [this.runnerScriptPath, solutionFile, inputFile], {
          cwd: tempDir,
          env: {
            PATH: process.env.PATH,
            PYTHONUNBUFFERED: "1"
          }
        });

        let stdout = "";
        let stderr = "";

        const timer = setTimeout(() => {
          isTimedOut = true;
          try {
            child.kill("SIGKILL");
          } catch {}
          resolve({
            status: "TIMEOUT",
            output: "",
            error: `Time Limit Exceeded (${timeoutMs}ms limit)`,
            runtime_ms: timeoutMs,
            memory_kb: 0
          });
        }, timeoutMs);

        child.stdout.on("data", (data) => {
          stdout += data.toString();
        });

        child.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        child.on("close", (code) => {
          clearTimeout(timer);
          if (isTimedOut) return;

          try {
            const parsed = JSON.parse(stdout.trim());
            resolve(parsed);
          } catch {
            resolve({
              status: "RUNTIME_ERROR",
              output: stdout,
              error: stderr || `Process failed with exit code ${code}`,
              runtime_ms: 0,
              memory_kb: 0
            });
          }
        });

        child.on("error", (err) => {
          clearTimeout(timer);
          logger.error(`Local runner process error: ${err.message}`);
          resolve({
            status: "RUNTIME_ERROR",
            output: "",
            error: `Failed to spawn Python process: ${err.message}`,
            runtime_ms: 0,
            memory_kb: 0
          });
        });
      });
    } finally {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {}
    }
  }
}
