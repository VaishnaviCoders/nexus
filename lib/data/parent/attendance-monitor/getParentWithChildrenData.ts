import prisma from '@/lib/db';
import { getCurrentUserId } from '@/lib/user';
import { ParentData } from '@/types';
import { performance } from 'perf_hooks';

export async function getParentWithChildrenData() {
  const start = performance.now();

  const userId = await getCurrentUserId();

  const parentData = await prisma.parent.findUnique({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      whatsAppNumber: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
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
