'use server';

import prisma from '../lib/db';
import { getOrganizationId } from '../lib/organization';
import { cache } from 'react';

export async function getCurrentAcademicYear() {
  const organizationId = await getOrganizationId();
  const academicYear = await prisma.academicYear.findFirst({
    where: {
      organizationId,
      isCurrent: true,
    },
  });

  return academicYear || null;
}

export const getCurrentAcademicYearId = cache(async (): Promise<string> => {
  const organizationId = await getOrganizationId();

  const currentYear = await prisma.academicYear.findFirst({
    where: {
      organizationId,
      isCurrent: true,
    },
    select: {
      id: true,
    },
  });

  if (!currentYear) {
    throw new Error('No current academic year found for organization');
  }

  return currentYear.id;
});