import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp, Target, Clock } from 'lucide-react';
import { getStudentAttendanceStatsCards } from '@/lib/data/attendance/get-student-attendance-stats';
import { DashboardFourGridsCardSkeleton } from '@/components/skeletons/DashboardCardSkeleton';
// import { getStudentAttendanceOverview } from "@/lib/actions/student-attendance-actions"

async function AttendanceStatsCardsContent() {
  const data = await getStudentAttendanceStatsCards();

  const statsCards = [
    {
      title: "Today's Status",
      value:
        data.todayStatus === 'NOT_MARKED' ? 'Not Marked' : data.todayStatus,
      icon: Clock,
      color:
        data.todayStatus === 'PRESENT'
          ? 'green'
          : data.todayStatus === 'ABSENT'
            ? 'red'
            : 'gray',
      badge:
        data.todayStatus === 'PRESENT'
          ? 'Present'
          : data.todayStatus === 'ABSENT'
            ? 'Absent'
            : 'Pending',
    },
    {
      title: "This Month's Attendance",
      value: `${data.thisMonth.percentage}%`,
      description: `${data.thisMonth.presentDays}/${data.thisMonth.totalDays} days`,
      icon: Calendar,
      color: 'blue',
      progress: data.thisMonth.percentage,
    },
    {
      title: 'This Year',
      value: `${data.thisYear.percentage}%`,
      description: `${data.thisYear.presentDays}/${data.thisYear.totalDays} days`,
      icon: TrendingUp,
      color: 'purple',
      progress: data.thisYear.percentage,
    },
    {
      title: 'Overall',
      value: `${data.overall.percentage}%`,
      description: `${data.overall.presentDays}/${data.overall.totalDays} days`,
      icon: Target,
      color: 'emerald',
      progress: data.overall.percentage,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        const getStatusColor = () => {
          if (stat.color === 'green')
            return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300';
          if (stat.color === 'red')
            return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300';
          if (stat.color === 'blue')
            return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300';
          if (stat.color === 'purple')
            return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300';
          if (stat.color === 'emerald')
            return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300';
          return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300';
        };

        return (
          <Card
            key={index}
            className="relative overflow-hidden group transition-all duration-300  bg-gradient-to-br from-card via-card to-muted/10"
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

                {stat.progress !== undefined && (
                  <div className="space-y-1">
                    <Progress value={stat.progress} className="h-2" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  {stat.description && (
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  )}

                  {stat.badge && (
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 ${getStatusColor()}`}
                    >
                      {stat.badge}
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



export function AttendanceStatsCards() {
  return (
    <Suspense fallback={<DashboardFourGridsCardSkeleton />}>
      <AttendanceStatsCardsContent />
    </Suspense>
  );
}
