import Link from 'next/link';
import { CalendarIcon, DownloadIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { AttendanceTable } from '@/app/components/dashboardComponents/attendance-table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function AttendancePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Attendance Records
            </h1>
            <p className="text-muted-foreground">
              View and manage student attendance records.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/attendance/export">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Export
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/student-attendance/mark">
                Mark Attendance
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Filters</CardTitle>
            <CardDescription>
              Filter attendance records by date, section, or student
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[205px] pl-3 text-left font-normal flex items-center gap-2'
                        // !field.value && 'text-muted-foreground'
                      )}
                    >
                      {/* {field.value ? (
                              new Intl.DateTimeFormat('en-IN', {
                                dateStyle: 'long',
                              }).format(field.value)
                            ) : (
                              <span>Pick a date</span>
                            )} */}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      // selected={field.value}
                      // onSelect={field.onChange}
                      disabled={(date) => date < new Date('2023-01-01')}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Section</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="all">All Sections</option>
                  <option value="section-a">Section A</option>
                  <option value="section-b">Section B</option>
                  <option value="section-c">Section C</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Student</label>
                <Input placeholder="Search by name or ID" />
              </div>
            </div>
          </CardContent>
        </Card>

        <AttendanceTable />
      </main>
    </div>
  );
}
