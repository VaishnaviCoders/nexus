'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface AttendanceRecord {
  id: string;
  present: boolean;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  date: Date;
  note?: string | null;
}

interface RecentAttendanceTimelineProps {
  recentAttendance?: AttendanceRecord[];
}

export function RecentAttendanceTimeline({
  recentAttendance = [],
}: RecentAttendanceTimelineProps) {
  // Mock data if none provided

  const timelineData =
    recentAttendance.length > 0
      ? recentAttendance.slice(0, 5)
      : recentAttendance;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return {
          icon: CheckCircle2,
          color: 'text-green-600',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          badge: 'present',
        };
      case 'ABSENT':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          badge: 'absent',
        };
      case 'LATE':
        return {
          icon: Clock,
          color: 'text-amber-600',
          bgColor: 'bg-amber-100 dark:bg-amber-900/30',
          badge: 'late',
        };
      default:
        return {
          icon: Calendar,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30',
          badge: 'outline',
        };
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-card via-card to-purple-50/20 dark:to-purple-950/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Attendance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineData.map((record, index) => {
            const config = getStatusConfig(record.status);
            const IconComponent = config.icon;

            return (
              <div key={record.id} className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-full ${config.bgColor} ${config.color}`}
                >
                  <IconComponent className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">
                      {format(new Date(record.date), 'EEEE, MMM d')}
                    </p>
                    <Badge variant={config.badge as any} className="text-xs">
                      {record.status}
                    </Badge>
                  </div>

                  {record.note && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {record.note}
                    </p>
                  )}
                </div>

                {index < timelineData.length - 1 && (
                  <div className="absolute left-6 mt-8 w-px h-4 bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
            );
          })}
        </div>

        {timelineData.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No recent attendance records</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
