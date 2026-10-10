import { Response } from "express";
import { companyReadinessService } from "../services/analytics/company-readiness.service";
import { successResponse, errorResponse } from "../utils/response";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class CompanyController {
  async getReadiness(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, "Unauthorized", 401);
      }

      const profiles = await companyReadinessService.getCompanyReadiness(req.user.userId);
      return successResponse(res, profiles);
    } catch (error: any) {
      return errorResponse(res, error.message || "Failed to retrieve company readiness metrics", 500);
    }
  }
}

export const companyController = new CompanyController();
