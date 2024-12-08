-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "bannerProgramId" INTEGER;

-- CreateIndex
CREATE INDEX "activities_bannerProgramId_idx" ON "activities"("bannerProgramId");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_bannerProgramId_fkey" FOREIGN KEY ("bannerProgramId") REFERENCES "banner_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
