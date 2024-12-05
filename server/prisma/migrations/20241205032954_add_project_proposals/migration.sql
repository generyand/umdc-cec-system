-- CreateTable
CREATE TABLE "project_proposals" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bannerProgram" TEXT NOT NULL,
    "targetBeneficiaries" TEXT NOT NULL,
    "targetArea" TEXT NOT NULL,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "venue" TEXT NOT NULL,
    "budget" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "departmentId" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "project_proposals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_proposals_departmentId_idx" ON "project_proposals"("departmentId");

-- CreateIndex
CREATE INDEX "project_proposals_programId_idx" ON "project_proposals"("programId");

-- CreateIndex
CREATE INDEX "project_proposals_userId_idx" ON "project_proposals"("userId");

-- CreateIndex
CREATE INDEX "project_proposals_status_idx" ON "project_proposals"("status");

-- AddForeignKey
ALTER TABLE "project_proposals" ADD CONSTRAINT "project_proposals_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_proposals" ADD CONSTRAINT "project_proposals_programId_fkey" FOREIGN KEY ("programId") REFERENCES "academic_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_proposals" ADD CONSTRAINT "project_proposals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
