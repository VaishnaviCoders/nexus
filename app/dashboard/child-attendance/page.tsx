import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  CalendarIcon,
  Download,
  Filter,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { AttendanceOverviewCards } from '@/components/dashboard/parent/attendance-overview-cards';
import { AttendanceAlerts } from '@/components/dashboard/parent/attendance-alerts';
import { DetailedAttendanceChart } from '@/components/dashboard/parent/detailed-attendance-chart';

// import { AttendanceAlerts } from "@/components/parent-attendance/attendance-alerts"
// import { DetailedAttendanceChart } from "@/components/parent-attendance/detailed-attendance-chart"

export default function ChildAttendancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="">
        <CardContent className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-6 gap-4">
          <div>
            <CardTitle className="text-lg font-bold ">
              Attendance Monitor
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Track and analyze your children's school attendance patterns
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Real-time Updates
            </Badge>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Link href="/dashboard">
                <Button size="sm">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Section */}
      <AttendanceAlerts />

      {/* Overview Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Children Overview</h2>
        <AttendanceOverviewCards />
      </div>

      {/* Detailed Analytics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Detailed Analytics</h2>
        <DetailedAttendanceChart />
      </div>

      {/* Quick Actions */}
      <Card className="border-0 bg-gradient-to-r from-card via-card to-muted/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/notices">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Check School Calendar
              </Button>
            </Link>
            <Link href="/dashboard/remark">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Teacher Remarks
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="w-full justify-start">
                <Filter className="w-4 h-4 mr-2" />
                Notification Settings
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips and Guidelines */}
      <Card className="border-0 bg-gradient-to-br from-card via-card to-green-50/20 dark:to-green-950/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200">
            Attendance Guidelines
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Minimum Requirements</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Maintain at least 75% attendance</li>
                <li>• Inform school about planned absences</li>
                <li>• Submit medical certificates for sick leaves</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Establish consistent morning routines</li>
                <li>• Monitor attendance regularly</li>
                <li>• Communicate with teachers about concerns</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
