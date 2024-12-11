import { Request, Response, RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/errors.js";

// Get all proposals that need the current user's approval
export const getProposalsForApproval: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id; // From auth middleware
    console.log(`📃 Fetching proposals for approval by user: ${userId}`);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { position: true },
    });

    // First, check if user has a position
    if (!user?.position) {
      throw new ApiError(400, "User position not found");
    }

    const proposals = await prisma.projectProposal.findMany({
      where: {
        OR: [
          // Get proposals waiting for current user's approval
          {
            currentApprovalStep: user.position,
            status: "PENDING",
          },
          // Get proposals where user has already taken action
          {
            approvals: {
              some: {
                approverRole: user.position,
                approverUserId: userId,
              },
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            department: {
              select: {
                name: true,
              },
            },
          },
        },
        approvals: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(
      `✅ Successfully fetched ${proposals.length} proposals for approval`
    );
    res.status(200).json({
      success: true,
      message: "Proposals fetched successfully",
      data: proposals,
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
// export const approveProposal: RequestHandler = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;
//     const { comment } = req.body;
//     console.log(
//       `📝 Processing approval for proposal ID: ${id} by user: ${userId}`
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

//     // Start a transaction for the approval process
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
//           status: "APPROVED",
//           approverUserId: userId,
//           comment,
//           approvedAt: new Date(),
//         },
//       });

//       // Determine and set next approval step
//       const nextStep = getNextApprovalStep(user.position!);

//       if (nextStep) {
//         return prisma.projectProposal.update({
//           where: { id: proposal.id },
//           data: { currentApprovalStep: nextStep },
//         });
//       } else {
//         return prisma.projectProposal.update({
//           where: { id: proposal.id },
//           data: {
//             status: "APPROVED",
//             currentApprovalStep: user.position!,
//           },
//         });
//       }
//     });

//     console.log("✅ Successfully processed approval");
//     res.status(200).json({
//       success: true,
//       message: "Proposal approved successfully",
//       data: updatedProposal,
//     });
//   } catch (error) {
//     console.error("❌ Error processing approval:", error);
//     if (error instanceof ApiError) throw error;
//     throw new ApiError(500, "Failed to process approval");
//   }
// };

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
//     CEC_HEAD: "VP_DIRECTOR",
//     VP_DIRECTOR: "CHIEF_OPERATION_OFFICER",
//     CHIEF_OPERATION_OFFICER: null,
//   };
//   return flow[currentStep] || null;
// }
