import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

interface FilterStudentsProps {
  search?: string;
  gradeId?: string;
  sectionId?: string;
}

export default async function FilterStudents({
  search = '',
  gradeId = 'all',
  sectionId = 'all',
}: FilterStudentsProps) {
  const orgId = await getOrganizationId();

  const where: Prisma.StudentWhereInput = {
    organizationId: orgId,
  };

  const trimmedSearch = search.trim();
  if (trimmedSearch !== '') {
    where.AND = [
      {
        OR: [
          { firstName: { contains: trimmedSearch, mode: 'insensitive' } },
          { lastName: { contains: trimmedSearch, mode: 'insensitive' } },
          { fullName: { contains: trimmedSearch, mode: 'insensitive' } },
          { rollNumber: { contains: trimmedSearch, mode: 'insensitive' } },
          { email: { contains: trimmedSearch, mode: 'insensitive' } },
        ],
      },
    ];
  }

  if (gradeId !== 'all') {
    where.gradeId = gradeId;
  }

  if (sectionId !== 'all') {
    where.sectionId = sectionId;
  }

  try {
    const students = await prisma.student.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        fullName: true,
        rollNumber: true,
        phoneNumber: true,
        email: true,
        profileImage: true,
        dateOfBirth: true,
        grade: {
          select: {
            id: true,
            grade: true,
          },
        },
        section: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      take: 120, // protect against massive payloads
    });

    return students;
  } catch (error) {
    console.error('Error filtering students:', error);
    throw new Error('Failed to fetch students');
  }
}
