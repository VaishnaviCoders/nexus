import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });

// Middleware: auto-inject academicYearId for models which have it
// Avoid importing getOrganizationId/getCurrentAcademicYearId here to prevent circular deps in Next RSC
// Instead, query directly when needed
prisma.$use(async (params, next) => {
  const modelsNeedingYear: Record<string, true> = {
    ExamSession: true,
    StudentAttendance: true,
    AcademicCalendar: true,
    TeachingAssignment: true,
    Notice: true,
    ReportCard: true,
  };

  const isCreate = params.action === 'create' || params.action === 'createMany';
  const needsYear = !!modelsNeedingYear[params.model as string];

  if (isCreate && needsYear) {
    if (params.action === 'create') {
      const data = (params.args?.data ?? {}) as Record<string, unknown>;
      if (!data.academicYearId) {
        const organizationId = (data.organizationId ||
          (Array.isArray(data) ? undefined : undefined)) as string | undefined;
        if (organizationId) {
          const current = await prisma.academicYear.findFirst({
            where: { organizationId, isCurrent: true },
            select: { id: true },
          });
          if (current?.id) {
            (params.args.data as any).academicYearId = current.id;
          }
        }
      }
    } else if (params.action === 'createMany') {
      const dataList = Array.isArray(params.args?.data)
        ? (params.args.data as Array<Record<string, unknown>>)
        : [];
      for (const data of dataList) {
        if (!data.academicYearId) {
          const organizationId = data.organizationId as string | undefined;
          if (!organizationId) continue;
          const current = await prisma.academicYear.findFirst({
            where: { organizationId, isCurrent: true },
            select: { id: true },
          });
          if (current?.id) {
            (data as any).academicYearId = current.id;
          }
        }
      }
    }
  }

  return next(params);
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
