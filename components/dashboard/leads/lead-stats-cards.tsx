import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, AlertTriangle, UserPlus } from 'lucide-react';
import {
  getLeadStats,
  getConversionRate,
  getLeadGrowthThisMonth,
  getLeadsRequiringFollowUp,
} from '@/lib/data/leads/get-dashboard-card-stats';

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
      color: 'blue',
    },
    {
      title: 'New Leads',
      value: stats.newLeads.toLocaleString(),
      description: 'Last 7 days',
      icon: UserPlus,
      color: 'green',
    },
    {
      title: 'Converted',
      value: stats.convertedLeads.toLocaleString(),
      description: `Conversion rate: ${conversionRate}%`,
      icon: Target,
      color: 'purple',
    },
    {
      title: 'High Priority',
      value: stats.highPriorityLeads.toLocaleString(),
      description: `${followUpLeads} need follow-up`,
      icon: AlertTriangle,
      color: 'orange',
    },
  ];

  const colorClasses = {
    blue: {
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      border: 'border-blue-100',
    },
    green: {
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      border: 'border-green-100',
    },
    purple: {
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      border: 'border-purple-100',
    },
    orange: {
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      border: 'border-orange-100',
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        const colors = colorClasses[stat.color as keyof typeof colorClasses];

        return (
          <Card key={stat.title} className={`border ${colors.border}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${colors.iconBg}`}>
                  <Icon className={`h-6 w-6 ${colors.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export async function LeadDashboardStatsCards() {
  return <StatsCardsContent />;
}
