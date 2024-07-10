-- CreateTable
CREATE TABLE "password_reset" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "coorId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_reset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_token_key" ON "password_reset"("token");

-- AddForeignKey
ALTER TABLE "password_reset" ADD CONSTRAINT "password_reset_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset" ADD CONSTRAINT "password_reset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset" ADD CONSTRAINT "password_reset_coorId_fkey" FOREIGN KEY ("coorId") REFERENCES "coordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
