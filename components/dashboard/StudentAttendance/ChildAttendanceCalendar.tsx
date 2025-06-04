'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AttendanceRecord {
  id: string;
  date: Date;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  note?: string | null;
  present: boolean;
}

interface ChildAttendanceCalendarProps {
  childId: string;
  records: AttendanceRecord[];
}

export function ChildAttendanceCalendar({
  childId,
  records,
}: ChildAttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the first day of the current month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Get the first day of the week for the calendar grid
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  // Get the last day of the week for the calendar grid
  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

  // Generate calendar days
  const calendarDays = [];
  const currentDateIterator = new Date(startDate);

  while (currentDateIterator <= endDate) {
    calendarDays.push(new Date(currentDateIterator));
    currentDateIterator.setDate(currentDateIterator.getDate() + 1);
  }

  // Create a map of attendance records by date for quick lookup
  const attendanceMap = new Map();
  records.forEach((record) => {
    const dateKey = new Date(record.date).toDateString();
    attendanceMap.set(dateKey, record);
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getAttendanceStatus = (date: Date) => {
    const dateKey = date.toDateString();
    return attendanceMap.get(dateKey);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ABSENT':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  const monthNames = [
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

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate attendance statistics for the current month
  const currentMonthRecords = records.filter((record) => {
    const recordDate = new Date(record.date);
    return (
      recordDate.getMonth() === currentDate.getMonth() &&
      recordDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const presentDays = currentMonthRecords.filter(
    (r) => r.status === 'PRESENT'
  ).length;
  const absentDays = currentMonthRecords.filter(
    (r) => r.status === 'ABSENT'
  ).length;
  const lateDays = currentMonthRecords.filter(
    (r) => r.status === 'LATE'
  ).length;
  const totalDays = currentMonthRecords.length;

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          {totalDays > 0 && (
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <span>Present: {presentDays}</span>
              <span>Absent: {absentDays}</span>
              <span>Late: {lateDays}</span>
              <span>Total: {totalDays}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500"></div>
          <span>Late</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-300"></div>
          <span>No Record</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const attendance = getAttendanceStatus(date);
              const isCurrentMonthDay = isCurrentMonth(date);
              const isTodayDate = isToday(date);
              const isWeekendDay = isWeekend(date);

              return (
                <div
                  key={index}
                  className={cn(
                    'min-h-[60px] p-2 border rounded-lg transition-colors relative',
                    isCurrentMonthDay ? 'bg-background' : 'bg-muted/30',
                    isTodayDate && 'ring-2 ring-primary ring-offset-1',
                    isWeekendDay && isCurrentMonthDay && 'bg-muted/50',
                    'hover:bg-muted/50'
                  )}
                >
                  <div className="flex flex-col h-full">
                    <span
                      className={cn(
                        'text-sm font-medium',
                        !isCurrentMonthDay && 'text-muted-foreground',
                        isTodayDate && 'text-primary font-bold'
                      )}
                    >
                      {date.getDate()}
                    </span>

                    {attendance && isCurrentMonthDay && (
                      <div className="mt-1 flex-1 flex items-center justify-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs px-1 py-0.5 h-auto',
                            getStatusColor(attendance.status)
                          )}
                        >
                          {attendance.status === 'PRESENT' && 'P'}
                          {attendance.status === 'ABSENT' && 'A'}
                          {attendance.status === 'LATE' && 'L'}
                        </Badge>
                      </div>
                    )}

                    {attendance?.note && (
                      <div className="absolute top-1 right-1">
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full"
                          title={attendance.note}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      {totalDays > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {presentDays}
                </div>
                <div className="text-sm text-muted-foreground">
                  Present Days
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {absentDays}
                </div>
                <div className="text-sm text-muted-foreground">Absent Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {lateDays}
                </div>
                <div className="text-sm text-muted-foreground">Late Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {totalDays > 0
                    ? Math.round((presentDays / totalDays) * 100)
                    : 0}
                  %
                </div>
                <div className="text-sm text-muted-foreground">
                  Attendance Rate
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
