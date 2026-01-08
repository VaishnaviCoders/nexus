'use server';

import prisma from '@/lib/db';
import { getCurrentUserId } from './user';
import { getOrganizationId } from './organization';
import { syncOrganizationUser } from './syncUser';


export type RoleResult =
  | { role: 'STUDENT'; studentId: string }
  | { role: 'TEACHER'; teacherId: string }
  | { role: 'PARENT'; parentId: string }
  | { role: 'ADMIN'; userId: string };

export async function getCurrentUserByRole(): Promise<RoleResult> {
  const userId = await getCurrentUserId();
  const organizationId = await getOrganizationId();
  // await syncOrganizationUser(organizationId, orgRole, userId);

  // Run queries in parallel
  const [admin, student, teacher, parent] = await Promise.all([
    prisma.user.findFirst({
      where: { id: userId, role: 'ADMIN', organizationId },
      select: { id: true },
    }),
    prisma.student.findFirst({
      where: { userId, organizationId },
      select: { id: true },
    }),
    prisma.teacher.findFirst({
      where: { userId, organizationId },
      select: { id: true },
    }),
    prisma.parent.findFirst({
      where: { userId },
      select: { id: true },
    }),
  ]);

  console.log('User:', admin, teacher, student, parent);

  if (admin) return { role: 'ADMIN', userId };
  if (student) return { role: 'STUDENT', studentId: student.id };
  if (teacher) return { role: 'TEACHER', teacherId: teacher.id };
  if (parent) return { role: 'PARENT', parentId: parent.id };

  throw new Error(
    `Role not found for user ${userId} in organization ${organizationId}`
  );
}
