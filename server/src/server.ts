import express from "express";
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
import projectProposalsRoutes from "./routes/project-proposals/project-proposals.route.js";
import bannerProgramsRoutes from "./routes/banner-programs/banner-programs.route.js";
import activitiesRoutes from "./routes/activities/activities.route.js";
import partnerCommunitiesRoutes from "./routes/partner-communities/partner-communities.route.js";

async function createServer() {
  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ status: "healthy" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", usersRoutes);
  app.use("/api/departments", departmentsRoutes);
  app.use("/api/academic-programs", academicProgramsRoutes);
  app.use("/api/banner-programs", bannerProgramsRoutes);
  app.use("/api/project-proposals", projectProposalsRoutes);
  app.use("/api/activities", activitiesRoutes);
  app.use("/api/partner-communities", partnerCommunitiesRoutes);

  app.use(errorHandler);

  return app;
}

async function bootstrap() {
  try {
    await testDatabaseConnection();

    const app = await createServer();
    const config = initializeConfig();

    const server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
    });

    setupGracefulShutdown(server);
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
}

bootstrap();
