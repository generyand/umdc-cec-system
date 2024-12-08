import { Router } from "express";
import {
  createBannerProgram,
  deleteBannerProgram,
  getBannerProgramById,
  getBannerPrograms,
  updateBannerProgram,
} from "../../controllers/banner-programs.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

// Get all banner programs
router.get("/", authenticateToken, getBannerPrograms);

// Get a specific banner program
router.get("/:id", authenticateToken, getBannerProgramById);

// Create a new banner program
router.post("/", authenticateToken, createBannerProgram);

// Update a banner program
router.put("/:id", authenticateToken, updateBannerProgram);

// Delete/Archive a banner program
router.delete("/:id", authenticateToken, deleteBannerProgram);

export default router;
