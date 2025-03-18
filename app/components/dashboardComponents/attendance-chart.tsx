"use client"

import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for monthly attendance
const monthlyData = [
  { month: "Jan", present: 94.2, absent: 5.8 },
  { month: "Feb", present: 95.8, absent: 4.2 },
  { month: "Mar", present: 93.1, absent: 6.9 },
  { month: "Apr", present: 97.3, absent: 2.7 },
  { month: "May", present: 96.5, absent: 3.5 },
  { month: "Jun", present: 98.2, absent: 1.8 },
  { month: "Jul", present: 91.7, absent: 8.3 },
  { month: "Aug", present: 92.3, absent: 7.7 },
  { month: "Sep", present: 93.9, absent: 6.1 },
  { month: "Oct", present: 94.5, absent: 5.5 },
  { month: "Nov", present: 95.1, absent: 4.9 },
  { month: "Dec", present: 96.8, absent: 3.2 },
]

// Mock data for yearly attendance
const yearlyData = [
  { year: "2020", present: 91.5, absent: 8.5 },
  { year: "2021", present: 92.8, absent: 7.2 },
  { year: "2022", present: 93.4, absent: 6.6 },
  { year: "2023", present: 94.7, absent: 5.3 },
  { year: "2024", present: 95.2, absent: 4.8 },
  { year: "2025", present: 92.7, absent: 7.3 },
]

export function AttendanceChart({ isYearly = false }: { isYearly?: boolean }) {
  const data = isYearly ? yearlyData : monthlyData
  const xKey = isYearly ? "year" : "month"

  return (
    <ChartContainer
      config={{
        present: {
          label: "Present %",
          color: "hsl(var(--chart-1))",
        },
        absent: {
          label: "Absent %",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            domain={[80, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="present"
            stroke="var(--color-present)"
            strokeWidth={2}
            dot={{ fill: "var(--color-present)" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="absent"
            stroke="var(--color-absent)"
            strokeWidth={2}
            dot={{ fill: "var(--color-absent)" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

