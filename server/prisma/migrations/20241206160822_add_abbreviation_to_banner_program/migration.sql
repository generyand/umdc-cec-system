/*
  Warnings:

  - A unique constraint covering the columns `[abbreviation]` on the table `banner_programs` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "banner_programs" ADD COLUMN     "abbreviation" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "banner_programs_abbreviation_key" ON "banner_programs"("abbreviation");
