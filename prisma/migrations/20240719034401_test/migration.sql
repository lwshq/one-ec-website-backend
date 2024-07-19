/*
  Warnings:

  - You are about to drop the column `issuedDate` on the `bill` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `bill` table. All the data in the column will be lost.
  - Added the required column `cRead` to the `bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromDate` to the `bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextDate` to the `bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toDate` to the `bill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bill" DROP CONSTRAINT "bill_meterAccountId_fkey";

-- AlterTable
ALTER TABLE "bill" DROP COLUMN "issuedDate",
DROP COLUMN "status",
ADD COLUMN     "applied" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "cRead" INTEGER NOT NULL,
ADD COLUMN     "distribution" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "fitAll" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "fromDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gTax" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "generation" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "nextDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "other" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "pRead" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sLoss" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "subsidies" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "toDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "transmission" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ALTER COLUMN "meterAccountId" DROP NOT NULL,
ALTER COLUMN "rate" SET DEFAULT 0.00,
ALTER COLUMN "referenceNumber" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "bill" ADD CONSTRAINT "bill_meterAccountId_fkey" FOREIGN KEY ("meterAccountId") REFERENCES "meter_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
