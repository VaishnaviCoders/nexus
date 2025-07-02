'use client';

import { cn } from '@/lib/utils';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Filter,
  RotateCcw,
  TrendingUp,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isFuture,
  getDay,
} from 'date-fns';
import { Separator } from '@/components/ui/separator';

// Types based on Prisma schema
type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

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
  attendanceRecords: StudentAttendanceRecord[];
  onDateClick?: (date: Date, record?: StudentAttendanceRecord) => void;
  onExportData?: () => void;
  className?: string;
}

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
  attendance?: StudentAttendanceRecord;
  status: 'present' | 'absent' | 'late' | 'no-data' | 'future' | 'weekend';
}

interface MonthlyStats {
  totalSchoolDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendanceRate: number;
}

const STATUS_CONFIG = {
  present: {
    className: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
    darkClassName:
      'dark:bg-green-950/50 dark:border-green-800 dark:text-green-300',
    icon: CheckCircle2,
    label: 'Present',
    badgeVariant: 'present' as const,
  },
  absent: {
    className: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
    darkClassName: 'dark:bg-red-950/50 dark:border-red-800 dark:text-red-300',
    icon: XCircle,
    label: 'Absent',
    badgeVariant: 'absent' as const,
  },
  late: {
    className:
      'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100',
    darkClassName:
      'dark:bg-yellow-950/50 dark:border-yellow-800 dark:text-yellow-300',
    icon: Clock,
    label: 'Late',
    badgeVariant: 'late' as const,
  },
  'no-data': {
    className: 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100',
    darkClassName:
      'dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-400',
    icon: Calendar,
    label: 'No Data',
    badgeVariant: 'outline' as const,
  },
  future: {
    className: 'bg-gray-50 border-gray-200 text-gray-400',
    darkClassName:
      'dark:bg-gray-900/30 dark:border-gray-800 dark:text-gray-500',
    icon: Calendar,
    label: 'Future',
    badgeVariant: 'outline' as const,
  },
  weekend: {
    className: 'bg-blue-50 border-blue-200 text-blue-600',
    darkClassName:
      'dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-400',
    icon: Calendar,
    label: 'Weekend',
    badgeVariant: 'outline' as const,
  },
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
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
];

