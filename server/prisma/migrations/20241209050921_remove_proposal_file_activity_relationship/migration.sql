/*
  Warnings:

  - You are about to drop the column `proposalFileId` on the `activities` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_proposalFileId_fkey";

-- DropIndex
DROP INDEX "activities_proposalFileId_key";

-- AlterTable
ALTER TABLE "activities" DROP COLUMN "proposalFileId";
