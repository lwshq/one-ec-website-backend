-- DropForeignKey
ALTER TABLE "password_reset" DROP CONSTRAINT "password_reset_adminId_fkey";

-- DropForeignKey
ALTER TABLE "password_reset" DROP CONSTRAINT "password_reset_coorId_fkey";

-- DropForeignKey
ALTER TABLE "password_reset" DROP CONSTRAINT "password_reset_userId_fkey";

-- AlterTable
ALTER TABLE "password_reset" ALTER COLUMN "adminId" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "coorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "password_reset" ADD CONSTRAINT "password_reset_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset" ADD CONSTRAINT "password_reset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset" ADD CONSTRAINT "password_reset_coorId_fkey" FOREIGN KEY ("coorId") REFERENCES "coordinator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
