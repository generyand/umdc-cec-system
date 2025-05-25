import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import { getCurrentSchoolYear, createSchoolYear } from "../../controllers/school-years.controller.js";

const router = express.Router();

router.get("/", authenticateToken, getCurrentSchoolYear);
router.post("/", authenticateToken, createSchoolYear);

export default router;

