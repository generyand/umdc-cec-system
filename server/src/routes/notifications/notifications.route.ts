import { Router } from "express";
import { getNotifications, markAllAsRead, markAsRead } from "@/controllers/notifications.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticateToken, getNotifications);
router.post("/mark-read", authenticateToken, markAsRead);
router.post("/mark-all-read", authenticateToken, markAllAsRead);

export default router;
