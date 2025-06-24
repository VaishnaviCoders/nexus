import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, TrendingDown, Bell } from 'lucide-react';
import { getAttendanceAlerts } from '@/lib/data/parent/attendance-monitor/getParent-attendance';
import Link from 'next/link';

async function AttendanceAlertsContent() {
  const alerts = await getAttendanceAlerts();

  if (alerts.length === 0) {
    return (
      <Card className="border-0 bg-gradient-to-br from-card via-card to-green-50/20 dark:to-green-950/20">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            All Good!
          </h3>
          <p className="text-sm text-green-600 dark:text-green-400 text-center">
            No attendance alerts for your children. Keep up the great work!
          </p>
        </CardContent>
      </Card>
    );
  }

  const severityColors = {
    HIGH: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
    MEDIUM:
      'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800',
    LOW: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
  };

  const alertIcons = {
    LOW_ATTENDANCE: TrendingDown,
    CONSECUTIVE_ABSENCES: AlertTriangle,
    NOT_MARKED: Clock,
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-card via-card to-red-50/20 dark:to-red-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Attendance Alerts
          <Badge variant="outline" className="ml-auto">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert, index) => {
          const Icon =
            alertIcons[alert.type as keyof typeof alertIcons] || AlertTriangle;
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                alert.severity === 'HIGH'
                  ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
                  : alert.severity === 'MEDIUM'
                    ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800'
                    : 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={`w-5 h-5 mt-0.5 ${
                    alert.severity === 'HIGH'
                      ? 'text-red-500'
                      : alert.severity === 'MEDIUM'
                        ? 'text-yellow-500'
                        : 'text-blue-500'
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{alert.studentName}</h4>
                    <Badge
                      variant="outline"
                      className={`text-xs ${severityColors[alert.severity as keyof typeof severityColors]}`}
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {alert.message}
                  </p>

                  {alert.type === 'LOW_ATTENDANCE' && (
                    <div className="flex items-center gap-4 text-xs">
                      <span>Current: {alert.percentage}%</span>
                      <span className="text-muted-foreground">
                        Required: 75%
                      </span>
                    </div>
                  )}

                  {alert.type === 'CONSECUTIVE_ABSENCES' && (
                    <div className="text-xs text-muted-foreground">
                      {alert.days} consecutive days absent
                    </div>
                  )}
                </div>

                <Link
                  href={`/dashboard/child-attendance?student=${alert.studentId}`}
                  passHref
                >
                  <Button size="sm" variant="outline" className="text-xs">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function AttendanceAlertsSkeleton() {
  return (
    <Card className="animate-pulse border-0">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-muted rounded"></div>
          <div className="h-5 bg-muted rounded w-32"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-muted rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AttendanceAlerts() {
  return (
    <Suspense fallback={<AttendanceAlertsSkeleton />}>
      <AttendanceAlertsContent />
    </Suspense>
  );
}
