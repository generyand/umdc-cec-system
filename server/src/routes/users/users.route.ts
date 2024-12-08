import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import {
  updateUserProfile,
  getUsers,
  addUser,
  deleteUser,
} from "../../controllers/users.controller.js";

const router = Router();

// PATCH is used for partial updates to user profile
router.get("/", authenticateToken, getUsers);
router.patch("/:userId/profile", authenticateToken, updateUserProfile);
router.post("/", authenticateToken, addUser);
router.delete("/:userId", authenticateToken, deleteUser);

export default router;
