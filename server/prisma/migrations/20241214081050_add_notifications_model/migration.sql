-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PROPOSAL_STATUS', 'ACTIVITY_REMINDER', 'DEADLINE_ALERT', 'SYSTEM_UPDATE', 'ASSIGNMENT', 'DOCUMENT_UPDATE', 'FEEDBACK', 'COMMUNITY_UPDATE', 'RESOURCE_ALERT', 'COMPLIANCE');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "userId" TEXT NOT NULL,
    "proposalId" INTEGER,
    "activityId" INTEGER,
    "departmentId" INTEGER,
    "academicProgramId" INTEGER,
    "bannerProgramId" INTEGER,
    "partnerCommunityId" INTEGER,
    "actionUrl" TEXT,
    "actionLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "groupId" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_departmentId_idx" ON "notifications"("departmentId");

-- CreateIndex
CREATE INDEX "notifications_academicProgramId_idx" ON "notifications"("academicProgramId");

-- CreateIndex
CREATE INDEX "notifications_bannerProgramId_idx" ON "notifications"("bannerProgramId");

-- CreateIndex
CREATE INDEX "notifications_partnerCommunityId_idx" ON "notifications"("partnerCommunityId");

-- CreateIndex
CREATE INDEX "notifications_proposalId_idx" ON "notifications"("proposalId");

-- CreateIndex
CREATE INDEX "notifications_activityId_idx" ON "notifications"("activityId");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "project_proposals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_academicProgramId_fkey" FOREIGN KEY ("academicProgramId") REFERENCES "academic_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_bannerProgramId_fkey" FOREIGN KEY ("bannerProgramId") REFERENCES "banner_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_partnerCommunityId_fkey" FOREIGN KEY ("partnerCommunityId") REFERENCES "partner_communities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
