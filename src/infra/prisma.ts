import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

declare global {
  const prisma: PrismaClient;
}

(globalThis as any).prisma = prisma;

export default prisma;
