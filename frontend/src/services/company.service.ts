import { api } from "./api";
import { CompanyReadinessProfile } from "../types";

export const companyService = {
  async getReadiness(): Promise<CompanyReadinessProfile[]> {
    const res = await api.get("/company/readiness");
    return res.data.data;
  }
};
