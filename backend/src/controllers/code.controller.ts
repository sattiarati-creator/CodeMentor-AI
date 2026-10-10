import { Response } from "express";
import { z } from "zod";
import { prisma } from "../config/database";
import { judgeService } from "../services/judge/judge.service";
import { learningDnaService } from "../services/analytics/learning-dna.service";
import { successResponse, errorResponse } from "../utils/response";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const runCodeSchema = z.object({
  code: z.string().min(1, "Code cannot be empty").max(50000, "Code length exceeds limit"),
  language: z.enum(["python"]).default("python"),
  input: z.string().max(20000, "Input length exceeds limit").default("")
});

export const submitCodeSchema = z.object({
  problemId: z.string().min(1, "problemId is required"),
  code: z.string().min(1, "Code cannot be empty").max(50000, "Code length exceeds limit"),
  language: z.enum(["python"]).default("python"),
  hintsUsed: z.number().int().min(0).max(10).default(0)
});

export class CodeController {
  async runCode(req: AuthenticatedRequest, res: Response) {
    try {
      const { code, input } = req.body;
      const result = await judgeService.runCustomCode(code, input);

      return successResponse(res, result, "Code executed successfully");
    } catch (error: any) {
      return errorResponse(res, error.message || "Failed to execute code", 500);
    }
  }

  async submitCode(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, "You must be logged in to submit solutions", 401);
      }

      const { problemId, code, language, hintsUsed = 0 } = req.body;

      const problem = await prisma.problem.findUnique({
        where: { id: problemId },
        include: {
          testCases: true,
          topic: true
        }
      });

      if (!problem) {
        return errorResponse(res, "Problem not found", 404);
      }

      if (problem.testCases.length === 0) {
        return errorResponse(res, "No test cases configured for this problem", 400);
      }

      // Execute code against all test cases
      const evaluation = await judgeService.evaluateSubmission(code, problem.testCases);

      // Save submission to database
      const submission = await prisma.submission.create({
        data: {
          userId: req.user.userId,
          problemId: problem.id,
          code,
          language,
          verdict: evaluation.verdict,
          runtimeMs: evaluation.runtimeMs,
          memoryKb: evaluation.memoryKb,
          passedTestCases: evaluation.passedTestCases,
          totalTestCases: evaluation.totalTestCases,
          failedCaseDetails: evaluation.firstFailedTestCase ? (evaluation.firstFailedTestCase as any) : undefined
        }
      });

      // Update Learning DNA in background
      try {
        await learningDnaService.recordSubmissionEvent(
          req.user.userId,
          problem.topicId,
          evaluation.verdict,
          hintsUsed
        );
      } catch (dnaErr: any) {
        // Log but do not block submission response
        console.warn("Learning DNA update non-fatal error:", dnaErr.message);
      }

      return successResponse(
        res,
        {
          submissionId: submission.id,
          verdict: evaluation.verdict,
          passedTestCases: evaluation.passedTestCases,
          totalTestCases: evaluation.totalTestCases,
          runtimeMs: evaluation.runtimeMs,
          memoryKb: evaluation.memoryKb,
          testCaseResults: evaluation.testCaseResults.filter((tc) => tc.isSample), // Only expose sample details
          firstFailedTestCase: evaluation.firstFailedTestCase
            ? {
                verdict: evaluation.firstFailedTestCase.verdict,
                testCaseIndex: evaluation.firstFailedTestCase.testCaseIndex,
                isSample: evaluation.firstFailedTestCase.isSample,
                error: evaluation.firstFailedTestCase.error,
                // Only disclose input/output if it was a public sample test case
                input: evaluation.firstFailedTestCase.isSample ? evaluation.firstFailedTestCase.input : "[Hidden Test Case]",
                expectedOutput: evaluation.firstFailedTestCase.isSample ? evaluation.firstFailedTestCase.expectedOutput : "[Hidden Test Case]",
                actualOutput: evaluation.firstFailedTestCase.isSample ? evaluation.firstFailedTestCase.actualOutput : "[Hidden Output]"
              }
            : null
        },
        `Submission verdict: ${evaluation.verdict}`
      );
    } catch (error: any) {
      return errorResponse(res, error.message || "Submission processing failed", 500);
    }
  }
}

export const codeController = new CodeController();
