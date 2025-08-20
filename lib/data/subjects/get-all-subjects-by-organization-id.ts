'use server';

import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
// Get all subjects for the organization
export async function getAllSubjectsByOrganizationId() {
  const organizationId = await getOrganizationId();

  const subjects = await prisma.subject.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
  });

  return subjects;
}
