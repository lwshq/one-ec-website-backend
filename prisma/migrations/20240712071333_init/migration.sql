/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `cooperative` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `cooperative` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cooperative" ADD COLUMN     "contact" TEXT,
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cooperative_email_key" ON "cooperative"("email");
