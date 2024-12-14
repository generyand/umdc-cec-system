import { prisma } from "@/lib/prisma.js";

interface ProposalApprovalParams {
  proposal: {
    id: number;
    title: string;
    userId: string;
    departmentId: number;
  };
  approver: {
    id: string;
    position: string;
  };
  nextApprover?: {
    id: string;
    position: string;
  } | null;
}

interface CreateNotificationParams {
  title: string;
  content: string;
  type:
    | "PROPOSAL_STATUS"
    | "ACTIVITY_REMINDER"
    | "DEADLINE_ALERT"
    | "SYSTEM_UPDATE"
    | "ASSIGNMENT"
    | "DOCUMENT_UPDATE"
    | "FEEDBACK"
    | "COMMUNITY_UPDATE"
    | "RESOURCE_ALERT"
    | "COMPLIANCE";
  userId: string;
  priority?: "HIGH" | "MEDIUM" | "LOW";
  proposalId?: number;
  activityId?: number;
  departmentId?: number;
  academicProgramId?: number;
  bannerProgramId?: number;
  partnerCommunityId?: number;
  actionUrl?: string;
  actionLabel?: string;
  groupId?: string;
}

export class NotificationService {
  static async createNotification({
    title,
    content,
    type,
    userId,
    priority = "MEDIUM",
    proposalId,
    activityId,
    departmentId,
    academicProgramId,
    bannerProgramId,
    partnerCommunityId,
    actionUrl,
    actionLabel,
    groupId,
  }: CreateNotificationParams) {
    return await prisma.notification.create({
      data: {
        title,
        content,
        type,
        userId,
        priority,
        proposalId,
        activityId,
        departmentId,
        academicProgramId,
        bannerProgramId,
        partnerCommunityId,
        actionUrl,
        actionLabel,
        groupId,
      },
    });
  }

  static async createBulkNotifications(
    notifications: CreateNotificationParams[]
  ) {
    return await prisma.notification.createMany({
      data: notifications,
    });
  }

  // Predefined notification templates
  static async notifyProposalApproval({
    proposal,
    approver,
    nextApprover,
  }: ProposalApprovalParams) {
    // Notify proposal owner
    await this.createNotification({
      title: "Proposal Approved",
      content: `Your proposal "${proposal.title}" has been approved by ${approver.position}`,
      type: "PROPOSAL_STATUS",
      userId: proposal.userId,
      priority: "HIGH",
      proposalId: proposal.id,
      departmentId: proposal.departmentId,
    });

    // If there's a next approver, notify them
    if (nextApprover) {
      await this.createNotification({
        title: "Proposal Pending Review",
        content: `A proposal "${proposal.title}" requires your review`,
        type: "PROPOSAL_STATUS",
        userId: nextApprover.id,
        priority: "HIGH",
        proposalId: proposal.id,
        departmentId: proposal.departmentId,
      });
    }
  }
}
