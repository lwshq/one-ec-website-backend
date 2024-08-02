/*
  Warnings:

  - Added the required column `billDate` to the `bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `readingDate` to the `bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bill" ADD COLUMN     "billDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "readingDate" TIMESTAMP(3) NOT NULL;
