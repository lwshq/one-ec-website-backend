/*
  Warnings:

  - The `role` column on the `admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createdAt` on the `admin_log` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `admin_log` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `admin_log` table. All the data in the column will be lost.
  - The `role` column on the `coordinator` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createdAt` on the `password_reset` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `password_reset` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `password_reset` table. All the data in the column will be lost.
  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'COORDINATOR', 'ADMIN');

-- AlterTable
ALTER TABLE "admin" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'ADMIN';

-- AlterTable
ALTER TABLE "admin_log" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "coordinator" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" DEFAULT 'COORDINATOR';

-- AlterTable
ALTER TABLE "password_reset" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
