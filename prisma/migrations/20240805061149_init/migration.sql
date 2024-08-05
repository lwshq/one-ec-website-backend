/*
  Warnings:

  - Added the required column `coopId` to the `role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "role" ADD COLUMN     "coopId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "cooperative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
