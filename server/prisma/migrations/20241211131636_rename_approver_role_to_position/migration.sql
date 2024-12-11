/*
  Warnings:

  - The values [REJECTED] on the enum `ApprovalStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `approverRole` on the `project_approvals` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[proposalId,approverPosition]` on the table `project_approvals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `approverPosition` to the `project_approvals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ApprovalStatus_new" AS ENUM ('PENDING', 'APPROVED', 'RETURNED');
ALTER TABLE "project_approvals" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "project_approvals" ALTER COLUMN "status" TYPE "ApprovalStatus_new" USING ("status"::text::"ApprovalStatus_new");
ALTER TYPE "ApprovalStatus" RENAME TO "ApprovalStatus_old";
ALTER TYPE "ApprovalStatus_new" RENAME TO "ApprovalStatus";
DROP TYPE "ApprovalStatus_old";
ALTER TABLE "project_approvals" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropIndex
DROP INDEX "project_approvals_proposalId_approverRole_key";

-- AlterTable
ALTER TABLE "project_approvals" DROP COLUMN "approverRole",
ADD COLUMN     "approverPosition" "UserPosition" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "project_approvals_proposalId_approverPosition_key" ON "project_approvals"("proposalId", "approverPosition");
