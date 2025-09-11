'use server';

import { getCurrentAcademicYearId } from '@/lib/academicYear';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export async function getStudentNotices() {
  const organizationId = await getOrganizationId();
  const academicYearId = await getCurrentAcademicYearId();

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
