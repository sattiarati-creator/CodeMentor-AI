import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { errorResponse } from "../utils/response";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(`Unhandled error on ${req.method} ${req.url}:`, err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error occurred.";

  const isDev = process.env.NODE_ENV !== "production";
  return errorResponse(res, message, statusCode, isDev ? err.stack : undefined);
}
