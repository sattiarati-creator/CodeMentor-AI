import { api } from "./api";
import { Problem, Topic } from "../types";

export const problemService = {
  async listProblems(params?: { difficulty?: string; topic?: string; search?: string }): Promise<Problem[]> {
    const res = await api.get("/problems", { params });
    return res.data.data;
  },

  async getProblem(idOrSlug: string): Promise<Problem> {
    const res = await api.get(`/problems/${idOrSlug}`);
    return res.data.data;
  },

  async listTopics(): Promise<Topic[]> {
    const res = await api.get("/problems/topics");
    return res.data.data;
  }
};
