// 'use client';

import {
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
// import { AttendanceStats } from "@/components/attendance/attendance-stats"

// Mock data - in a real app, this would come from an API

const mockSectionAttendance = [
  {
    id: '1',
    section: 'Grade 1 - Section A',
    grade: 'Grade 1',
    date: '2025-03-20',
    reportedBy: 'John Smith',
    status: 'completed',
    percentage: 100,
    studentsPresent: 25,
    totalStudents: 25,
  },
  {
    id: '2',
    section: 'Grade 1 - Section B',
    grade: 'Grade 1',
    date: '2025-03-20',
    reportedBy: 'Jane Doe',
    status: 'completed',
    percentage: 96,
    studentsPresent: 24,
    totalStudents: 25,
  },
  {
    id: '3',
    section: 'Grade 2 - Section A',
    grade: 'Grade 2',
    date: '2025-03-20',
    reportedBy: 'Michael Johnson',
    status: 'pending',
    percentage: 0,
    studentsPresent: 0,
    totalStudents: 28,
  },
  {
    id: '4',
    section: 'Grade 2 - Section B',
    grade: 'Grade 2',
    date: '2025-03-20',
    reportedBy: 'Sarah Williams',
    status: 'in-progress',
    percentage: 68,
    studentsPresent: 17,
    totalStudents: 25,
  },
  {
    id: '5',
    section: 'Grade 3 - Section A',
    grade: 'Grade 3',
    date: '2025-03-20',
    reportedBy: 'Robert Brown',
    status: 'completed',
    percentage: 92,
    studentsPresent: 23,
    totalStudents: 25,
  },
];

export default async function AttendanceOverview() {
  // const [showStats, setShowStats] = useState(false);
  const { orgId } = await auth();

  if (!orgId) return null;

  const sections = await prisma.section.findMany({
    where: {
      organizationId: orgId,
    },
    include: {
      grade: true,
      StudentAttendance: true,
      students: true,
    },
  });

  const attendanceRecords = await prisma.studentAttendance.findMany({
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  // console.log(sections.map((s) => s.grade.grade));
  // console.log(attendanceRecords);
  // Calculate overall stats
  const totalSections = mockSectionAttendance.length;
  const completedSections = mockSectionAttendance.filter(
    (s) => s.status === 'completed'
  ).length;
  const overallCompletionPercentage = Math.round(
    (completedSections / totalSections) * 100
  );

  const totalStudents = mockSectionAttendance.reduce(
    (acc, curr) => acc + curr.totalStudents,
    0
  );
  const totalPresent = mockSectionAttendance.reduce(
    (acc, curr) => acc + curr.studentsPresent,
    0
  );
  const overallAttendancePercentage = Math.round(
    (totalPresent / totalStudents) * 100
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sections
            </CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSections}</div>
            <p className="text-xs text-muted-foreground">
              Sections being tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallCompletionPercentage}%
            </div>
            <Progress
              value={overallCompletionPercentage}
              className="h-2 mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {completedSections} of {totalSections} sections completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Rate
            </CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallAttendancePercentage}%
            </div>
            <Progress
              value={overallAttendancePercentage}
              className="h-2 mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {totalPresent} of {totalStudents} students present
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Sections
            </CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSections - completedSections}
            </div>
            <p className="text-xs text-muted-foreground">
              Sections awaiting completion
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Section Attendance Status</CardTitle>
              <CardDescription>
                Overview of attendance status for all sections
              </CardDescription>
            </div>
            {/* <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-1"
            >
              {showStats ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Hide Stats
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show Stats
                </>
              )}
            </Button> */}
          </div>
        </CardHeader>
        <CardContent>
          {/* {showStats && <AttendanceStats data={mockSectionAttendance} />} */}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Section</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSectionAttendance.map((section) => (
                <TableRow key={section.id}>
                  <TableCell className="font-medium">
                    {section.section}
                  </TableCell>
                  <TableCell>
                    {new Date(section.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{section.reportedBy}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        section.status === 'completed'
                          ? 'default'
                          : section.status === 'in-progress'
                            ? 'secondary'
                            : 'destructive'
                      }
                      className={
                        section.status === 'completed'
                          ? 'bg-green-500'
                          : section.status === 'in-progress'
                            ? 'secondary'
                            : 'capitalize py-1'
                      }
                    >
                      {section.status === 'completed' && (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      )}
                      {section.status === 'in-progress' && (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {section.status === 'pending' && (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                      {section.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm font-medium">
                        {section.percentage}%
                      </span>
                      <Progress
                        value={section.percentage}
                        className="h-2 w-16"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {mockSectionAttendance.length} sections
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
