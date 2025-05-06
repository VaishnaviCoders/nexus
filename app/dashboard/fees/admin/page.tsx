'use server';
import { cn } from '@/lib/utils';

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
import AllFeesHistory from '@/components/dashboard/Fees/AllFeesHistory';
import AdminFeesSummaryCards from '@/components/dashboard/Fees/AdminFeesSummaryCards';
import { Suspense } from 'react';
import Link from 'next/link';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { getMonthlyFeeData } from '@/lib/data/fee/getMonthlyFeeData';
import { Skeleton } from '@/components/ui/skeleton';
import StudentPaymentHistoryTable from '@/components/dashboard/Fees/StudentPaymentHistoryTable';

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
  const feeCategories = await getFeeCategoryAggregates();
  const data = await getMonthlyFeeData(2025);
  console.log('Fee Categories', feeCategories);

  // console.log(data);
  return (
    <div className="flex flex-col space-y-8 ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Fee Management</h1>
          <p className="text-muted-foreground">
            Manage and track fee collection across all students
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Link href={'/dashboard/fees/admin/assign'}>
            <Button type="button">
              {' '}
              <PlusIcon className="mr-2 h-4 w-4" />
              Assign Fees
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <AdminFeesSummaryCards />

      {/* Charts and Analytics */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Suspense fallback={<FeeDistributionByCategorySkeleton />}>
          <MonthlyFeeCollection data={data} />
        </Suspense>

        <Suspense fallback={<FeeDistributionByCategorySkeleton />}>
          <FeeDistributionByCategory data={feeCategories} />
        </Suspense>
      </div>

      <StudentPaymentHistoryTable />

      {/* Fee Records */}
      <AllFeesHistory />
    </div>
  );
}

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
