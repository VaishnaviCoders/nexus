import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Calendar, DollarSign, Bell } from 'lucide-react';
import Link from 'next/link';
import { ParentDashboardStatsContent } from '@/components/dashboard/parent/parent-dashboard-stats-cards';
import { NoticesSummaryCard } from '@/components/dashboard/parent/notice-summary-card';
import { AttendanceSummaryCard } from '@/components/dashboard/parent/attendance-summary-card';
import { FeesSummaryCard } from '@/components/dashboard/parent/fees-summary-card';
import { ChildrenOverviewCard } from '@/components/dashboard/parent/children-overview-card';

export default function ParentDashboard() {
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
                    <DollarSign className="w-4 h-4 mr-2" />
                    Pay Fees
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <ParentDashboardStatsContent />

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
            <NoticesSummaryCard />
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
                  <DollarSign className="w-4 h-4 mr-2" />
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
