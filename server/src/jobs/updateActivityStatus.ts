import { prisma } from "../lib/prisma.js";
import cron from "node-cron";

export const scheduleActivityStatusUpdates = () => {
  // Run at midnight every day
  cron.schedule("0 0 * * *", async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.activity.updateMany({
        where: {
          AND: [{ status: "UPCOMING" }, { targetDate: today }],
        },
        data: {
          status: "ONGOING",
        },
      });

      console.log("✅ Activity statuses updated successfully");
    } catch (error) {
      console.error("❌ Error updating activity statuses:", error);
    }
  });
};
