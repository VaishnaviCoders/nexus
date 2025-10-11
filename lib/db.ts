import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getCurrentAcademicYearId } from './academicYear';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const base = new PrismaClient({ adapter });

// ✅ Only models that actually have academicYearId field in schema
const MODELS_WITH_ACADEMIC_YEAR = [
  'Fee',
  'TeachingAssignment',
  'StudentAttendance',
  'AcademicCalendar',
  'AnonymousComplaint',
  'Notice',
] as const;

const prisma = base.$extends({
  name: 'withAcademicYear',
  query: {
    // ✅ Apply to specific models only
    fee: {
      async findMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async findFirst({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async create({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        if (!args.data.academicYearId) {
          args.data.academicYearId = academicYearId;
        }
        return query(args);
      },
      async createMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        if (Array.isArray(args.data)) {
          args.data = args.data.map((item) => ({
            ...item,
            academicYearId: item.academicYearId ?? academicYearId,
          }));
        } else {
          args.data = {
            ...args.data,
            academicYearId: args.data.academicYearId ?? academicYearId,
          };
        }
        return query(args);
      },
      async update({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId } as any;
        return query(args);
      },
      async updateMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async delete({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId } as any;
        return query(args);
      },
      async deleteMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
    },
    teachingAssignment: {
      async findMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async findFirst({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async create({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        if (!args.data.academicYearId) {
          args.data.academicYearId = academicYearId;
        }
        return query(args);
      },
      async createMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        if (Array.isArray(args.data)) {
          args.data = args.data.map((item) => ({
            ...item,
            academicYearId: item.academicYearId ?? academicYearId,
          }));
        } else {
          args.data = {
            ...args.data,
            academicYearId: args.data.academicYearId ?? academicYearId,
          };
        }
        return query(args);
      },
      async update({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId } as any;
        return query(args);
      },
      async updateMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async delete({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId } as any;
        return query(args);
      },
      async deleteMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
    },
    studentAttendance: {
      async findMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async findFirst({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async create({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        if (!args.data.academicYearId) {
          args.data.academicYearId = academicYearId;
        }
        return query(args);
      },
      async createMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        if (Array.isArray(args.data)) {
          args.data = args.data.map((item) => ({
            ...item,
            academicYearId: item.academicYearId ?? academicYearId,
          }));
        } else {
          args.data = {
            ...args.data,
            academicYearId: args.data.academicYearId ?? academicYearId,
          };
        }
        return query(args);
      },
      async update({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId } as any;
        return query(args);
      },
      async updateMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async delete({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId } as any;
        return query(args);
      },
      async deleteMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
    },
    academicCalendar: {
      async findMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async findFirst({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async create({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        if (!args.data.academicYearId) {
          args.data.academicYearId = academicYearId;
        }
        return query(args);
      },
      async createMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        if (Array.isArray(args.data)) {
          args.data = args.data.map((item) => ({
            ...item,
            academicYearId: item.academicYearId ?? academicYearId,
          }));
        } else {
          args.data = {
            ...args.data,
            academicYearId: args.data.academicYearId ?? academicYearId,
          };
        }
        return query(args);
      },
      async update({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId } as any;
        return query(args);
      },
      async updateMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async delete({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId } as any;
        return query(args);
      },
      async deleteMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
    },
    anonymousComplaint: {
      async findMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async findFirst({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async create({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        if (!args.data.academicYearId) {
          args.data.academicYearId = academicYearId;
        }
        return query(args);
      },
      async createMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        if (Array.isArray(args.data)) {
          args.data = args.data.map((item) => ({
            ...item,
            academicYearId: item.academicYearId ?? academicYearId,
          }));
        } else {
          args.data = {
            ...args.data,
            academicYearId: args.data.academicYearId ?? academicYearId,
          };
        }
        return query(args);
      },
      async update({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId } as any;
        return query(args);
      },
      async updateMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async delete({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId } as any;
        return query(args);
      },
      async deleteMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
    },
    notice: {
      async findMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async findFirst({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async create({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        if (!args.data.academicYearId) {
          args.data.academicYearId = academicYearId;
        }
        return query(args);
      },
      async createMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        if (Array.isArray(args.data)) {
          args.data = args.data.map((item) => ({
            ...item,
            academicYearId: item.academicYearId ?? academicYearId,
          }));
        } else {
          args.data = {
            ...args.data,
            academicYearId: args.data.academicYearId ?? academicYearId,
          };
        }
        return query(args);
      },
      async update({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId } as any;
        return query(args);
      },
      async updateMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
      async delete({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId } as any;
        return query(args);
      },
      async deleteMany({ args, query }) {
        const academicYearId = await getCurrentAcademicYearId();
        args.where = { ...(args.where ?? {}), academicYearId };
        return query(args);
      },
    },
  },
});

export default prisma;
