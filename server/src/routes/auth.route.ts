import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema.js";
import {
  login,
  register,
  logout,
  resetPassword,
  refreshToken,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { rateLimit } from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});

const router = Router();

// Apply rate limiting to auth routes
router.use(authLimiter);

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", authenticateToken, logout);
router.post("/refresh-token", refreshToken);
router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  resetPassword
);

export default router;
