import { Suspense } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import { getAttendanceSummary } from '@/lib/data/parent/getParent-dashboard-stats';

async function AttendanceSummaryContent() {
  const attendanceData = await getAttendanceSummary();

  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-medium">
          Attendance Summary
        </CardTitle>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-6">
        {attendanceData.map((student) => (
          <div key={student.studentId} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">{student.studentName}</h4>
              <Badge
                variant="outline"
                className={`text-xs ${
                  student.attendancePercentage >= 90
                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300'
                    : student.attendancePercentage >= 75
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300'
                      : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300'
                }`}
              >
                {student.attendancePercentage}%
              </Badge>
            </div>

            <Progress value={student.attendancePercentage} className="h-2" />

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  {student.presentDays} present
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-red-500" />
                  {student.absentDays} absent
                </div>
              </div>
              <span>{student.totalDays} total days</span>
            </div>

            {/* Recent 7 days attendance */}
            <div className="flex gap-1">
              {student.recentAttendance.map((attendance, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                    attendance.present
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}
                  title={`${attendance.date.toLocaleDateString()} - ${attendance.status}`}
                >
                  {attendance.present ? 'P' : 'A'}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  );
}

function AttendanceSummarySkeleton() {
  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
        <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-3 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-5 bg-muted rounded w-12"></div>
            </div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="h-3 bg-muted rounded w-32"></div>
          </div>
        ))}
      </div>
    </CardContent>
  );
}

export function AttendanceSummaryCard() {
  return (
    <Card className="border-0 bg-gradient-to-br from-card via-card to-green-50/20 dark:to-green-950/20">
      <Suspense fallback={<AttendanceSummarySkeleton />}>
        <AttendanceSummaryContent />
      </Suspense>
    </Card>
  );
}
