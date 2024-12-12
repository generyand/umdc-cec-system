import {
  PrismaClient,
  ProjectProposal,
  UserPosition,
  ApprovalStatus,
  Prisma,
} from "@prisma/client";
import { ApiError } from "../utils/errors.js";
import { prisma } from "../lib/prisma.js";
import { ActivityService } from "./activity.service.js";

interface ApprovalData {
  proposalId: number;
  userId: string;
  comment?: string;
}

export class ProposalService {
  private prisma: PrismaClient;
  private activityService: ActivityService;

  constructor(prismaClient: PrismaClient = prisma) {
    this.prisma = prismaClient;
    this.activityService = new ActivityService(prismaClient);
  }

  // Helper method to check if user can approve
  private async validateApprover(userId: string, proposal: ProjectProposal) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { position: true },
    });

    if (!user?.position) {
      throw new ApiError(400, "User position not found");
    }

    if (user.position !== proposal.currentApprovalStep) {
      throw new ApiError(403, "Not authorized for this approval step");
    }

    return user;
  }

  // Helper to determine next approval step
  private getNextApprovalStep(currentStep: UserPosition): UserPosition | null {
    const flow: Record<UserPosition, UserPosition | null> = {
      CEC_HEAD: "VP_DIRECTOR",
      VP_DIRECTOR: "CHIEF_OPERATION_OFFICER",
      CHIEF_OPERATION_OFFICER: null,
      // Add other positions with null as they're not part of approval flow
      CEC_OFFICE_ASSISTANT: null,
      CEC_COORDINATOR: null,
      DEAN: null,
      PROGRAM_HEAD: null,
      FOCAL_PERSON: null,
    };

    return flow[currentStep];
  }

  // Main approval method (we'll implement this next)
  async approveProposal(data: ApprovalData) {
    const { proposalId, userId, comment } = data;

    // 1. Get proposal and validate it exists
    const proposal = await this.prisma.projectProposal.findUnique({
      where: { id: proposalId },
      include: {
        approvals: true,
      },
    });

    if (!proposal) {
      throw new ApiError(404, "Proposal not found");
    }

    // 2. Validate user can approve
    const user = await this.validateApprover(userId, proposal);

    // 3. Process approval in transaction
    return await this.prisma.$transaction(async (tx) => {
      // Update current approval
      const updatedApproval = await tx.projectApproval.update({
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

      // Get next step in approval flow
      const nextStep = this.getNextApprovalStep(user.position!);

      // If no next step, proposal is fully approved
      if (!nextStep) {
        // Update proposal to approved status
        const approvedProposal = await tx.projectProposal.update({
          where: { id: proposal.id },
          data: {
            status: "APPROVED",
            currentApprovalStep: user.position!,
          },
        });

        // Create activity using ActivityService with transaction client
        await this.activityService.createFromProposal(approvedProposal, tx);

        return approvedProposal;
      }

      // If there is a next step, update to next approver
      return await tx.projectProposal.update({
        where: { id: proposal.id },
        data: { currentApprovalStep: nextStep },
      });
    });
  }
}
