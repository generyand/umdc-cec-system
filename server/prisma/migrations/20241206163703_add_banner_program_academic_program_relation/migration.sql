-- AlterTable
ALTER TABLE "academic_programs" ADD COLUMN     "bannerProgramId" INTEGER;

-- AlterTable
ALTER TABLE "banner_programs" ALTER COLUMN "abbreviation" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "academic_programs_bannerProgramId_idx" ON "academic_programs"("bannerProgramId");

-- AddForeignKey
ALTER TABLE "academic_programs" ADD CONSTRAINT "academic_programs_bannerProgramId_fkey" FOREIGN KEY ("bannerProgramId") REFERENCES "banner_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
