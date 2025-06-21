import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, DollarSign, Bell } from 'lucide-react';
import { getParentDashboardStats } from '@/lib/data/parent/getParent-dashboard-stats';

async function ParentStatsContent() {
  const stats = await getParentDashboardStats();

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const statsCards = [
    {
      title: 'My Children',
      value: stats.totalChildren.toString(),
      description: `${stats.presentToday} present today`,
      icon: Users,
      color: 'blue',
      badge:
        stats.presentToday === stats.totalChildren
          ? { text: 'All Present', variant: 'green' }
          : null,
    },
    {
      title: 'Avg Attendance',
      value: `${stats.avgAttendance}%`,
      description: 'This month average',
      icon: Calendar,
      color: 'green',
      badge:
        stats.avgAttendance >= 90
          ? { text: 'Excellent', variant: 'green' }
          : stats.avgAttendance >= 75
            ? { text: 'Good', variant: 'yellow' }
            : { text: 'Needs Attention', variant: 'red' },
    },
    {
      title: 'Pending Fees',
      value:
        stats.totalPendingFees > 0
          ? formatCurrency(stats.totalPendingFees)
          : '₹0',
      description:
        stats.totalOverdueFees > 0
          ? `₹${formatCurrency(stats.totalOverdueFees)} overdue`
          : 'All up to date',
      icon: DollarSign,
      color: 'emerald',
      badge:
        stats.totalOverdueFees > 0
          ? { text: 'Overdue', variant: 'red' }
          : stats.totalPendingFees > 0
            ? { text: 'Pending', variant: 'yellow' }
            : { text: 'Paid', variant: 'green' },
    },
    {
      title: 'New Notices',
      value: stats.unreadNotices.toString(),
      description: 'Unread notices',
      icon: Bell,
      color: 'purple',
      badge: stats.unreadNotices > 0 ? { text: 'New', variant: 'blue' } : null,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        const badgeVariants = {
          green:
            'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
          blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
          yellow:
            'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800',
          red: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
          purple:
            'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
        };

        return (
          <Card
            key={index}
            className="relative overflow-hidden group bg-white border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card via-card to-muted/10"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </h3>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="space-y-3">
                <div className="text-2xl font-bold">{stat.value}</div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {stat.description}
                  </p>

                  {stat.badge && (
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 ${
                        badgeVariants[
                          stat.badge.variant as keyof typeof badgeVariants
                        ]
                      }`}
                    >
                      {stat.badge.text}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ParentStatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="animate-pulse border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-8 bg-muted rounded w-16"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ParentDashboardStatsContent() {
  return (
    <Suspense fallback={<ParentStatsCardsSkeleton />}>
      <ParentStatsContent />
    </Suspense>
  );
}
