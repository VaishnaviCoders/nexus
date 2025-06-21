import prisma from '@/lib/db';
import { AttendanceRecord } from '@/types';

export async function getRecentAttendance(
  childId: string
): Promise<AttendanceRecord[]> {
  const records = await prisma.studentAttendance.findMany({
    where: {
      studentId: childId,
    },
    select: {
      student: {
        select: {
          firstName: true,
        },
      },
      date: true,
      studentId: true,
      sectionId: true,
      status: true,
      id: true,
      note: true,
      recordedBy: true,
      present: true,
    },
    orderBy: {
      date: 'desc',
    },
    take: 15, // Get the 15 most recent records
  });

  return records;
}
