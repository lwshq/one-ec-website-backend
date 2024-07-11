/*
  Warnings:

  - Added the required column `updatedAt` to the `admin_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `password_reset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin_log" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "password_reset" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
