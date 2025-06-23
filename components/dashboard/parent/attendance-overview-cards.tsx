import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { getChildrenAttendanceOverview } from '@/lib/data/parent/attendance-monitor/getParent-attendance';

async function AttendanceOverviewContent() {
  const children = await getChildrenAttendanceOverview();

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 ">
      {children.map((child) => (
        <Card key={child.id}>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={child.profileImage || ''} alt={child.name} />
                <AvatarFallback className="text-lg">
                  {child.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-xl">{child.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Grade {child.grade}-{child.section} • Roll: {child.rollNumber}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      child.todayStatus === 'PRESENT'
                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300'
                        : child.todayStatus === 'ABSENT'
                          ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300'
                          : child.todayStatus === 'LATE'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300'
                            : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300'
                    }`}
                  >
                    Today:{' '}
                    {child.todayStatus === 'NOT_MARKED'
                      ? 'Not Marked'
                      : child.todayStatus}
                  </Badge>
                  {child.streaks.current > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
                    >
                      <Award className="w-3 h-3 mr-1" />
                      {child.streaks.current} day streak
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* This Month Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">This Month</h4>
                <div className="flex items-center gap-1">
                  {child.monthStats.percentage >= 90 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : child.monthStats.percentage < 75 ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <Calendar className="w-4 h-4 text-blue-500" />
                  )}
                  <span className="text-lg font-bold">
                    {child.monthStats.percentage}%
                  </span>
                </div>
              </div>
              <Progress value={child.monthStats.percentage} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{child.monthStats.presentDays} present</span>
                <span>
                  {child.monthStats.totalDays - child.monthStats.presentDays}{' '}
                  absent
                </span>
                <span>{child.monthStats.totalDays} total days</span>
              </div>
            </div>

            {/* Year Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">This Year</h4>
                <span className="text-lg font-bold">
                  {child.yearStats.percentage}%
                </span>
              </div>
              <Progress value={child.yearStats.percentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {child.yearStats.presentDays}/{child.yearStats.totalDays} days
                </span>
                <span>
                  {child.yearStats.percentage >= 90
                    ? 'Excellent'
                    : child.yearStats.percentage >= 75
                      ? 'Good'
                      : 'Needs Improvement'}
                </span>
              </div>
            </div>

            {/* Recent Attendance Pattern */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Last 14 Days</h4>
              <div className="flex gap-1 flex-wrap">
                {child.recentAttendance.map((record, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium ${
                      record.present
                        ? record.status === 'LATE'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}
                    title={`${record.date.toLocaleDateString()} - ${record.status}`}
                  >
                    {record.present
                      ? record.status === 'LATE'
                        ? 'L'
                        : 'P'
                      : 'A'}
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                P = Present, A = Absent, L = Late
              </div>
            </div>

            {/* Streaks */}
            {(child.streaks.current > 0 || child.streaks.longest > 0) && (
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {child.streaks.current}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Current Streak
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {child.streaks.longest}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Best Streak
                  </div>
                </div>
              </div>
            )}

            {/* Alerts */}
            {child.monthStats.percentage < 75 &&
              child.monthStats.totalDays >= 5 && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-800 dark:text-red-200">
                      Low Attendance Alert
                    </span>
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Attendance is below 75%. Please ensure regular school
                    attendance.
                  </p>
                </div>
              )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AttendanceOverviewSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i} className="animate-pulse border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-muted rounded w-32"></div>
                <div className="h-4 bg-muted rounded w-48"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-3 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-32"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AttendanceOverviewCards() {
  return (
    <Suspense fallback={<AttendanceOverviewSkeleton />}>
      <AttendanceOverviewContent />
    </Suspense>
  );
}
