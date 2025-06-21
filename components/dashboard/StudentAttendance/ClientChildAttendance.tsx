'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChildSelector } from '../parent/child-selector';
import { AttendanceRecord, ParentData } from '@/types';
import { ChildAttendanceSummary } from './ChildAttendanceSummary';
import { ChildAttendanceCalendar } from '../parent/child-attendance-calendar';
import { ChildAttendanceTable } from './ChildAttendanceTable';
import { ChildMonthlyAttendance } from './ChildMonthlyAttendance';

type StudentData = ParentData['students'][number]['student'];

interface ParentDashboardProps {
  parentData: ParentData;
  attendanceStats: {
    percentage: number;
    present: number;
    absent: number;
    late: number;
    total: number;
  };
  records: AttendanceRecord[];
  monthlyData: Array<{
    month: string;
    year: number;
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    percentage: number;
  }>;
}

export function ClientChildAttendance({
  parentData,
  attendanceStats,
  records,
  monthlyData,
}: ParentDashboardProps) {
  const [selectedChild, setSelectedChild] = useState<StudentData>(
    parentData.students[0].student
  );

  return (
    <div className="space-y-6 px-4 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b">
        <h1 className="text-2xl font-bold tracking-tight">
          {selectedChild.firstName} {selectedChild.lastName}'s Attendance
        </h1>
        <div className="w-full sm:w-auto">
          <ChildSelector
            children={parentData.students.map((s) => s.student)}
            selectedChild={selectedChild}
            onSelectChild={setSelectedChild}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Summary Card - Fixed Height */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <ChildAttendanceSummary
              summary={attendanceStats}
              childId={selectedChild.id}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="list">Records</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>

            <TabsContent value="calendar">
              <Card className="p-6 shadow-sm">
                <ChildAttendanceCalendar records={records} />
              </Card>
            </TabsContent>

            <TabsContent value="list">
              <Card className="shadow-sm">
                <ChildAttendanceTable
                  childId={selectedChild.id}
                  records={records}
                />
              </Card>
            </TabsContent>

            <TabsContent value="monthly">
              <ChildMonthlyAttendance
                childId={selectedChild.id}
                monthlyData={monthlyData}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
