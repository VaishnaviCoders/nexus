import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, Clock, BarChart3, Users, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

import { getAttendanceCompletionStats } from '@/lib/data/attendance/get-attendance-completion-stats';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionWiseAttendanceTable } from '@/components/dashboard/StudentAttendance/section-wise-attendance-table';

export default async function AttendanceAnalyticsPage() {
  const today = new Date();
  const attendanceData = await getAttendanceCompletionStats(today);

  if (!attendanceData) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              Unable to fetch attendance data. Please check your organization
              settings.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { sections, stats } = attendanceData;

  // Convert date strings to Date objects
  const sectionsWithDateObjects = sections.map((section) => ({
    ...section,
    date: new Date(section.date),
    students: section.students.map((student) => ({
      ...student,
      attendanceStatus: student.attendanceStatus as
        | 'present'
        | 'absent'
        | 'late'
        | 'not-recorded',
      note: student.note || undefined,
    })),
  }));

  return (
    <div className="space-y-3 px-2">
      <Card className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 bg-gradient-to-r from-card via-card to-primary/5">
        <div className="w-full md:w-auto">
          <CardTitle> Section Attendance </CardTitle>
          <CardDescription>Today&apos;s attendance overview</CardDescription>
        </div>
        <div className="flex w-full md:w-auto flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="w-full sm:w-auto">
            <Link
              href="/dashboard/attendance"
              passHref
              className="w-full sm:w-auto"
            >
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Calendar className="w-4 h-4 mr-2" />
                View History
              </Button>
            </Link>
          </div>
          <Link
            href="/dashboard/attendance/mark"
            passHref
            className="w-full sm:w-auto"
          >
            <Button size="sm" className="w-full sm:w-auto">
              <Users className="w-4 h-4 mr-2" />
              Take Attendance
            </Button>
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Total Sections</h3>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{stats.totalSections}</div>
            <p className="text-xs text-muted-foreground">
              Sections being tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Completion Rate</h3>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">
              {stats.completionPercentage}%
            </div>
            <Progress value={stats.completionPercentage} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.completedSections} / {stats.totalSections} sections
              completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Attendance Rate</h3>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">
              {stats.attendancePercentage}%
            </div>
            <Progress value={stats.attendancePercentage} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.totalPresent} / {stats.totalStudents} students present
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Pending Sections</h3>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{stats.pendingSections}</div>
            <p className="text-xs text-muted-foreground">
              Sections awaiting completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section Attendance Table */}
      <Card>
        <CardContent className="p-6">
          <SectionWiseAttendanceTable
            sections={sectionsWithDateObjects}
            date={today}
          />
        </CardContent>
      </Card>
    </div>
  );
}
