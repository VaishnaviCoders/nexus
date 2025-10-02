import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Calendar, BookOpen, AlertTriangle } from 'lucide-react';
import { getTeacherDashboardStats } from '@/lib/data/teacher/get-teacher-dashboard-stats';

async function TeacherStatsContent() {
  const stats = await getTeacherDashboardStats();

  const statsCards = [
    {
      title: 'My Students',
      value: stats.totalStudents.toString(),
      description: `${stats.todayAttendance.present} present today`,
      icon: Users,
      color: 'blue',
      progress: stats.todayAttendance.percentage,
      badge: {
        text:
          stats.todayAttendance.total === 0
            ? 'No Attendance Data'
            : stats.todayAttendance.absent === 0
              ? 'All Present'
              : `${stats.todayAttendance.absent} absent`,
        variant:
          stats.todayAttendance.total === 0
            ? 'yellow'
            : stats.todayAttendance.absent === 0
              ? 'green'
              : 'yellow',
      },
    },
    {
      title: "Today's Attendance",
      value: `${stats.todayAttendance.present}/${stats.todayAttendance.total}`,
      description: `${stats.todayAttendance.percentage}% present`,
      icon: Calendar,
      color: 'green',
      progress: stats.todayAttendance.percentage,
      badge: {
        text:
          stats.todayAttendance.absent > 0
            ? `${stats.todayAttendance.absent} absent`
            : 'All Present',
        variant: stats.todayAttendance.absent === 0 ? 'green' : 'yellow',
      },
    },
    {
      title: 'Teaching Subjects',
      value: stats.teacher.teachingAssignment.length.toString(),
      description: `Subjects you're assigned`,
      icon: BookOpen,
      color: 'purple',
      badge:
        stats.teacher.teachingAssignment.length > 0
          ? {
              text: `${stats.teacher.teachingAssignment.length} subjects`,
              variant: 'blue',
            }
          : {
              text: 'No Subjects Assigned',
              variant: 'yellow',
            },
    },
    {
      title: 'Pending Complaints',
      value: stats.pendingComplaints.toString(),
      description: 'Complaints to review',
      icon: AlertTriangle,
      color: 'red',
      badge: {
        text: stats.pendingComplaints > 0 ? 'Action Required' : 'All Clear',
        variant: stats.pendingComplaints > 0 ? 'red' : 'green',
      },
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
            className="relative overflow-hidden group  transition-all duration-300  bg-gradient-to-br from-card via-card to-muted/10"
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

function TeacherStatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="animate-pulse ">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-8 bg-muted rounded w-16"></div>
              <div className="h-2 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TeacherStatsCards() {
  return (
    <Suspense fallback={<TeacherStatsCardsSkeleton />}>
      <TeacherStatsContent />
    </Suspense>
  );
}
