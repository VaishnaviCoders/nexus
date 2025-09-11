import { PrismaClient } from '@/generated/prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { getOrganizationId } from './organization';
import { getCurrentAcademicYearId } from './academicYear';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
