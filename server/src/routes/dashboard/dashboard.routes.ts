import express from "express";
import { getDashboardStats, getDashboardOverview } from "../../controllers/dashboard.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", authenticateToken, getDashboardStats);
router.get("/overview", authenticateToken, getDashboardOverview);

export default router; 