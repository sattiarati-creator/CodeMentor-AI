import { execFile, spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { ExecutionRequest, IJudgeRunner, RawExecutionResult } from "./judge.interface";
import { config } from "../../config/env";
import { logger } from "../../utils/logger";

export class DockerJudgeRunner implements IJudgeRunner {
  private runnerScriptPath: string;

  constructor() {
    this.runnerScriptPath = path.resolve(__dirname, "../../../../judge/runner.py");
  }

  async execute(req: ExecutionRequest): Promise<RawExecutionResult> {
    const timeoutMs = req.timeoutMs || config.judgeTimeoutMs;
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "codementor-docker-"));
    const solutionFile = path.join(tempDir, "solution.py");
    const inputFile = path.join(tempDir, "input.txt");
    const runnerCopy = path.join(tempDir, "runner.py");

    try {
      fs.writeFileSync(solutionFile, req.code, "utf-8");
      fs.writeFileSync(inputFile, req.input || "", "utf-8");

      if (fs.existsSync(this.runnerScriptPath)) {
        fs.copyFileSync(this.runnerScriptPath, runnerCopy);
      } else {
        throw new Error("Runner harness script not found at " + this.runnerScriptPath);
      }

      // Convert temp directory path for Docker volume mounting
      // Normalize Windows drive letter and backslashes if on Windows
      const mountPath = tempDir.replace(/\\/g, "/");

      const dockerArgs = [
        "run",
        "--rm",
        "--network", "none",
        "--memory", `${config.judgeMemoryLimitMb}m`,
        "--cpus", "0.5",
        "-v", `${mountPath}:/sandbox:ro`,
        "-w", "/sandbox",
        "python:3.11-alpine",
        "python", "runner.py", "solution.py", "input.txt"
      ];

      return await new Promise<RawExecutionResult>((resolve) => {
        let isTimedOut = false;
        const child = spawn("docker", dockerArgs);

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
            if (stderr.toLowerCase().includes("memory") || stderr.toLowerCase().includes("kill")) {
              resolve({
                status: "RUNTIME_ERROR",
                output: stdout,
                error: "Memory Limit Exceeded or Container Terminated",
                runtime_ms: timeoutMs,
                memory_kb: config.judgeMemoryLimitMb * 1024
              });
            } else {
              resolve({
                status: "RUNTIME_ERROR",
                output: stdout,
                error: stderr || `Process exited with code ${code}`,
                runtime_ms: 0,
                memory_kb: 0
              });
            }
          }
        });

        child.on("error", (err) => {
          clearTimeout(timer);
          logger.warn(`Docker execution error: ${err.message}`);
          resolve({
            status: "RUNTIME_ERROR",
            output: "",
            error: `Docker runner failed: ${err.message}`,
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
