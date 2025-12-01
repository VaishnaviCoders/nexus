import React, { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
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
import { getCurrentAcademicYear } from '@/lib/academicYear';
import Link from 'next/link';
import { getRecentAdminActivities } from '@/lib/data/admin/get-recent-activities';
import { RecentNoticesCards } from '../notice/recent-notices-cards';
import { getAdminNotices } from '@/lib/data/notice/get-admin-notices';

const AdminDashboard = async () => {
  const data = await getMonthlyFeeData(2025);
  const academicYear = await getCurrentAcademicYear();
  const activities = await getRecentAdminActivities();
  const recentAdminNotices = await getAdminNotices();

  if (!academicYear) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 ">
        <h2 className="text-2xl font-semibold">Academic Year Not Set</h2>
        <p className="text-muted-foreground max-w-md">
          Please set the current academic year before using the dashboard
          features.
        </p>
        <Button asChild>
          <Link href="/dashboard/settings">Go to Settings</Link>
        </Button>
      </div>
    );
  }

  // const data = mockMonthlyFeeCollectionData;
  return (
    <div className="space-y-6 px-2">
      <Card className="py-4 px-2 flex items-center justify-between   ">
        <div>
          <CardTitle className="text-lg">Admin Dashboard</CardTitle>
          <CardDescription className="text-sm">
            Dashboard for admin to manage the system
          </CardDescription>
        </div>
        <div className="flex justify-center items-center space-x-3">
          <div className="">
            <AiMonthlyReport data={data} />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="default">
                Quick Actions
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Quick Actions</DialogTitle>
                <DialogDescription />
                <AdminQuickActions />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      <AdminDashboardCards />

      <div className="grid gap-4 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
        {/* Left Column - Charts */}
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-3 space-y-4 sm:space-y-6 ">
          <div className="grid gap-4 sm:gap-6 grid-cols-1">
            <Suspense fallback={<ActivitySkeleton />}>
              <MonthlyFeeCollection data={data} />
            </Suspense>
            <Suspense fallback={<ActivitySkeleton />}>
              <AdminRecentActivity activities={activities} />
            </Suspense>
          </div>
        </div>

        {/* Right Column - Sidebar Info */}
        <div className="space-y-4 sm:space-y-6 ">
          <Suspense fallback={<EventsSkeleton />}>
            <RecentNoticesCards recentNotices={recentAdminNotices} />
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
