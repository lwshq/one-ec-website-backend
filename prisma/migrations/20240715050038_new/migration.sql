/*
  Warnings:

  - You are about to drop the column `status` on the `coordinator` table. All the data in the column will be lost.
  - Made the column `address` on table `cooperative` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cooperative" ALTER COLUMN "address" SET NOT NULL;

-- AlterTable
ALTER TABLE "coordinator" DROP COLUMN "status";
