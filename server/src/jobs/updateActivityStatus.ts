import { prisma } from "../lib/prisma.js";
import { schedule } from "node-cron";

export const scheduleActivityStatusUpdates = () => {
  // Specify the timezone directly
  schedule(
    "0 0 * * *",
    async () => {
      try {
        const today = new Date();
        today.setUTCHours(16, 0, 0, 0); // 16:00 UTC = 00:00 Philippines time

        await prisma.activity.updateMany({
          where: {
            AND: [
              { status: "UPCOMING" },
              {
                targetDate: {
                  gte: today,
                  lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
              },
            ],
          },
          data: {
            status: "ONGOING",
          },
        });

        console.log("✅ Activity statuses updated successfully");
      } catch (error) {
        console.error("❌ Error updating activity statuses:", error);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Manila",
    }
  );
};
