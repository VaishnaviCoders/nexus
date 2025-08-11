'use server';

import prisma from '@/lib/db';
import { getCurrentUserId } from './user';
import { getOrganizationId } from './organization';

export type RoleResult =
  | { role: 'STUDENT'; studentId: string }
  | { role: 'TEACHER'; teacherId: string }
  | { role: 'PARENT'; parentId: string }
  | { role: 'ADMIN'; userId: string };

export async function getCurrentUserByRole(): Promise<RoleResult> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Not authenticated');

  const organizationId = await getOrganizationId();
  if (!organizationId) throw new Error('Organization context missing');

  // Check each role in priority order
  const student = await prisma.student.findFirst({
    where: { userId, organizationId },
    select: { id: true },
  });
  if (student) return { role: 'STUDENT', studentId: student.id };

  const teacher = await prisma.teacher.findFirst({
    where: { userId, organizationId },
    select: { id: true },
  });
  if (teacher) return { role: 'TEACHER', teacherId: teacher.id };

  const parent = await prisma.parent.findFirst({
    where: { userId },
    select: { id: true },
  });
  if (parent) return { role: 'PARENT', parentId: parent.id };

  // Default fallback
  return { role: 'ADMIN', userId };
}
