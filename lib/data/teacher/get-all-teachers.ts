'use server';

import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export async function getAllTeachers() {
  const organizationId = await getOrganizationId();
  const teachers = await prisma.teacher.findMany({
    where: {
      organizationId,
    },
    select: {
      id: true,
      employeeCode: true,
      isActive: true,
      employmentStatus: true,
      organizationId: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      profile: true,
      user: true,
    },
  });
  return teachers;
}
