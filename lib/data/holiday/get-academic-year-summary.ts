import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

type Props = {
  startDate: Date;
  endDate: Date;
};
export const getAcademicYearSummary = async ({ startDate, endDate }: Props) => {
  const organizationId = await getOrganizationId(); // Assuming this function retrieves the current organization ID

  // Fetch holidays for the organization within the specified date range
  const holidays = await prisma.academicCalendar.findMany({
    where: {
      organizationId,
      startDate: {
        gte: new Date(startDate),
      },
      endDate: {
        lte: new Date(endDate),
      },
    },
  });

  // Calculate total days

  const totalDays =
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  // Calculate total holiday days (sum of durations for each holiday)
  const holidayDays = new Set<string>();
  holidays.forEach((holiday) => {
    const start = new Date(holiday.startDate);
    const end = new Date(holiday.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      holidayDays.add(d.toISOString().split('T')[0]); // Add unique holiday dates
    }
  });
  const totalHolidays = holidayDays.size;

  // Initialize counters
  let totalWorkingDays = 0;
  let totalWeekendDays = 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    // Check if the day is a weekend (Saturday or Sunday)
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    // Check if the day is a holiday
    const isHoliday = holidays.some((holiday) => {
      const holidayStart = new Date(holiday.startDate);
      const holidayEnd = new Date(holiday.endDate);
      return d >= holidayStart && d <= holidayEnd;
    });

    // Count weekend days
    if (isWeekend) {
      totalWeekendDays++;
    }

    // If it's not a weekend and not a holiday, count it as a working day
    if (!isWeekend && !isHoliday) {
      totalWorkingDays++;
    }
  }

  return {
    totalDays,
    totalWorkingDays,
    totalHolidays,
    totalWeekendDays, // Include weekend days in the return object
  };
};
