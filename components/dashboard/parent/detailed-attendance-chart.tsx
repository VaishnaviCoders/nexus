'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from 'recharts';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import {
  getChildrenAttendanceOverview,
  getDetailedAttendanceForChild,
} from '@/lib/data/parent/attendance-monitor/getParent-attendance';

interface DetailedAttendanceChartProps {
  defaultStudentId?: string;
}

export function DetailedAttendanceChart({
  defaultStudentId,
}: DetailedAttendanceChartProps) {
  const [selectedStudent, setSelectedStudent] = useState(
    defaultStudentId || ''
  );
  const [children, setChildren] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'monthly' | 'weekly' | 'daily'>(
    'monthly'
  );

  useEffect(() => {
    async function loadChildren() {
      try {
        const childrenData = await getChildrenAttendanceOverview();
        setChildren(childrenData);
        if (!selectedStudent && childrenData.length > 0) {
          setSelectedStudent(childrenData[0].id);
        }
      } catch (error) {
        console.error('Failed to load children:', error);
      }
    }
    loadChildren();
  }, [selectedStudent]);

  useEffect(() => {
    async function loadAttendanceData() {
      if (!selectedStudent) return;

      setLoading(true);
      try {
        const data = await getDetailedAttendanceForChild(selectedStudent, 6);
        setAttendanceData(data);
      } catch (error) {
        console.error('Failed to load attendance data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAttendanceData();
  }, [selectedStudent]);

  const chartConfig = {
    percentage: {
      label: 'Attendance %',
      color: 'hsl(var(--primary))',
    },
    present: {
      label: 'Present',
      color: 'hsl(var(--primary))',
    },
    absent: {
      label: 'Absent',
      color: 'hsl(var(--destructive))',
    },
  };

  if (loading) {
    return (
      <Card className="border-0 ">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (!attendanceData) {
    return (
      <Card className="border-0 ">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">No attendance data available</p>
        </CardContent>
      </Card>
    );
  }

  const getChartData = () => {
    switch (chartType) {
      case 'monthly':
        return attendanceData.monthlyData;
      case 'weekly':
        return attendanceData.weeklyData.slice(-12); // Last 12 weeks
      case 'daily':
        return attendanceData.dayPatternData;
      default:
        return attendanceData.monthlyData;
    }
  };

  const getChartTitle = () => {
    switch (chartType) {
      case 'monthly':
        return 'Monthly Attendance Trend';
      case 'weekly':
        return 'Weekly Attendance Pattern';
      case 'daily':
        return 'Day-wise Attendance Pattern';
      default:
        return 'Attendance Trend';
    }
  };

  return (
    <Card className="border-0 ">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {getChartTitle()}
            </CardTitle>
            <CardDescription>
              Detailed attendance analysis for{' '}
              {attendanceData.student?.firstName}{' '}
              {attendanceData.student?.lastName}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={chartType}
              onValueChange={(value: any) => setChartType(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg bg-background/50">
            <div className="text-2xl font-bold text-primary">
              {attendanceData.overallStats.percentage}%
            </div>
            <div className="text-xs text-muted-foreground">Overall</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
            <div className="text-2xl font-bold text-green-600">
              {attendanceData.overallStats.presentDays}
            </div>
            <div className="text-xs text-muted-foreground">Present</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
            <div className="text-2xl font-bold text-red-600">
              {attendanceData.overallStats.absentDays}
            </div>
            <div className="text-xs text-muted-foreground">Absent</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
            <div className="text-2xl font-bold text-yellow-600">
              {attendanceData.overallStats.lateDays}
            </div>
            <div className="text-xs text-muted-foreground">Late</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'daily' ? (
              <BarChart data={getChartData()}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="percentage"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : (
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient
                    id="attendanceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey={chartType === 'monthly' ? 'month' : 'week'}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#attendanceGradient)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>

        {/* Performance Indicators */}
        <div className="flex flex-wrap gap-2 mt-6">
          {attendanceData.overallStats.percentage >= 95 && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <TrendingUp className="w-3 h-3 mr-1" />
              Excellent Attendance
            </Badge>
          )}
          {attendanceData.overallStats.percentage >= 90 &&
            attendanceData.overallStats.percentage < 95 && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Very Good
              </Badge>
            )}
          {attendanceData.overallStats.percentage >= 75 &&
            attendanceData.overallStats.percentage < 90 && (
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Good
              </Badge>
            )}
          {attendanceData.overallStats.percentage < 75 && (
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              <TrendingDown className="w-3 h-3 mr-1" />
              Needs Improvement
            </Badge>
          )}
          {attendanceData.overallStats.lateDays > 5 && (
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              Frequent Late Arrivals
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
