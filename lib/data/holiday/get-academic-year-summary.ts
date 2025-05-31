import { eachDayOfInterval, isWeekend, isSameDay } from 'date-fns';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export const getAcademicYearSummary = async ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  // Get all holidays for the organization in range

  const organizationId = await getOrganizationId();
  const holidays = await prisma.academicCalendar.findMany({
    where: {
      organizationId,
      startDate: {
        lte: endDate,
      },
      endDate: {
        gte: startDate,
      },
    },
  });

  // Flatten holiday ranges into individual dates
  const holidayDates = new Set<string>();
  for (const holiday of holidays) {
    const range = eachDayOfInterval({
      start: holiday.startDate,
      end: holiday.endDate,
    });
    range.forEach((date) => holidayDates.add(date.toDateString()));
  }

  // Iterate through each day in the range
  const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });

  let totalDays = 0;
  let weekendCount = 0;
  let holidayCount = 0;
  let workingDaysCount = 0;

  for (const day of daysInRange) {
    totalDays++;

    const isWeekendDay = isWeekend(day);
    const isHoliday = holidayDates.has(day.toDateString());

    if (isWeekendDay) weekendCount++;
    if (isHoliday) holidayCount++;

    if (!isWeekendDay && !isHoliday) {
      workingDaysCount++;
    }
  }

  return {
    totalDays,
    weekendCount,
    holidayCount,
    workingDaysCount,
  };
};
