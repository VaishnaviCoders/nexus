'use client';

import { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  CalendarDays,
  BookOpen,
  DollarSign,
  UserCheck,
  Bell,
  Filter,
} from 'lucide-react';
import { format, isSameDay, eachDayOfInterval } from 'date-fns';

// Types based on your Prisma schema
type CalendarEventType = 'PLANNED' | 'SUDDEN' | 'INSTITUTION_SPECIFIC';
type FeeStatus = 'PAID' | 'UNPAID' | 'OVERDUE';
type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

interface AcademicEvent {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  type: CalendarEventType;
  reason?: string;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  startDate: Date;
  endDate: Date;
  noticeType: string;
  isPublished: boolean;
}

interface FeeEvent {
  id: string;
  totalFee: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: Date;
  status: FeeStatus;
  categoryName: string;
}

interface AttendanceEvent {
  id: string;
  date: Date;
  status: AttendanceStatus;
  present: boolean;
  note?: string;
}

interface CalendarEvent {
  id: string;
  date: Date;
  type: 'holiday' | 'notice' | 'fee' | 'attendance';
  title: string;
  data: AcademicEvent | Notice | FeeEvent | AttendanceEvent;
}

// Mock data based on your schema
const mockAcademicEvents: AcademicEvent[] = [
  {
    id: '1',
    name: 'Diwali Break',
    startDate: new Date(2024, 10, 12),
    endDate: new Date(2024, 10, 16),
    type: 'PLANNED',
    reason: 'Festival',
  },
  {
    id: '2',
    name: 'Winter Break',
    startDate: new Date(2024, 11, 25),
    endDate: new Date(2025, 0, 5),
    type: 'PLANNED',
    reason: 'Winter Vacation',
  },
  {
    id: '3',
    name: 'Sports Day',
    startDate: new Date(2024, 11, 15),
    endDate: new Date(2024, 11, 15),
    type: 'INSTITUTION_SPECIFIC',
    reason: 'Annual Sports Event',
  },
];

const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Parent-Teacher Meeting',
    content: 'Monthly parent-teacher meeting scheduled for all grades.',
    startDate: new Date(2024, 11, 8),
    endDate: new Date(2024, 11, 8),
    noticeType: 'MEETING',
    isPublished: true,
  },
  {
    id: '2',
    title: 'Science Exhibition',
    content: 'Annual science exhibition. All students must participate.',
    startDate: new Date(2024, 11, 20),
    endDate: new Date(2024, 11, 22),
    noticeType: 'EVENT',
    isPublished: true,
  },
];

const mockFees: FeeEvent[] = [
  {
    id: '1',
    totalFee: 5000,
    paidAmount: 0,
    pendingAmount: 5000,
    dueDate: new Date(2024, 11, 10),
    status: 'UNPAID',
    categoryName: 'Tuition Fee',
  },
  {
    id: '2',
    totalFee: 1500,
    paidAmount: 1500,
    pendingAmount: 0,
    dueDate: new Date(2024, 10, 15),
    status: 'PAID',
    categoryName: 'Lab Fee',
  },
];

const mockAttendance: AttendanceEvent[] = [
  {
    id: '1',
    date: new Date(2025, 3, 2),
    status: 'PRESENT',
    present: true,
  },
  {
    id: '2',
    date: new Date(2024, 11, 3),
    status: 'ABSENT',
    present: false,
    note: 'Sick leave',
  },
  {
    id: '3',
    date: new Date(2024, 11, 4),
    status: 'LATE',
    present: true,
    note: 'Arrived 15 minutes late',
  },
];

