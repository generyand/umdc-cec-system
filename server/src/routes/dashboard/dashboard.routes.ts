import express from "express";
import { getAdminDashboardStats, getAdminDashboardOverview } from "../../controllers/dashboard.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", authenticateToken, getAdminDashboardStats);
router.get("/overview", authenticateToken, getAdminDashboardOverview);

export default router; 