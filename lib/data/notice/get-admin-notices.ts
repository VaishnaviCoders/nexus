'use server';

import { getCurrentAcademicYearId } from '@/lib/academicYear';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export async function getAdminNotices() {
  const organizationId = await getOrganizationId();
  const academicYearId = await getCurrentAcademicYearId();

  const notices = await prisma.notice.findMany({
    where: {
    academicYearId,
      organizationId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return notices;
}
