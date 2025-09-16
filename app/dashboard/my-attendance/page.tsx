import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';
import { AttendanceStatsCards } from '@/components/dashboard/StudentAttendance/attendance-stats-cards';
import { StudentAttendanceCalendar } from '@/components/dashboard/StudentAttendance/attendance-calendar';
import { RecentAttendanceTimeline } from '@/components/dashboard/StudentAttendance/recent-attendance-calendar';
import { getCurrentUserId } from '@/lib/user';
import WeeklyAttendanceReportCard from '@/components/dashboard/StudentAttendance/WeeklyAttendanceReportCard';
import { getWeeklyAttendanceReport } from '@/lib/data/attendance/get-weekly-attendance-report';
import { Progress } from '@/components/ui/progress';
import { getMyAttendance } from '@/lib/data/attendance/my-attendance';

export default async function page() {
  const userId = await getCurrentUserId();

  const {
    annualPercentage,
    attendanceData,
    currentStreak,
    student,
    monthlyPercentage,
    monthlyStats,
    recentAttendance,
  } = await getMyAttendance(userId);

  const weeklyReportData = await getWeeklyAttendanceReport(student.id);

  return (
    <div className="px-2 space-y-3">
      {/* Header */}
      <Card className="py-4 px-2 flex items-center justify-between">
        <div>
          <CardTitle className="text-lg flex gap-3 items-center">
            My Attendance
            <Badge
              variant="outline"
              className="bg-blue-50 max-sm:hidden text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Academic Year 2025-26
            </Badge>
          </CardTitle>
          <CardDescription className="text-sm">
            Track your school attendance, reports
          </CardDescription>
        </div>
        <div className="flex justify-center items-center space-x-3">
          <div className="">
            <WeeklyAttendanceReportCard data={weeklyReportData} />
          </div>
          <Link href="/dashboard" className="max-sm:hidden">
            <Button size="sm">
              <ChevronLeft /> Dashboard
            </Button>
          </Link>
        </div>
      </Card>

      {/* Overview Cards */}
      <AttendanceStatsCards />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column - Calendar */}
        <div className="lg:col-span-8 space-y-6">
          <StudentAttendanceCalendar attendanceRecords={attendanceData} />
          <Card className="border-0 ">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Smart Recommendations
              </h3>
              <div className="space-y-3">
                {monthlyPercentage >= 90 ? (
                  <div className="p-3 bg-green-100 dark:bg-green-950/30 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      🎉 Excellent Attendance!
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      You're doing great! Keep maintaining this consistency.
                    </p>
                  </div>
                ) : monthlyPercentage >= 75 ? (
                  <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      📈 Good Progress
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Try to avoid late arrivals on Fridays to improve your
                      record.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-orange-100 dark:bg-orange-950/30 rounded-lg">
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      ⚠️ Needs Improvement
                    </p>
                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                      Focus on consistent daily attendance to reach your goals.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Quick Tips</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Set multiple alarms 15 minutes apart</li>
                    <li>• Prepare school bag the night before</li>
                    <li>• Track your sleep schedule</li>
                    <li>• Plan your morning routine</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Timeline & Insights */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Timeline */}
          <RecentAttendanceTimeline recentAttendance={recentAttendance} />
          <Card className="border-0 ">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Attendance Goals
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Target (85%)</span>
                    <span
                      className={
                        monthlyPercentage >= 85
                          ? 'text-green-600'
                          : 'text-orange-600'
                      }
                    >
                      {monthlyPercentage}%
                    </span>
                  </div>

                  <Progress
                    value={monthlyPercentage}
                    max={100}
                    className="h-2 rounded-full transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Annual Target (90%)</span>
                    <span
                      className={
                        annualPercentage >= 85
                          ? 'text-green-600'
                          : 'text-orange-600'
                      }
                    >
                      {annualPercentage}%
                    </span>
                  </div>
                  <Progress
                    value={annualPercentage}
                    max={100}
                    className="h-2 rounded-full transition-all duration-300"
                  />
                </div>

                {monthlyPercentage < 85 && (
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-orange-700 dark:text-orange-300">
                          Attendance Alert
                        </p>
                        <p className="text-orange-600 dark:text-orange-400">
                          You need{' '}
                          {Math.ceil(
                            (85 * monthlyStats.totalDays) / 100 -
                              monthlyStats.presentDays
                          )}{' '}
                          more present days to reach your monthly goal.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Monthly Insights */}
          <Card className="border-0 ">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                This Month's Summary
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {monthlyPercentage}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Attendance Rate
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="font-semibold text-green-700 dark:text-green-300">
                      {monthlyStats.presentDays}
                    </div>
                    <div className="text-green-600 dark:text-green-400">
                      Present
                    </div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <div className="font-semibold text-orange-700 dark:text-orange-300">
                      {monthlyStats.lateDays}
                    </div>
                    <div className="text-orange-600 dark:text-orange-400">
                      Late
                    </div>
                  </div>
                </div>

                {currentStreak > 0 && (
                  <div className="text-center p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-semibold">
                        {currentStreak} Day Streak!
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Keep it up!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Attendance Goals */}
        </div>
      </div>

      {/* Attendance Insights & Tips */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Smart Recommendations */}
      </div>

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
