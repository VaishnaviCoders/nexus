'use server';

import prisma from '@/lib/db';

export async function getChildrenAttendance(studentId: string) {
  await prisma.studentAttendance.findMany({
    where: { studentId: studentId },
    select: {
      date: true,
      status: true,
      id: true,
      notes: true,
      recordedBy: true,
    },
  });
}
