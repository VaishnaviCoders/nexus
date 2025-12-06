import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendanceTable } from '@/components/dashboard/StudentAttendance/attendance-table';

import AttendanceFilters from '@/components/dashboard/StudentAttendance/attendance-filter';
import { searchParamsCache } from '@/lib/searchParams';
import { SearchParams } from 'nuqs';
import { FilterAttendance } from '@/lib/data/attendance/FilterAttendance';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { getOrganizationId } from '@/lib/organization';
type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'all';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function AttendancePage({ searchParams }: PageProps) {
  const organizationId = await getOrganizationId();

  const { search, sectionId, status, gradeId } =
    await searchParamsCache.parse(searchParams);

  const records = await FilterAttendance({
    search,
    sectionId,
    gradeId,
    status: status as AttendanceStatus,
  });

  return (
    <>
      <Card className="py-4 px-2 flex items-center justify-between mb-4">
        <div>
          <CardTitle className="text-lg">Attendance History</CardTitle>
          <CardDescription className="text-sm">
            Manage and track attendance across all students
          </CardDescription>
        </div>
        <div className="flex justify-center items-center space-x-3">
          <Button variant="outline" >
            Export CSV
          </Button>
          <Button asChild>
            <Link href={'/dashboard/attendance/mark'} prefetch >
              <PlusIcon className="mr-2 h-4 w-4" />
              Take Attendance
            </Link>
          </Button>
        </div>
      </Card>
      <Card>
        <CardContent className="p-2 md:p-6 m-0">
          <AttendanceFilters organizationId={organizationId} />
        </CardContent>
      </Card>

      <AttendanceTable records={records || []} />
    </>
  );
}
