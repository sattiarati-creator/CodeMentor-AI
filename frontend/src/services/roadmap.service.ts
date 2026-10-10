import { api } from "./api";
import { Roadmap } from "../types";

export const roadmapService = {
  async getRoadmap(): Promise<Roadmap | null> {
    const res = await api.get("/roadmap");
    return res.data.data;
  },

  async generateRoadmap(targetCompany?: string): Promise<Roadmap> {
    const res = await api.post("/roadmap/generate", { targetCompany });
    return res.data.data;
  }
};
