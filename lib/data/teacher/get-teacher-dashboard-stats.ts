'use server';

import { getCurrentAcademicYearId } from '@/lib/academicYear';
import { getCurrentUserByRole } from '@/lib/auth';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { getCurrentUserId } from '@/lib/user';

export async function getTeacherDashboardStats() {
  const academicYearId = await getCurrentAcademicYearId();
  const organizationId = await getOrganizationId();

  const userId = await getCurrentUserId();
  const teacher = await prisma.teacher.findUnique({
    where: {
      userId,
    },
    include: {
      teachingAssignment: true,
      section: true,
    },
  });

  if (!teacher) throw new Error('Teacher Not Found');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const teachingAssignments = teacher.teachingAssignment ?? [];
  const teachingSectionIds = teachingAssignments.map(
    (assignment) => assignment.sectionId
  );

  const uniqueSectionIds = [...new Set(teachingSectionIds.filter(Boolean))];

  const [
    totalStudents,
    todayTotal,
    todayPresent,
    monthTotal,
    monthPresent,
    pendingComplaints,
    recentNotices,
    upcomingHolidays,
    classPerformance,
  ] = await Promise.all([
    // 1. Total Students in assigned sections
    prisma.student.count({
      where: {
        sectionId: { in: uniqueSectionIds },
      },
    }),

    // 2. Today's total records marked
    prisma.studentAttendance.count({
      where: {
        sectionId: { in: uniqueSectionIds },
        date: today,
      },
    }),

    // 3. Today's present records
    prisma.studentAttendance.count({
      where: {
        sectionId: { in: uniqueSectionIds },
        date: today,
        present: true,
      },
    }),

    // 4. Monthly total records
    prisma.studentAttendance.count({
      where: {
        sectionId: { in: uniqueSectionIds },
        date: {
          gte: new Date(today.getFullYear(), today.getMonth(), 1),
          lte: today,
        },
      },
    }),

    // 5. Monthly present records
    prisma.studentAttendance.count({
      where: {
        sectionId: { in: uniqueSectionIds },
        date: {
          gte: new Date(today.getFullYear(), today.getMonth(), 1),
          lte: today,
        },
        present: true,
      },
    }),

    // 6. Pending Complaints
    prisma.anonymousComplaint.count({
      where: {
        academicYearId,
        organizationId,
        currentStatus: {
          in: ['PENDING', 'UNDER_REVIEW', 'INVESTIGATING'],
        },
      },
    }),

    // 7. Recent Notices
    prisma.notice.findMany({
      where: {
        organizationId,
        targetAudience: { has: 'TEACHER' },
        endDate: { gte: today },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),

    // 8. Upcoming Holidays
    prisma.academicCalendar.findMany({
      where: {
        organizationId,
        startDate: { gte: today },
      },
      orderBy: { startDate: 'asc' },
      take: 3,
    }),

    // 9. Class Performance (Section-wise monthly attendance)
    prisma.studentAttendance.groupBy({
      by: ['sectionId'],
      where: {
        sectionId: { in: uniqueSectionIds },
        date: { gte: new Date(today.getFullYear(), today.getMonth(), 1) },
      },
      _count: { _all: true },
    }),
  ]);

  const todayAttendancePercentage = todayTotal
    ? Math.round((todayPresent / todayTotal) * 100)
    : 0;

  const monthAttendancePercentage = monthTotal
    ? Math.round((monthPresent / monthTotal) * 100)
    : 0;

  return {
    teacher,
    totalStudents,
    todayAttendance: {
      total: todayTotal,
      present: todayPresent,
      absent: todayTotal - todayPresent,
      percentage: todayAttendancePercentage,
    },
    monthAttendance: {
      percentage: monthAttendancePercentage,
      totalRecords: monthTotal,
    },
    pendingComplaints,
    recentNotices,
    upcomingHolidays,
    classPerformance,
  };
}

export async function getRecentActivities() {
  const organizationId = await getOrganizationId();
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const { role } = await getCurrentUserByRole();

  // Get recent attendance records marked by this teacher
  const recentAttendance = await prisma.studentAttendance.findMany({
    where: {
      date: { gte: weekAgo },
    },
    include: {
      section: {
        include: {
          grade: true,
        },
      },
    },
    orderBy: { date: 'desc' },
    take: 10,
  });

  // Get recent notices created (if teacher has permission)
  const recentNotices = await prisma.notice.findMany({
    where: {
      organizationId,
      createdAt: { gte: weekAgo },
      targetAudience: {
        has: role.toUpperCase(),
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  // Combine and format activities
  const activities = [
    ...recentAttendance.map((attendance) => ({
      id: `attendance-${attendance.id}`,
      type: 'ATTENDANCE',
      title: 'Attendance Marked',
      description: `Marked attendance for Grade ${attendance.section.grade.grade}-${attendance.section.name}`,
      time: attendance.date,
      icon: 'Calendar',
    })),
    ...recentNotices.map((notice) => ({
      id: `notice-${notice.id}`,
      type: 'NOTICE',
      title: 'Notice Published',
      description: notice.title,
      time: notice.createdAt,
      icon: 'Bell',
    })),
  ];

  return activities
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8);
}
