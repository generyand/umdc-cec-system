/*
  Warnings:

  - You are about to drop the column `bannerProgram` on the `project_proposals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "project_proposals" DROP COLUMN "bannerProgram",
ADD COLUMN     "bannerProgramId" INTEGER;

-- CreateTable
CREATE TABLE "banner_programs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "yearStarted" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "departmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banner_programs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "banner_programs_name_key" ON "banner_programs"("name");

-- CreateIndex
CREATE INDEX "banner_programs_departmentId_idx" ON "banner_programs"("departmentId");

-- CreateIndex
CREATE INDEX "banner_programs_status_idx" ON "banner_programs"("status");

-- CreateIndex
CREATE INDEX "project_proposals_bannerProgramId_idx" ON "project_proposals"("bannerProgramId");

-- AddForeignKey
ALTER TABLE "project_proposals" ADD CONSTRAINT "project_proposals_bannerProgramId_fkey" FOREIGN KEY ("bannerProgramId") REFERENCES "banner_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banner_programs" ADD CONSTRAINT "banner_programs_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
