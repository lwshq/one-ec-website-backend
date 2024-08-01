/*
  Warnings:

  - Made the column `uCharges` on table `bill` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bill" ALTER COLUMN "uCharges" SET NOT NULL;
