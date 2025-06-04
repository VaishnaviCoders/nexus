'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO, isSameDay } from 'date-fns';

interface AttendanceRecord {
  id: string;
  date: Date;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  note: string | null;
}

interface ChildAttendanceCalendarProps {
  records: AttendanceRecord[];
}

export function ChildAttendanceCalendar({
  records,
}: ChildAttendanceCalendarProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());

  // Function to get status for a specific date
  const getDateStatus = (day: Date) => {
    const record = records.find((r) =>
      isSameDay(parseISO(r.date.toISOString()), day)
    );
    return record ? record.status : null;
  };

  // Custom day rendering with attendance status
  const renderDay = (day: Date) => {
    const status = getDateStatus(day);

    let statusClass = '';
    if (status === 'PRESENT')
      statusClass =
        'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
    else if (status === 'ABSENT')
      statusClass =
        'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
    else if (status === 'LATE')
      statusClass =
        'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400';

    return (
      <div
        className={`w-full h-full flex items-center justify-center rounded-full ${statusClass}`}
      >
        {day.getDate()}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const newMonth = new Date(month);
            newMonth.setMonth(newMonth.getMonth() - 1);
            setMonth(newMonth);
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-medium">{format(month, 'MMMM yyyy')}</h3>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const newMonth = new Date(month);
            newMonth.setMonth(newMonth.getMonth() + 1);
            setMonth(newMonth);
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-100 dark:bg-green-900/20"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-100 dark:bg-red-900/20"></div>
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-amber-100 dark:bg-amber-900/20"></div>
          <span>Late</span>
        </div>
      </div>
    </div>
  );
}
