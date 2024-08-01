-- AlterTable
ALTER TABLE "bill" ADD COLUMN     "uCharges" DOUBLE PRECISION DEFAULT 0.00;

-- AlterTable
ALTER TABLE "login_attempts" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3);
