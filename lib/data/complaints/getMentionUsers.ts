'use server';

import prisma from '@/lib/db';

export interface MentionUser {
  id: string;
  name: string;
  role: string;
  department?: string;
  email: string;
}

export async function getMentionUsers(
  organizationId: string,
  searchQuery?: string
): Promise<MentionUser[]> {
  try {
    const whereClause = {
      organizationId,
      isActive: true,
      ...(searchQuery &&
        searchQuery.length >= 2 && {
          OR: [
            {
              firstName: {
                contains: searchQuery,
                mode: 'insensitive' as const,
              },
            },
            {
              lastName: {
                contains: searchQuery,
                mode: 'insensitive' as const,
              },
            },
            {
              email: {
                contains: searchQuery,
                mode: 'insensitive' as const,
              },
            },
          ],
        }),
    };

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        teacher: {
          select: {
            profile: {
              select: {
                qualification: true,
                specializedSubjects: true,
              },
            },
          },
        },
        student: {
          select: {
            grade: {
              select: {
                grade: true,
              },
            },
            section: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      take: searchQuery ? 10 : 50, // Show more when not searching
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });

    return users.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      department: getDepartmentInfo(user),
      email: user.email,
    }));
  } catch (error) {
    console.error('Error fetching mention users:', error);
    throw new Error('Failed to fetch users for mentions');
  }
}

// Helper function to get department/additional info
function getDepartmentInfo(user: any): string | undefined {
  if (user.teacher?.profile) {
    if (user.teacher.profile.specializedSubjects?.length > 0) {
      return user.teacher.profile.specializedSubjects.join(', ');
    }
    return user.teacher.profile.qualification || 'Teacher';
  }

  if (user.student) {
    return `Grade ${user.student.grade.grade} - Section ${user.student.section.name}`;
  }

  return user.role;
}
