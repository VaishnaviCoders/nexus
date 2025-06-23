import React, { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MonthlyFeeCollection } from '@/components/dashboard/Fees/MonthlyFeeCollection';
import { getMonthlyFeeData } from '@/lib/data/fee/getMonthlyFeeData';

import { mockMonthlyFeeCollectionData } from '@/constants';
import AiMonthlyReport from '@/app/components/dashboardComponents/AiMonthlyReport';
import AdminQuickActions from '@/app/components/dashboardComponents/AdminQuickActions';
import AdminDashboardCards from '@/app/components/dashboardComponents/AdminDashboardCards';
import AdminRecentActivity from '@/app/components/dashboardComponents/RecentActivity';
import { UpcomingEvents } from '@/app/components/dashboardComponents/UpcomingEvents';

const AdminDashboard = async () => {
  const data = await getMonthlyFeeData(2025);

  // const data = mockMonthlyFeeCollectionData;
  return (
    <div className="space-y-6 ">
      <Card className="flex items-center justify-between p-6">
        <div>
          <CardTitle className="text-lg">Admin Dashboard</CardTitle>
          <CardDescription>
            {' '}
            Dashboard for admin to manage the system{' '}
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          {/* <Link href="/dashboard/attendance/ " passHref> */}
          {/* <Button variant="outline" size="sm">
              Download Report
            </Button> */}

          {/* </Link> */}

          <AiMonthlyReport data={data} />

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant={'default'}>
                Quick Actions
              </Button>
            </DialogTrigger>

            <DialogContent className="min-w-7xl">
              <DialogHeader>
                <DialogTitle>Quick Actions</DialogTitle>
                <DialogDescription></DialogDescription>
                <AdminQuickActions />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      <AdminDashboardCards />

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Left Column - Charts */}
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-3 space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-1">
            <Suspense fallback={<ActivitySkeleton />}>
              <MonthlyFeeCollection data={data} />
            </Suspense>
            <Suspense fallback={<ActivitySkeleton />}>
              <AdminRecentActivity />
            </Suspense>
          </div>
        </div>

        {/* Right Column - Sidebar Info */}
        <div className="space-y-4 sm:space-y-6">
          <Suspense fallback={<EventsSkeleton />}>
            <UpcomingEvents />
          </Suspense>
          <Suspense fallback={<ComplaintsSkeleton />}>
            {/* <ComplaintsSummary /> */}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

// Loading Skeletons for better UX
function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 bg-muted rounded w-20"></div>
            <div className="h-4 w-4 bg-muted rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-muted rounded w-16 mb-2"></div>
            <div className="h-3 bg-muted rounded w-24"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-5 bg-muted rounded w-32"></div>
        <div className="h-4 bg-muted rounded w-48"></div>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-muted rounded"></div>
      </CardContent>
    </Card>
  );
}

function ActivitySkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-5 bg-muted rounded w-32"></div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-muted rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function EventsSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-5 bg-muted rounded w-32"></div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ComplaintsSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-5 bg-muted rounded w-32"></div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-4 bg-muted rounded w-20"></div>
            <div className="h-6 bg-muted rounded w-8"></div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
