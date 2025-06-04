'use server';

import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { singleHolidayFormSchema } from '@/lib/schemas';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const createSingleHolidayAction = async (
  data: z.infer<typeof singleHolidayFormSchema>
) => {
  const validateData = singleHolidayFormSchema.parse(data);

  const user = await currentUser();
  const organizationId = await getOrganizationId();

  await prisma.academicCalendar.create({
    data: {
      name: validateData.name,
      startDate: validateData.startDate,
      endDate: validateData.endDate,
      type: validateData.type,
      reason: validateData.reason,
      organizationId: organizationId,
      isRecurring: validateData.isRecurring,
      createdBy: `${user?.firstName} ${user?.lastName} || "Unknown"`,
      createdAt: new Date(),
    },
  });
  revalidatePath('/dashboard/holiday');
};
