import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AttendanceTable } from '@/components/dashboard/StudentAttendance/attendance-table';

import AttendanceFilters from '@/components/dashboard/StudentAttendance/attendance-filter';
import { auth } from '@clerk/nextjs/server';
import { searchParamsCache } from '@/lib/searchParams';
import { SearchParams } from 'nuqs';
import { FilterAttendance } from '@/lib/data/attendance/FilterAttendance';
type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'all';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function AttendancePage({ searchParams }: PageProps) {
  const { orgId } = await auth();

  if (!orgId) throw new Error('No organization found during Attendance Page');

  const { search, sectionId, status, gradeId } = await searchParamsCache.parse(
    searchParams
  );

  const records = await FilterAttendance({
    search,
    sectionId,
    gradeId,
    status: status as AttendanceStatus,
  });

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
