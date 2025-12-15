import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Calendar, IndianRupee, Bell } from 'lucide-react';
import Link from 'next/link';
import { ParentDashboardStats } from '@/components/dashboard/parent/parent-dashboard-stats-cards';
import { AttendanceSummaryCard } from '@/components/dashboard/parent/attendance-summary-card';
import { FeesSummaryCard } from '@/components/dashboard/parent/fees-summary-card';
import { ChildrenOverviewCard } from '@/components/dashboard/parent/children-overview-card';
import { Suspense } from 'react';
import { RecentNoticesCards } from '../notice/recent-notices-cards';
import { getNoticesSummary } from '@/lib/data/parent/getParent-dashboard-stats';

export default async function ParentDashboard() {
  const notices = await getNoticesSummary();


  return (
    <div className="">
      <div className="space-y-6">
        {/* Header */}
        <Card className="">
          <CardContent className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-6 gap-4">
            <div>
              <CardTitle className="text-lg font-bold ">
                Parent Dashboard
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Monitor your children's academic progress and school activities
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                All Systems Active
              </Badge>
              <div className="flex gap-2">
                <Link href="/dashboard/my-children">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    My Children
                  </Button>
                </Link>
                <Link href="/dashboard/fees/parent">
                  <Button size="sm">
                    <IndianRupee className="w-4 h-4 mr-2" />
                    Pay Fees
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <ParentDashboardStats />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <ChildrenOverviewCard />
            <AttendanceSummaryCard />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <FeesSummaryCard />
            <Suspense fallback={<EventsSkeleton />}>
              <RecentNoticesCards recentNotices={notices} />
            </Suspense>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 bg-gradient-to-r from-card via-card to-muted/10">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/dashboard/child-attendance">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Attendance
                </Button>
              </Link>
              <Link href="/dashboard/fees/parent">
                <Button variant="outline" className="w-full justify-start">
                  <IndianRupee className="w-4 h-4 mr-2" />
                  Pay Fees
                </Button>
              </Link>
              <Link href="/dashboard/notices">
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Read Notices
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Profile Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
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