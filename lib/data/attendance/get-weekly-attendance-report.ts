'use server';
import { AttendanceStatus } from '@/app/generated/prisma/enums';
import prisma from '@/lib/db';
import {
  addDays,
  formatISO,
  startOfWeek,
  eachDayOfInterval,
  isWeekend,
} from 'date-fns';

export async function getWeeklyAttendanceReport(studentId: string) {
  // 1. student profile
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { grade: true, section: true, organization: true },
  });
  if (!student) throw new Error('Student not found');

  // 2. weekly window (Mon–Sun)
  // 2️⃣  past weekly window (Mon–Sun that ended last Sunday)
  const today = new Date();
  const weekStart = startOfWeek(addDays(today, -7), { weekStartsOn: 1 }); // last Mon 00:00
  const weekEnd = addDays(weekStart, 6); // last Sun 23:59

  // 3. fetch rows for the week
  const weeklyRows = await prisma.studentAttendance.findMany({
    where: { studentId, date: { gte: weekStart, lte: weekEnd } },
    orderBy: { date: 'asc' },
  });

  // 4. build 7 daily records (fill gaps → absent)
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const weeklyRecords = weekDays.map((d) => {
    const row = weeklyRows.find((r) =>
      r.date.toISOString().startsWith(formatISO(d, { representation: 'date' }))
    );
    return {
      date: formatISO(d, { representation: 'date' }),
      present: row?.present ?? false,
      status: row?.status ?? AttendanceStatus.ABSENT,
      note: row?.note ?? null,
    };
  });

  // 5. cumulative stats for the *whole academic year*
  //    We assume the organisation uses weekdays only.
  const yearRows = await prisma.studentAttendance.findMany({
    where: { studentId },
  });
  const totalPossibleYear = yearRows.length; // rows already exclude weekends / holidays
  const totalPresentYear = yearRows.filter((r) => r.present).length;
  const yearPercentage =
    totalPossibleYear > 0
      ? Math.round((totalPresentYear / totalPossibleYear) * 100)
      : 0;

  return {
    student: {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      middleName: student.middleName,
      rollNumber: student.rollNumber,
      profileImage: student.profileImage,
      grade: { grade: student.grade.grade },
      section: { name: student.section.name },
    },
    attendanceRecords: weeklyRecords,
    weekRange: {
      startDate: formatISO(weekStart, { representation: 'date' }),
      endDate: formatISO(weekEnd, { representation: 'date' }),
    },
    organization: {
      name: student.organization.name,
      organizationLogo: student.organization.organizationLogo,
      contactEmail: student.organization.contactEmail,
      contactPhone: student.organization.contactPhone,
    },
    cumulativeStats: {
      totalDaysPresent: totalPresentYear,
      totalPossibleDays: totalPossibleYear,
      attendancePercentage: yearPercentage,
    },
  };
}
