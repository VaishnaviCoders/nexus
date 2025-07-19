'use client';

import { useState } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

// Mock performance data
const performanceData = [
  { subject: 'Math', score: 45, classAvg: 72, grade: 'A' },
  { subject: 'Physics', score: 78, classAvg: 68, grade: 'B+' },
  { subject: 'Chemistry', score: 92, classAvg: 75, grade: 'A+' },
  { subject: 'Biology', score: 88, classAvg: 70, grade: 'A' },
  { subject: 'English', score: 82, classAvg: 76, grade: 'A-' },
  { subject: 'History', score: 100, classAvg: 73, grade: 'A+' },
];

const chartConfig = {
  score: {
    label: 'Your Score',
    color: 'hsl(var(--chart-1))',
  },
  classAvg: {
    label: 'Class Average',
    color: '#8b5cf6',
  },
};

export default function StudentSubjectsRadar() {
  const [showComparison, setShowComparison] = useState(false);

  const overallAvg = Math.round(
    performanceData.reduce((sum, item) => sum + item.score, 0) /
      performanceData.length
  );

  const classOverallAvg = Math.round(
    performanceData.reduce((sum, item) => sum + item.classAvg, 0) /
      performanceData.length
  );

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            Overall: {overallAvg}%
          </Badge>
          {showComparison && (
            <Badge variant="secondary" className="text-xs">
              Class: {classOverallAvg}%
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="comparison"
            checked={showComparison}
            onCheckedChange={setShowComparison}
          />
          <Label htmlFor="comparison" className="text-xs font-medium">
            Compare with class
          </Label>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="w-full ">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px] sm:max-h-[320px]"
        >
          <RadarChart
            data={performanceData}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <PolarGrid stroke="hsl(var(--border))" />
            <Radar
              dataKey="score"
              fill="var(--color-score)"
              fillOpacity={0.3}
              stroke="var(--color-score)"
              strokeWidth={1}
            />
            {showComparison && (
              <Radar
                dataKey="classAvg"
                fill="var(--color-classAvg)"
                fillOpacity={0.2}
                stroke="var(--color-classAvg)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            )}
          </RadarChart>
        </ChartContainer>
      </div>

      {/* Subject breakdown - compact grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {performanceData.map((subject, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-md bg-slate-50 dark:bg-slate-800/50"
          >
            <span className="font-medium truncate">{subject.subject}</span>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs px-1 py-0">
                {subject.grade}
              </Badge>
              <span className="font-semibold">{subject.score}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
