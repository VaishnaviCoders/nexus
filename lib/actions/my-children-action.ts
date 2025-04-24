import { performance } from 'perf_hooks';
import prisma from '../db';

export default async function getAllChildrenByParentId(parentId: string) {
  const start = performance.now();
  const data = await prisma.parent.findUnique({
    where: { id: parentId },
    select: {
      students: {
        select: {
          student: {
            select: {
              profileImage: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              phoneNumber: true,
              rollNumber: true,
              StudentAttendance: true,
              section: {
                select: {
                  name: true,
                },
              },
              grade: {
                select: {
                  grade: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const end = performance.now();
  console.log(
    `⏱️ Fully Optimized getAllChildrenByParentId took ${(end - start).toFixed(
      2
    )} ms`
  );

  return data;
}
