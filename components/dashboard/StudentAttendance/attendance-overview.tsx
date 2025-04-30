'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const data = [
  { date: '01', attendance: 94.2 },
  { date: '02', attendance: 95.8 },
  { date: '03', attendance: 93.1 },
  { date: '04', attendance: 97.3 },
  { date: '05', attendance: 96.5 },
  { date: '06', attendance: 98.2 },
  { date: '07', attendance: 91.7 },
  { date: '08', attendance: 92.3 },
  { date: '09', attendance: 93.9 },
  { date: '10', attendance: 94.5 },
  { date: '11', attendance: 95.1 },
  { date: '12', attendance: 96.8 },
  { date: '13', attendance: 97.4 },
  { date: '14', attendance: 93.2 },
  { date: '15', attendance: 94.7 },
  { date: '16', attendance: 95.3 },
  { date: '17', attendance: 96.9 },
  { date: '18', attendance: 97.5 },
  { date: '19', attendance: 98.1 },
  { date: '20', attendance: 92.6 },
  { date: '21', attendance: 93.3 },
  { date: '22', attendance: 94.8 },
  { date: '23', attendance: 95.4 },
  { date: '24', attendance: 96.0 },
  { date: '25', attendance: 97.6 },
  { date: '26', attendance: 98.3 },
  { date: '27', attendance: 92.9 },
  { date: '28', attendance: 94.4 },
  { date: '29', attendance: 95.0 },
  { date: '30', attendance: 96.6 },
];

export function AttendanceOverview() {
  return (
    <ChartContainer
      config={{
        attendance: {
          label: 'Attendance %',
          color: 'hsl(var(--chart-1))',
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => `${value}`}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            domain={[80, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          <Bar
            dataKey="attendance"
            fill="var(--color-attendance)"
            radius={[4, 4, 0, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
