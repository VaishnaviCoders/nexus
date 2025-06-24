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

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const yearStart = new Date(today.getFullYear(), 0, 1);
  const last14Start = new Date(today);
  last14Start.setDate(today.getDate() - 13); // incl

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

      const monthStats = await prisma.studentAttendance.groupBy({
        by: ['status'],
        where: {
          studentId: student.id,
          date: { gte: monthStart },
        },
        _count: true,
      });

      const monthPresent =
        monthStats.find((r) => r.status === 'PRESENT')?._count || 0;
      const monthTotal = monthStats.reduce((sum, r) => sum + r._count, 0);
      const attendancePercentage =
        monthTotal > 0 ? Math.round((monthPresent / monthTotal) * 100) : 0;

      // 3. Year stats
      const yearStats = await prisma.studentAttendance.groupBy({
        by: ['status'],
        where: {
          studentId: student.id,
          date: { gte: yearStart },
        },
        _count: true,
      });

      const yearPresent =
        yearStats.find((r) => r.status === 'PRESENT')?._count || 0;
      const yearTotal = yearStats.reduce((sum, r) => sum + r._count, 0);

      // 4. Last 14 Days (sorted by date ASC)
      const last14 = await prisma.studentAttendance.findMany({
        where: {
          studentId: student.id,
          date: { gte: last14Start, lte: today },
        },
        orderBy: { date: 'asc' },
        select: { date: true, status: true },
      });

      const last14Map = new Map(
        last14.map((entry) => [entry.date.toDateString(), entry.status])
      );
      const last14Days = Array.from({ length: 14 }).map((_, i) => {
        const d = new Date(last14Start);
        d.setDate(d.getDate() + i);
        const key = d.toDateString();
        return {
          date: d,
          status: last14Map.get(key) || 'NOT_MARKED',
        };
      });
      // 5. Streak logic
      let currentStreak = 0;
      let bestStreak = 0;
      let tempStreak = 0;

      for (let i = last14Days.length - 1; i >= 0; i--) {
        const status = last14Days[i].status;
        if (status === 'PRESENT') {
          tempStreak += 1;
          if (i === last14Days.length - 1) currentStreak = tempStreak;
        } else {
          bestStreak = Math.max(bestStreak, tempStreak);
          tempStreak = 0;
        }
      }
      bestStreak = Math.max(bestStreak, tempStreak);

      // 6. Pending fees
      const pendingFees = await prisma.fee.aggregate({
        where: {
          studentId: student.id,
          status: { in: ['UNPAID', 'OVERDUE'] },
        },
        _sum: { pendingAmount: true },
        _count: { _all: true },
      });

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
        month: {
          present: monthPresent,
          total: monthTotal,
          percentage: attendancePercentage,
        },
        year: {
          present: yearPresent,
          total: yearTotal,
        },
        last14Days: last14Days, // Array of { date, status }
        streak: {
          current: currentStreak,
          best: bestStreak,
        },
        pendingFees: {
          amount: pendingFees._sum.pendingAmount || 0,
          count: pendingFees._count._all || 0,
        },
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

  const alerts: {
    type: 'LOW_ATTENDANCE' | 'CONSECUTIVE_ABSENCES' | 'NOT_MARKED';
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    studentId: string;
    studentName: string;
    message: string;
    percentage?: number;
    days?: number;
  }[] = [];

  for (const parentStudent of studentsToCheck) {
    const student = parentStudent.student;

    // Check for low attendance (below 75%)
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [presentCount, totalCount] = await Promise.all([
      prisma.studentAttendance.count({
        where: {
          studentId: student.id,
          date: { gte: monthStart, lte: today },
          present: true,
        },
      }),
      prisma.studentAttendance.count({
        where: {
          studentId: student.id,
          date: { gte: monthStart, lte: today },
        },
      }),
    ]);

    const monthPercentage =
      totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

    if (monthPercentage < 75 && totalCount >= 5) {
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

    // Check if not marked today (after 7 AM)
    const currentHour = new Date().getHours();
    if (currentHour >= 7) {
      const startOfDay = new Date(today);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      const todayAttendance = await prisma.studentAttendance.findFirst({
        where: {
          studentId: student.id,
          date: {
            gte: startOfDay,
            lte: endOfDay,
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
