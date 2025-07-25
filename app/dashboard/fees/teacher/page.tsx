import { Suspense } from 'react';

import StudentPaymentHistoryTable from '@/components/dashboard/Fees/StudentPaymentHistoryTable';
import { getFeeRecords } from '@/lib/data/fee/get-all-students-fees';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FeeStatsCardForTeacher } from '@/components/dashboard/teacher/FeeStatsCardForTeacher';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export default async function TeacherFeesManagementDashboard() {
  const feeRecords = await getFeeRecords();

  return (
    <div className="">
      <main className="flex flex-1 flex-col gap-4">
        <Card className="py-4 px-2 flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Teacher Dashboard</CardTitle>
            <CardDescription className="text-sm">
              Dashboard for admin to manage the system
            </CardDescription>
          </div>
          <Link
            href="/dashboard/fees/admin/assign"
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto">
              <PlusIcon className="mr-2 h-4 w-4" />
              <span className="sm:inline">Assign Fees</span>
            </Button>
          </Link>
        </Card>

        <FeeStatsCardForTeacher />

        <Suspense fallback={<StudentPaymentHistoryTableSkeleton />}>
          <StudentPaymentHistoryTable feeRecords={feeRecords} />
        </Suspense>
      </main>
    </div>
  );
}

const StudentPaymentHistoryTableSkeleton = () => (
  <Card>
    <CardContent className="p-0">
      <table className="w-full">
        <thead>
          <tr>
            {Array.from({ length: 8 }).map((_, i) => (
              <th key={i} className="p-4">
                <Skeleton className="h-5 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: 8 }).map((__, j) => (
                <td key={j} className="p-4">
                  <Skeleton className="h-5 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
);
