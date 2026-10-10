import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export function successResponse<T>(res: Response, data: T, message?: string, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

export function errorResponse(res: Response, message: string, statusCode = 400, errorDetail?: string) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errorDetail && { error: errorDetail })
  });
}