export default function StudentCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [filters, setFilters] = useState({
    holidays: true,
    notices: true,
    fees: true,
    attendance: true,
  });
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );

  // Combine all events into a single array
  const allEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    // Add academic events (holidays)
    if (filters.holidays) {
      mockAcademicEvents.forEach((event) => {
        const days = eachDayOfInterval({
          start: event.startDate,
          end: event.endDate,
        });
        days.forEach((day) => {
          events.push({
            id: `holiday-${event.id}-${day.getTime()}`,
            date: day,
            type: 'holiday',
            title: event.name,
            data: event,
          });
        });
      });
    }

    // Add notices
    if (filters.notices) {
      mockNotices.forEach((notice) => {
        const days = eachDayOfInterval({
          start: notice.startDate,
          end: notice.endDate,
        });
        days.forEach((day) => {
          events.push({
            id: `notice-${notice.id}-${day.getTime()}`,
            date: day,
            type: 'notice',
            title: notice.title,
            data: notice,
          });
        });
      });
    }

    // Add fees
    if (filters.fees) {
      mockFees.forEach((fee) => {
        events.push({
          id: `fee-${fee.id}`,
          date: fee.dueDate,
          type: 'fee',
          title: `${fee.categoryName} Due`,
          data: fee,
        });
      });
    }

    // Add attendance
    if (filters.attendance) {
      mockAttendance.forEach((attendance) => {
        events.push({
          id: `attendance-${attendance.id}`,
          date: attendance.date,
          type: 'attendance',
          title: `Attendance: ${attendance.status}`,
          data: attendance,
        });
      });
    }

    return events;
  }, [filters]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return allEvents.filter((event) => isSameDay(event.date, selectedDate));
  }, [allEvents, selectedDate]);

  // Custom day renderer for calendar
  const renderDay = (day: Date) => {
    const dayEvents = allEvents.filter((event) => isSameDay(event.date, day));
    const hasEvents = dayEvents.length > 0;

    if (!hasEvents) return null;

    const eventTypes = [...new Set(dayEvents.map((e) => e.type))];

    return (
      <div className="relative w-full h-full">
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5">
          {eventTypes.map((type) => (
            <div
              key={type}
              className={`w-1.5 h-1.5 rounded-full ${
                type === 'holiday'
                  ? 'bg-green-500'
                  : type === 'notice'
                    ? 'bg-blue-500'
                    : type === 'fee'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'holiday':
        return <CalendarDays className="h-4 w-4" />;
      case 'notice':
        return <Bell className="h-4 w-4" />;
      case 'fee':
        return <DollarSign className="h-4 w-4" />;
      case 'attendance':
        return <UserCheck className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'holiday':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'notice':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fee':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'attendance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Student Calendar</h1>
        <p className="text-muted-foreground">
          View your holidays, notices, fee due dates, and attendance records
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>
                    {selectedDate
                      ? format(selectedDate, 'MMMM yyyy')
                      : 'Select a date'}
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Calendar Filters</DialogTitle>
                      <DialogDescription>
                        Choose which events to display on the calendar
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {Object.entries(filters).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Switch
                            id={key}
                            checked={value}
                            onCheckedChange={(checked) =>
                              setFilters((prev) => ({
                                ...prev,
                                [key]: checked,
                              }))
                            }
                          />
                          <Label htmlFor={key} className="capitalize">
                            {key}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                // components={{
                //   Day: ({ date, ...props }) => (
                //     <div className="relative">
                //       <button {...props} className="relative w-full h-full">
                //         {date.getDate()}
                //         {renderDay(date)}
                //       </button>
                //     </div>
                //   ),
                // }}
              />
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Holidays</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Notices</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Fee Due</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Attendance</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate
                  ? format(selectedDate, 'MMM dd, yyyy')
                  : 'Select a date'}
              </CardTitle>
              <CardDescription>
                {selectedDateEvents.length} event
                {selectedDateEvents.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No events for this date
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <Dialog key={event.id}>
                      <DialogTrigger asChild>
                        <div
                          className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow ${getEventColor(event.type)}`}
                        >
                          <div className="flex items-start gap-2">
                            {getEventIcon(event.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {event.title}
                              </p>
                              <Badge
                                variant="secondary"
                                className="text-xs mt-1"
                              >
                                {event.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {getEventIcon(event.type)}
                            {event.title}
                          </DialogTitle>
                        </DialogHeader>
                        <EventDetails event={event} />
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending Fees</span>
                  <Badge variant="destructive">
                    ₹
                    {mockFees
                      .filter((f) => f.status === 'UNPAID')
                      .reduce((sum, f) => sum + f.pendingAmount, 0)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">This Month Attendance</span>
                  <Badge variant="secondary">
                    {Math.round(
                      (mockAttendance.filter((a) => a.present).length /
                        mockAttendance.length) *
                        100
                    )}
                    %
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Upcoming Holidays</span>
                  <Badge variant="secondary">
                    {
                      mockAcademicEvents.filter((e) => e.startDate > new Date())
                        .length
                    }
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EventDetails({ event }: { event: CalendarEvent }) {
  const { data, type } = event;

  if (type === 'holiday') {
    const holiday = data as AcademicEvent;
    return (
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium">Duration</Label>
          <p className="text-sm text-muted-foreground">
            {format(holiday.startDate, 'MMM dd')} -{' '}
            {format(holiday.endDate, 'MMM dd, yyyy')}
          </p>
        </div>
        <div>
          <Label className="text-sm font-medium">Type</Label>
          <p className="text-sm text-muted-foreground capitalize">
            {holiday.type.toLowerCase().replace('_', ' ')}
          </p>
        </div>
        {holiday.reason && (
          <div>
            <Label className="text-sm font-medium">Reason</Label>
            <p className="text-sm text-muted-foreground">{holiday.reason}</p>
          </div>
        )}
      </div>
    );
  }

  if (type === 'notice') {
    const notice = data as Notice;
    return (
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium">Content</Label>
          <p className="text-sm text-muted-foreground">{notice.content}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Type</Label>
          <p className="text-sm text-muted-foreground">{notice.noticeType}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Duration</Label>
          <p className="text-sm text-muted-foreground">
            {format(notice.startDate, 'MMM dd')} -{' '}
            {format(notice.endDate, 'MMM dd, yyyy')}
          </p>
        </div>
      </div>
    );
  }

  if (type === 'fee') {
    const fee = data as FeeEvent;
    return (
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium">Category</Label>
          <p className="text-sm text-muted-foreground">{fee.categoryName}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Total Amount</Label>
          <p className="text-sm text-muted-foreground">₹{fee.totalFee}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Paid Amount</Label>
          <p className="text-sm text-muted-foreground">₹{fee.paidAmount}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Pending Amount</Label>
          <p className="text-sm text-muted-foreground">₹{fee.pendingAmount}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Status</Label>
          <Badge
            variant={
              fee.status === 'PAID'
                ? 'default'
                : fee.status === 'OVERDUE'
                  ? 'destructive'
                  : 'secondary'
            }
          >
            {fee.status}
          </Badge>
        </div>
      </div>
    );
  }

  if (type === 'attendance') {
    const attendance = data as AttendanceEvent;
    return (
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium">Status</Label>
          <Badge variant={attendance.present ? 'default' : 'destructive'}>
            {attendance.status}
          </Badge>
        </div>
        <div>
          <Label className="text-sm font-medium">Present</Label>
          <p className="text-sm text-muted-foreground">
            {attendance.present ? 'Yes' : 'No'}
          </p>
        </div>
        {attendance.note && (
          <div>
            <Label className="text-sm font-medium">Note</Label>
            <p className="text-sm text-muted-foreground">{attendance.note}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
