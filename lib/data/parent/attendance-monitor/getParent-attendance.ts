'use server';

import prisma from '@/lib/db';
import { getCurrentUserId } from '@/lib/user';
import { cache } from 'react';

// Cache the parent lookup for better performance
const getParentInfo = cache(async () => {
  const userId = await getCurrentUserId();
  const parent = await prisma.parent.findUnique({
    where: {
      userId: userId,
    },
    select: {
      students: {
        include: {
          student: {
            include: {
              grade: true,
              section: true,
            },
          },
        },
      },
    },
  });

  if (!parent) throw new Error('Parent profile not found');
  return parent;
});

export async function getChildrenAttendanceOverview() {
  const parent = await getParentInfo();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const childrenData = await Promise.all(
    parent.students.map(async (parentStudent) => {
      const student = parentStudent.student;

      // Get today's attendance
      const todayAttendance = await prisma.studentAttendance.findUnique({
        where: {
          studentId_date: {
            studentId: student.id,
            date: today,
          },
        },
      });

      // Get this month's attendance stats
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthAttendance = await prisma.studentAttendance.aggregate({
        where: {
          studentId: student.id,
          date: { gte: monthStart, lte: today },
        },
        _count: { _all: true, present: true },
      });

      // Get this year's attendance stats
      const yearStart = new Date(today.getFullYear(), 0, 1);
      const yearAttendance = await prisma.studentAttendance.aggregate({
        where: {
          studentId: student.id,
          date: { gte: yearStart, lte: today },
        },
        _count: { _all: true, present: true },
      });

      // Get last 30 days attendance for trend
      const last30Days = new Date(today);
      last30Days.setDate(last30Days.getDate() - 30);
      const recentAttendance = await prisma.studentAttendance.findMany({
        where: {
          studentId: student.id,
          date: { gte: last30Days, lte: today },
        },
        orderBy: { date: 'desc' },
      });

      // Calculate streaks
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      const sortedAttendance = recentAttendance.sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );

      for (let i = 0; i < sortedAttendance.length; i++) {
        if (sortedAttendance[i].present) {
          if (i === 0) currentStreak++;
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          if (i === 0) currentStreak = 0;
          tempStreak = 0;
        }
      }

      const monthPercentage =
        monthAttendance._count._all > 0
          ? Math.round(
              ((monthAttendance._count.present || 0) /
                monthAttendance._count._all) *
                100
            )
          : 0;

      const yearPercentage =
        yearAttendance._count._all > 0
          ? Math.round(
              ((yearAttendance._count.present || 0) /
                yearAttendance._count._all) *
                100
            )
          : 0;

      return {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        rollNumber: student.rollNumber,
        grade: student.grade.grade,
        section: student.section.name,
        profileImage: student.profileImage,
        relationship: parentStudent.relationship,
        todayStatus: todayAttendance?.status || 'NOT_MARKED',
        todayPresent: todayAttendance?.present || false,
        monthStats: {
          totalDays: monthAttendance._count._all,
          presentDays: monthAttendance._count.present || 0,
          percentage: monthPercentage,
        },
        yearStats: {
          totalDays: yearAttendance._count._all,
          presentDays: yearAttendance._count.present || 0,
          percentage: yearPercentage,
        },
        streaks: {
          current: currentStreak,
          longest: longestStreak,
        },
        recentAttendance: recentAttendance.slice(0, 14), // Last 14 days
      };
    })
  );

  return childrenData;
}

