'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

// Mock section attendance data
const sectionData = [
  {
    id: 1,
    section: 'A',
    totalStudents: 30,
    present: 28,
    absent: 2,
    late: 0,
    percentage: 93.3,
  },
  {
    id: 2,
    section: 'B',
    totalStudents: 32,
    present: 29,
    absent: 2,
    late: 1,
    percentage: 90.6,
  },
  {
    id: 3,
    section: 'C',
    totalStudents: 28,
    present: 26,
    absent: 1,
    late: 1,
    percentage: 92.9,
  },
  {
    id: 4,
    section: 'D',
    totalStudents: 31,
    present: 30,
    absent: 1,
    late: 0,
    percentage: 96.8,
  },
  {
    id: 5,
    section: 'E',
    totalStudents: 29,
    present: 25,
    absent: 3,
    late: 1,
    percentage: 86.2,
  },
  {
    id: 6,
    section: 'F',
    totalStudents: 30,
    present: 28,
    absent: 1,
    late: 1,
    percentage: 93.3,
  },
  {
    id: 7,
    section: 'G',
    totalStudents: 33,
    present: 31,
    absent: 2,
    late: 0,
    percentage: 93.9,
  },
  {
    id: 8,
    section: 'H',
    totalStudents: 32,
    present: 30,
    absent: 1,
    late: 1,
    percentage: 93.8,
  },
];

export function SectionAttendanceTable() {
  // const getProgressColor = (percentage: number) => {
  //   if (percentage >= 95) return 'bg-green-600';
  //   if (percentage >= 90) return 'bg-yellow-600';
  //   return 'bg-red-600';
  // };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Section</TableHead>
            <TableHead>Total Students</TableHead>
            <TableHead>Present</TableHead>
            <TableHead>Absent</TableHead>
            <TableHead>Late</TableHead>
            <TableHead>Percentage</TableHead>
            <TableHead className="w-[200px]">Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sectionData.map((section) => (
            <TableRow key={section.id}>
              <TableCell className="font-medium">
                Section {section.section}
              </TableCell>
              <TableCell>{section.totalStudents}</TableCell>
              <TableCell>{section.present}</TableCell>
              <TableCell>{section.absent}</TableCell>
              <TableCell>{section.late}</TableCell>
              <TableCell>{section.percentage.toFixed(1)}%</TableCell>
              <TableCell>
                <Progress
                  value={section.percentage}
                  max={100}
                  className="h-2"
                  // indicatorClassName={getProgressColor(section.percentage)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
