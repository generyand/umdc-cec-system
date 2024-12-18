/*
  Warnings:

  - Added the required column `schoolYearId` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolYearId` to the `project_proposals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "schoolYearId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "schoolYearId" INTEGER;

-- AlterTable
ALTER TABLE "project_proposals" ADD COLUMN     "schoolYearId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "school_years" (
    "id" SERIAL NOT NULL,
    "year" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_years_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "school_years_year_key" ON "school_years"("year");

-- CreateIndex
CREATE INDEX "school_years_isCurrent_idx" ON "school_years"("isCurrent");

-- CreateIndex
CREATE INDEX "school_years_status_idx" ON "school_years"("status");

-- CreateIndex
CREATE INDEX "activities_schoolYearId_idx" ON "activities"("schoolYearId");

-- CreateIndex
CREATE INDEX "announcements_schoolYearId_idx" ON "announcements"("schoolYearId");

-- CreateIndex
CREATE INDEX "project_proposals_schoolYearId_idx" ON "project_proposals"("schoolYearId");

-- AddForeignKey
ALTER TABLE "project_proposals" ADD CONSTRAINT "project_proposals_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "school_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "school_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "school_years"("id") ON DELETE SET NULL ON UPDATE CASCADE;
