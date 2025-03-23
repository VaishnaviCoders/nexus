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

interface SectionAttendance {
  id: string;
  section: string;
  grade: string;
  date: string;
  reportedBy: string;
  status: 'completed' | 'in-progress' | 'pending';
  percentage: number;
  studentsPresent: number;
  totalStudents: number;
}

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

// Get all sections Count
async function getSectionCount() {
  const { orgId } = await auth();

  if (!orgId) return null;
  return prisma.section.count({
    where: {
      organizationId: orgId,
    },
  });
}
// Get Completion Rate =>> 3 of 5 sections completed

// Attendance Rate =>> 89 of 128 students present
async function getAttendanceRate() {
  const { orgId } = await auth();
  if (!orgId) return null;
  return prisma.studentAttendance.count({
    where: {},
  });
}

async function getAttendanceCompletionStats(date = new Date()) {
  const { orgId } = await auth();
  if (!orgId) return null;

  const formattedDate = new Date(date);
  formattedDate.setHours(0, 0, 0, 0);
  const nextDay = new Date(formattedDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const sections = await prisma.section.findMany({
    where: {
      organizationId: orgId,
    },
    include: {
      grade: true,
      students: {
        select: { id: true },
      },
      StudentAttendance: {
        where: {
          date: {
            gte: formattedDate,
            lt: nextDay,
          },
        },
        include: {
          student: {
            select: { firstName: true, lastName: true },
          },
        },
      },
    },
  });

  const users = await prisma.user.findMany({
    where: {
      organizationId: orgId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });

  const userMap = users.reduce<Record<string, string>>((map, user) => {
    map[user.id] = `${user.firstName} ${user.lastName}`;
    return map;
  }, {});

  const sectionAttendanceData: SectionAttendance[] = sections.map((section) => {
    const totalStudents = section.students.length;
    const recordedAttendances = section.StudentAttendance.length;
    const studentsPresent = section.StudentAttendance.filter(
      (a) => a.present
    ).length;
    const percentage =
      totalStudents > 0
        ? Math.round((recordedAttendances / totalStudents) * 100)
        : 0;

    // Determine status based on attendance records
    let status: 'completed' | 'in-progress' | 'pending' = 'pending';
    if (recordedAttendances === 0) {
      status = 'pending';
    } else if (recordedAttendances < totalStudents) {
      status = 'in-progress';
    } else {
      status = 'completed';
    }

    // Get the most recent recorder's name
    let reportedBy = 'Not reported';
    if (section.StudentAttendance.length > 0) {
      const recordedById = section.StudentAttendance[0].recordedBy;
      reportedBy = userMap[recordedById] || 'Unknown';
    }

    return {
      id: section.id,
      section: `${section.grade.grade} - Section ${section.name}`,
      grade: section.grade.grade,
      date: formattedDate.toISOString().split('T')[0],
      reportedBy,
      status,
      percentage,
      studentsPresent,
      totalStudents,
    };
  });

  // Calculate overall stats
  const totalSections = sectionAttendanceData.length;
  const completedSections = sectionAttendanceData.filter(
    (s) => s.status === 'completed'
  ).length;
  const totalStudents = sectionAttendanceData.reduce(
    (acc, curr) => acc + curr.totalStudents,
    0
  );
  const totalPresent = sectionAttendanceData.reduce(
    (acc, curr) => acc + curr.studentsPresent,
    0
  );

  return {
    sections: sectionAttendanceData,
    stats: {
      totalSections,
      completedSections,
      completionPercentage:
        totalSections > 0
          ? Math.round((completedSections / totalSections) * 100)
          : 0,
      totalStudents,
      totalPresent,
      attendancePercentage:
        totalStudents > 0
          ? Math.round((totalPresent / totalStudents) * 100)
          : 0,
      pendingSections: totalSections - completedSections,
    },
  };
}

// Pending Sections => { 2 } => Sections awaiting completion

export default async function AttendanceOverview() {
  const sectionCount = await getSectionCount();
  const attendanceData = await getAttendanceCompletionStats();
  // const [showStats, setShowStats] = useState(false);

  if (!attendanceData) {
    return (
      <div>
        Unable to fetch attendance data. Please check your organization
        settings.
      </div>
    );
  }

  const { sections, stats } = attendanceData;

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
            <div className="text-2xl font-bold">{sectionCount}</div>
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
              {stats.completionPercentage}%
            </div>
            <Progress value={stats.completionPercentage} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.completionPercentage}% of {stats.totalSections} sections
              completed
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
              {stats.attendancePercentage}%
            </div>
            <Progress value={stats.attendancePercentage} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.totalPresent} of {stats.totalStudents} students present
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
            <div className="text-2xl font-bold">{stats.pendingSections}</div>
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
              {sections.map((section) => (
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
