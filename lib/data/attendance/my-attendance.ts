'use server';

import { getCurrentAcademicYearId } from '@/lib/academicYear';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export async function getMyAttendance(userId: string) {
  if (!userId) {
    throw new Error('User ID is required to fetch attendance.');
  }

  const student = await prisma.student.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!student) {
    throw new Error('Student not found for this user.');
  }

  const organizationId = await getOrganizationId();
  const academicYearId = await getCurrentAcademicYearId();

  const attendanceData = await prisma.studentAttendance.findMany({
    where: { studentId: student.id, academicYearId },
    orderBy: { date: 'desc' },
  });

  const holidayData = await prisma.academicCalendar.findMany({
    where: { organizationId, academicYearId },
  });

  const recentAttendance = attendanceData.slice(0, 7);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const monthlyAttendance = await prisma.studentAttendance.findMany({
    where: {
      studentId: student.id,
      date: { gte: monthStart, lte: monthEnd },
    },
  });

  const monthlyStats = {
    totalDays: monthlyAttendance.length,
    presentDays: monthlyAttendance.filter((r) => r.present).length,
    lateDays: monthlyAttendance.filter((r) => r.status === 'LATE').length,
    absentDays: monthlyAttendance.filter((r) => !r.present).length,
  };

  const monthlyPercentage =
    monthlyStats.totalDays > 0
      ? Math.round((monthlyStats.presentDays / monthlyStats.totalDays) * 100)
      : 0;

  const annualAttendance = await prisma.studentAttendance.findMany({
    where: { studentId: student.id },
  });

  const annualStats = {
    totalDays: annualAttendance.length,
    presentDays: annualAttendance.filter((r) => r.present).length,
    lateDays: annualAttendance.filter((r) => r.status === 'LATE').length,
    absentDays: annualAttendance.filter((r) => !r.present).length,
  };

  const annualPercentage =
    annualStats.totalDays > 0
      ? Math.round((annualStats.presentDays / annualStats.totalDays) * 100)
      : 0;

  let currentStreak = 0;
  const sorted = [...attendanceData].reverse();
  for (const r of sorted) {
    if (r.present) currentStreak++;
    else break;
  }

  return {
    student,
    attendanceData,
    holidayData,
    recentAttendance,
    monthlyStats,
    monthlyPercentage,
    annualStats,
    annualPercentage,
    currentStreak,
  };
}