export async function getDetailedAttendanceForChild(
  studentId: string,
  months = 6
) {
  const parent = await getParentInfo();

  // Verify this child belongs to the parent
  const isParentChild = parent.students.some(
    (ps) => ps.student.id === studentId
  );
  if (!isParentChild) throw new Error('Unauthorized access to student data');

  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  // Get all attendance records for the period
  const attendanceRecords = await prisma.studentAttendance.findMany({
    where: {
      studentId,
      date: { gte: startDate, lte: endDate },
    },
    orderBy: { date: 'asc' },
  });

  // Get student info
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      grade: true,
      section: true,
    },
  });

  // Group by month for monthly stats
  const monthlyStats = new Map();
  const weeklyStats = new Map();
  const dailyPattern = new Map(); // Day of week pattern

  attendanceRecords.forEach((record) => {
    const date = new Date(record.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const weekKey = getWeekKey(date);
    const dayOfWeek = date.getDay();

    // Monthly stats
    if (!monthlyStats.has(monthKey)) {
      monthlyStats.set(monthKey, { total: 0, present: 0, absent: 0, late: 0 });
    }
    const monthStat = monthlyStats.get(monthKey);
    monthStat.total++;
    if (record.present) monthStat.present++;
    else monthStat.absent++;
    if (record.status === 'LATE') monthStat.late++;

    // Weekly stats
    if (!weeklyStats.has(weekKey)) {
      weeklyStats.set(weekKey, {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        weekStart: getWeekStart(date),
      });
    }
    const weekStat = weeklyStats.get(weekKey);
    weekStat.total++;
    if (record.present) weekStat.present++;
    else weekStat.absent++;
    if (record.status === 'LATE') weekStat.late++;

    // Daily pattern (0 = Sunday, 1 = Monday, etc.)
    if (!dailyPattern.has(dayOfWeek)) {
      dailyPattern.set(dayOfWeek, { total: 0, present: 0 });
    }
    const dayPattern = dailyPattern.get(dayOfWeek);
    dayPattern.total++;
    if (record.present) dayPattern.present++;
  });

  // Convert maps to arrays and calculate percentages
  const monthlyData = Array.from(monthlyStats.entries()).map(([key, stats]) => {
    const [year, month] = key.split('-').map(Number);
    return {
      month: new Date(year, month).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      ...stats,
      percentage:
        stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0,
    };
  });

  const weeklyData = Array.from(weeklyStats.entries())
    .map(([key, stats]) => ({
      week: key,
      ...stats,
      percentage:
        stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0,
    }))
    .sort(
      (a, b) =>
        new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime()
    );

  const dayPatternData = Array.from(dailyPattern.entries())
    .map(([day, stats]) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
      dayNumber: day,
      ...stats,
      percentage:
        stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0,
    }))
    .sort((a, b) => a.dayNumber - b.dayNumber);

  // Calculate overall stats
  const totalDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter((r) => r.present).length;
  const absentDays = totalDays - presentDays;
  const lateDays = attendanceRecords.filter((r) => r.status === 'LATE').length;
  const overallPercentage =
    totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return {
    student,
    overallStats: {
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      percentage: overallPercentage,
    },
    monthlyData,
    weeklyData,
    dayPatternData,
    recentRecords: attendanceRecords.slice(-30), // Last 30 records
  };
}

export async function getAttendanceAlerts(studentId?: string) {
  const parent = await getParentInfo();
  const today = new Date();

  const studentsToCheck = studentId
    ? parent.students.filter((ps) => ps.student.id === studentId)
    : parent.students;

  const alerts = [];

  for (const parentStudent of studentsToCheck) {
    const student = parentStudent.student;

    // Check for low attendance (below 75%)
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthAttendance = await prisma.studentAttendance.aggregate({
      where: {
        studentId: student.id,
        date: { gte: monthStart, lte: today },
      },
      _count: { _all: true, present: true },
    });

    const monthPercentage =
      monthAttendance._count._all > 0
        ? Math.round(
            ((monthAttendance._count.present || 0) /
              monthAttendance._count._all) *
              100
          )
        : 0;

    if (monthPercentage < 75 && monthAttendance._count._all >= 5) {
      alerts.push({
        type: 'LOW_ATTENDANCE',
        severity: monthPercentage < 60 ? 'HIGH' : 'MEDIUM',
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        message: `${student.firstName}'s attendance is ${monthPercentage}% this month`,
        percentage: monthPercentage,
      });
    }

    // Check for consecutive absences
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);
    const recentAttendance = await prisma.studentAttendance.findMany({
      where: {
        studentId: student.id,
        date: { gte: last7Days, lte: today },
      },
      orderBy: { date: 'desc' },
    });

    let consecutiveAbsences = 0;
    for (const record of recentAttendance) {
      if (!record.present) {
        consecutiveAbsences++;
      } else {
        break;
      }
    }

    if (consecutiveAbsences >= 3) {
      alerts.push({
        type: 'CONSECUTIVE_ABSENCES',
        severity: consecutiveAbsences >= 5 ? 'HIGH' : 'MEDIUM',
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        message: `${student.firstName} has been absent for ${consecutiveAbsences} consecutive days`,
        days: consecutiveAbsences,
      });
    }

    // Check if not marked today (after 10 AM)
    const currentHour = new Date().getHours();
    if (currentHour >= 10) {
      const todayAttendance = await prisma.studentAttendance.findUnique({
        where: {
          studentId_date: {
            studentId: student.id,
            date: today,
          },
        },
      });

      if (!todayAttendance) {
        alerts.push({
          type: 'NOT_MARKED',
          severity: 'LOW',
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          message: `${student.firstName}'s attendance not marked today`,
        });
      }
    }
  }

  return alerts;
}

// Helper functions
function getWeekKey(date: Date): string {
  const weekStart = getWeekStart(date);
  return weekStart.toISOString().split('T')[0];
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}
