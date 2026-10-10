import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/codementor?schema=public",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  jwtSecret: process.env.JWT_SECRET || "codementor-super-secure-jwt-secret-key-32chars",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  aiApiKey: process.env.AI_API_KEY || "",
  aiModel: process.env.AI_MODEL || "gemini-1.5-flash",
  enableDockerJudge: process.env.ENABLE_DOCKER_JUDGE !== "false",
  judgeTimeoutMs: parseInt(process.env.JUDGE_TIMEOUT_MS || "3000", 10),
  judgeMemoryLimitMb: parseInt(process.env.JUDGE_MEMORY_LIMIT_MB || "128", 10)
};
