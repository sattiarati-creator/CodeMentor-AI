import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import apiRoutes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import { config } from "./config/env";

const app = express();

// Security and middleware
app.use(helmet({
  contentSecurityPolicy: false // Allows Monaco editor workers and Swagger UI CDN
}));

app.use(cors({
  origin: "*", // Permissive for local dev / demo
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Swagger Documentation
try {
  let swaggerDocument;
  const devSwaggerPath = path.resolve(__dirname, "swagger.yaml");
  const prodSwaggerPath = path.resolve(__dirname, "../src/swagger.yaml");

  if (require("fs").existsSync(devSwaggerPath)) {
    swaggerDocument = YAML.load(devSwaggerPath);
  } else if (require("fs").existsSync(prodSwaggerPath)) {
    swaggerDocument = YAML.load(prodSwaggerPath);
  }

  if (swaggerDocument) {
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
} catch (e: any) {
  console.warn("Swagger spec loading notice:", e.message);
}

// API Routes
app.use("/api", apiRoutes);

// Root Welcome Endpoint
app.get("/", (req, res) => {
  res.json({
    name: "CodeMentor AI API",
    tagline: "Adaptive Coding Coach & Interview Intelligence Platform",
    version: "1.0.0",
    docs: "/api/docs",
    health: "/api/health"
  });
});

// Central Error Handler
app.use(errorHandler);

export default app;
