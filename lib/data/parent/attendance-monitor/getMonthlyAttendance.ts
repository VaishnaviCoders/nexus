import prisma from '@/lib/db';
import { format } from 'date-fns';

export async function getMonthlyAttendance(childId: string) {
  // Fetch attendance records for the specified student
  const attendanceRecords = await prisma.studentAttendance.findMany({
    where: {
      studentId: childId,
    },
    select: {
      date: true,
      present: true,
      status: true,
    },
  });

  // Initialize a map to group attendance records by month and year
  const monthlyAttendanceMap = new Map<
    string,
    {
      month: string;
      year: number;
      totalDays: number;
      presentDays: number;
      absentDays: number;
      lateDays: number;
    }
  >();

  // Process each attendance record
  for (const record of attendanceRecords) {
    const attendanceDate = new Date(record.date);
    const monthName = format(attendanceDate, 'MMMM'); // e.g., "January"
    const year = attendanceDate.getFullYear();
    const monthKey = `${year}-${monthName}`;

    // Initialize the monthly attendance record if it doesn't exist
    if (!monthlyAttendanceMap.has(monthKey)) {
      monthlyAttendanceMap.set(monthKey, {
        month: monthName,
        year,
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
      });
    }

    // Update the attendance statistics for the month
    const monthlyStats = monthlyAttendanceMap.get(monthKey)!;
    monthlyStats.totalDays += 1;

    if (record.present) {
      monthlyStats.presentDays += 1;
    } else {
      monthlyStats.absentDays += 1;
    }

    if (record.status === 'LATE') {
      monthlyStats.lateDays += 1;
    }
  }

  // Convert the map to an array and calculate the attendance percentage
  const monthlyAttendanceArray = Array.from(monthlyAttendanceMap.values()).map(
    (stats) => ({
      ...stats,
      percentage:
        stats.totalDays > 0
          ? Math.round((stats.presentDays / stats.totalDays) * 100)
          : 0,
    })
  );

  return monthlyAttendanceArray;
}
