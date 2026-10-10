import { api } from "./api";
import { SocraticHintResponse, DebugResponse, FailureAnalysisResponse } from "../types";

export const aiService = {
  async getHint(data: {
    problemId?: string;
    problemTitle: string;
    problemDescription?: string;
    constraints?: string;
    studentCode?: string;
    errorOutput?: string;
    hintLevel: number;
  }): Promise<SocraticHintResponse> {
    const res = await api.post("/ai/hint", data);
    return res.data.data;
  },

  async getDebugGuidance(data: {
    problemTitle: string;
    problemDescription?: string;
    studentCode: string;
    testInput?: string;
    expectedOutput?: string;
    actualOutput?: string;
  }): Promise<DebugResponse> {
    const res = await api.post("/ai/debug", data);
    return res.data.data;
  },

  async analyzeFailure(data: {
    problemTitle: string;
    difficulty?: string;
    topic?: string;
    studentCode?: string;
    verdict: string;
    failedInput?: string;
    expectedOutput?: string;
    actualOutput?: string;
  }): Promise<FailureAnalysisResponse> {
    const res = await api.post("/ai/analyze-failure", data);
    return res.data.data;
  }
};
