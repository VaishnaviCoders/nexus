import prisma from '@/lib/db';
import { Prisma } from '@/lib/generated/prisma';
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

  if (search && search.trim() !== '') {
    where.AND = [
      {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
          { rollNumber: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
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
      take: 100,
    });

    return students;
  } catch (error) {
    console.error('Error filtering students:', error);
    throw new Error('Failed to fetch students');
  } finally {
    await prisma.$disconnect();
  }
}
