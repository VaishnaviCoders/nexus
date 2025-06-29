'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  User,
  FileText,
} from 'lucide-react';
import { AttendanceStatus } from '@/lib/generated/prisma';
import { cn } from '@/lib/utils';

// Type-safe interfaces based on Prisma schema
interface StudentAttendanceRecord {
  id: string;
  studentId: string;
  present: boolean;
  date: Date;
  status: AttendanceStatus;
  note?: string | null;
  recordedBy: string;
  sectionId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AttendanceCalendarProps {
  attendanceData: StudentAttendanceRecord[];
  studentName?: string;
  className?: string;
  onDateClick?: (date: Date, attendance?: StudentAttendanceRecord) => void;
}

type DateStatus =
  | 'present'
  | 'absent'
  | 'late'
  | 'future'
  | 'no-school'
  | 'today';

interface CalendarDay {
  day: number | null;
  date: Date | null;
  status: DateStatus;
  attendance?: StudentAttendanceRecord;
  isToday: boolean;
  isCurrentMonth: boolean;
}

const STATUS_CONFIG = {
  present: {
    color:
      'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    icon: CheckCircle2,
    label: 'Present',
    badgeVariant: 'default' as const,
    description: 'Student was present on this day',
  },
  absent: {
    color:
      'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
    icon: XCircle,
    label: 'Absent',
    badgeVariant: 'destructive' as const,
    description: 'Student was absent on this day',
  },
  late: {
    color:
      'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    icon: Clock,
    label: 'Late',
    badgeVariant: 'secondary' as const,
    description: 'Student arrived late on this day',
  },
  future: {
    color:
      'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-500 dark:border-slate-700',
    icon: Calendar,
    label: 'Future',
    badgeVariant: 'outline' as const,
    description: 'Future date',
  },
  'no-school': {
    color:
      'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600',
    icon: Calendar,
    label: 'No School',
    badgeVariant: 'outline' as const,
    description: 'No school on this day',
  },
  today: {
    color:
      'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-700 ring-2 ring-blue-300 dark:ring-blue-700',
    icon: Calendar,
    label: 'Today',
    badgeVariant: 'default' as const,
    description: 'Today',
  },
} as const;

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export function AttendanceCalendar({
  attendanceData,
  studentName,
  className,
  onDateClick,
}: AttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date();

  // Memoized calendar calculations for performance
  const calendarData = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const calendarDays: CalendarDay[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push({
        day: null,
        date: null,
        status: 'no-school',
        isToday: false,
        isCurrentMonth: false,
      });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateStr = date.toISOString().split('T')[0];
      const todayStr = today.toISOString().split('T')[0];

      const attendance = attendanceData.find((record) => {
        const recordDateStr = new Date(record.date).toISOString().split('T')[0];
        return recordDateStr === dateStr;
      });

      let status: DateStatus;
      const isToday = dateStr === todayStr;

      if (isToday) {
        status = 'today';
      } else if (date > today) {
        status = 'future';
      } else if (!attendance) {
        status = 'no-school';
      } else if (attendance.present) {
        status =
          attendance.status === AttendanceStatus.LATE ? 'late' : 'present';
      } else {
        status = 'absent';
      }

      calendarDays.push({
        day,
        date,
        status,
        attendance,
        isToday,
        isCurrentMonth: true,
      });
    }

    return calendarDays;
  }, [currentYear, currentMonth, attendanceData, today]);

  // Memoized statistics
  const monthStats = useMemo(() => {
    const monthAttendance = attendanceData.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    });

    const totalDays = monthAttendance.length;
    const presentDays = monthAttendance.filter(
      (record) => record.present
    ).length;
    const lateDays = monthAttendance.filter(
      (record) => record.status === AttendanceStatus.LATE
    ).length;
    const absentDays = totalDays - presentDays;

    return {
      totalDays,
      presentDays,
      lateDays,
      absentDays,
      percentage:
        totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0,
    };
  }, [attendanceData, currentMonth, currentYear]);

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setHoveredDay(null);
  }, []);

  const handleDateClick = useCallback(
    (calendarDay: CalendarDay) => {
      if (calendarDay.date && onDateClick) {
        onDateClick(calendarDay.date, calendarDay.attendance);
      }
    },
    [onDateClick]
  );

  const formatTooltipContent = useCallback((calendarDay: CalendarDay) => {
    if (!calendarDay.date) return null;

    const config = STATUS_CONFIG[calendarDay.status];
    const attendance = calendarDay.attendance;

    return (
      <div className="space-y-2 max-w-xs">
        <div className="flex items-center gap-2">
          <config.icon className="w-4 h-4" />
          <span className="font-medium">
            {calendarDay.date.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <div className="text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="font-medium">Status:</span>
            <Badge variant={config.badgeVariant} className="text-xs">
              {config.label}
            </Badge>
          </div>
        </div>

        {attendance && (
          <div className="space-y-1 text-xs">
            {attendance.note && (
              <div className="flex items-start gap-1">
                <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{attendance.note}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-muted-foreground">
              <User className="w-3 h-3" />
              <span>Recorded by: {attendance.recordedBy}</span>
            </div>
            <div className="text-muted-foreground">
              Updated: {new Date(attendance.updatedAt).toLocaleTimeString()}
            </div>
          </div>
        )}

        {calendarDay.status === 'future' && (
          <div className="text-xs text-muted-foreground">
            Attendance not yet recorded
          </div>
        )}

        {calendarDay.status === 'no-school' && !calendarDay.isCurrentMonth && (
          <div className="text-xs text-muted-foreground">Different month</div>
        )}
      </div>
    );
  }, []);

  return (
    <TooltipProvider delayDuration={300}>
      <Card
        className={cn(
          'border-0 bg-gradient-to-br from-card via-card to-blue-50/20 dark:to-blue-950/20 shadow-lg',
          className
        )}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                Attendance Calendar
              </CardTitle>
              {studentName && (
                <p className="text-sm text-muted-foreground">
                  {studentName}'s attendance journey
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="text-center min-w-[140px]">
                <div className="text-sm font-semibold">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </div>
                <div className="text-xs text-muted-foreground">
                  {monthStats.percentage}% attendance
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Month Statistics */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>{monthStats.presentDays} Present</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span>{monthStats.lateDays} Late</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>{monthStats.absentDays} Absent</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            {Object.entries(STATUS_CONFIG).map(([status, config]) => {
              if (status === 'today') return null;
              return (
                <Badge
                  key={status}
                  variant={config.badgeVariant}
                  className="text-xs"
                >
                  <config.icon className="w-3 h-3 mr-1" />
                  {config.label}
                </Badge>
              );
            })}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
            {/* Day headers */}
            {DAY_NAMES.map((day) => (
              <div
                key={day}
                className="p-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarData.map((calendarDay, index) => {
              if (calendarDay.day === null) {
                return <div key={index} className="p-3"></div>;
              }

              const config = STATUS_CONFIG[calendarDay.status];
              const isHovered = hoveredDay === calendarDay.day;

              return (
                <Tooltip key={calendarDay.day}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'relative p-3 text-center text-sm border rounded-lg cursor-pointer transition-all duration-300',
                        'hover:scale-110 hover:shadow-sm hover:z-10 active:scale-95',
                        config.color,
                        isHovered && 'scale-110 shadow-lg z-10',
                        calendarDay.isToday && 'font-bold ',
                        !calendarDay.isCurrentMonth && 'opacity-30'
                      )}
                      onClick={() => handleDateClick(calendarDay)}
                      onMouseEnter={() => setHoveredDay(calendarDay.day)}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      <span className="relative z-10">{calendarDay.day}</span>

                      {/* Status indicator */}
                      {calendarDay.attendance && (
                        <div className="absolute top-1 right-1">
                          <config.icon className="w-3 h-3 opacity-70" />
                        </div>
                      )}

                      {/* Today indicator */}
                      {calendarDay.isToday && (
                        <div className="absolute inset-0 rounded-lg  border-blue-600 animate-pulse"></div>
                      )}

                      {/* Hover effect */}
                      {isHovered && (
                        <div className="absolute inset-0 rounded-lg bg-white/20 dark:bg-black/20"></div>
                      )}
                    </div>
                  </TooltipTrigger>

                  <TooltipContent
                    side="top"
                    className="max-w-xs p-3 bg-white dark:bg-gray-900 border shadow-xl"
                  >
                    {formatTooltipContent(calendarDay)}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
            <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
              <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                {monthStats.presentDays}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">
                Present
              </div>
            </div>

            <div className="text-center p-2 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <div className="text-lg font-bold text-amber-700 dark:text-amber-300">
                {monthStats.lateDays}
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-400">
                Late
              </div>
            </div>

            <div className="text-center p-2 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="text-lg font-bold text-red-700 dark:text-red-300">
                {monthStats.absentDays}
              </div>
              <div className="text-xs text-red-600 dark:text-red-400">
                Absent
              </div>
            </div>

            <div className="text-center p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {monthStats.percentage}%
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
