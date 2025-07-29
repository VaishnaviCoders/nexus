import { getCurrentAcademicYearId } from '@/lib/academicYear';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { eachDayOfInterval, isSaturday, isSunday } from 'date-fns';

export const getAcademicYearSummary = async () => {
  const organizationId = await getOrganizationId();
  const academicYearData = await getCurrentAcademicYearId();

  if (!academicYearData) {
    // Handle the missing academic year here
    // You can redirect, show a message, throw an error, etc.
    throw new Error('No current academic year is set.');
  }

  const { academicYearId } = academicYearData;
  // ✅ Fetch academic year start and end dates
  const academicYear = await prisma.academicYear.findUnique({
    where: { id: academicYearId },
    select: { startDate: true, endDate: true },
  });

  if (!academicYear) throw new Error('Academic year not found');

  const { startDate, endDate } = academicYear;

  // ✅ Fetch holidays for that academic year
  const holidays = await prisma.academicCalendar.findMany({
    where: {
      organizationId,
      academicYearId,
    },
    select: {
      startDate: true,
      endDate: true,
    },
  });

  // ✅ All dates in academic year
  const allDates = eachDayOfInterval({
    start: new Date(startDate),
    end: new Date(endDate),
  });
  const totalDays = allDates.length;

  // ✅ Count weekends
  const weekendDays = allDates.filter(
    (date) => isSaturday(date) || isSunday(date)
  );
  const totalWeekendDays = weekendDays.length;

  // ✅ Flatten holidays into individual dates
  const holidayDates = new Set<string>();
  for (const holiday of holidays) {
    const range = eachDayOfInterval({
      start: new Date(holiday.startDate),
      end: new Date(holiday.endDate),
    });
    range.forEach((d) => holidayDates.add(d.toDateString()));
  }
  const totalHolidays = holidayDates.size;

  // ✅ Remove double-counted weekend+holiday dates
  const overlappingHolidayWeekends = weekendDays.filter((date) =>
    holidayDates.has(date.toDateString())
  ).length;

  // ✅ Final working day calculation
  const totalWorkingDays =
    totalDays - totalWeekendDays - totalHolidays + overlappingHolidayWeekends;

  return {
    totalDays,
    totalWorkingDays,
    totalHolidays,
    totalWeekendDays,
  };
};
