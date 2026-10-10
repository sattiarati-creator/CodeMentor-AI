export type ExecutionVerdict =
  | "Accepted"
  | "Wrong Answer"
  | "Time Limit Exceeded"
  | "Runtime Error"
  | "Compilation Error";

export interface ExecutionRequest {
  code: string;
  language: "python";
  input?: string;
  timeoutMs?: number;
}

export interface RawExecutionResult {
  status: "SUCCESS" | "RUNTIME_ERROR" | "COMPILATION_ERROR" | "TIMEOUT";
  output: string;
  error?: string;
  runtime_ms: number;
  memory_kb: number;
}

export interface TestCaseEvaluation {
  testCaseIndex: number;
  isSample: boolean;
  passed: boolean;
  verdict: ExecutionVerdict;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  runtimeMs: number;
  memoryKb: number;
  error?: string;
}

export interface SubmissionResult {
  verdict: ExecutionVerdict;
  totalTestCases: number;
  passedTestCases: number;
  runtimeMs: number;
  memoryKb: number;
  testCaseResults: TestCaseEvaluation[];
  firstFailedTestCase?: TestCaseEvaluation;
}

export interface IJudgeRunner {
  execute(req: ExecutionRequest): Promise<RawExecutionResult>;
}
