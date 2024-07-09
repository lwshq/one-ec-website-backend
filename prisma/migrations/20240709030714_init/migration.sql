/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CoopBank` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CoopCoordinator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cooperative` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CoordinatorRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MeterAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MeterAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Settlement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAddress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_coopId_fkey";

-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_meterAccountId_fkey";

-- DropForeignKey
ALTER TABLE "CoopBank" DROP CONSTRAINT "CoopBank_coopId_fkey";

-- DropForeignKey
ALTER TABLE "CoopCoordinator" DROP CONSTRAINT "CoopCoordinator_coopId_fkey";

-- DropForeignKey
ALTER TABLE "CoordinatorRole" DROP CONSTRAINT "CoordinatorRole_coordinatorId_fkey";

-- DropForeignKey
ALTER TABLE "CoordinatorRole" DROP CONSTRAINT "CoordinatorRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "MeterAccount" DROP CONSTRAINT "MeterAccount_coopId_fkey";

-- DropForeignKey
ALTER TABLE "MeterAddress" DROP CONSTRAINT "MeterAddress_meterId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_billId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_coopId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Settlement" DROP CONSTRAINT "Settlement_coopId_fkey";

-- DropForeignKey
ALTER TABLE "UserAddress" DROP CONSTRAINT "UserAddress_userId_fkey";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Bill";

-- DropTable
DROP TABLE "CoopBank";

-- DropTable
DROP TABLE "CoopCoordinator";

-- DropTable
DROP TABLE "Cooperative";

-- DropTable
DROP TABLE "CoordinatorRole";

-- DropTable
DROP TABLE "MeterAccount";

-- DropTable
DROP TABLE "MeterAddress";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "Settlement";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserAddress";

-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "user_id" INTEGER,
    "coordinator_id" INTEGER,
    "admin_id" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "contact_number" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coordinator" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "coop_id" INTEGER NOT NULL,
    "role" TEXT DEFAULT 'coordinator',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "status" TEXT NOT NULL,

    CONSTRAINT "coordinator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "contact_number" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cooperative" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "cooperative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coop_bank" (
    "id" SERIAL NOT NULL,
    "cooperativeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "coop_bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_address" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "billId" INTEGER NOT NULL,
    "coopId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bill" (
    "id" SERIAL NOT NULL,
    "meterAccountId" INTEGER NOT NULL,
    "coopId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "kwhConsume" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "issuedDate" TIMESTAMP(3) NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meter_account" (
    "id" SERIAL NOT NULL,
    "meterId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "coopId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "meter_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meter_address" (
    "id" SERIAL NOT NULL,
    "meterId" INTEGER NOT NULL,
    "meterProvince" TEXT NOT NULL,
    "meterTown" TEXT NOT NULL,
    "meterBrgy" TEXT NOT NULL,
    "meterSt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "meter_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settlement" (
    "id" SERIAL NOT NULL,
    "coopId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "settlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "modules" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coordinator_role" (
    "id" SERIAL NOT NULL,
    "coordinatorId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "coordinator_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_log" (
    "id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time" TEXT NOT NULL,
    "activity" TEXT NOT NULL,

    CONSTRAINT "admin_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "coordinator_email_key" ON "coordinator"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_coordinator_id_fkey" FOREIGN KEY ("coordinator_id") REFERENCES "coordinator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coordinator" ADD CONSTRAINT "coordinator_coop_id_fkey" FOREIGN KEY ("coop_id") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coop_bank" ADD CONSTRAINT "coop_bank_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_billId_fkey" FOREIGN KEY ("billId") REFERENCES "bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill" ADD CONSTRAINT "bill_meterAccountId_fkey" FOREIGN KEY ("meterAccountId") REFERENCES "meter_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill" ADD CONSTRAINT "bill_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meter_account" ADD CONSTRAINT "meter_account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meter_account" ADD CONSTRAINT "meter_account_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meter_address" ADD CONSTRAINT "meter_address_meterId_fkey" FOREIGN KEY ("meterId") REFERENCES "meter_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlement" ADD CONSTRAINT "settlement_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coordinator_role" ADD CONSTRAINT "coordinator_role_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coordinator_role" ADD CONSTRAINT "coordinator_role_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "coordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_log" ADD CONSTRAINT "admin_log_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
