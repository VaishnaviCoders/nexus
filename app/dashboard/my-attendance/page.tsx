import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Award, Clock } from 'lucide-react';
import Link from 'next/link';
import { AttendanceStatsCards } from '@/components/dashboard/StudentAttendance/attendance-stats-cards';
import { StudentAttendanceCalendar } from '@/components/dashboard/StudentAttendance/attendance-calendar';
import prisma from '@/lib/db';
import { RecentAttendanceTimeline } from '@/components/dashboard/StudentAttendance/recent-attendance-calendar';
import { getCurrentUserId } from '@/lib/user';
import { getCurrentUserByRole } from '@/lib/auth';

export default async function page() {
  const userId = await getCurrentUserId();
  const user = await getCurrentUserByRole();

  if (user.role !== 'STUDENT') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 space-y-2">
            <CardTitle>Unauthorized</CardTitle>
            <CardDescription>
              This page is only accessible to students.
            </CardDescription>
            <p className="text-muted-foreground">
              You are logged in as <strong>{user.role}</strong>.
            </p>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="mt-2">
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const student = await prisma.student.findUnique({
    where: {
      id: user.studentId,
    },
  });
  const attendanceData = await prisma.studentAttendance.findMany({
    where: {
      studentId: student?.id,
    },
    orderBy: { date: 'desc' },
  });

  const recentAttendance = await prisma.studentAttendance.findMany({
    where: {
      studentId: student?.id,
    },
    orderBy: { date: 'desc' },
    take: 7,
  });
  return (
    <div className="px-2 space-y-3">
      {/* Header */}
      <Card className="">
        <CardContent className="flex flex-col md:flex-row lg:items-center lg:justify-between p-6 gap-4">
          <div>
            <CardTitle className="text-lg  flex items-center gap-2">
              My Attendance Journey
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Academic Year 2025-26
              </Badge>
            </CardTitle>
            <CardDescription className=" mt-1">
              Track your school attendance, achievements, and build great habits
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Link href="/dashboard">
                <Button size="sm">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <AttendanceStatsCards />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column - Calendar & Trends */}
        <div className="lg:col-span-8 space-y-6">
          {/* Attendance Calendar */}
          <StudentAttendanceCalendar attendanceRecords={attendanceData} />
          {/* <StudentCalendar /> */}

          {/* Trends Chart */}
          {/* <AttendanceTrendsChart initialData={attendanceData} /> */}
        </div>

        {/* Right Column - Timeline & Achievements */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Timeline */}
          <RecentAttendanceTimeline recentAttendance={recentAttendance} />

          {/* Quick Stats */}
          <Card className="border-0 bg-gradient-to-br from-card via-card to-indigo-50/20 dark:to-indigo-950/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    This Week
                  </span>
                  <Badge className="bg-green-100 text-green-800">
                    5/5 Present
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Current Streak
                  </span>
                  <Badge className="bg-blue-100 text-blue-800">12 days</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Class Rank
                  </span>
                  <Badge className="bg-purple-100 text-purple-800">
                    #3 of 45
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Achievements Section */}
      {/* <AttendanceAchievements /> */}

      {/* Attendance Tips */}
      <Card className="border-0 bg-gradient-to-br from-card via-card to-green-50/20 dark:to-green-950/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Attendance Tips
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Building Good Habits</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Set a consistent sleep schedule</li>
                <li>• Prepare school materials the night before</li>
                <li>• Create a morning routine checklist</li>
                <li>• Track your attendance goals</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">When You're Sick</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Inform your teacher or school office</li>
                <li>• Get a medical certificate if needed</li>
                <li>• Catch up on missed assignments</li>
                <li>• Rest well to recover quickly</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Quote */}
      <Card className="border-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
        <CardContent className="text-center p-8">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">
              "Success is the sum of small efforts repeated day in and day out."
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Keep showing up, keep learning, keep growing! 🌟
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
