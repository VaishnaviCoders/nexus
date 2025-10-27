import type React from 'react';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Target,
  AlertTriangle,
  UserPlus,
  ArrowDownIcon,
  TrendingUp,
} from 'lucide-react';
import {
  getLeadStats,
  getConversionRate,
  getLeadGrowthThisMonth,
  getLeadsRequiringFollowUp,
} from '@/lib/data/leads/get-dashboard-card-stats';

export function StatCardSkeleton() {
  return (
    <Card className="relative overflow-hidden border-border/40 bg-card/50">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-24 shimmer rounded-md" />
          <div className="h-8 w-32 shimmer rounded-md" />
        </div>
        <div className="h-12 w-12 shimmer rounded-lg" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-3 w-40 shimmer rounded-md" />
          <div className="flex items-center justify-between gap-2">
            <div className="h-2 w-20 shimmer rounded-md" />
            <div className="h-5 w-16 shimmer rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

async function StatsCardsContent() {
  const [stats, followUpLeads, conversionRate, growthRate] = await Promise.all([
    getLeadStats(),
    getLeadsRequiringFollowUp(),
    getConversionRate(),
    getLeadGrowthThisMonth(),
  ]);

  const statsData = [
    {
      title: 'Total Leads',
      value: stats.totalLeads.toLocaleString(),
      description: 'All time leads',
      icon: Users,
      trend: growthRate,
      accentColor: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100 dark:bg-blue-950',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'New Leads',
      value: stats.newLeads.toLocaleString(),
      description: 'Last 7 days',
      icon: UserPlus,
      accentColor: 'from-emerald-500 to-emerald-600',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
    },
    {
      title: 'Converted',
      value: stats.convertedLeads.toLocaleString(),
      description: `Conversion rate: ${conversionRate}%`,
      icon: Target,
      accentColor: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100 dark:bg-purple-950',
      iconColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
    {
      title: 'High Priority',
      value: stats.highPriorityLeads.toLocaleString(),
      description: `${followUpLeads} need follow-up`,
      icon: AlertTriangle,
      accentColor: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-100 dark:bg-orange-950',
      iconColor: 'text-orange-600 dark:text-orange-400',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <StatCard key={stat.title} stat={stat} index={index} />
      ))}
    </div>
  );
}

interface StatCardProps {
  stat: {
    title: string;
    value: string;
    description: string;
    icon: React.ComponentType<any>;
    trend?: number | null;
    accentColor: string;
    iconBg: string;
    iconColor: string;
    borderColor: string;
  };
  index: number;
}

function StatCard({ stat, index }: StatCardProps) {
  const Icon = stat.icon;

  return (
    <Card
      className={`relative overflow-hidden border transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 group ${stat.borderColor} bg-gradient-to-br from-card to-card/50`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br from-primary via-transparent to-accent" />

      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="relative z-10">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-sm text-muted-foreground uppercase ">
              {stat.title}
            </CardTitle>
            <div className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {stat.value}
            </div>
          </div>
          <div
            className={`p-3 rounded-xl ${stat.iconBg} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
          >
            <Icon className={`h-5 w-5 ${stat.iconColor}`} />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              {stat.description}
            </p>
            {stat.trend !== undefined && stat.trend !== null && (
              <Badge
                variant={stat.trend >= 0 ? 'default' : 'destructive'}
                className="text-xs flex items-center gap-1 whitespace-nowrap font-semibold"
              >
                {stat.trend >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3" />
                )}
                {Math.abs(stat.trend)}%
              </Badge>
            )}
          </div>

          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${stat.accentColor} transition-all duration-1000`}
              style={{
                width: `${Math.min(Math.random() * 100 + 40, 100)}%`,
              }}
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export function StatsCards() {
  return (
    <Suspense fallback={<StatsCardsSkeleton />}>
      <StatsCardsContent />
    </Suspense>
  );
}
