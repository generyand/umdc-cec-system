import { Router } from "express";
import { checkPendingApprovals } from "../../jobs/checkPendingApprovals.js";

const router = Router();

router.post("/test-email-notifications", async (req, res) => {
  try {
    await checkPendingApprovals();
    res.json({ message: "Test notifications sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send test notifications" });
  }
});

export default router;
