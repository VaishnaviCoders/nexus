import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { DashboardCardSkeleton } from '@/lib/skeletons/DashboardCardSkeleton';
import { Calendar, Receipt, User } from 'lucide-react';
import ParentFeeHistory from '@/components/dashboard/Fees/ParentFeeHistory';
import GetFeesByParentId from '@/lib/data/fee/GetFeesByParentId';
import { formatCurrencyIN } from '@/lib/utils';
import { redirect } from 'next/navigation';

export default async function ParentDashboard() {
  const parentData = await GetFeesByParentId();

  if (!parentData) redirect('/dashboard');

  const totalFees = parentData.children.reduce(
    (sum, child) => sum + child.totalFees,
    0
  );
  const totalPaid = parentData.children.reduce(
    (sum, child) => sum + child.paidFees,
    0
  );
  const totalPending = parentData.children.reduce(
    (sum, child) => sum + child.pendingFees,
    0
  );
  const paymentPercentage = Math.round((totalPaid / totalFees) * 100);

  return (
    <div className="">
      <main className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between mx-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Parent Dashboard {parentData.name}
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Suspense fallback={<DashboardCardSkeleton />}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Children
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {parentData.children.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Enrolled in school
                </p>
              </CardContent>
            </Card>
          </Suspense>
          <Suspense fallback={<DashboardCardSkeleton />}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Fees
                </CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{formatCurrencyIN(totalFees)}
                </div>
                <p className="text-xs text-muted-foreground">
                  For all children
                </p>
              </CardContent>
            </Card>
          </Suspense>
          <Suspense fallback={<DashboardCardSkeleton />}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Paid Amount
                </CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ₹{formatCurrencyIN(totalPaid)}
                </div>
                <div className="flex items-center">
                  <p className="text-xs text-muted-foreground">
                    {paymentPercentage}% of total fees
                  </p>
                </div>
              </CardContent>
            </Card>
          </Suspense>
          <Suspense fallback={<DashboardCardSkeleton />}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Amount
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  ₹{formatCurrencyIN(totalPending)}
                </div>
                <p className="text-xs text-muted-foreground">Due payments</p>
              </CardContent>
            </Card>
          </Suspense>
        </div>
        <Suspense fallback={<DashboardCardSkeleton />}>
          <ParentFeeHistory parentData={parentData} />
        </Suspense>
      </main>
    </div>
  );
}
