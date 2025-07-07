'use client';

import { useState } from 'react';
import { TrendingUp, Users, User, BookOpen, Award } from 'lucide-react';
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
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
import { Button } from '@/components/ui/button';

// Mock data structure that matches your future schema
const mockSubjects = [
  { id: '1', name: 'Mathematics', code: 'MATH101', maxMarks: 100 },
  { id: '2', name: 'Physics', code: 'PHY101', maxMarks: 100 },
  { id: '3', name: 'Chemistry', code: 'CHEM101', maxMarks: 100 },
  { id: '4', name: 'Biology', code: 'BIO101', maxMarks: 100 },
  { id: '5', name: 'English', code: 'ENG101', maxMarks: 100 },
  { id: '6', name: 'Computer Science', code: 'CS101', maxMarks: 100 },
  { id: '7', name: 'Computer Science', code: 'CS101', maxMarks: 100 },
];

const mockStudents = [
  {
    id: '1',
    name: 'Alice Johnson',
    rollNumber: '2024001',
    grade: 'Grade 10',
    section: 'A',
    performance: [
      { subject: 'Mathematics', score: 52, maxScore: 100 },
      { subject: 'Physics', score: 78, maxScore: 100 },
      { subject: 'Chemistry', score: 75, maxScore: 100 },
      { subject: 'Biology', score: 80, maxScore: 100 },
      { subject: 'English', score: 64, maxScore: 100 },
      { subject: 'Computer Science', score: 96, maxScore: 100 },
    ],
  },
  {
    id: '2',
    name: 'Bob Smith',
    rollNumber: '2024002',
    grade: 'Grade 10',
    section: 'A',
    performance: [
      { subject: 'Mathematics', score: 78, maxScore: 100 },
      { subject: 'Physics', score: 82, maxScore: 100 },
      { subject: 'Chemistry', score: 75, maxScore: 100 },
      { subject: 'Biology', score: 80, maxScore: 100 },
      { subject: 'English', score: 88, maxScore: 100 },
      { subject: 'Computer Science', score: 85, maxScore: 100 },
    ],
  },
  {
    id: '3',
    name: 'Carol Davis',
    rollNumber: '2024003',
    grade: 'Grade 10',
    section: 'A',
    performance: [
      { subject: 'Mathematics', score: 95, maxScore: 100 },
      { subject: 'Physics', score: 91, maxScore: 100 },
      { subject: 'Chemistry', score: 89, maxScore: 100 },
      { subject: 'Biology', score: 87, maxScore: 100 },
      { subject: 'English', score: 92, maxScore: 100 },
      { subject: 'Computer Science', score: 98, maxScore: 100 },
    ],
  },
];

// Calculate class average
const classAverage = mockSubjects.map((subject) => {
  const totalScore = mockStudents.reduce((sum, student) => {
    const performance = student.performance.find(
      (p) => p.subject === subject.name
    );
    return sum + (performance?.score || 0);
  }, 0);
  return {
    subject: subject.name,
    score: Math.round(totalScore / mockStudents.length),
    maxScore: 100,
  };
});

type ViewMode = 'individual' | 'class-average' | 'comparison';
type TimePeriod = 'current' | 'monthly' | 'quarterly' | 'yearly';

