import { PrismaClient } from '@prisma/client';

// Fallback: some Windows environments inject a global DATABASE_URL (e.g. jdbc:mysql://...).
// If that happens, prefer DIRECT_URL from the project .env when it is a valid postgres URL.
if (
  typeof process.env.DATABASE_URL === 'string' &&
  process.env.DATABASE_URL.startsWith('jdbc:') &&
  typeof process.env.DIRECT_URL === 'string' &&
  (process.env.DIRECT_URL.startsWith('postgresql://') || process.env.DIRECT_URL.startsWith('postgres://'))
) {
  process.env.DATABASE_URL = process.env.DIRECT_URL;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
