'use server';

import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export async function getStudentStats() {
  const organizationId = await getOrganizationId();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalStudents,
    activeStudents,
    newAdmissionsThisMonth,
    todayAttendance,
  ] = await Promise.all([
    // Total Students
    prisma.student.count({
      where: { organizationId },
    }),

    // Active Students (those with recent attendance)
    prisma.student.count({
      where: {
        organizationId,
        StudentAttendance: {
          some: {
            date: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        },
      },
    }),

    // New Admissions This Month
    prisma.student.count({
      where: {
        organizationId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),

    // Today's Attendance
    prisma.studentAttendance.aggregate({
      where: {
        section: { organizationId },
        date: today,
      },
      _count: {
        _all: true,
        present: true,
      },
    }),
  ]);

  const presentToday = todayAttendance._count.present || 0;
  const totalAttendanceRecords = todayAttendance._count._all || 0;
  const attendancePercentage =
    totalAttendanceRecords > 0
      ? Math.round((presentToday / totalAttendanceRecords) * 100)
      : 0;

  return {
    totalStudents,
    activeStudents,
    newAdmissionsThisMonth,
    presentToday,
    totalAttendanceRecords,
    attendancePercentage,
  };
}

export async function getTeacherStats() {
  const organizationId = await getOrganizationId();

  const [totalTeachers, activeTeachers, newTeachersThisMonth] =
    await Promise.all([
      // Total Teachers
      prisma.teacher.count({
        where: { organizationId },
      }),

      // Active Teachers
      prisma.teacher.count({
        where: {
          organizationId,
          isActive: true,
          employmentStatus: 'ACTIVE',
        },
      }),

      // New Teachers This Month
      prisma.teacher.count({
        where: {
          organizationId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

  return {
    totalTeachers,
    activeTeachers,
    newTeachersThisMonth,
  };
}

export async function getRevenueStats() {
  const organizationId = await getOrganizationId();
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const [
    totalRevenue,
    collectedRevenue,
    overdueFeesCount,
    thisMonthCollection,
  ] = await Promise.all([
    // Total Expected Revenue (all fees)
    prisma.fee.aggregate({
      where: { organizationId },
      _sum: { totalFee: true },
    }),

    // Total Collected Revenue
    prisma.feePayment.aggregate({
      where: {
        organizationId,
        status: 'COMPLETED',
      },
      _sum: { amount: true },
    }),

    // Overdue Fees Count
    prisma.fee.count({
      where: {
        organizationId,
        status: 'OVERDUE',
        dueDate: { lt: new Date() },
      },
    }),

    // This Month's Collection
    prisma.feePayment.aggregate({
      where: {
        organizationId,
        status: 'COMPLETED',
        paymentDate: { gte: currentMonth },
      },
      _sum: { amount: true },
    }),
  ]);

  const totalRevenueAmount = totalRevenue._sum.totalFee || 0;
  const collectedRevenueAmount = collectedRevenue._sum.amount || 0;
  const pendingRevenue = totalRevenueAmount - collectedRevenueAmount;
  const revenuePercentage =
    totalRevenueAmount > 0
      ? Math.round((collectedRevenueAmount / totalRevenueAmount) * 100)
      : 0;

  return {
    totalRevenue: totalRevenueAmount,
    collectedRevenue: collectedRevenueAmount,
    pendingRevenue,
    revenuePercentage,
    overdueFeesCount,
    thisMonthCollection: thisMonthCollection._sum.amount || 0,
  };
}

export async function getIssuesStats() {
  const organizationId = await getOrganizationId();

  const [totalIssues, pendingIssues, resolvedIssues, criticalIssues] =
    await Promise.all([
      // Total Issues
      prisma.anonymousComplaint.count({
        where: { organizationId },
      }),

      // Pending Issues
      prisma.anonymousComplaint.count({
        where: {
          organizationId,
          currentStatus: { in: ['PENDING', 'UNDER_REVIEW', 'INVESTIGATING'] },
        },
      }),

      // Resolved Issues
      prisma.anonymousComplaint.count({
        where: {
          organizationId,
          currentStatus: 'RESOLVED',
        },
      }),

      // Critical Issues
      prisma.anonymousComplaint.count({
        where: {
          organizationId,
          severity: 'CRITICAL',
          currentStatus: { not: 'RESOLVED' },
        },
      }),
    ]);

  return {
    totalIssues,
    pendingIssues,
    resolvedIssues,
    criticalIssues,
  };
}