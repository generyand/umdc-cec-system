import { Request, Response, RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/errors.js";
import { getNextApprovalStep } from "../utils/approval.utils.js";

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

// Get specific proposal approval details
// export const getProposalApprovalById: RequestHandler = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log(`📃 Fetching approval details for proposal ID: ${id}`);

//     const proposal = await prisma.projectProposal.findUnique({
//       where: { id: parseInt(id) },
//       include: {
//         user: {
//           select: {
//             firstName: true,
//             lastName: true,
//             department: {
//               select: {
//                 name: true,
//               },
//             },
//           },
//         },
//         approvals: {
//           include: {
//             approver: {
//               select: {
//                 firstName: true,
//                 lastName: true,
//                 position: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!proposal) {
//       console.log(`❌ Proposal with ID ${id} not found`);
//       throw new ApiError(404, "Proposal not found");
//     }

//     console.log("✅ Successfully fetched proposal details");
//     res.status(200).json({
//       success: true,
//       message: "Proposal details fetched successfully",
//       data: proposal,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching proposal details:", error);
//     if (error instanceof ApiError) throw error;
//     throw new ApiError(500, "Failed to fetch proposal details");
//   }
// };

// // Get approval history for a proposal
// export const getApprovalHistory: RequestHandler = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log(`📃 Fetching approval history for proposal ID: ${id}`);

//     const approvalHistory = await prisma.projectApproval.findMany({
//       where: { proposalId: parseInt(id) },
//       include: {
//         approver: {
//           select: {
//             firstName: true,
//             lastName: true,
//             position: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "asc",
//       },
//     });

//     console.log("✅ Successfully fetched approval history");
//     res.status(200).json({
//       success: true,
//       message: "Approval history fetched successfully",
//       data: approvalHistory,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching approval history:", error);
//     if (error instanceof ApiError) throw error;
//     throw new ApiError(500, "Failed to fetch approval history");
//   }
// };

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

      // If there's no next step, this is the final approval
      if (!nextStep) {
        // First update the proposal status
        const approvedProposal = await prisma.projectProposal.update({
          where: { id: proposal.id },
          data: {
            status: "APPROVED",
            currentApprovalStep: user.position!,
          },
        });

        // Then create the activity
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

        console.log("✅ Activity created for approved proposal:", proposal.id);
        return approvedProposal;
      } else {
        // If there are more approval steps, just update the current step
        return await prisma.projectProposal.update({
          where: { id: proposal.id },
          data: { currentApprovalStep: nextStep },
        });
      }
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
      include: { approvals: true },
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
          approverUserId: userId,
          comment,
          approvedAt: new Date(),
        },
      });
      console.log("✅ Approval record updated");

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
