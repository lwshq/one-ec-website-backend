/*
  Warnings:

  - You are about to drop the column `coopId` on the `bill` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `meter_account` table. All the data in the column will be lost.
  - You are about to drop the column `coopId` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the `meter_address` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `meterAccountId` on table `bill` required. This step will fail if there are existing NULL values in that column.
  - Made the column `referenceNumber` on table `bill` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `meterAccountName` to the `meter_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meterAddress` to the `meter_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meterNumber` to the `meter_account` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');

-- DropForeignKey
ALTER TABLE "bill" DROP CONSTRAINT "bill_coopId_fkey";

-- DropForeignKey
ALTER TABLE "bill" DROP CONSTRAINT "bill_meterAccountId_fkey";

-- DropForeignKey
ALTER TABLE "meter_account" DROP CONSTRAINT "meter_account_userId_fkey";

-- DropForeignKey
ALTER TABLE "meter_address" DROP CONSTRAINT "meter_address_meterId_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_coopId_fkey";

-- DropForeignKey
ALTER TABLE "settlement" DROP CONSTRAINT "settlement_coopId_fkey";

-- AlterTable
ALTER TABLE "bill" DROP COLUMN "coopId",
ALTER COLUMN "meterAccountId" SET NOT NULL,
ALTER COLUMN "referenceNumber" SET NOT NULL;

-- AlterTable
ALTER TABLE "meter_account" DROP COLUMN "userId",
ADD COLUMN     "customerType" TEXT,
ADD COLUMN     "meterAccountName" TEXT NOT NULL,
ADD COLUMN     "meterActivated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "meterAddress" TEXT NOT NULL,
ADD COLUMN     "meterNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "coopId",
DROP COLUMN "date",
ADD COLUMN     "medium" TEXT;

-- DropTable
DROP TABLE "meter_address";

-- CreateTable
CREATE TABLE "accountRegistry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "meterId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "accountRegistry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bill" ADD CONSTRAINT "bill_meterAccountId_fkey" FOREIGN KEY ("meterAccountId") REFERENCES "meter_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountRegistry" ADD CONSTRAINT "accountRegistry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountRegistry" ADD CONSTRAINT "accountRegistry_meterId_fkey" FOREIGN KEY ("meterId") REFERENCES "meter_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
