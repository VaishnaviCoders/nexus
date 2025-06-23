import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { getIssuesStats } from '@/lib/data/dashboard/admin-dashboard-cards';

async function IssuesStatsContent() {
  const stats = await getIssuesStats();
  const resolutionRate =
    stats.totalIssues > 0
      ? Math.round((stats.resolvedIssues / stats.totalIssues) * 100)
      : 0;

  return (
    <Card className="h-full">
      <CardContent className="pt-6   ">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Issues & Complaints</h3>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="space-y-3 ">
          <div className="text-2xl font-bold">{stats.pendingIssues}</div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Issues awaiting resolution
            </p>

            {stats.criticalIssues > 0 && (
              <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
              >
                {stats.criticalIssues} critical
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <CheckCircle className="w-3 h-3 text-green-500" />
              {stats.resolvedIssues} resolved ({resolutionRate}%)
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              {stats.totalIssues} total
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function IssuesStatsCardSkeleton() {
  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
        <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="space-y-3">
        <div className="h-8 bg-muted rounded w-12 animate-pulse"></div>
        <div className="h-3 bg-muted rounded w-32 animate-pulse"></div>
        <div className="h-3 bg-muted rounded w-28 animate-pulse"></div>
      </div>
    </CardContent>
  );
}

export function IssuesStatsCard() {
  return (
    <Card className="border-0 bg-gradient-to-br from-card via-card to-red-50/20 dark:to-red-950/20">
      <Suspense fallback={<IssuesStatsCardSkeleton />}>
        <IssuesStatsContent />
      </Suspense>
    </Card>
  );
}
