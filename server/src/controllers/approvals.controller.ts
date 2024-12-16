import { Request, Response, RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/errors.js";
import { getNextApprovalStep } from "../utils/approval.utils.js";
import { NotificationService } from "../services/notification.service.js";

// Get all proposals that need the current user's approval
export const getProposalsForApproval: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log(`📃 Fetching proposals for approval by user: ${userId}`);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { position: true },
    });

    if (!user?.position) {
      throw new ApiError(400, "User position not found");
    }

    // Different queries based on user position
    let whereCondition = {};

    switch (user.position) {
      case "CEC_HEAD":
        whereCondition = {
          OR: [
            // Pending proposals that need CEC Head's approval
            {
              currentApprovalStep: "CEC_HEAD",
              status: {
                in: ["PENDING", "RESUBMITTED"],
              },
            },
            // Proposals already approved by CEC Head
            {
              approvals: {
                some: {
                  approverPosition: "CEC_HEAD",
                  status: "APPROVED",
                  approverUserId: userId,
                },
              },
            },
          ],
        };
        break;

      case "VP_DIRECTOR":
        whereCondition = {
          OR: [
            // Pending proposals that need VP Director's approval
            {
              currentApprovalStep: "VP_DIRECTOR",
              status: {
                in: ["PENDING", "RESUBMITTED"],
              },
              approvals: {
                some: {
                  approverPosition: "CEC_HEAD",
                  status: "APPROVED",
                },
              },
            },
            // Proposals already approved by VP Director
            {
              approvals: {
                some: {
                  approverPosition: "VP_DIRECTOR",
                  status: "APPROVED",
                  approverUserId: userId,
                },
              },
            },
          ],
        };
        break;

      case "CHIEF_OPERATION_OFFICER":
        whereCondition = {
          OR: [
            // Pending proposals that need COO's approval
            {
              currentApprovalStep: "CHIEF_OPERATION_OFFICER",
              status: {
                in: ["PENDING", "RESUBMITTED"],
              },
              approvals: {
                some: {
                  approverPosition: "VP_DIRECTOR",
                  status: "APPROVED",
                },
              },
            },
            // Proposals already approved by COO
            {
              approvals: {
                some: {
                  approverPosition: "CHIEF_OPERATION_OFFICER",
                  status: "APPROVED",
                  approverUserId: userId,
                },
              },
            },
          ],
        };
        break;
      default:
        throw new ApiError(400, "User position not found");
    }

    const proposals = await prisma.projectProposal.findMany({
      where: whereCondition,
      select: {
        id: true,
        title: true,
        description: true,
        targetDate: true,
        budget: true,
        status: true,
        currentApprovalStep: true,
        createdAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            department: {
              select: { name: true },
            },
          },
        },
        approvals: {
          select: {
            approverPosition: true,
            status: true,
            comment: true,
            approvedAt: true,
            approver: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform the data for frontend use
    const simplifiedProposals = proposals.map((proposal) => ({
      id: proposal.id,
      title: proposal.title,
      description: proposal.description,
      targetDate: proposal.targetDate,
      budget: proposal.budget,
      status: proposal.status,
      currentStep: proposal.currentApprovalStep,
      createdAt: proposal.createdAt,
      submittedBy: {
        name: `${proposal.user.firstName} ${proposal.user.lastName}`,
        department: proposal.user.department?.name || "",
      },
      approvalFlow: proposal.approvals.map((approval) => ({
        role: approval.approverPosition,
        status: approval.status,
        comment: approval.comment,
        approvedAt: approval.approvedAt,
        approvedBy: approval.approver
          ? `${approval.approver.firstName} ${approval.approver.lastName}`
          : null,
      })),
    }));

    console.log(`✅ Successfully fetched ${proposals.length} proposals`);
    res.status(200).json({
      success: true,
      message: "Proposals fetched successfully",
      data: simplifiedProposals,
    });
  } catch (error) {
    console.error("❌ Error fetching proposals:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to fetch proposals");
  }
};

// // Approve a proposal
export const approveProposal: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { comment } = req.body;

    const existingProposal = await prisma.projectProposal.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProposal) {
      throw new ApiError(404, "Proposal not found");
    }

    // Allow approval if status is PENDING or RESUBMITTED
    if (
      existingProposal.status !== "PENDING" &&
      existingProposal.status !== "RESUBMITTED"
    ) {
      throw new ApiError(
        400,
        "Proposal cannot be approved in its current status"
      );
    }

    // 1. Get the proposal and check if it exists
    const proposal = await prisma.projectProposal.findUnique({
      where: { id: parseInt(id) },
      include: {
        approvals: true,
      },
    });

    if (!proposal) {
      console.log(`❌ Proposal with ID ${id} not found`);
      throw new ApiError(404, "Proposal not found");
    }

    // 2. Get user's position and verify authorization
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { position: true },
    });

    if (user?.position !== proposal.currentApprovalStep) {
      console.log("❌ User not authorized for this approval step");
      throw new ApiError(403, "Not authorized for this approval step");
    }

    // 3. Process the approval in a transaction
    const updatedProposal = await prisma.$transaction(async (prisma) => {
      // Update the current approval
      const updatedApproval = await prisma.projectApproval.update({
        where: {
          proposalId_approverPosition: {
            proposalId: proposal.id,
            approverPosition: user.position!,
          },
        },
        data: {
          status: "APPROVED",
          approverUserId: userId,
          comment,
          approvedAt: new Date(),
        },
      });

      console.log("🔍 Approval updated successfully", updatedApproval);

      // Determine and set next approval step
      const nextStep = getNextApprovalStep(user.position!);

      // After determining next step
      const result = await (async () => {
        if (!nextStep) {
          // Final approval case
          const approvedProposal = await prisma.projectProposal.update({
            where: { id: proposal.id },
            data: {
              status: "APPROVED",
              currentApprovalStep: user.position!,
            },
          });

          // Create activity
          await prisma.activity.create({
            data: {
              title: proposal.title,
              description: proposal.description,
              targetDate: proposal.targetDate,
              status: "UPCOMING",
              departmentId: proposal.departmentId,
              partnerCommunityId: proposal.communityId!,
              proposalId: proposal.id,
              bannerProgramId: proposal.bannerProgramId || undefined,
            },
          });

          // Create final approval notification
          await NotificationService.createNotification({
            title: "Proposal Fully Approved! 🎉",
            content: `Your proposal "${proposal.title}" has been fully approved and is now ready for implementation.`,
            type: "PROPOSAL_STATUS",
            userId: proposal.userId,
            priority: "HIGH",
            proposalId: proposal.id,
            departmentId: proposal.departmentId,
            actionUrl: `/staff/proposals/${proposal.id}`,
            actionLabel: "View Proposal",
          });

          console.log("🔍 Notification created successfully");

          return approvedProposal;
        } else {
          // Get the next approver(s) for notification
          const nextApprovers = await prisma.user.findMany({
            where: { position: nextStep },
            select: { id: true, firstName: true, lastName: true },
          });

          if (proposal.status === "RESUBMITTED") {
            const updatedProposal = await prisma.projectProposal.update({
              where: { id: proposal.id },
              data: {
                status: "PENDING",
                currentApprovalStep: user.position!,
              },
            });

            // Notify proposal owner of progress
            await NotificationService.createNotification({
              title: "Proposal Approved by Current Reviewer",
              content: `Your resubmitted proposal "${proposal.title}" has been approved by ${user.position}.`,
              type: "PROPOSAL_STATUS",
              userId: proposal.userId,
              priority: "HIGH",
              proposalId: proposal.id,
              departmentId: proposal.departmentId,
              actionUrl: `/staff/proposals/${proposal.id}`,
              actionLabel: "View Progress",
            });

            // Notify the same approver (not the next step)
            await NotificationService.createNotification({
              title: "Resubmitted Proposal Ready for Review",
              content: `The proposal "${proposal.title}" has been resubmitted and requires your review.`,
              type: "PROPOSAL_STATUS",
              userId: userId!,
              priority: "HIGH",
              proposalId: proposal.id,
              departmentId: proposal.departmentId,
              actionUrl: `/admin/community-engagement/project-proposals/${proposal.id}`,
              actionLabel: "Review Proposal",
            });

            return updatedProposal;
          } else {
            const updatedProposal = await prisma.projectProposal.update({
              where: { id: proposal.id },
              data: { currentApprovalStep: nextStep },
            });

            // Notify proposal owner of progress
            await NotificationService.createNotification({
              title: "Proposal Moves to Next Step",
              content: `Your proposal "${proposal.title}" has been approved by ${user.position} and moved to the next approval step.`,
              type: "PROPOSAL_STATUS",
              userId: proposal.userId,
              priority: "HIGH",
              proposalId: proposal.id,
              departmentId: proposal.departmentId,
              actionUrl: `/staff/proposals/${proposal.id}`,
              actionLabel: "View Progress",
            });

            // Notify next approvers
            await NotificationService.createBulkNotifications(
              nextApprovers.map((approver) => ({
                title: "New Proposal Needs Review",
                content: `A proposal "${proposal.title}" requires your review as ${nextStep}.`,
                type: "PROPOSAL_STATUS",
                userId: approver.id,
                priority: "HIGH",
                proposalId: proposal.id,
                departmentId: proposal.departmentId,
                actionUrl: `/admin/community-engagement/project-proposals/${proposal.id}`,
                actionLabel: "Review Proposal",
              }))
            );

            console.log("🔍 Notification created successfully");

            return updatedProposal;
          }
        }
      })();

      return result;
    });

    console.log("📊 Proposal updated:", updatedProposal);

    // 4. Get the updated proposal with all details
    const finalProposal = await prisma.projectProposal.findUnique({
      where: { id: proposal.id },
      select: {
        id: true,
        title: true,
        status: true,
        currentApprovalStep: true,
        approvals: {
          select: {
            approverPosition: true,
            status: true,
            comment: true,
            approvedAt: true,
            approver: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    console.log("✅ Successfully processed approval");
    res.status(200).json({
      success: true,
      message: "Proposal approved successfully",
      data: {
        id: finalProposal?.id,
        title: finalProposal?.title,
        status: finalProposal?.status,
        currentStep: finalProposal?.currentApprovalStep,
        approvalFlow: finalProposal?.approvals.map((approval) => ({
          role: approval.approverPosition,
          status: approval.status,
          comment: approval.comment,
          approvedAt: approval.approvedAt,
          approvedBy: approval.approver
            ? `${approval.approver.firstName} ${approval.approver.lastName}`
            : null,
        })),
      },
    });
  } catch (error) {
    console.error("❌ Error processing approval:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to process approval");
  }
};

export const returnProposal: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { comment } = req.body;

    console.log(`📝 Starting return process for proposal ID: ${id}`);
    console.log(`👤 User ID: ${userId}`);
    console.log(`💬 Return comment: ${comment}`);

    // 1. Validation
    if (!comment) {
      console.log("❌ Return failed: Comment is missing");
      throw new ApiError(400, "Comment is required when returning a proposal");
    }

    // 2. Get the proposal
    const proposal = await prisma.projectProposal.findUnique({
      where: { id: parseInt(id) },
      include: { 
        approvals: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        department: {
          select: {
            id: true,
            name: true
          }
        }
      },
    });

    if (!proposal) {
      console.log(`❌ Return failed: Proposal ${id} not found`);
      throw new ApiError(404, "Proposal not found");
    }
    console.log(`📋 Found proposal: ${proposal.title}`);

    // 3. Get user's position and verify
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { position: true },
    });

    console.log(`👤 User position: ${user?.position}`);
    console.log(`🔍 Current approval step: ${proposal.currentApprovalStep}`);

    if (user?.position !== proposal.currentApprovalStep) {
      console.log(`❌ Return failed: User not authorized for this step`);
      console.log(
        `Expected: ${proposal.currentApprovalStep}, Got: ${user?.position}`
      );
      throw new ApiError(403, "Not authorized for this approval step");
    }

    // 4. Process return in transaction
    console.log("🔄 Starting return transaction...");
    const returnedProposal = await prisma.$transaction(async (prisma) => {
      // First, verify the current step hasn't changed
      const currentProposal = await prisma.projectProposal.findUnique({
        where: { id: parseInt(id) },
        select: { currentApprovalStep: true },
      });

      if (currentProposal?.currentApprovalStep !== user?.position) {
        throw new ApiError(400, "Approval step has changed");
      }

      // Update approval record for the current step only
      console.log("📝 Updating approval record...");
      await prisma.projectApproval.update({
        where: {
          proposalId_approverPosition: {
            proposalId: proposal.id,
            approverPosition: user.position,
          },
        },
        data: {
          status: "RETURNED",
          approverUserId: userId!,
          comment,
          approvedAt: new Date(),
        },
      });
      console.log("✅ Approval record updated");

      // Create notification for the proposal owner
      await prisma.notification.create({
        data: {
          title: "Proposal Returned for Revision",
          content: `Your proposal "${proposal.title}" has been returned by ${user?.position} for revision. Comment: ${comment}`,
          type: "PROPOSAL_STATUS",
          priority: "HIGH",
          status: "UNREAD",
          userId: proposal.user.id,
          proposalId: proposal.id,
          departmentId: proposal.departmentId,
          actionUrl: `/staff/proposals/${proposal.id}`,
          actionLabel: "View Proposal",
          groupId: `proposal-${proposal.id}-return`,
        },
      });

      // Update proposal status while explicitly keeping the same approval step
      console.log("📝 Updating proposal status...");
      return await prisma.projectProposal.update({
        where: { id: proposal.id },
        data: {
          status: "RETURNED",
          currentApprovalStep: currentProposal.currentApprovalStep, // Explicitly set to keep the same step
        },
      });
    });
    console.log("✅ Return transaction completed");

    // 5. Get final state
    console.log("🔍 Fetching final proposal state...");
    const finalProposal = await prisma.projectProposal.findUnique({
      where: { id: proposal.id },
      select: {
        id: true,
        title: true,
        status: true,
        currentApprovalStep: true,
        approvals: {
          select: {
            approverPosition: true,
            status: true,
            comment: true,
            approvedAt: true,
            approver: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    console.log("📊 Final proposal state:", {
      id: finalProposal?.id,
      title: finalProposal?.title,
      status: finalProposal?.status,
      currentStep: finalProposal?.currentApprovalStep,
    });

    console.log("✅ Return process completed successfully");

    res.status(200).json({
      success: true,
      message: "Proposal returned successfully",
      data: {
        id: finalProposal?.id,
        title: finalProposal?.title,
        status: finalProposal?.status,
        returnedBy: {
          role: user?.position,
          comment: comment,
        },
        approvalFlow: finalProposal?.approvals.map((approval) => ({
          role: approval.approverPosition,
          status: approval.status,
          comment: approval.comment,
          actionDate: approval.approvedAt,
          actionBy: approval.approver
            ? `${approval.approver.firstName} ${approval.approver.lastName}`
            : null,
        })),
      },
    });
  } catch (error) {
    console.error("❌ Error returning proposal:", error);
    console.error("Error details:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to return proposal");
  }
};
