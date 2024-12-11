-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "UserPosition" ADD VALUE 'CHIEF_OPERATION_OFFICER';

-- AlterTable
ALTER TABLE "project_proposals" ADD COLUMN     "currentApprovalStep" "UserPosition" NOT NULL DEFAULT 'CEC_HEAD';

-- CreateTable
CREATE TABLE "project_approvals" (
    "id" SERIAL NOT NULL,
    "proposalId" INTEGER NOT NULL,
    "approverRole" "UserPosition" NOT NULL,
    "approverUserId" TEXT,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_approvals_proposalId_idx" ON "project_approvals"("proposalId");

-- CreateIndex
CREATE INDEX "project_approvals_approverUserId_idx" ON "project_approvals"("approverUserId");

-- CreateIndex
CREATE UNIQUE INDEX "project_approvals_proposalId_approverRole_key" ON "project_approvals"("proposalId", "approverRole");

-- CreateIndex
CREATE INDEX "project_proposals_currentApprovalStep_idx" ON "project_proposals"("currentApprovalStep");

-- AddForeignKey
ALTER TABLE "project_approvals" ADD CONSTRAINT "project_approvals_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "project_proposals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_approvals" ADD CONSTRAINT "project_approvals_approverUserId_fkey" FOREIGN KEY ("approverUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
