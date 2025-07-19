// lib/auth/getCurrentUserByRole.ts

import prisma from '@/lib/db';
import { getCurrentUserId } from './user';

export type RoleResult =
  | { role: 'STUDENT'; studentId: string }
  | { role: 'TEACHER'; teacherId: string }
  | { role: 'PARENT'; parentId: string }
  | { role: 'ADMIN'; userId: string };

export async function getCurrentUserByRole(): Promise<RoleResult> {
  const userId = await getCurrentUserId();

  const [student, teacher, parent] = await Promise.all([
    prisma.student.findUnique({ where: { userId }, select: { id: true } }),
    prisma.teacher.findUnique({ where: { userId }, select: { id: true } }),
    prisma.parent.findUnique({ where: { userId }, select: { id: true } }),
  ]);

  if (student) return { role: 'STUDENT', studentId: student.id };
  if (teacher) return { role: 'TEACHER', teacherId: teacher.id };
  if (parent) return { role: 'PARENT', parentId: parent.id };

  return { role: 'ADMIN', userId }; // default fallback
}
