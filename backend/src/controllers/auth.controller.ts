import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../config/database";
import { generateToken } from "../utils/jwt";
import { successResponse, errorResponse } from "../utils/response";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100)
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      });

      if (existingUser) {
        return errorResponse(res, "An account with this email already exists", 409);
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          passwordHash,
          role: "student"
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      });

      const token = generateToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role
      });

      return successResponse(
        res,
        { user: newUser, token },
        "Registration successful",
        201
      );
    } catch (error: any) {
      return errorResponse(res, error.message || "Registration failed", 500);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      });

      if (!user) {
        return errorResponse(res, "Invalid email or password", 401);
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return errorResponse(res, "Invalid email or password", 401);
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      const userProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      };

      return successResponse(
        res,
        { user: userProfile, token },
        "Login successful"
      );
    } catch (error: any) {
      return errorResponse(res, error.message || "Login failed", 500);
    }
  }

  async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, "Unauthorized", 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      });

      if (!user) {
        return errorResponse(res, "User not found", 404);
      }

      return successResponse(res, { user });
    } catch (error: any) {
      return errorResponse(res, error.message || "Failed to fetch profile", 500);
    }
  }
}

export const authController = new AuthController();
