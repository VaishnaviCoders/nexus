import React, { Suspense } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupeeIcon, XCircleIcon } from 'lucide-react';
import { getTeacherFeeSummary } from '@/lib/data/teacher/get-teacher-fee-summary';
import { getCurrentUserId } from '@/lib/user';
import prisma from '@/lib/db';
import { formatCurrencyIN } from '@/lib/utils';

const FeeStatsCardForTeacherContent = async () => {
  const userId = await getCurrentUserId();

  const stats = await getTeacherFeeSummary(userId);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden border-border/50 transition-all hover:border-primary/20 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium"> Total Students</CardTitle>
          <div className="rounded-md bg-primary/10 p-1">
            <IndianRupeeIcon className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-1">
            <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">{stats.totalStudents}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">In your class</p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/50 transition-all hover:border-primary/20 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paid Fees</CardTitle>
          <div className="rounded-md bg-primary/10 p-1">
            <IndianRupeeIcon className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-1">
            <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">
              {formatCurrencyIN(stats.paidFees)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrencyIN(stats.paidFees + stats.unpaidFees)} of total fees
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/50 transition-all hover:border-amber-500/20 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unpaid Fees</CardTitle>
          <div className="rounded-md bg-amber-500/10 p-1">
            <IndianRupeeIcon className="h-4 w-4 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-1">
            <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">
              {formatCurrencyIN(stats.unpaidFees)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.studentsWithUnpaidFees} Students with unpaid fees
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/50 transition-all hover:border-red-500/20 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue Fees</CardTitle>
          <div className="rounded-md bg-red-500/10 p-1">
            <XCircleIcon className="h-4 w-4 text-red-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">
              {formatCurrencyIN(stats.overdueFees)}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.studentsWithOverdueFees} students with overdue fees
            </p>
          </div>
          {stats.overdueFees > 0 && (
            <p className="text-xs text-muted-foreground mt-1 text-red-500">
              Fees past due date requiring action
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

function FeeStatsCardForTeacherSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="animate-pulse ">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-8 bg-muted rounded w-16"></div>
              <div className="h-2 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function FeeStatsCardForTeacher() {
  return (
    <Suspense fallback={<FeeStatsCardForTeacherSkeleton />}>
      <FeeStatsCardForTeacherContent />
    </Suspense>
  );
}
