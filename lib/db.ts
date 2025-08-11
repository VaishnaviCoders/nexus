import { PrismaClient } from '@/generated/prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { getOrganizationId } from './organization';

async function reconnectPrisma() {
  console.warn('🔄 Reinitializing Prisma connection...');
  const newClient = new PrismaClient();
  return newClient;
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log:
    //   process.env.NODE_ENV === 'production'
    //     ? ['error']
    //     : ['query', 'error', 'warn'],
    datasourceUrl: process.env.DATABASE_URL,
  });

// extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
