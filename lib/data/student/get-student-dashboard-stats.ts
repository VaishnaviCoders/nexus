'use server';

import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const getStudentDashboardStats = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const student = await prisma.student.findFirst({
    where: {
      user: {
        clerkId: userId,
      },
    },
    select: {
      id: true,
      sectionId: true,
    },
  });

  console.log(student);

  if (!student) throw new Error('Student not found');

  // Attendance Rate (last 30 days)
  const attendanceRecords = await prisma.studentAttendance.findMany({
    where: {
      studentId: student.id,
      date: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
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
  const upcomingExams = 2;

  // Pending Assignments (Mock until assignments model added)
  const pendingAssignments = 4;

  return {
    attendanceRate,
    gpa,
    upcomingExams,
    pendingAssignments,
  };
};
