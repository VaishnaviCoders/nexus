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
    todayAttendance,
    thisMonthAttendance,
    pendingComplaints,
    recentNotices,
    upcomingHolidays,
    classPerformance,
  ] = await Promise.all([
    prisma.student.count({
      where: {
        sectionId: {
          in: uniqueSectionIds,
        },
      },
    }),

    prisma.studentAttendance.aggregate({
      where: {
        sectionId: {
          in: uniqueSectionIds,
        },
        date: today,
      },
      _count: {
        _all: true,
        present: true,
      },
    }),

    prisma.studentAttendance.aggregate({
      where: {
        sectionId: {
          in: uniqueSectionIds,
        },
        date: {
          gte: new Date(today.getFullYear(), today.getMonth(), 1),
          lte: today,
        },
      },
      _count: {
        _all: true,
        present: true,
      },
    }),

    prisma.anonymousComplaint.count({
      where: {
        academicYearId,
        organizationId,
        currentStatus: {
          in: ['PENDING', 'UNDER_REVIEW', 'INVESTIGATING'],
        },
      },
    }),

    prisma.notice.findMany({
      where: {
        organizationId,
        targetAudience: {
          has: 'TEACHER',
        },
        endDate: {
          gte: today,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    }),

    prisma.academicCalendar.findMany({
      where: {
        organizationId,
        startDate: {
          gte: today,
        },
      },
      orderBy: {
        startDate: 'asc',
      },
      take: 3,
    }),

    prisma.studentAttendance.groupBy({
      by: ['sectionId'],
      where: {
        sectionId: {
          in: uniqueSectionIds,
        },
        date: {
          gte: new Date(today.getFullYear(), today.getMonth(), 1),
        },
      },
      _count: {
        _all: true,
        present: true,
      },
    }),
  ]);

  const todayAttendancePercentage = todayAttendance._count._all
    ? Math.round(
        ((todayAttendance._count.present || 0) / todayAttendance._count._all) *
          100
      )
    : 0;

  const monthAttendancePercentage = thisMonthAttendance._count._all
    ? Math.round(
        ((thisMonthAttendance._count.present || 0) /
          thisMonthAttendance._count._all) *
          100
      )
    : 0;

  return {
    teacher,
    totalStudents,
    todayAttendance: {
      total: todayAttendance._count._all,
      present: todayAttendance._count.present || 0,
      absent:
        todayAttendance._count._all - (todayAttendance._count.present || 0),
      percentage: todayAttendancePercentage,
    },
    monthAttendance: {
      percentage: monthAttendancePercentage,
      totalRecords: thisMonthAttendance._count._all,
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
