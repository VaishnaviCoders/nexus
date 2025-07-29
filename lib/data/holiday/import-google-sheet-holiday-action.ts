'use server';
import { getCurrentAcademicYearId } from '@/lib/academicYear';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { goggleImportHolidayFormSchema } from '@/lib/schemas';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const ImportGoogleSheetHolidayAction = async (
  data: z.infer<typeof goggleImportHolidayFormSchema>
) => {
  try {
    const organizationId = await getOrganizationId();
    const user = await currentUser();
    const academicYearData = await getCurrentAcademicYearId();

    if (!academicYearData) {
      // Handle the missing academic year here
      // You can redirect, show a message, throw an error, etc.
      throw new Error('No current academic year is set.');
    }

    const { academicYearId } = academicYearData;

    // Validate data against schema
    const validatedData = goggleImportHolidayFormSchema.parse(data);

    await prisma.academicCalendar.createMany({
      data: validatedData.map((holiday) => ({
        name: holiday.name,
        startDate: holiday.startDate,
        endDate: holiday.endDate,
        type: holiday.type,
        reason: holiday.reason,
        isRecurring: holiday.isRecurring,
        organizationId,
        createdBy: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
        academicYearId,
      })),
      skipDuplicates: true,
    });
    revalidatePath('/dashboard/holidays');
  } catch (error) {
    console.error('Error importing holidays:', error);
    return { success: false, message: 'Failed to import holidays' };
  }
};
