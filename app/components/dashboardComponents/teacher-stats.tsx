import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, TrendingUp } from 'lucide-react';
import { getTeacherStats } from '@/lib/data/dashboard/admin-dashboard-cards';

async function TeacherStatsContent() {
  const stats = await getTeacherStats();
  const activePercentage =
    stats.totalTeachers > 0
      ? Math.round((stats.activeTeachers / stats.totalTeachers) * 100)
      : 0;

  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">Teaching Staff</h3>
        <GraduationCap className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        <div className="text-2xl font-bold">{stats.totalTeachers}</div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {stats.activeTeachers} active teachers ({activePercentage}%)
          </p>

          {stats.newTeachersThisMonth > 0 && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
            >
              <TrendingUp className="w-3 h-3 mr-1" />+
              {stats.newTeachersThisMonth} new
            </Badge>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          All departments covered
        </div>
      </div>
    </CardContent>
  );
}

function TeacherStatsCardSkeleton() {
  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
        <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="space-y-3">
        <div className="h-8 bg-muted rounded w-12 animate-pulse"></div>
        <div className="h-3 bg-muted rounded w-32 animate-pulse"></div>
        <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
      </div>
    </CardContent>
  );
}

export function TeacherStatsCard() {
  return (
    <Card className="border-0 bg-gradient-to-br from-card via-card to-green-50/20 dark:to-green-950/20">
      <Suspense fallback={<TeacherStatsCardSkeleton />}>
        <TeacherStatsContent />
      </Suspense>
    </Card>
  );
}
