import { Router } from "express";
import { getDepartmentReports } from "../../controllers/reports.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js"

const router = Router();

router.get("/banner-programs-per-department", authenticateToken, getDepartmentReports);

export default router;