const chartConfig = {
  score: {
    label: 'Score',
    color: 'hsl(var(--chart-1))',
  },
  classAverage: {
    label: 'Class Average',
    color: 'hsl(var(--chart-2))',
  },
  student2: {
    label: 'Comparison',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

interface StudentSubjectsRadarProps {
  organizationId?: string;
  gradeId?: string;
  sectionId?: string;
  studentId?: string;
}

export default function StudentSubjectsRadar({
  organizationId,
  gradeId,
  sectionId,
  studentId,
}: StudentSubjectsRadarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('individual');
  const [selectedStudent, setSelectedStudent] = useState(mockStudents[0].id);
  const [selectedStudent2, setSelectedStudent2] = useState(mockStudents[1].id);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('current');

  const getChartData = () => {
    switch (viewMode) {
      case 'individual':
        const student = mockStudents.find((s) => s.id === selectedStudent);
        return student?.performance || [];

      case 'class-average':
        return classAverage;

      case 'comparison':
        const student1 = mockStudents.find((s) => s.id === selectedStudent);
        const student2 = mockStudents.find((s) => s.id === selectedStudent2);

        return mockSubjects.map((subject) => {
          const perf1 = student1?.performance.find(
            (p) => p.subject === subject.name
          );
          const perf2 = student2?.performance.find(
            (p) => p.subject === subject.name
          );
          return {
            subject: subject.name,
            score: perf1?.score || 0,
            student2Score: perf2?.score || 0,
            maxScore: 100,
          };
        });

      default:
        return [];
    }
  };

  const getSelectedStudentInfo = () => {
    return mockStudents.find((s) => s.id === selectedStudent);
  };

  const getPerformanceInsights = () => {
    const student = getSelectedStudentInfo();
    if (!student) return null;

    const scores = student.performance.map((p) => p.score);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const strongestSubject = student.performance.find(
      (p) => p.score === highest
    )?.subject;
    const weakestSubject = student.performance.find(
      (p) => p.score === lowest
    )?.subject;

    return {
      average: Math.round(average),
      highest,
      lowest,
      strongestSubject,
      weakestSubject,
      trend:
        average > 80
          ? 'excellent'
          : average > 70
            ? 'good'
            : 'needs-improvement',
    };
  };

  const chartData = getChartData();
  const studentInfo = getSelectedStudentInfo();
  const insights = getPerformanceInsights();

  return (
    <div className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={viewMode === 'individual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('individual')}
            className="flex items-center gap-1"
          >
            <User className="h-4 w-4" />
            Individual
          </Button>
          <Button
            variant={viewMode === 'class-average' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('class-average')}
            className="flex items-center gap-1"
          >
            <Users className="h-4 w-4" />
            Class Average
          </Button>
          <Button
            variant={viewMode === 'comparison' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('comparison')}
            className="flex items-center gap-1"
          >
            <Award className="h-4 w-4" />
            Compare
          </Button>
        </div>

        {viewMode === 'individual' && (
          <div className="flex items-center gap-4">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockStudents.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} ({student.rollNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {studentInfo && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{studentInfo.grade}</Badge>
                <Badge variant="outline">Section {studentInfo.section}</Badge>
              </div>
            )}
          </div>
        )}

        {viewMode === 'comparison' && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Student 1:</span>
              <Select
                value={selectedStudent}
                onValueChange={setSelectedStudent}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Student 2:</span>
              <Select
                value={selectedStudent2}
                onValueChange={setSelectedStudent2}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  `${value}%`,
                  name === 'score'
                    ? 'Score'
                    : name === 'student2Score'
                      ? 'Student 2'
                      : name,
                ]}
              />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 12 }}
                className="text-xs"
              />
              <PolarGrid />

              {viewMode === 'comparison' ? (
                <>
                  <Radar
                    dataKey="score"
                    stroke="var(--color-score)"
                    fill="var(--color-score)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    dot={{ r: 4, fillOpacity: 1 }}
                  />
                  <Radar
                    dataKey="student2Score"
                    stroke="var(--color-student2)"
                    fill="var(--color-student2)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    dot={{ r: 4, fillOpacity: 1 }}
                  />
                </>
              ) : (
                <Radar
                  dataKey="score"
                  stroke="var(--color-score)"
                  fill="var(--color-score)"
                  fillOpacity={0.4}
                  strokeWidth={2}
                  dot={{ r: 5, fillOpacity: 1 }}
                />
              )}
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-4 text-sm">
        {viewMode === 'individual' && insights && (
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium leading-none">
                <TrendingUp className="h-4 w-4" />
                Overall Average: {insights.average}%
                <Badge
                  variant={
                    insights.trend === 'excellent'
                      ? 'default'
                      : insights.trend === 'good'
                        ? 'secondary'
                        : 'destructive'
                  }
                >
                  {insights.trend === 'excellent'
                    ? 'Excellent'
                    : insights.trend === 'good'
                      ? 'Good'
                      : 'Needs Improvement'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Strongest Subject:
                  </span>
                  <span className="font-medium text-green-600">
                    {insights.strongestSubject} ({insights.highest}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Needs Focus:</span>
                  <span className="font-medium text-orange-600">
                    {insights.weakestSubject} ({insights.lowest}%)
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Grade:</span>
                  <span className="font-medium">{studentInfo?.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Section:</span>
                  <span className="font-medium">{studentInfo?.section}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'class-average' && (
          <div className="w-full">
            <div className="flex items-center gap-2 font-medium leading-none">
              <Users className="h-4 w-4" />
              Class Performance Overview - Grade 10, Section A
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground mt-1">
              Based on {mockStudents.length} students • {timePeriod} period
            </div>
          </div>
        )}

        {viewMode === 'comparison' && (
          <div className="w-full">
            <div className="flex items-center gap-2 font-medium leading-none">
              <Award className="h-4 w-4" />
              Student Performance Comparison
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground mt-1">
              {mockStudents.find((s) => s.id === selectedStudent)?.name} vs{' '}
              {mockStudents.find((s) => s.id === selectedStudent2)?.name}
            </div>
          </div>
        )}
      </CardFooter>
    </div>
  );
}
