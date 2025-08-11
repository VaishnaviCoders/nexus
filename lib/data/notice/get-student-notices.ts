'use server';

import { getCurrentAcademicYearId } from '@/lib/academicYear';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export async function getStudentNotices() {
  const organizationId = await getOrganizationId();
  const academicYearData = await getCurrentAcademicYearId();

  if (!academicYearData) {
    // Handle the missing academic year here
    // You can redirect, show a message, throw an error, etc.
    throw new Error('No current academic year is set.');
  }

  const { academicYearId } = academicYearData;

  const notices = await prisma.notice.findMany({
    where: {
      organizationId,
      academicYearId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return notices;
}
