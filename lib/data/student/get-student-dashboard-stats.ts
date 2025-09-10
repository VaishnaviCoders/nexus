'use server';

import prisma from '@/lib/db';

export const getStudentDashboardStats = async (studentId: string) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      sectionId: true,
    },
  });

  if (!student) throw new Error('Student not found');

  // Attendance Rate (last 30 days)
  const attendanceRecords = await prisma.studentAttendance.findMany({
    where: {
      studentId: student.id,
    },
    select: {
      present: true,
    },
  });

  const total = attendanceRecords.length;
  const present = attendanceRecords.filter((a) => a.present).length;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

  // GPA (Placeholder – needs real model later)
  const gpa = 3.6; // You can calculate or mock this if no mark/performance model exists yet.

  // Upcoming Exams (Mock until exams model added)
  const upcomingExams = await prisma.exam.findMany({
    where: {
      sectionId: student.sectionId,
      status: 'UPCOMING',
      startDate: {
        gte: new Date(),
      },
    },
    select: {
      startDate: true,
      title: true,
      subject: {
        select: {
          name: true,
          code: true,
        },
      },
    },
    orderBy: { startDate: 'asc' },
    take: 5,
  });

  // Pending Assignments (Mock until assignments model added)
  const pendingAssignments = 4;

  return {
    attendanceRate,
    gpa,
    upcomingExams,
    pendingAssignments,
  };
};
