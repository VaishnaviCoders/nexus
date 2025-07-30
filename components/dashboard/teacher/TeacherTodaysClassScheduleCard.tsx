import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, BookOpen } from 'lucide-react';
import { stat } from 'fs';
import { ScrollArea } from '@radix-ui/react-scroll-area';
// import { getTodaySchedule } from '@/lib/actions/teacher-dashboard-stats';

async function TodayScheduleContent() {
  // const schedule = await getTodaySchedule();

  const schedule = [
    {
      class_item: 1,
      status: 'COMPLETED',
      subject: 'Mathematics',
      grade: '12',
      section: 'A',
      time: '10:00 AM - 12:00 PM',
      room: '101',
      id: 1,
    },
    {
      class_item: 2,
      status: 'UPCOMING',
      subject: 'Mathematics',
      grade: '12',
      section: 'A',
      time: '10:00 AM - 12:00 PM',
      room: '101',
      id: 2,
    },
    {
      class_item: 3,
      status: 'ONGOING',
      subject: 'Mathematics',
      grade: '12',
      section: 'A',
      time: '10:00 AM - 12:00 PM',
      room: '101',
      id: 4,
    },
  ];

  const statusColors = {
    COMPLETED:
      'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300',
    ONGOING:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
    UPCOMING:
      'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300',
  };

  return (
    <Card className="border-0 ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5" />
          Today's Schedule (Mock)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 h-80">
        {schedule.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No classes scheduled for today</p>
          </div>
        ) : (
          <ScrollArea className="h-80 space-y-4">
            {schedule.map((class_item) => (
              <div
                key={class_item.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  class_item.status === 'ONGOING'
                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800 shadow-md'
                    : 'bg-background/50 hover:bg-background/80'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <h4 className="font-medium text-sm">
                        {class_item.subject}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${statusColors[class_item.status as keyof typeof statusColors]}`}
                      >
                        {class_item.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Grade {class_item.grade}-{class_item.section}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {class_item.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {class_item.room}
                    </div>
                  </div>
                  {class_item.status === 'UPCOMING' && (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      Next
                    </span>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

function TodayScheduleSkeleton() {
  return (
    <Card className="animate-pulse border-0 ">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-muted rounded"></div>
          <div className="h-5 bg-muted rounded w-32"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            </div>
            <div className="h-3 bg-muted rounded w-32"></div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function TeacherTodaysClassScheduleCard() {
  return (
    <Suspense fallback={<TodayScheduleSkeleton />}>
      <TodayScheduleContent />
    </Suspense>
  );
}
