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

  if (!academicYear) {
    throw new Error('No default academic year is set for this organization.');
  }

  return academicYear;
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

  if (!academicYear) {
    throw new Error('No default academic year is set for this organization.');
  }

  return {
    academicYearId: academicYear.id,
  };
}
