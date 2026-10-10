import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

let prisma: PrismaClient;

declare global {
  var __prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
  }
  prisma = global.__prisma;
}

export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info(" Connected to database via Prisma");
    return true;
  } catch (error: any) {
    logger.warn(` Database connection notice: ${error.message}`);
    return false;
  }
}

export { prisma };
