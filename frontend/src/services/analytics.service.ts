import { api } from "./api";
import { DashboardData, LearningDnaSummary } from "../types";

export const analyticsService = {
  async getDashboard(): Promise<DashboardData> {
    const res = await api.get("/analytics/dashboard");
    return res.data.data;
  },

  async getLearningDna(): Promise<LearningDnaSummary> {
    const res = await api.get("/analytics/learning-dna");
    return res.data.data;
  }
};
