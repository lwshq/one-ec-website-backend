/*
  Warnings:

  - You are about to drop the column `birthdate` on the `coordinator` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'COOPSUPERADMIN';

-- AlterTable
ALTER TABLE "coordinator" DROP COLUMN "birthdate",
ADD COLUMN     "address" TEXT,
ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL;
