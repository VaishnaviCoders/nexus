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
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start gap-2">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight">Attendance</h1>
              <p className="text-muted-foreground">
                Manage and track attendance across all students
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={'secondary'}>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Link href={'/dashboard/attendance/mark'}>
                <Button type="button">
                  {' '}
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Mark Attendance
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2 md:p-6 m-0">
          <AttendanceFilters organizationId={orgId} />
        </CardContent>
      </Card>

      <AttendanceTable records={records || []} />
    </div>
  );
}
