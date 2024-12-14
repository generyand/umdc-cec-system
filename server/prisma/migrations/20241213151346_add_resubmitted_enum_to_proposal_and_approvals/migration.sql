/*
  Warnings:

  - The `status` column on the `project_proposals` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'APPROVED', 'RETURNED', 'RESUBMITTED');

-- AlterEnum
ALTER TYPE "ApprovalStatus" ADD VALUE 'RESUBMITTED';

-- AlterTable
ALTER TABLE "project_proposals" DROP COLUMN "status",
ADD COLUMN     "status" "ProposalStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "project_proposals_status_idx" ON "project_proposals"("status");
