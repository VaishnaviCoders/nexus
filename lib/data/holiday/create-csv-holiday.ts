'use server';

import { getCurrentAcademicYearId } from '@/lib/academicYear';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { singleHolidayFormSchema } from '@/lib/schemas';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

type HolidayCSVData = {
  name: string;
  startDate: Date;
  endDate: Date;
  type: string; // should be one of CalendarEventType strings
  reason: string | null;
  isRecurring: boolean;
};

export const createCsvHolidayAction = async (holidayData: HolidayCSVData) => {
  // Validate using existing Zod schema; adjust shape if needed
  const validated = singleHolidayFormSchema.parse({
    name: holidayData.name,
    startDate: holidayData.startDate,
    endDate: holidayData.endDate,
    type: holidayData.type,
    reason: holidayData.reason,
    isRecurring: holidayData.isRecurring,
  });

  const user = await currentUser();
  const organizationId = await getOrganizationId();
  const academicYearData = await getCurrentAcademicYearId();

  if (!academicYearData) {
    // Handle the missing academic year here
    // You can redirect, show a message, throw an error, etc.
    throw new Error('No current academic year is set.');
  }

  const { academicYearId } = academicYearData;
  await prisma.academicCalendar.createMany({
    data: {
      name: validated.name,
      startDate: validated.startDate,
      endDate: validated.endDate,
      type: validated.type,
      reason: validated.reason,
      isRecurring: validated.isRecurring,
      organizationId,
      createdBy:
        `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Unknown',
      createdAt: new Date(),
      academicYearId,
    },
    skipDuplicates: true,
  });

  // Revalidate the dashboard page after insertion
  revalidatePath('/dashboard/holiday');
};
