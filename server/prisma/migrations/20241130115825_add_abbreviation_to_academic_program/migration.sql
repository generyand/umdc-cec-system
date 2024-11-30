/*
  Warnings:

  - A unique constraint covering the columns `[abbreviation]` on the table `academic_programs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `abbreviation` to the `academic_programs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "academic_programs" ADD COLUMN     "abbreviation" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "academic_programs_abbreviation_key" ON "academic_programs"("abbreviation");
