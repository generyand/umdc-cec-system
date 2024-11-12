import express from "express";
import helmet from "helmet";
import cors from "cors";
import { initializeConfig } from "./config/app.config.js";
import {
  testDatabaseConnection,
  setupGracefulShutdown,
} from "./services/startup.service.js";
import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.route.js";
// import { Server } from "http";

async function createServer() {
  // Initialize configuration
  const config = initializeConfig();
  console.log(`Current environment: ${config.nodeEnv}`);

  // Create Express app
  const app = express();

  // Basic middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Routes
  app.get("/health", (req, res) => {
    res.json({ status: "healthy" });
  });

  app.use("/api/auth", authRoutes);

  // Error handling middleware (should be last)
  app.use(errorHandler);

  return app;
}

async function bootstrap() {
  try {
    // Test database connection
    await testDatabaseConnection();

    // Create and configure the server
    const app = await createServer();
    const config = initializeConfig();

    const server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
    });

    // Setup graceful shutdown
    setupGracefulShutdown(server);
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
}

bootstrap();
