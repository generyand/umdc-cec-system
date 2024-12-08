/*
  Warnings:

  - Added the required column `partnerCommunityId` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "partnerCommunityId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "activities_partnerCommunityId_idx" ON "activities"("partnerCommunityId");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_partnerCommunityId_fkey" FOREIGN KEY ("partnerCommunityId") REFERENCES "partner_communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
