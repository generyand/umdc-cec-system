import { prisma } from "../lib/prisma.js";
import { addDays, isPast } from "date-fns";
import { sendEmail } from "../utils/email.js"; // You'll need to implement this
import cron from "node-cron";

export async function checkPendingApprovals() {
  try {
    // Test 1: Just get all proposals
    const test1 = await prisma.projectProposal.findMany();
    console.log("All proposals:", test1.length);

    // Test 2: Only filter by status
    const test2 = await prisma.projectProposal.findMany({
      where: {
        status: "PENDING",
      },
    });
    console.log("Pending proposals:", test2.length);

    // Test 3: Add approvals condition
    const test3 = await prisma.projectProposal.findMany({
      where: {
        status: "PENDING",
        approvals: {
          some: {
            status: "PENDING",
          },
        },
      },
    });
    console.log("Pending proposals with pending approvals:", test3.length);

    // Test 4: Full query with date check
    const test4 = await prisma.projectProposal.findMany({
      where: {
        status: "PENDING",
        approvals: {
          some: {
            status: "PENDING",
            updatedAt: {
              lt: addDays(new Date(), -0.001),
            },
          },
        },
      },
    });
    console.log("Final query result:", test4.length);

    // Log the date we're comparing against
    const compareDate = addDays(new Date(), -0.001);
    console.log("Checking for updates before:", compareDate);

    const pendingProposals = await prisma.projectProposal.findMany({
      where: {
        status: "PENDING",
        approvals: {
          some: {
            status: "PENDING",
            // Try a longer period for testing
            updatedAt: {
              lt: new Date(), // Remove the date check temporarily
            },
          },
        },
      },
      include: {
        approvals: {
          where: {
            status: "PENDING",
          },
          include: {
            approver: {
              select: {
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    console.log(pendingProposals);

    console.log("Found pending proposals:", pendingProposals.length);

    // Send notifications for each pending proposal
    for (const proposal of pendingProposals) {
      const currentApprover = proposal.approvals[0].approver;

      if (currentApprover?.email || "herajhinn@gmail.com") {
        await sendEmail({
          to: "kiedajhinn@gmail.com", // Your test email
          subject: "Action Required: Pending Proposal Review",
          body: `Dear Yow,

                A proposal has been awaiting your review for more than 3 days.

                Proposal Title: ${proposal.title}
                Submitted by: ${proposal.user.firstName} ${proposal.user.lastName}
                Submitted Date: ${proposal.createdAt}

                Please review this proposal at your earliest convenience.

                Best regards,
                System Administrator`,
        });

        console.log(`✅ Reminder sent to Yow`);
      }
    }
  } catch (error) {
    console.error("❌ Error checking pending approvals:", error);
  }
}

export const schedulePendingApprovalChecks = () => {
  cron.schedule("0 1 * * *", checkPendingApprovals);
};
