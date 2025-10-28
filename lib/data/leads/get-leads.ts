'use server';

import { getCurrentAcademicYearId } from '@/lib/academicYear';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export async function getLeads() {
  const organizationId = await getOrganizationId();
  const academicYearId = await getCurrentAcademicYearId();

  const leads = await prisma.lead.findMany({
    where: {
      organizationId,
      academicYearId,
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          email: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          firstName: true,
        },
      },
      academicYear: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return leads;
}
