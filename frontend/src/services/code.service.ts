import { api } from "./api";
import { RunResult, SubmitResult } from "../types";

export const codeService = {
  async runCode(code: string, input: string): Promise<RunResult> {
    const res = await api.post("/code/run", { code, input });
    return res.data.data;
  },

  async submitCode(problemId: string, code: string, hintsUsed: number = 0): Promise<SubmitResult> {
    const res = await api.post("/code/submit", { problemId, code, hintsUsed });
    return res.data.data;
  }
};
