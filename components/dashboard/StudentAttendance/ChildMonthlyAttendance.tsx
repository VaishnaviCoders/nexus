'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

import { Progress } from '@/components/ui/progress';

interface MonthlyStats {
  month: string;
  year: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  percentage: number;
}

interface ChildMonthlyAttendanceProps {
  childId: string;
  monthlyData: MonthlyStats[];
}

export function ChildMonthlyAttendance({
  monthlyData,
}: ChildMonthlyAttendanceProps) {
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );

  // Filter data for current year
  const yearData = monthlyData.filter((data) => data.year === currentYear);

  // Calculate year average
  const yearAverage =
    yearData.length > 0
      ? Math.round(
          yearData.reduce((sum, month) => sum + month.percentage, 0) /
            yearData.length
        )
      : 0;

  // Get trend (comparing current month with previous month)
  const currentMonth = new Date().getMonth();
  const currentMonthData = yearData.find(
    (data) =>
      new Date(`${data.month} 1, ${data.year}`).getMonth() === currentMonth
  );
  const previousMonthData = yearData.find(
    (data) =>
      new Date(`${data.month} 1, ${data.year}`).getMonth() === currentMonth - 1
  );

  const trend =
    currentMonthData && previousMonthData
      ? currentMonthData.percentage - previousMonthData.percentage
      : 0;

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentYear(direction === 'prev' ? currentYear - 1 : currentYear + 1);
  };

  return (
    <div className="space-y-6">
      {/* Year Navigation and Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Monthly Attendance Overview
              </CardTitle>
              <CardDescription>
                Attendance summary for {currentYear}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateYear('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold min-w-[4rem] text-center">
                {currentYear}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateYear('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{yearAverage}%</div>
              <div className="text-sm text-muted-foreground">Year Average</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                {trend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : trend < 0 ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : null}
                <span className="text-2xl font-bold">
                  {trend > 0 ? '+' : ''}
                  {trend.toFixed(1)}%
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Monthly Trend</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{yearData.length}</div>
              <div className="text-sm text-muted-foreground">
                Months Tracked
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {yearData.map((monthData, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{monthData.month}</CardTitle>
              <CardDescription>
                {/* {monthData.totalDays} school days */}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Attendance Rate</span>
                    <span className="font-medium">{monthData.percentage}%</span>
                  </div>
                  <Progress value={monthData.percentage} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <div className="font-semibold text-green-600">
                      {monthData.presentDays}
                    </div>
                    <div className="text-muted-foreground">Present</div>
                  </div>
                  <div>
                    <div className="font-semibold text-red-600">
                      {monthData.absentDays}
                    </div>
                    <div className="text-muted-foreground">Absent</div>
                  </div>
                  <div>
                    <div className="font-semibold text-amber-600">
                      {monthData.lateDays}
                    </div>
                    <div className="text-muted-foreground">Late</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {yearData.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No data available</h3>
            <p className="text-muted-foreground">
              No attendance data found for {currentYear}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
