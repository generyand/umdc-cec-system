import { Router } from "express";
import { getNotifications } from "@/controllers/notifications.controller.js";
import { authenticateToken } from "@/middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticateToken, getNotifications);

export default router;
