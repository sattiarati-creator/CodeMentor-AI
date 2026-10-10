import app from "./app";
import { config } from "./config/env";
import { connectDatabase } from "./config/database";
import { logger } from "./utils/logger";

async function startServer() {
  await connectDatabase();

  const server = app.listen(config.port, () => {
    logger.info(` CodeMentor AI Backend listening on port ${config.port}`);
    logger.info(` REST API: http://localhost:${config.port}/api`);
    logger.info(` Swagger Docs: http://localhost:${config.port}/api/docs`);
  });

  const shutdown = async () => {
    logger.info("Gracefully shutting down server...");
    server.close(() => {
      logger.info("HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

startServer();
