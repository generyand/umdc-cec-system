import { Router } from "express";
import { bannerProgramsController } from "@/controllers/banner-programs.controller.js";
import { authenticateToken } from "@/middleware/auth.middleware.js";

const router = Router();

// Get all banner programs
router.get("/", authenticateToken, bannerProgramsController.getBannerPrograms);

// Get a specific banner program
router.get(
  "/:id",
  authenticateToken,
  bannerProgramsController.getBannerProgramById
);

// Create a new banner program
router.post(
  "/",
  authenticateToken,
  bannerProgramsController.createBannerProgram
);

// Update a banner program
router.put(
  "/:id",
  authenticateToken,
  bannerProgramsController.updateBannerProgram
);

// Delete/Archive a banner program
router.delete(
  "/:id",
  authenticateToken,
  bannerProgramsController.deleteBannerProgram
);

export default router;
