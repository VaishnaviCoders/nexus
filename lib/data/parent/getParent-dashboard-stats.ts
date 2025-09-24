'use server';

import { getCurrentUserByRole } from '@/lib/auth';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
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

export async function getChildrenOverview() {
  const parent = await getParentInfo();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const last14Start = new Date(today);
  last14Start.setDate(today.getDate() - 13); // includes today

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

      // 2. Month stats
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
        isPrimary: parentStudent.isPrimary,
        todayAttendance: todayAttendance?.status || 'NOT_MARKED',
        attendancePercentage,
        pendingFees: pendingFees._sum.pendingAmount || 0,
        pendingFeesCount: pendingFees._count._all || 0,
      };
    })
  );

  return childrenData;
}

export async function getAttendanceSummary() {
  const parent = await getParentInfo();
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const attendanceData = await Promise.all(
    parent.students.map(async (parentStudent) => {
      const student = parentStudent.student;

      // Get this month's detailed attendance
      const monthlyAttendance = await prisma.studentAttendance.findMany({
        where: {
          studentId: student.id,
          date: { gte: monthStart },
        },
        orderBy: { date: 'desc' },
        take: 30,
      });

      const totalDays = monthlyAttendance.length;
      const presentDays = monthlyAttendance.filter((a) => a.present).length;
      const absentDays = totalDays - presentDays;
      const attendancePercentage =
        totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

      return {
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        totalDays,
        presentDays,
        absentDays,
        attendancePercentage,
        recentAttendance: monthlyAttendance.slice(0, 7), // Last 7 days
      };
    })
  );

  return attendanceData;
}

export async function getFeesSummary() {
  const parent = await getParentInfo();

  const feesData = await Promise.all(
    parent.students.map(async (parentStudent) => {
      const student = parentStudent.student;

      // Get all fees for this student
      const [totalFees, paidFees, pendingFees, overdueFees] = await Promise.all(
        [
          prisma.fee.aggregate({
            where: { studentId: student.id },
            _sum: { totalFee: true },
            _count: { _all: true },
          }),
          prisma.fee.aggregate({
            where: { studentId: student.id, status: 'PAID' },
            _sum: { paidAmount: true },
            _count: { _all: true },
          }),
          prisma.fee.aggregate({
            where: { studentId: student.id, status: 'UNPAID' },
            _sum: { pendingAmount: true },
            _count: { _all: true },
          }),
          prisma.fee.aggregate({
            where: {
              studentId: student.id,
              status: 'OVERDUE',
              dueDate: { lt: new Date() },
            },
            _sum: { pendingAmount: true },
            _count: { _all: true },
          }),
        ]
      );

      // Get recent payments
      const recentPayments = await prisma.feePayment.findMany({
        where: {
          fee: { studentId: student.id },
          status: 'COMPLETED',
        },
        include: {
          fee: {
            include: { feeCategory: true },
          },
        },
        orderBy: { paymentDate: 'desc' },
        take: 5,
      });

      return {
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        totalFees: totalFees._sum.totalFee || 0,
        paidAmount: paidFees._sum.paidAmount || 0,
        pendingAmount: pendingFees._sum.pendingAmount || 0,
        overdueAmount: overdueFees._sum.pendingAmount || 0,
        pendingFeesCount: pendingFees._count._all || 0,
        overdueFeesCount: overdueFees._count._all || 0,
        recentPayments,
      };
    })
  );

  return feesData;
}

export async function getNoticesSummary() {
  const organizationId = await getOrganizationId();
  const { role } = await getCurrentUserByRole();

  // Get recent notices targeted to parents
  const notices = await prisma.notice.findMany({
    where: {
      organizationId,
      status: { in: ['PUBLISHED', 'EXPIRED'] },
      targetAudience: {
        has: role.toUpperCase(),
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return notices;
}

export async function getParentDashboardStats() {
  const [children, attendance, fees, notices] = await Promise.all([
    getChildrenOverview(),
    getAttendanceSummary(),
    getFeesSummary(),
    getNoticesSummary(),
  ]);

  // Calculate overall stats
  const totalChildren = children.length;
  const presentToday = children.filter(
    (c) => c.todayAttendance === 'PRESENT'
  ).length;
  const totalPendingFees = fees.reduce((sum, f) => sum + f.pendingAmount, 0);
  const totalOverdueFees = fees.reduce((sum, f) => sum + f.overdueAmount, 0);
  const unreadNotices = notices.length;
  const avgAttendance =
    children.length > 0
      ? Math.round(
          children.reduce((sum, c) => sum + c.attendancePercentage, 0) /
            children.length
        )
      : 0;

  return {
    totalChildren,
    presentToday,
    avgAttendance,
    totalPendingFees,
    totalOverdueFees,
    unreadNotices,
    children,
    attendance,
    fees,
    notices: notices.slice(0, 5), // Latest 5 notices
  };
}
