'use server';
import { cn } from '@/lib/utils';

import {
  DownloadIcon,
  IndianRupeeIcon,
  PlusIcon,
  UsersIcon,
  XCircleIcon,
} from 'lucide-react';

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
import { getFeesSummary } from '@/app/actions';
import AdminFeesSummaryCards from '@/components/dashboard/Fees/AdminFeesSummaryCards';
import { Suspense } from 'react';
import Link from 'next/link';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { getOrganizationId } from '@/lib/organization';
import { getMonthlyFeeData } from '@/lib/data/fee/getMonthlyFeeData';
import { Skeleton } from '@/components/ui/skeleton';

const mockFeeCategories = [
  { name: 'Tuition Fee', amount: 650000 },
  { name: 'Exam Fee', amount: 75000 },
  { name: 'Library Fee', amount: 50000 },
  { name: 'Lab Fee', amount: 60000 },
  { name: 'Sports Fee', amount: 40000 },
];

const mockMonthlyData = [
  { month: 0, year: 2023, amount: 95000, count: 42 },
  { month: 1, year: 2023, amount: 105000, count: 51 },
  { month: 2, year: 2023, amount: 85000, count: 38 },
  { month: 3, year: 2023, amount: 110000, count: 55 },
  { month: 4, year: 2023, amount: 75000, count: 32 },
  { month: 5, year: 2023, amount: 65000, count: 28 },
  { month: 6, year: 2023, amount: 90000, count: 41 },
  { month: 7, year: 2023, amount: 100000, count: 47 },
  { month: 8, year: 2023, amount: 115000, count: 53 },
  { month: 9, year: 2023, amount: 95000, count: 44 },
  { month: 10, year: 2023, amount: 80000, count: 36 },
  { month: 11, year: 2023, amount: 120000, count: 58 },
  // Previous year data
  { month: 0, year: 2022, amount: 85000, count: 38 },
  { month: 1, year: 2022, amount: 90000, count: 42 },
  { month: 2, year: 2022, amount: 75000, count: 35 },
  { month: 3, year: 2022, amount: 0, count: 0 },
  { month: 4, year: 2022, amount: 65000, count: 30 },
  { month: 5, year: 2022, amount: 60000, count: 25 },
  { month: 6, year: 2022, amount: 80000, count: 37 },
  { month: 7, year: 2022, amount: 85000, count: 40 },
  { month: 8, year: 2022, amount: 100000, count: 48 },
  { month: 9, year: 2022, amount: 85000, count: 39 },
  { month: 10, year: 2022, amount: 70000, count: 32 },
  { month: 11, year: 2022, amount: 105000, count: 50 },
];

export default async function AdminFeeDashboard() {
  const data = await getMonthlyFeeData(2025);

  console.log(data);
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
          <MonthlyFeeCollection data={mockMonthlyData} />
        </Suspense>

        <Suspense fallback={<FeeDistributionByCategorySkeleton />}>
          <FeeDistributionByCategory data={mockFeeCategories} />
        </Suspense>
      </div>

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
