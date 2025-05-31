import prisma from '@/lib/db';

export async function getAttendanceSummary(childId: string) {
  const attendanceRecords = await prisma.studentAttendance.findMany({
    where: {
      studentId: childId,
    },
  });

  const present = attendanceRecords.filter(
    (record) => record.status === 'PRESENT'
  ).length;
  const absent = attendanceRecords.filter(
    (record) => record.status === 'ABSENT'
  ).length;
  const late = attendanceRecords.filter(
    (record) => record.status === 'LATE'
  ).length;
  const total = attendanceRecords.length;

  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return {
    present,
    absent,
    late,
    total,
    percentage,
  };
}
