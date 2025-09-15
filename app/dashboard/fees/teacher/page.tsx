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
    <main className="flex flex-1 flex-col gap-4">
      <Card className="py-4 px-2 flex items-center justify-between">
        <div>
          <CardTitle className="text-lg">Teacher Dashboard</CardTitle>
          <CardDescription className="text-sm">
            Dashboard for admin to manage the system
          </CardDescription>
        </div>
        <Link href="/dashboard/fees/admin/assign" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <PlusIcon className="mr-2 h-4 w-4" />
            <span className="sm:inline">Assign Fees</span>
          </Button>
        </Link>
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
