import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import { getCurrentSchoolYear } from "../../controllers/school-years.controller.js";

const router = express.Router();

router.get("/", authenticateToken, getCurrentSchoolYear);

export default router;

