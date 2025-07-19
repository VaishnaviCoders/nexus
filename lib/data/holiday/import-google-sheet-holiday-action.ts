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
    const { academicYearId } = await getCurrentAcademicYearId();

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
