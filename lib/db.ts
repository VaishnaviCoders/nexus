import { PrismaClient, Prisma } from "@/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { getCurrentAcademicYearId } from './academicYear';

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL,
});
const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const base = globalForPrisma.prisma || new PrismaClient({
  adapter,
})


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

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


export default prisma;