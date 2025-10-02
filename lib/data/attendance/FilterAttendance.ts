import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'all';

interface FilterAttendanceProps {
  search: string;
  sectionId?: string;
  status?: AttendanceStatus;
  gradeId?: string;
  startDate?: string;
  endDate?: string;
}

export const FilterAttendance = async ({
  search,
  sectionId,
  status,
  gradeId,
  startDate,
  endDate,
}: FilterAttendanceProps) => {
  const orgId = await getOrganizationId();

  const whereClause: any = {
    student: {
      organizationId: orgId,
    },
  };

  // Add search filters if provided
  if (search) {
    whereClause.student.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { rollNumber: { contains: search } },
    ];
  }

  // Add section filter if provided and not 'all'
  if (sectionId && sectionId !== 'all') {
    whereClause.sectionId = sectionId;
  }

  // Add grade filter if provided and not 'all'
  if (gradeId && gradeId !== 'all') {
    whereClause.student.gradeId = gradeId;
  }

  // Add status filter if provided and not 'all'
  if (status && status !== 'all') {
    whereClause.status = status;
  }

  // Add date range filters if provided
  if (startDate) {
    whereClause.date = {
      ...whereClause.date,
      gte: new Date(startDate),
    };
  }

  if (endDate) {
    whereClause.date = {
      ...whereClause.date,
      lte: new Date(endDate),
    };
  }
  const records = await prisma.studentAttendance.findMany({
    where: whereClause,
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          rollNumber: true,
          section: {
            select: { name: true },
          },
          grade: {
            select: {
              grade: true,
              id: true,
            },
          },
        },
      },
      section: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  console.log('Attebdance', records);

  return records.map((record) => ({
    ...record,
    grade: record.student.grade,
  }));
};
