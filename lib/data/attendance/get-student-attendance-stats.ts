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
        include: {
          grade: true,
          section: true,
          organization: true,
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

  const [
    todayAttendance,
    thisMonthStats,
    thisYearStats,
    overallStats,
    recentAttendance,
    monthlyTrend,
  ] = await Promise.all([
    // Today's attendance
    prisma.studentAttendance.findUnique({
      where: {
        studentId_date: {
          studentId: student.id,
          date: today,
        },
      },
    }),

    // This month stats
    prisma.studentAttendance.aggregate({
      where: {
        studentId: student.id,
        date: {
          gte: new Date(today.getFullYear(), today.getMonth(), 1),
          lte: today,
        },
      },
      _count: { _all: true, present: true },
    }),

    // This year stats
    prisma.studentAttendance.aggregate({
      where: {
        studentId: student.id,
        date: {
          gte: new Date(today.getFullYear(), 0, 1),
          lte: today,
        },
      },
      _count: { _all: true, present: true },
    }),

    // Overall stats
    prisma.studentAttendance.aggregate({
      where: {
        studentId: student.id,
      },
      _count: { _all: true, present: true },
    }),

    // Recent 30 days attendance
    prisma.studentAttendance.findMany({
      where: {
        studentId: student.id,
        date: {
          gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
          lte: today,
        },
      },
      orderBy: { date: 'desc' },
    }),

    // Monthly trend for the year
    prisma.studentAttendance.groupBy({
      by: ['date'],
      where: {
        studentId: student.id,
        date: {
          gte: new Date(today.getFullYear(), 0, 1),
          lte: today,
        },
      },
      _count: { _all: true, present: true },
    }),
  ]);

  // Calculate percentages
  const todayStatus = todayAttendance?.status || 'NOT_MARKED';
  const thisMonthPercentage =
    thisMonthStats._count._all > 0
      ? Math.round(
          ((thisMonthStats._count.present || 0) / thisMonthStats._count._all) *
            100
        )
      : 0;
  const thisYearPercentage =
    thisYearStats._count._all > 0
      ? Math.round(
          ((thisYearStats._count.present || 0) / thisYearStats._count._all) *
            100
        )
      : 0;
  const overallPercentage =
    overallStats._count._all > 0
      ? Math.round(
          ((overallStats._count.present || 0) / overallStats._count._all) * 100
        )
      : 0;

  // Process monthly trend
  //   const monthlyData = processMonthlyTrend(monthlyTrend);

  // Calculate streaks
  //   const { currentStreak, longestStreak } = calculateStreaks(recentAttendance);

  return {
    student,
    todayStatus,
    thisMonth: {
      totalDays: thisMonthStats._count._all,
      presentDays: thisMonthStats._count.present || 0,
      percentage: thisMonthPercentage,
    },
    thisYear: {
      totalDays: thisYearStats._count._all,
      presentDays: thisYearStats._count.present || 0,
      percentage: thisYearPercentage,
    },
    overall: {
      totalDays: overallStats._count._all,
      presentDays: overallStats._count.present || 0,
      percentage: overallPercentage,
    },
    recentAttendance,
    // monthlyData,
    // streaks: {
    //   current: currentStreak,
    //   longest: longestStreak,
    // },
  };
}
