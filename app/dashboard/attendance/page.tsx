import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AttendanceTable } from '@/app/components/dashboardComponents/attendance-table';

import AttendanceFilters from '@/app/components/dashboardComponents/attendance-filter';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { searchParamsCache } from '@/lib/searchParams';
import { SearchParams } from 'nuqs';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'all';

interface FilterAttendanceProps {
  search: string;
  sectionId?: string;
  status?: AttendanceStatus;
  grade?: string;
  startDate?: string;
  endDate?: string;
}
const FilterAttendance = async ({
  search,
  sectionId,
  status,
  grade,
  startDate,
  endDate,
}: FilterAttendanceProps) => {
  const { orgId } = await auth();
  if (!orgId) return null;

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
  if (grade && grade !== 'all') {
    whereClause.student.gradeId = grade;
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
        },
      },
      section: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  return records;
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function AttendancePage({ searchParams }: PageProps) {
  const { orgId } = await auth();

  if (!orgId) throw new Error('No organization found during Attendance Page');

  const { search, sectionId, status, grade } =
    await searchParamsCache.parse(searchParams);

  const records = await FilterAttendance({
    search,
    sectionId,
    grade,
    status: status as AttendanceStatus,
  });

  console.log('records', records);

  return (
    <div className="flex flex-col">
      <Card className="p-0 m-0 mb-4">
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            Overview of attendance status for all sections
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 md:p-6 m-0">
          <AttendanceFilters organizationId={orgId} />
        </CardContent>
      </Card>

      <AttendanceTable records={records || []} />
    </div>
  );
}
