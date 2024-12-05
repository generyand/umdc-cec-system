-- AlterTable
ALTER TABLE "project_proposals" ADD COLUMN     "communityId" INTEGER;

-- CreateTable
CREATE TABLE "partner_communities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "communityType" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "adoptionStart" TIMESTAMP(3) NOT NULL,
    "adoptionEnd" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "contactPerson" TEXT NOT NULL,
    "contactEmail" TEXT,
    "contactNumber" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_communities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "partner_communities_status_idx" ON "partner_communities"("status");

-- CreateIndex
CREATE INDEX "partner_communities_communityType_idx" ON "partner_communities"("communityType");

-- CreateIndex
CREATE INDEX "project_proposals_communityId_idx" ON "project_proposals"("communityId");

-- AddForeignKey
ALTER TABLE "project_proposals" ADD CONSTRAINT "project_proposals_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "partner_communities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
