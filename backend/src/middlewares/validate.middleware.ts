import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { errorResponse } from "../utils/response";

export function validateBody(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ");
        return errorResponse(res, `Validation error: ${errorMessages}`, 400);
      }
      return errorResponse(res, "Invalid request payload", 400);
    }
  };
}
