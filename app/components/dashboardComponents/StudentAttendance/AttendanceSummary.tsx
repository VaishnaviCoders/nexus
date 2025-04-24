import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CircleCheck, CircleX, Clock } from 'lucide-react';

interface AttendanceData {
  present: number;
  absent: number;
  late: number;
  total: number;
  percentage: number;
}

interface AttendanceSummaryProps {
  attendance: AttendanceData;
}

export function AttendanceSummary({ attendance }: AttendanceSummaryProps) {
  // Determine badge color based on attendance percentage
  const getBadgeVariant = (percentage: number) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'warning';
    return 'destructive';
  };

  const badgeVariant = getBadgeVariant(attendance.percentage);
  const badgeText =
    attendance.percentage >= 90
      ? 'Excellent'
      : attendance.percentage >= 75
      ? 'Good'
      : 'Needs Improvement';

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Attendance Summary</CardTitle>
          <Badge
            variant={
              badgeVariant as
                | 'default'
                | 'secondary'
                | 'destructive'
                | 'outline'
                | 'present'
                | 'absent'
                | 'late'
            }
            className="ml-2"
          >
            {badgeText}
          </Badge>
        </div>
        <CardDescription>Overall attendance for current term</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Attendance Rate</span>
              <span className="font-medium">{attendance.percentage}%</span>
            </div>
            <Progress value={attendance.percentage} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 mb-2">
                <CircleCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold">{attendance.present}</div>
              <div className="text-xs text-muted-foreground">Present</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 mb-2">
                <CircleX className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-2xl font-bold">{attendance.absent}</div>
              <div className="text-xs text-muted-foreground">Absent</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/20 mb-2">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-2xl font-bold">{attendance.late}</div>
              <div className="text-xs text-muted-foreground">Late</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
