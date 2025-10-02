import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Bell,
  Clock,
  Activity,
  RefreshCw,
  AlertCircle,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { getRecentActivities } from '@/lib/data/teacher/get-teacher-dashboard-stats';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDateIN, formatDateTimeIN, getRelativeTime } from '@/lib/utils';
import Link from 'next/link';

async function RecentActivitiesContent() {
  try {
    const activities = await getRecentActivities();

    const activityIcons = {
      ATTENDANCE: Calendar,
      NOTICE: Bell,
      GRADE: TrendingUp,
      COMPLAINT: AlertCircle,
    };

    const activityColors = {
      ATTENDANCE:
        'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      NOTICE:
        'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800',
      GRADE:
        'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      COMPLAINT:
        'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800',
    };

    const activityLabels = {
      ATTENDANCE: 'Attendance',
      NOTICE: 'Notice',
      GRADE: 'Grade',
      COMPLAINT: 'Complaint',
    };

    if (!activities || activities.length === 0) {
      return (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activities
              </div>
              {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <RefreshCw className="w-4 h-4" />
                <span className="sr-only">Refresh activities</span>
              </Button> */}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 mx-auto bg-muted/30 rounded-full flex items-center justify-center">
                  <Activity className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Plus className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">
                  No recent activities
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Your recent activities will appear here. Start by taking
                  attendance, posting notices, or grading assignments.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-xs bg-transparent"
                >
                  <Link href={'dashboard/attendance/mark'}>
                    <Calendar className="w-3 h-3 mr-1" />
                    Take Attendance
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-transparent"
                >
                  <Bell className="w-3 h-3 mr-1" />
                  Post Notice
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activities
              <Badge variant="secondary" className="text-xs font-normal">
                {activities.length}
              </Badge>
            </div>
            {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <RefreshCw className="w-4 h-4" />
              <span className="sr-only">Refresh activities</span>
            </Button> */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80 pr-4">
            <div className="space-y-2">
              {activities.map((activity, index) => {
                const Icon =
                  activityIcons[activity.type as keyof typeof activityIcons] ||
                  Activity;
                const colorClass =
                  activityColors[activity.type as keyof typeof activityColors];
                const label =
                  activityLabels[activity.type as keyof typeof activityLabels];

                return (
                  <div
                    key={activity.id}
                    className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/40 transition-all duration-200 border border-transparent hover:border-border/50"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={`p-2 rounded-lg border ${colorClass} flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm text-foreground line-clamp-1">
                              {activity.title}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-xs font-normal shrink-0"
                            >
                              {label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {activity.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />

                          {formatDateTimeIN(activity.time)}
                        </div>

                        <span className="text-xs text-muted-foreground/70">
                          {getRelativeTime(activity.time)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  } catch (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-50 dark:bg-red-950/50 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">
                Unable to load activities
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                There was an error loading your recent activities. Please try
                again.
              </p>
            </div>
            <Button variant="outline" size="sm" className="mt-4 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
}

function RecentActivitiesSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
            <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
            <div className="h-5 bg-muted rounded w-8 animate-pulse"></div>
          </div>
          <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg">
              <div className="w-8 h-8 bg-muted rounded-lg animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                </div>
                <div className="h-3 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="flex justify-between items-center pt-1">
                  <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-12 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentActivitiesCard() {
  return (
    <Suspense fallback={<RecentActivitiesSkeleton />}>
      <RecentActivitiesContent />
    </Suspense>
  );
}
