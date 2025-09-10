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

// extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Models that have academicYearId field (based on your schema)
// const ACADEMIC_YEAR_MODELS = [
//   'notice',
//   'studentAttendance',
//   'anonymousComplaint',
//   'academicCalendar',
//   'teachingAssignment',
// ];

// // ⬇️ Prisma Middleware
// prisma.$use(async (params, next) => {
//   const { model, action } = params;

//   // Skip if not a relevant model
//   if (!model || !ACADEMIC_YEAR_MODELS.includes(model)) {
//     return next(params);
//   }

//   try {
//     // Handle CREATE operations
//     if (action === 'create') {
//       const data = params.args.data;

//       if (data.organizationId && !data.academicYearId) {
//         const academicYearId = await getCurrentAcademicYearId();
//         if (academicYearId) {
//           params.args.data.academicYearId = academicYearId;
//         }
//       }
//     }

//     // Handle CREATE MANY operations
//     else if (action === 'createMany') {
//       const dataArray = params.args.data;

//       if (Array.isArray(dataArray) && dataArray.length > 0) {
//         const firstRecord = dataArray[0];

//         if (firstRecord.organizationId) {
//           const academicYearId = await getCurrentAcademicYearId();

//           if (academicYearId) {
//             params.args.data = dataArray.map((record) => ({
//               ...record,
//               academicYearId: record.academicYearId || academicYearId,
//             }));
//           }
//         }
//       }
//     }

//     // Handle FIND operations - auto-filter by current academic year
//     else if (action.startsWith('find')) {
//       const where = params.args.where;

//       if (where?.organizationId && !where.academicYearId) {
//         const academicYearId = await getCurrentAcademicYearId();
//         if (academicYearId) {
//           params.args.where.academicYearId = academicYearId;
//         }
//       }
//     }
//   } catch (error) {
//     console.error(`Middleware error for ${model}.${action}:`, error);
//     // Continue with original operation if middleware fails
//   }

//   return next(params);
// });

export default prisma;
