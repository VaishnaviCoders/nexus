'use server';

import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { cache } from 'react';

// Cache the teacher lookup for better performance
const getTeacherInfo = cache(async () => {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      teacher: {
        include: {
          organization: true,
          TeachingAssignment: {
            include: {
              subject: true,
              grade: true,
              section: true,
            },
          },
        },
      },
    },
  });

  if (!user?.teacher) throw new Error('Teacher profile not found');
  return user.teacher;
});

export async function getTeacherDashboardStats() {
  const teacher = await getTeacherInfo();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const teachingAssignments = teacher.TeachingAssignment ?? [];
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
        organizationId: teacher.organizationId,
        currentStatus: {
          in: ['PENDING', 'UNDER_REVIEW', 'INVESTIGATING'],
        },
      },
    }),

    prisma.notice.findMany({
      where: {
        organizationId: teacher.organizationId,
        isPublished: true,
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
        organizationId: teacher.organizationId,
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

export async function getTeacherClasses() {
  const teacher = await getTeacherInfo();

  // Get all classes this teacher is involved with
  const teachingSubjects = await prisma.teachingAssignment.findMany({
    where: { teacherId: teacher.id },
    include: {
      subject: true,
      grade: true,
      section: {
        include: {
          students: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
              rollNumber: true,
            },
          },
        },
      },
    },
  });

  // Get class teacher info if applicable
  const classTeacherInfo = teacher.TeachingAssignment
    ? {
        grade: teacher.TeachingAssignment.map((ta) => ta.grade.grade),
        section: teacher.TeachingAssignment.map((ta) => ta.section.name),
        // students: teacher.TeachingAssignment.map((ta) => ta.section.students),
        isClassTeacher: true,
      }
    : null;

  return {
    teachingSubjects,
    classTeacherInfo,
  };
}

export async function getTodaySchedule() {
  const teacher = await getTeacherInfo();
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // This would typically come from a timetable/schedule table
  // For now, we'll create a mock schedule based on teacher's subjects
  const schedule = teacher.TeachingAssignment.map((ts, index) => ({
    id: `schedule-${index}`,
    subject: ts.subject.name,
    grade: ts.grade.grade,
    section: ts.section.name,
    time: `${9 + index}:00 - ${10 + index}:00`,
    room: `Room ${101 + index}`,
    status: index < 2 ? 'COMPLETED' : index === 2 ? 'ONGOING' : 'UPCOMING',
  }));

  return schedule;
}

export async function getRecentActivities() {
  const teacher = await getTeacherInfo();
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

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
      organizationId: teacher.organizationId,
      createdAt: { gte: weekAgo },
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

// export async function getStudentPerformanceOverview() {
//   const teacher = await getTeacherInfo();

//   // Check if teacher is assigned as a class teacher for a section
//   const classTeacherSectionId = teacher?.classTeacher?.id ;

//   if (!classTeacherSectionId) {
//     return []; // No section assigned as class teacher
//   }

//   const today = new Date();
//   const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

//   // Get students in the class teacher's section
//   const students = await prisma.student.findMany({
//     where: {
//       sectionId: classTeacherSectionId,
//     },
//     include: {
//       StudentAttendance: {
//         where: {
//           date: {
//             gte: monthStart,
//             lte: today,
//           },
//         },
//         select: {
//           present: true,
//         },
//       },
//       fees: {
//         where: {
//           status: {
//             in: ['UNPAID', 'OVERDUE'],
//           },
//         },
//         select: {
//           pendingAmount: true,
//         },
//       },
//     },
//   });

//   const performanceData = students.map((student) => {
//     const totalDays = student.StudentAttendance.length;
//     const presentDays = student.StudentAttendance.filter(
//       (a) => a.present
//     ).length;

//     const attendancePercentage =
//       totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

//     const pendingFees = student.fees.reduce(
//       (sum, fee) => sum + (fee.pendingAmount || 0),
//       0
//     );

//     const status =
//       attendancePercentage >= 90
//         ? 'EXCELLENT'
//         : attendancePercentage >= 75
//           ? 'GOOD'
//           : 'NEEDS_ATTENTION';

//     return {
//       id: student.id,
//       name: `${student.firstName} ${student.lastName}`,
//       rollNumber: student.rollNumber,
//       attendancePercentage,
//       pendingFees,
//       status,
//     };
//   });

//   // Sort students by attendance performance (descending)
//   return performanceData.sort(
//     (a, b) => b.attendancePercentage - a.attendancePercentage
//   );
// }
