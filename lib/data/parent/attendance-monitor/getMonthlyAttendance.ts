import prisma from '@/lib/db';
import { format } from 'date-fns';

//Random Date
// const records = await prisma.studentAttendance.createMany({
//   data: {
//     studentId: 'cm965kxp10001vhr82rp4658c',
//     date: new Date(2023, 1, 1),
//     status: 'PRESENT',
//     note: 'test',
//     recordedBy: 'admin',
//     present: true,
//     sectionId: 'cm8lfvs1o0001vhughey8jge6',
//   },
// });

// console.log(records);
export async function getMonthlyAttendance(childId: string) {
  const records = await prisma.studentAttendance.findMany({
    where: {
      studentId: childId,
    },
    select: {
      date: true,
      present: true,
      status: true,
    },
  });

  const grouped = new Map<
    string,
    {
      month: string;
      year: number;
      totalDays: number;
      presentDays: number;
      absentDays: number;
      lateDays: number;
    }
  >();

  for (const record of records) {
    const dateObj = new Date(record.date);
    const month = format(dateObj, 'MMMM'); // e.g. "January"
    const year = dateObj.getFullYear();
    const key = `${year}-${month}`;

    if (!grouped.has(key)) {
      grouped.set(key, {
        month,
        year,
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
      });
    }

    const stats = grouped.get(key)!;
    stats.totalDays += 1;
    if (record.present) {
      stats.presentDays += 1;
    } else {
      stats.absentDays += 1;
    }
    if (record.status === 'LATE') {
      stats.lateDays += 1;
    }
  }

  const result = Array.from(grouped.values()).map((stat) => ({
    ...stat,
    percentage: stat.totalDays
      ? Math.round((stat.presentDays / stat.totalDays) * 100)
      : 0,
  }));

  return result;
}
