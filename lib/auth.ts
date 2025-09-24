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
  const organizationId = await getOrganizationId();
  // Check each role in priority order

  // 🔹 Check admin explicitly first
  const admin = await prisma.user.findFirst({
    where: { id: userId, role: 'ADMIN' }, // adjust if you store admin differently
    select: { id: true },
  });
  if (admin) return { role: 'ADMIN', userId };

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

  throw new Error(
    `Role not found for user ${userId} in organization ${organizationId}`
  );
}
