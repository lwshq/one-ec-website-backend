/*
  Warnings:

  - Added the required column `dueDate` to the `bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bill" ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL;
