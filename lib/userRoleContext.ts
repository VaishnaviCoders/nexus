import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

type RoleContext =
  | { role: 'STUDENT'; organizationId: string; studentId: string }
  | {
      role: 'PARENT';
      organizationId: string;
      parentId: string;
      studentIds: string[];
    }
  | { role: 'TEACHER'; organizationId: string; teacherId: string }
  | { role: 'ADMIN'; organizationId: string }
  | { role: 'UNKNOWN' };

export async function getRoleContext(): Promise<RoleContext> {
  const { userId } = await auth();
  if (!userId) return { role: 'UNKNOWN' };

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      student: true,
      teacher: true,
      parent: { include: { students: true } },
    },
  });

  if (!user || !user.role || !user.organizationId) {
    return { role: 'UNKNOWN' };
  }

  switch (user.role) {
    case 'STUDENT':
      if (user.student?.id) {
        return {
          role: 'STUDENT',
          organizationId: user.organizationId,
          studentId: user.student.id,
        };
      }
      break;
    case 'PARENT':
      return {
        role: 'PARENT',
        organizationId: user.organizationId,
        parentId: user.parent?.id ?? 'missing',
        studentIds: user.parent?.students.map((ps) => ps.studentId) ?? [],
      };
    case 'TEACHER':
      return {
        role: 'TEACHER',
        organizationId: user.organizationId,
        teacherId: user.teacher?.id ?? 'missing',
      };
    case 'ADMIN':
      return { role: 'ADMIN', organizationId: user.organizationId };

    default:
      return { role: 'UNKNOWN' };
  }

  return { role: 'UNKNOWN' };
}
