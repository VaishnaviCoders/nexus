// 'use client';

import { Suspense } from 'react';

import { SendFeesReminderDialog } from '@/components/dashboard/Fees/SendFeesReminderDialog';
import StudentPaymentHistoryTable from '@/components/dashboard/Fees/StudentPaymentHistoryTable';
import { getFeeRecords } from '@/lib/data/fee/get-all-students-fees';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { FeeStatsCardForTeacher } from '@/components/dashboard/teacher/FeeStatsCardForTeacher';

export default async function TeacherFeesManagementDashboard() {
  const feeRecords = await getFeeRecords();

  return (
    <div className="">
      <main className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between mx-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Teacher Dashboard
          </h1>
        </div>

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
