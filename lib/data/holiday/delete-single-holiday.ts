'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const deleteSingleHolidayAction = async (holidayId: string) => {
  await prisma.academicCalendar.delete({
    where: {
      id: holidayId,
    },
  });
  revalidatePath('/dashboard/holiday');
};
