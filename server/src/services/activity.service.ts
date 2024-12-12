import { PrismaClient, ProjectProposal, Prisma } from "@prisma/client";
import { ApiError } from "../utils/errors.js";
import { prisma } from "../lib/prisma.js";

export class ActivityService {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient = prisma) {
    this.prisma = prismaClient;
  }

  async createFromProposal(
    proposal: ProjectProposal,
    tx?: Prisma.TransactionClient
  ) {
    const prismaClient = tx || this.prisma;

    try {
      const activity = await prismaClient.activity.create({
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

      console.log(`✅ Activity created for proposal ${proposal.id}`);
      return activity;
    } catch (error) {
      console.error("❌ Error creating activity:", error);
      throw new ApiError(500, "Failed to create activity from proposal");
    }
  }
}
