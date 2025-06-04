'use server';

import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { revalidatePath } from 'next/cache';

export const deleteAllHolidaysAction = async () => {
  const organizationId = await getOrganizationId();

  await prisma.academicCalendar.deleteMany({
    where: {
      organizationId,
    },
  });
  revalidatePath('/dashboard/holiday');
};
