import express from "express";
// import helmet from "helmet";
import cors from "cors";
import { initializeConfig } from "./config/app.config.js";
import {
  testDatabaseConnection,
  setupGracefulShutdown,
} from "./services/startup.service.js";
import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth/auth.route.js";
import usersRoutes from "./routes/users/users.route.js";
import departmentsRoutes from "./routes/departments/departments.route.js";
import academicProgramsRoutes from "./routes/academic-programs/academic-programs.route.js";
// import { Server } from "http";

async function createServer() {
  // Initialize configuration
  // const config = initializeConfig();
  // console.log(`Current environment: ${config.nodeEnv}`);

  // Create Express app
  const app = express();

  // Basic middleware
  // app.use(helmet());
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(express.json());

  // Routes
  app.get("/health", (req, res) => {
    res.json({ status: "healthy" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", usersRoutes);
  app.use("/api/departments", departmentsRoutes);
  app.use("/api/academic-programs", academicProgramsRoutes);

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
