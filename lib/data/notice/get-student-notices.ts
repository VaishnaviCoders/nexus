'use server';

import { getCurrentAcademicYearId } from '@/lib/academicYear';
import { getCurrentUserByRole } from '@/lib/auth';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export async function getStudentNotices() {
  const organizationId = await getOrganizationId();
  const academicYearId = await getCurrentAcademicYearId();
  const { role } = await getCurrentUserByRole();

  const notices = await prisma.notice.findMany({
    where: {
      organizationId,
      status: { in: ['PUBLISHED', 'EXPIRED'] },
      targetAudience: {
        has: role.toUpperCase(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take:10
  });
  return notices;
}
