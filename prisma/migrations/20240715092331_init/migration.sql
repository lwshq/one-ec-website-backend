-- AlterTable
ALTER TABLE "coordinator" ADD COLUMN     "lastLoginAttempt" TIMESTAMP(3),
ADD COLUMN     "loginAttempts" INTEGER NOT NULL DEFAULT 0;
