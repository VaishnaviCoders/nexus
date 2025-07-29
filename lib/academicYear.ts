'use server';

import prisma from '../lib/db';
import { getOrganizationId } from '../lib/organization';

export async function getCurrentAcademicYear() {
  const organizationId = await getOrganizationId();

  console.log(organizationId);

  const academicYear = await prisma.academicYear.findFirst({
    where: {
      organizationId,
      isCurrent: true,
    },
  });

  return academicYear || null;
}

export async function getCurrentAcademicYearId() {
  const organizationId = await getOrganizationId();

  const academicYear = await prisma.academicYear.findFirst({
    where: {
      organizationId,
      isCurrent: true,
    },
    select: {
      id: true,
    },
  });

  return academicYear
    ? {
        academicYearId: academicYear.id,
      }
    : null;
}
