import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.PROJECT_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;