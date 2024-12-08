/*
  Warnings:

  - You are about to drop the column `budget` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `venue` on the `activities` table. All the data in the column will be lost.
  - Added the required column `departmentId` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetDate` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "activities_proposalId_idx";

-- AlterTable
ALTER TABLE "activities" DROP COLUMN "budget",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "venue",
ADD COLUMN     "departmentId" INTEGER NOT NULL,
ADD COLUMN     "targetDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "activities_departmentId_idx" ON "activities"("departmentId");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
