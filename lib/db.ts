import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getCurrentAcademicYearId } from './academicYear';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

function needsAcademicYear(model: string): boolean {
  return [
    'Fee',
    'FeePayment',
    'FeeCategory',
    'StudentDocument',
    'ScheduledJob',
    'NotificationLog',
    'HallTicket',
    'ReportCard',
    'ExamResult',
    // 'ExamEnrollment',
    'TeachingAssignment',
    'StudentAttendance',
    'AcademicCalendar',
  ].includes(model);
}

// const prisma = base.$extends({
//   name: 'withAcademicYear',
//   query: {
//     $allModels: {
//       async findMany({ args, query }) {
//         const academicYearId = await getCurrentAcademicYearId();
//         args.where = { ...(args.where ?? {}), academicYearId };
//         return query(args);
//       },

//       async create({ model, args, query }) {
//         const academicYearId = await getCurrentAcademicYearId();
//         if (
//           needsAcademicYear(model) &&
//           args.data &&
//           !('academicYearId' in args.data)
//         ) {
//           args.data.academicYearId = academicYearId;
//         }
//         return query(args);
//       },

//       async createMany({ args, query }) {
//         const academicYearId = await getCurrentAcademicYearId();
//         if (Array.isArray(args.data)) {
//           args.data = args.data.map((item) => ({
//             ...item,
//             academicYearId,
//           }));
//         } else {
//           args.data = { ...(args.data ?? {}), academicYearId };
//         }
//         return query(args);
//       },
//     },
//   },
// });

export default prisma;
