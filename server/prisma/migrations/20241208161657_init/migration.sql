-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "UserPosition" AS ENUM ('CEC_HEAD', 'CEC_OFFICE_ASSISTANT', 'CEC_COORDINATOR', 'VP_DIRECTOR', 'DEAN', 'PROGRAM_HEAD', 'FOCAL_PERSON');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STAFF',
    "position" "UserPosition",
    "contactNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "hashedPassword" TEXT NOT NULL,
    "resetPasswordToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "departmentId" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_programs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "description" TEXT,
    "totalStudents" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "bannerProgramId" INTEGER,

    CONSTRAINT "academic_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner_programs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "description" TEXT,
    "yearStarted" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "departmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banner_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_proposals" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bannerProgramId" INTEGER,
    "targetBeneficiaries" TEXT NOT NULL,
    "targetArea" TEXT NOT NULL,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "venue" TEXT NOT NULL,
    "budget" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "departmentId" INTEGER NOT NULL,
    "programId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "communityId" INTEGER,

    CONSTRAINT "project_proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_attachments" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proposalId" INTEGER NOT NULL,

    CONSTRAINT "project_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "status" "ActivityStatus" NOT NULL DEFAULT 'UPCOMING',
    "departmentId" INTEGER NOT NULL,
    "partnerCommunityId" INTEGER NOT NULL,
    "proposalFileId" INTEGER NOT NULL,
    "proposalId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bannerProgramId" INTEGER,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_documents" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activityId" INTEGER,

    CONSTRAINT "activity_documents_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_departmentId_idx" ON "users"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_abbreviation_key" ON "departments"("abbreviation");

-- CreateIndex
CREATE UNIQUE INDEX "academic_programs_name_key" ON "academic_programs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "academic_programs_abbreviation_key" ON "academic_programs"("abbreviation");

-- CreateIndex
CREATE INDEX "academic_programs_departmentId_idx" ON "academic_programs"("departmentId");

-- CreateIndex
CREATE INDEX "academic_programs_bannerProgramId_idx" ON "academic_programs"("bannerProgramId");

-- CreateIndex
CREATE UNIQUE INDEX "banner_programs_name_key" ON "banner_programs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "banner_programs_abbreviation_key" ON "banner_programs"("abbreviation");

-- CreateIndex
CREATE INDEX "banner_programs_departmentId_idx" ON "banner_programs"("departmentId");

-- CreateIndex
CREATE INDEX "banner_programs_status_idx" ON "banner_programs"("status");

-- CreateIndex
CREATE INDEX "project_proposals_departmentId_idx" ON "project_proposals"("departmentId");

-- CreateIndex
CREATE INDEX "project_proposals_programId_idx" ON "project_proposals"("programId");

-- CreateIndex
CREATE INDEX "project_proposals_userId_idx" ON "project_proposals"("userId");

-- CreateIndex
CREATE INDEX "project_proposals_status_idx" ON "project_proposals"("status");

-- CreateIndex
CREATE INDEX "project_proposals_communityId_idx" ON "project_proposals"("communityId");

-- CreateIndex
CREATE INDEX "project_proposals_bannerProgramId_idx" ON "project_proposals"("bannerProgramId");

-- CreateIndex
CREATE INDEX "project_attachments_proposalId_idx" ON "project_attachments"("proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "activities_proposalFileId_key" ON "activities"("proposalFileId");

-- CreateIndex
CREATE INDEX "activities_departmentId_idx" ON "activities"("departmentId");

-- CreateIndex
CREATE INDEX "activities_partnerCommunityId_idx" ON "activities"("partnerCommunityId");

-- CreateIndex
CREATE INDEX "activities_status_idx" ON "activities"("status");

-- CreateIndex
CREATE INDEX "activities_bannerProgramId_idx" ON "activities"("bannerProgramId");

-- CreateIndex
CREATE INDEX "activity_documents_category_idx" ON "activity_documents"("category");

-- CreateIndex
CREATE INDEX "activity_documents_activityId_idx" ON "activity_documents"("activityId");

-- CreateIndex
CREATE INDEX "partner_communities_status_idx" ON "partner_communities"("status");

-- CreateIndex
CREATE INDEX "partner_communities_communityType_idx" ON "partner_communities"("communityType");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_programs" ADD CONSTRAINT "academic_programs_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_programs" ADD CONSTRAINT "academic_programs_bannerProgramId_fkey" FOREIGN KEY ("bannerProgramId") REFERENCES "banner_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banner_programs" ADD CONSTRAINT "banner_programs_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_proposals" ADD CONSTRAINT "project_proposals_bannerProgramId_fkey" FOREIGN KEY ("bannerProgramId") REFERENCES "banner_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_proposals" ADD CONSTRAINT "project_proposals_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_proposals" ADD CONSTRAINT "project_proposals_programId_fkey" FOREIGN KEY ("programId") REFERENCES "academic_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_proposals" ADD CONSTRAINT "project_proposals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_proposals" ADD CONSTRAINT "project_proposals_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "partner_communities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_attachments" ADD CONSTRAINT "project_attachments_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "project_proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_partnerCommunityId_fkey" FOREIGN KEY ("partnerCommunityId") REFERENCES "partner_communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_proposalFileId_fkey" FOREIGN KEY ("proposalFileId") REFERENCES "activity_documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "project_proposals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_bannerProgramId_fkey" FOREIGN KEY ("bannerProgramId") REFERENCES "banner_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_documents" ADD CONSTRAINT "activity_documents_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
