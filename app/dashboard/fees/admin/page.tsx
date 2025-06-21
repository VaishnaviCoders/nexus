'use server';

import { DownloadIcon, PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { MonthlyFeeCollection } from '@/components/dashboard/Fees/MonthlyFeeCollection';
import FeeDistributionByCategory from '@/components/dashboard/Fees/FeeDistributionByCategory';
import AdminFeesSummaryCards from '@/components/dashboard/Fees/AdminFeesSummaryCards';
import { Suspense } from 'react';
import Link from 'next/link';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { getMonthlyFeeData } from '@/lib/data/fee/getMonthlyFeeData';
import { Skeleton } from '@/components/ui/skeleton';
import StudentPaymentHistoryTable from '@/components/dashboard/Fees/StudentPaymentHistoryTable';

import { getFeeRecords } from '@/lib/data/fee/get-all-students-fees';
import { DashboardCardSkeleton } from '@/lib/skeletons/DashboardCardSkeleton';
// import fixIncorrectFeeStatuses from '@/lib/data/fee/payFeesAction';

const getFeeCategoryAggregates = async () => {
  const orgId = await getOrganizationId();

  const result = await prisma.fee.groupBy({
    by: ['feeCategoryId'],
    where: {
      organizationId: orgId,
    },
    _sum: {
      paidAmount: true,
      pendingAmount: true,
    },
  });

  const categories = await prisma.feeCategory.findMany({
    where: {
      id: { in: result.map((r) => r.feeCategoryId) },
      organizationId: orgId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  const data = result.map((r) => {
    const category = categories.find((c) => c.id === r.feeCategoryId);
    return {
      name: category?.name ?? 'Unknown',
      paidAmount: r._sum.paidAmount ?? 0,
      pendingAmount: r._sum.pendingAmount ?? 0,
    };
  });

  return data;
};

export default async function AdminFeeDashboard() {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const feeCategories = await getFeeCategoryAggregates();
  const data = await getMonthlyFeeData(2025);
  const feeRecords = await getFeeRecords();

  // Call this function in your migration or admin script
  // fixIncorrectFeeStatuses().then((result) => {
  //   console.log('Updated incorrect fee statuses:', result.updated);
  // });
  return (
    <div className="flex flex-col space-y-8">
      {/* Responsive Header */}
      <div className="flex flex-col gap-4 sm:flex-row px-2 sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-bold tracking-tight sm:text-2xl">
            Fee Management
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Manage and track fee collection across all students
          </p>
        </div>

        {/* Responsive Button Container */}
        <div className="flex sm:flex-row sm:items-center space-x-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <DownloadIcon className="mr-2 h-4 w-4" />
            <span className="sm:inline">Export Data</span>
          </Button>
          <Link
            href="/dashboard/fees/admin/assign"
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto">
              <PlusIcon className="mr-2 h-4 w-4" />
              <span className="sm:inline">Assign Fees</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <Suspense fallback={<AdminFeesSummaryCardsSkeleton />}>
        <AdminFeesSummaryCards />
      </Suspense>

      {/* Charts and Analytics */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Suspense fallback={<FeeDistributionByCategorySkeleton />}>
          <MonthlyFeeCollection data={data} />
        </Suspense>

        <Suspense fallback={<FeeDistributionByCategorySkeleton />}>
          <FeeDistributionByCategory data={feeCategories} />
        </Suspense>
      </div>

      <Suspense fallback={<StudentPaymentHistoryTableSkeleton />}>
        <StudentPaymentHistoryTable feeRecords={feeRecords} />
      </Suspense>
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

const FeeDistributionByCategorySkeleton = () => {
  return (
    <>
      <Card className="p-0">
        <CardHeader>
          <CardTitle>
            <Skeleton className="w-full bg-gray-100 h-5 max-w-full mb-2" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="w-[30%] bg-gray-100 h-3 max-w-full mb-2" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="my-4">
              <div className="space-y-2 flex flex-col my-3">
                <span>
                  <Skeleton className="w-[120px] h-4 max-w-full" />
                </span>
                <span>
                  <Skeleton className="w-[624px]  h-4 max-w-full" />
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
};

const AdminFeesSummaryCardsSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <DashboardCardSkeleton key={i} />
    ))}
  </div>
);
