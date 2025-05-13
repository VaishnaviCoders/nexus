import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { performance } from 'perf_hooks';

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
  const start = performance.now();
  // console.log('FilterStudents inputs:', { orgId, search, gradeId, sectionId });

  const where: any = {
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

    const end = performance.now();
    console.log('Fetched students in', end - start, 'ms');
    // console.log(
    //   'Fetched students:',
    //   students.map((s) => s.firstName)
    // );

    return students;
  } catch (error) {
    console.error('Error filtering students:', error);
    throw new Error('Failed to fetch students');
  } finally {
    await prisma.$disconnect();
  }
}
