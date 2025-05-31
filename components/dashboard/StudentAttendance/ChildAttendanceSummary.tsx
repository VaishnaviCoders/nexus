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
import { Skeleton } from '@/components/ui/skeleton';

interface ChildAttendanceSummaryProps {
  childId: string;
  summary: {
    percentage: number;
    present: number;
    absent: number;
    late: number;
    total: number;
  };
}

export function ChildAttendanceSummary({
  summary,
}: ChildAttendanceSummaryProps) {
  const getBadgeVariant = (percentage: number) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'warning';
    return 'destructive';
  };

  const badgeVariant = getBadgeVariant(summary.percentage);
  const badgeText =
    summary.percentage >= 90
      ? 'Excellent'
      : summary.percentage >= 75
      ? 'Good'
      : 'Needs Improvement';

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Attendance Summary</CardTitle>
          <Badge
            variant={
              badgeVariant as
                | 'secondary'
                | 'destructive'
                | 'outline'
                | 'present'
                | 'late'
            }
            className="ml-2 text-xs cursor-pointer"
          >
            {badgeText}
          </Badge>
        </div>
        <CardDescription>Overall attendance for current term</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col space-y-6">
          <div className="space-y-2 p-6">
            <div className="flex justify-between text-sm">
              <span>Attendance Rate</span>
              <span className="font-medium">{summary.percentage}%</span>
            </div>
            <Progress value={summary.percentage} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center pb-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-2">
                <CircleCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold">{summary.present}</div>
              <div className="text-xs text-muted-foreground">Present</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-2">
                <CircleX className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-2xl font-bold">{summary.absent}</div>
              <div className="text-xs text-muted-foreground">Absent</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 mb-2">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-2xl font-bold">{summary.late}</div>
              <div className="text-xs text-muted-foreground">Late</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SummarySkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-60 mt-1" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="h-12 w-12 rounded-full mb-2" />
                <Skeleton className="h-6 w-8 mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
