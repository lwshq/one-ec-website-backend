-- DropForeignKey
ALTER TABLE "admin_log" DROP CONSTRAINT "admin_log_admin_id_fkey";

-- AlterTable
ALTER TABLE "admin_log" ADD COLUMN     "coor_id" INTEGER,
ALTER COLUMN "admin_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "admin_log" ADD CONSTRAINT "admin_log_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_log" ADD CONSTRAINT "admin_log_coor_id_fkey" FOREIGN KEY ("coor_id") REFERENCES "coordinator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
