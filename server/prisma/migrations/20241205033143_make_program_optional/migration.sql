-- DropForeignKey
ALTER TABLE "project_proposals" DROP CONSTRAINT "project_proposals_programId_fkey";

-- AlterTable
ALTER TABLE "project_proposals" ALTER COLUMN "programId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "project_proposals" ADD CONSTRAINT "project_proposals_programId_fkey" FOREIGN KEY ("programId") REFERENCES "academic_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
