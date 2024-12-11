import { Request, Response, RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/errors.js";

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
        // CEC Head sees all new pending proposals
        whereCondition = {
          currentApprovalStep: "CEC_HEAD",
          status: "PENDING",
        };
        break;

      case "VP_DIRECTOR":
        // VP Director only sees proposals approved by CEC Head
        whereCondition = {
          currentApprovalStep: "VP_DIRECTOR",
          status: "PENDING",
          approvals: {
            some: {
              approverRole: "CEC_HEAD",
              status: "APPROVED",
            },
          },
        };
        break;

      case "CHIEF_OPERATION_OFFICER":
        // Chief Operation Officer only sees proposals approved by VP Director
        whereCondition = {
          currentApprovalStep: "CHIEF_OPERATION_OFFICER",
          status: "PENDING",
          approvals: {
            some: {
              approverRole: "VP_DIRECTOR",
              status: "APPROVED",
            },
          },
        };
        break;
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
            approverRole: true,
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
        role: approval.approverRole,
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
    const { id } = req.params; // proposal ID
    const userId = req.user?.id;
    const { comment } = req.body;

    console.log(
      `📝 Processing approval for proposal ID: ${id} by user: ${userId}`
    );

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
      await prisma.projectApproval.update({
        where: {
          proposalId_approverRole: {
            proposalId: proposal.id,
            approverRole: user.position!,
          },
        },
        data: {
          status: "APPROVED",
          approverUserId: userId,
          comment,
          approvedAt: new Date(),
        },
      });

      // Determine and set next approval step
      const nextStep = getNextApprovalStep(user.position!);

      if (nextStep) {
        return prisma.projectProposal.update({
          where: { id: proposal.id },
          data: { currentApprovalStep: nextStep },
        });
      } else {
        // If no next step, mark proposal as fully approved
        return prisma.projectProposal.update({
          where: { id: proposal.id },
          data: {
            status: "APPROVED",
            currentApprovalStep: user.position!,
          },
        });
      }
    });

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
            approverRole: true,
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
          role: approval.approverRole,
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

// // Reject a proposal
// export const rejectProposal: RequestHandler = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;
//     const { comment } = req.body;
//     console.log(
//       `📝 Processing rejection for proposal ID: ${id} by user: ${userId}`
//     );

//     const proposal = await prisma.projectProposal.findUnique({
//       where: { id: parseInt(id) },
//       include: { approvals: true },
//     });

//     if (!proposal) {
//       console.log(`❌ Proposal with ID ${id} not found`);
//       throw new ApiError(404, "Proposal not found");
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { position: true },
//     });

//     if (user?.position !== proposal.currentApprovalStep) {
//       console.log("❌ User not authorized for this approval step");
//       throw new ApiError(403, "Not authorized for this approval step");
//     }

//     const updatedProposal = await prisma.$transaction(async (prisma) => {
//       // Update the current approval
//       await prisma.projectApproval.update({
//         where: {
//           proposalId_approverRole: {
//             proposalId: proposal.id,
//             approverRole: user.position!,
//           },
//         },
//         data: {
//           status: "REJECTED",
//           approverUserId: userId,
//           comment,
//           approvedAt: new Date(),
//         },
//       });

//       // Update proposal status to rejected
//       return prisma.projectProposal.update({
//         where: { id: proposal.id },
//         data: { status: "REJECTED" },
//       });
//     });

//     console.log("✅ Successfully processed rejection");
//     res.status(200).json({
//       success: true,
//       message: "Proposal rejected successfully",
//       data: updatedProposal,
//     });
//   } catch (error) {
//     console.error("❌ Error processing rejection:", error);
//     if (error instanceof ApiError) throw error;
//     throw new ApiError(500, "Failed to process rejection");
//   }
// };

// // Helper function to determine next approval step
// function getNextApprovalStep(currentStep: string): string | null {
//   const flow = {
//     'CEC_HEAD': 'VP_DIRECTOR',
//     'VP_DIRECTOR': 'CHIEF_OPERATION_OFFICER',
//     'CHIEF_OPERATION_OFFICER': null
//   };
//   return flow[currentStep] || null;
// }
