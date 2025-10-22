import { Suspense } from 'react';
import StudentPaymentHistoryTable from '@/components/dashboard/Fees/StudentPaymentHistoryTable';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { FeeStatsCardForTeacher } from '@/components/dashboard/teacher/FeeStatsCardForTeacher';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { getAssignedStudentsFees } from '@/lib/data/fee/getAssignedStudentsFees';
import { getCurrentUserByRole } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function TeacherFeesManagementDashboard() {
  const currentUser = await getCurrentUserByRole();

  if (currentUser.role !== 'TEACHER') {
    redirect('/dashboard'); // Better than throwing error
  }

  const teacherId = currentUser.teacherId;
  const feeRecords = await getAssignedStudentsFees(teacherId);

  return (
    <main className="px-2 space-y-3">
      <Card className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 bg-gradient-to-r from-card via-card to-primary/5">
        <div className="w-full md:w-auto">
          <CardTitle>Teacher Fees Dashboard</CardTitle>
          <CardDescription>Manage your assign student fees</CardDescription>
        </div>

        <div className="flex w-full md:w-auto flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="w-full sm:w-auto">
            <Link
              href="/dashboard/fees/admin/assign"
              className="w-full sm:w-auto"
            >
              <Button size="sm" className="w-full sm:w-auto">
                <PlusIcon className="mr-2 h-4 w-4" />
                Assign Fees
              </Button>
            </Link>
          </div>
          <Link
            href="/dashboard/attendance/mark"
            passHref
            className="w-full sm:w-auto"
          >
            <Button size="sm" className="w-full sm:w-auto">
              {/* <Users className="w-4 h-4 mr-2" /> */}
              Take Attendance
            </Button>
          </Link>
        </div>
      </Card>

      <Suspense fallback={<FeeStatsCardSkeleton />}>
        <FeeStatsCardForTeacher />
      </Suspense>

      <Suspense fallback={<StudentPaymentHistoryTableSkeleton />}>
        <StudentPaymentHistoryTable feeRecords={feeRecords} />
      </Suspense>
    </main>
  );
}

const StudentPaymentHistoryTableSkeleton = () => (
  <Card>
    <CardContent className="p-0">
      <div className="overflow-hidden">
        {/* Header skeleton */}
        <div className="flex items-center justify-between p-4 border-b">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>

        {/* Table skeleton */}
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

const FeeStatsCardSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <Card key={i}>
        <CardContent className="p-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-[60px]" />
            <Skeleton className="h-3 w-[120px]" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
