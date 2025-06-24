import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Bell, Clock, Activity } from 'lucide-react';
import { getRecentActivities } from '@/lib/data/teacher/get-teacher-dashboard-stats';

async function RecentActivitiesContent() {
  const activities = await getRecentActivities();

  const activityIcons = {
    ATTENDANCE: Calendar,
    NOTICE: Bell,
    GRADE: Activity,
    COMPLAINT: Activity,
  };

  const activityColors = {
    ATTENDANCE: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    NOTICE: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    GRADE:
      'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    COMPLAINT: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-card via-card to-green-50/20 dark:to-green-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No recent activities</p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon =
              activityIcons[activity.type as keyof typeof activityIcons] ||
              Activity;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors duration-200"
              >
                <div
                  className={`p-2 rounded-lg ${
                    activityColors[activity.type as keyof typeof activityColors]
                  } flex-shrink-0`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {activity.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Clock className="w-3 h-3" />
                      {new Date(activity.time).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

function RecentActivitiesSkeleton() {
  return (
    <Card className="animate-pulse border-0">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-muted rounded"></div>
          <div className="h-5 bg-muted rounded w-32"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3">
            <div className="w-8 h-8 bg-muted rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </div>
          </div>
        ))}
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