export function StudentAttendanceCalendar({
  attendanceRecords,
  onDateClick,
  onExportData,
  className,
}: AttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    setCurrentDate(new Date(selectedYear, selectedMonth, 1));
  }, [selectedYear, selectedMonth]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - getDay(monthStart));

    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - getDay(monthEnd)));

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map((date): CalendarDay => {
      const dayNumber = date.getDate();
      const isCurrentMonth = date.getMonth() === currentDate.getMonth();
      const todayCheck = isToday(date);
      const futureCheck = isFuture(date);
      const isWeekend = getDay(date) === 0 || getDay(date) === 6;

      const attendance = attendanceRecords.find((record) =>
        isSameDay(new Date(record.date), date)
      );

      let status: CalendarDay['status'];

      if (!isCurrentMonth) {
        status = 'no-data';
      } else if (futureCheck) {
        status = 'future';
      } else if (isWeekend && !attendance) {
        status = 'weekend';
      } else if (!attendance) {
        status = 'no-data';
      } else if (attendance.status === 'LATE') {
        status = 'late';
      } else if (attendance.present) {
        status = 'present';
      } else {
        status = 'absent';
      }

      return {
        date,
        dayNumber,
        isCurrentMonth,
        isToday: todayCheck,
        isFuture: futureCheck,
        attendance,
        status,
      };
    });
  }, [currentDate, attendanceRecords]);

  const monthlyStats = useMemo((): MonthlyStats => {
    const currentMonthRecords = attendanceRecords.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === selectedMonth &&
        recordDate.getFullYear() === selectedYear
      );
    });

    const totalSchoolDays = currentMonthRecords.length;
    const presentDays = currentMonthRecords.filter((r) => r.present).length;
    const absentDays = currentMonthRecords.filter(
      (r) => !r.present && r.status !== 'LATE'
    ).length;
    const lateDays = currentMonthRecords.filter(
      (r) => r.status === 'LATE'
    ).length;

    const attendanceRate =
      totalSchoolDays > 0
        ? Math.round((presentDays / totalSchoolDays) * 100)
        : 0;

    return {
      totalSchoolDays,
      presentDays,
      absentDays,
      lateDays,
      attendanceRate,
    };
  }, [attendanceRecords, selectedMonth, selectedYear]);

  const filteredCalendarDays = useMemo(() => {
    if (filterStatus === 'all') return calendarDays;
    return calendarDays.map((day) => ({
      ...day,
      isHighlighted: day.status === filterStatus,
    }));
  }, [calendarDays, filterStatus]);

  const navigateMonth = useCallback(
    (direction: 'prev' | 'next') => {
      if (direction === 'prev') {
        if (selectedMonth === 0) {
          setSelectedMonth(11);
          setSelectedYear((prev) => prev - 1);
        } else {
          setSelectedMonth((prev) => prev - 1);
        }
      } else {
        if (selectedMonth === 11) {
          setSelectedMonth(0);
          setSelectedYear((prev) => prev + 1);
        } else {
          setSelectedMonth((prev) => prev + 1);
        }
      }
    },
    [selectedMonth]
  );

  const resetToCurrentMonth = useCallback(() => {
    const now = new Date();
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth());
  }, []);

  const handleDateClick = useCallback(
    (day: CalendarDay) => {
      if (onDateClick && day.isCurrentMonth) {
        onDateClick(day.date, day.attendance);
      }
    },
    [onDateClick]
  );

  const getStatusConfig = (status: CalendarDay['status']) =>
    STATUS_CONFIG[status];

  return (
    <Card className={cn('w-full mx-auto', className)}>
      <CardContent>
        {/* Header */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Attendance Calendar
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Track your daily attendance and performance
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-28 h-8 text-xs">
                  <Filter className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                </SelectContent>
              </Select>

              {onExportData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExportData}
                  className="h-8 text-xs bg-transparent"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 transition-all duration-300">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-medium">
                    Present
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {monthlyStats.presentDays}
                  </p>
                </div>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-medium">
                    Absent
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
                    {monthlyStats.absentDays}
                  </p>
                </div>
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-medium">
                    Late
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {monthlyStats.lateDays}
                  </p>
                </div>
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-medium">
                    Rate
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {monthlyStats.attendanceRate}%
                  </p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <Card className="">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2">
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(value) =>
                    setSelectedMonth(Number.parseInt(value))
                  }
                >
                  <SelectTrigger className="w-32 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((month, index) => (
                      <SelectItem key={month} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) =>
                    setSelectedYear(Number.parseInt(value))
                  }
                >
                  <SelectTrigger className="w-20 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: 10 },
                      (_, i) => new Date().getFullYear() - 5 + i
                    ).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetToCurrentMonth}
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="p-3 pb-4 text-center text-xs font-medium  uppercase tracking-wide  "
                >
                  {day}
                </div>
              ))}
            </div>
            {/* <Separator className="h-[2px] w-full rounded-lg " /> */}

            <div className="grid grid-cols-7 my-3 space-x-2 space-y-2">
              {filteredCalendarDays.map((day, index) => {
                const config = getStatusConfig(day.status);
                const IconComponent = config.icon;

                return (
                  <HoverCard key={index} openDelay={200}>
                    <HoverCardTrigger asChild>
                      <div
                        className={cn(
                          'relative h-16 rounded-sm shadow-sm cursor-pointer transition-colors',
                          config.className,
                          config.darkClassName,
                          day.isCurrentMonth ? 'opacity-100' : 'opacity-40',
                          day.isToday && 'ring-2 ring-blue-500 ring-inset',
                          filterStatus !== 'all' &&
                            day.status !== filterStatus &&
                            'opacity-30'
                        )}
                        onClick={() => handleDateClick(day)}
                      >
                        <div className="p-2 h-full flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span
                              className={cn(
                                'text-sm font-medium ',
                                day.isToday && 'font-semibold'
                              )}
                            >
                              {day.dayNumber}
                            </span>
                            {day.attendance && (
                              <IconComponent className="h-3 w-3 opacity-60" />
                            )}
                          </div>

                          {day.isToday && (
                            <div className="flex justify-center">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            </div>
                          )}
                        </div>
                      </div>
                    </HoverCardTrigger>

                    <HoverCardContent className="w-72 p-4" side="top">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">
                            {format(day.date, 'EEEE, MMMM d, yyyy')}
                          </h4>
                          <Badge
                            variant={config.badgeVariant}
                            className="text-xs"
                          >
                            <IconComponent className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                        </div>

                        {day.attendance ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-xs">
                                  Status
                                </span>
                                <p className="font-medium">
                                  {day.attendance.status}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-xs">
                                  Present
                                </span>
                                <p className="font-medium">
                                  {day.attendance.present ? 'Yes' : 'No'}
                                </p>
                              </div>
                            </div>

                            {day.attendance.note && (
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-xs">
                                  Note
                                </span>
                                <p className="text-sm mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300">
                                  {day.attendance.note}
                                </p>
                              </div>
                            )}

                            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 pt-2 border-t border-gray-200 dark:border-gray-700">
                              <p>Recorded by: {day.attendance.recordedBy}</p>
                              <p>
                                Updated:{' '}
                                {format(
                                  new Date(day.attendance.updatedAt),
                                  "MMM d, yyyy 'at' h:mm a"
                                )}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {day.isFuture
                              ? 'Future date - attendance not recorded yet'
                              : day.status === 'weekend'
                                ? 'Weekend - no school'
                                : 'No attendance data available'}
                          </div>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 pt-4 border-t border-gray-200  flex-wrap">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => {
            const IconComponent = config.icon;
            return (
              <Badge
                key={status}
                variant={config.badgeVariant}
                className="text-xs"
              >
                <IconComponent className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
