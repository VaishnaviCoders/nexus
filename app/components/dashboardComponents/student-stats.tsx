import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp } from 'lucide-react';
import { getStudentStats } from '@/lib/data/dashboard/admin-dashboard-cards';

async function StudentStatsContent() {
  const stats = await getStudentStats();

  return (
    <Card className="pt-6  ">
      <CardContent>
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Total Students</h3>
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="space-y-3">
          <div className="text-2xl font-bold">
            {stats.totalStudents.toLocaleString()}
          </div>

          <Progress value={stats.attendancePercentage} className="h-2" />

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {stats.presentToday} present today ({stats.attendancePercentage}%)
            </p>

            {stats.newAdmissionsThisMonth > 0 && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
              >
                <TrendingUp className="w-3 h-3 mr-1" />+
                {stats.newAdmissionsThisMonth} this month
              </Badge>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            {stats.activeStudents} active students
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StudentStatsCardSkeleton() {
  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
        <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="space-y-3">
        <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
        <div className="h-2 bg-muted rounded animate-pulse"></div>
        <div className="h-3 bg-muted rounded w-32 animate-pulse"></div>
        <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
      </div>
    </CardContent>
  );
}

export function StudentStatsCard() {
  return (
    <Card className="border-0 bg-gradient-to-br from-card via-card to-blue-50/20 dark:to-blue-950/20">
      <Suspense fallback={<StudentStatsCardSkeleton />}>
        <StudentStatsContent />
      </Suspense>
    </Card>
  );
}
