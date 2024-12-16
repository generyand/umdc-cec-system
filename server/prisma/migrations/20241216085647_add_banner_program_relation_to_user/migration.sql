-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bannerProgramId" INTEGER;

-- CreateIndex
CREATE INDEX "users_bannerProgramId_idx" ON "users"("bannerProgramId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_bannerProgramId_fkey" FOREIGN KEY ("bannerProgramId") REFERENCES "banner_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
