import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';
import { getRevenueStats } from '@/lib/data/dashboard/admin-dashboard-cards';

async function RevenueStatsContent() {
  const stats = await getRevenueStats();

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <CardContent className="pt-6 ">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">Revenue Collection</h3>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        <div className="text-2xl font-bold">
          {formatCurrency(stats.collectedRevenue)}
        </div>

        <Progress value={stats.revenuePercentage} className="h-2" />

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {formatCurrency(stats.pendingRevenue)} pending (
            {100 - stats.revenuePercentage}%)
          </p>

          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
          >
            {stats.revenuePercentage}% collected
          </Badge>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>This month: {formatCurrency(stats.thisMonthCollection)}</span>
          {stats.overdueFeesCount > 0 && (
            <span className="text-red-600 dark:text-red-400">
              {stats.overdueFeesCount} overdue
            </span>
          )}
        </div>
      </div>
    </CardContent>
  );
}

function RevenueStatsCardSkeleton() {
  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
        <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="space-y-3">
        <div className="h-8 bg-muted rounded w-20 animate-pulse"></div>
        <div className="h-2 bg-muted rounded animate-pulse"></div>
        <div className="h-3 bg-muted rounded w-32 animate-pulse"></div>
        <div className="h-3 bg-muted rounded w-28 animate-pulse"></div>
      </div>
    </CardContent>
  );
}

export function RevenueStatsCard() {
  return (
    <Card className="border-0 bg-gradient-to-br from-card via-card to-emerald-50/20 dark:to-emerald-950/20">
      <Suspense fallback={<RevenueStatsCardSkeleton />}>
        <RevenueStatsContent />
      </Suspense>
    </Card>
  );
}
