/*
  Warnings:

  - You are about to drop the column `contact` on the `cooperative` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `cooperative` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `coordinator` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "cooperative_email_key";

-- AlterTable
ALTER TABLE "cooperative" DROP COLUMN "contact",
DROP COLUMN "email",
ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "coordinator" DROP COLUMN "address";
