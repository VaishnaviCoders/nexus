import prisma from '@/lib/db';
import { ParentData } from '@/types';
import { performance } from 'perf_hooks';

export async function getParentWithChildrenData() {
  const start = performance.now();
  const parentData: ParentData | null = await prisma.parent.findUnique({
    where: {
      id: 'cm97e0t2q0002vhvsz78ups0h',
    },
    select: {
      firstName: true,
      lastName: true,
      students: {
        select: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              grade: {
                select: {
                  grade: true,
                },
              },
              section: {
                select: {
                  name: true,
                },
              },
              StudentAttendance: {
                where: {
                  date: {
                    gte: new Date(
                      new Date().setDate(new Date().getDate() - 30)
                    ), // Last 30 days
                  },
                },
                select: {
                  id: true,
                  date: true,
                  status: true,
                  note: true,
                  recordedBy: true,
                  present: true,
                },
              },
            },
          },
        },
      },
    },
  });
  const end = performance.now();

  console.log('Parent Data Fetched in ', end - start, 'ms');

  return parentData;
}
