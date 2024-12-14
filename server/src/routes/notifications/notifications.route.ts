import { Router } from "express";
import { getNotifications } from "@/controllers/notifications.controller.js";

const router = Router();

router.get("/", getNotifications);

export default router;
