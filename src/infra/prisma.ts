import { PrismaClient } from 'generated/prisma';

const prisma = new PrismaClient();

declare global {
  const prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).prisma = prisma;
}

export default prisma;
