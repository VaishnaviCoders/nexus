'use server';

import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { cache } from 'react';

const getStudentInfo = cache(async () => {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      student: {
        select: {
          id: true,
          organizationId: true,
        },
      },
    },
  });

  if (!user?.student) throw new Error('Student profile not found');
  return user.student;
});

export async function getStudentAttendanceStatsCards() {
  const student = await getStudentInfo();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    todayAttendance,
    // This month
    thisMonthTotal,
    thisMonthPresent,
    // This year
    thisYearTotal,
    thisYearPresent,
    // Overall
    overallTotal,
    overallPresent,
    // Recent attendance
    recentAttendance,
    // Monthly trend (grouped by date)
    monthlyTrend,
  ] = await Promise.all([
    prisma.studentAttendance.findUnique({
      where: {
        studentId_date: {
          studentId: student.id,
          date: today,
        },
      },
    }),

    // This month stats
    prisma.studentAttendance.count({
      where: {
        studentId: student.id,
        date: {
          gte: startOfMonth,
          lte: today,
        },
      },
    }),
    prisma.studentAttendance.count({
      where: {
        studentId: student.id,
        status: 'PRESENT',
        date: {
          gte: startOfMonth,
          lte: today,
        },
      },
    }),

    // This year stats
    prisma.studentAttendance.count({
      where: {
        studentId: student.id,
        date: {
          gte: startOfYear,
          lte: today,
        },
      },
    }),
    prisma.studentAttendance.count({
      where: {
        studentId: student.id,
        status: 'PRESENT',
        date: {
          gte: startOfYear,
          lte: today,
        },
      },
    }),

    // Overall stats
    prisma.studentAttendance.count({
      where: {
        studentId: student.id,
      },
    }),
    prisma.studentAttendance.count({
      where: {
        studentId: student.id,
        status: 'PRESENT',
      },
    }),

    // Recent 30 days
    prisma.studentAttendance.findMany({
      where: {
        studentId: student.id,
        date: {
          gte: last30Days,
          lte: today,
        },
      },
      orderBy: { date: 'desc' },
    }),

    // Monthly trend
    prisma.studentAttendance.groupBy({
      by: ['date'],
      where: {
        studentId: student.id,
        date: {
          gte: startOfYear,
          lte: today,
        },
      },
      _count: true,
    }),
  ]);

  // Percentages
  const calcPercentage = (present: number, total: number) =>
    total > 0 ? Math.round((present / total) * 100) : 0;

  return {
    student,
    todayStatus: todayAttendance?.status || 'NOT_MARKED',
    thisMonth: {
      totalDays: thisMonthTotal,
      presentDays: thisMonthPresent,
      percentage: calcPercentage(thisMonthPresent, thisMonthTotal),
    },
    thisYear: {
      totalDays: thisYearTotal,
      presentDays: thisYearPresent,
      percentage: calcPercentage(thisYearPresent, thisYearTotal),
    },
    overall: {
      totalDays: overallTotal,
      presentDays: overallPresent,
      percentage: calcPercentage(overallPresent, overallTotal),
    },
    recentAttendance,
    monthlyTrend,
  };
}
