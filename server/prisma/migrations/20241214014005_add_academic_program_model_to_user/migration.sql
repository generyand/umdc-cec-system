-- AlterTable
ALTER TABLE "users" ADD COLUMN     "academicProgramId" INTEGER;

-- CreateIndex
CREATE INDEX "users_academicProgramId_idx" ON "users"("academicProgramId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_academicProgramId_fkey" FOREIGN KEY ("academicProgramId") REFERENCES "academic_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
