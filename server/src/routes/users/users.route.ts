import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import { updateUserProfile } from "../../controllers/users.controller.js";

const router = Router();

// PATCH is used for partial updates to user profile
router.patch("/:userId/profile", authenticateToken, updateUserProfile);

export default router;
