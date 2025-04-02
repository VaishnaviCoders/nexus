// 'use client';

import { CheckCircle, AlertCircle, Clock, BarChart3 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
import Link from 'next/link';
// import { AttendanceStats } from "@/components/attendance/attendance-stats"

interface SectionAttendance {
  id: string;
  section: string;
  grade: string;
  date: Date;
  reportedBy: string;
  status: 'completed' | 'in-progress' | 'pending';
  percentage: number;
  studentsPresent: number;
  totalStudents: number;
}

// Helper function to calculate percentage
function calculatePercentage(numerator: number, denominator: number): number {
  return denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;
}

// Helper function to determine status
function getAttendanceStatus(
  recordedAttendances: number,
  totalStudents: number
): 'completed' | 'in-progress' | 'pending' {
  if (recordedAttendances === 0) {
    return 'pending';
  }
  if (recordedAttendances < totalStudents) {
    return 'in-progress';
  }
  return 'completed';
}

async function getAttendanceCompletionStats(date: Date = new Date()) {
  const { orgId } = await auth();
  if (!orgId) return null;

  const formattedDate = new Date(date);
  formattedDate.setHours(0, 0, 0, 0); // Start of the day
  const nextDay = new Date(formattedDate);
  nextDay.setDate(nextDay.getDate() + 1); // End of the day

  // Fetch sections and attendance data
  const sections = await prisma.section.findMany({
    where: { organizationId: orgId },
    include: {
      grade: true,
      students: { select: { id: true } },
      StudentAttendance: {
        where: {
          date: {
            gte: formattedDate,
            lt: nextDay,
          },
        },
        include: { student: { select: { firstName: true, lastName: true } } },
      },
    },
  });

  // console.log(
  //   '------------------------',
  //   sections.map((s) => s.StudentAttendance)
  // );

  // Fetch the user data (optional, as needed for 'reportedBy' if it's part of your logic)
  const users = await prisma.user.findMany({
    where: { organizationId: orgId },
    select: { id: true, firstName: true, lastName: true },
  });

  // Process each section and calculate stats
  const sectionAttendanceData: SectionAttendance[] = sections.map((section) => {
    const totalStudents = section.students.length;
    const recordedAttendances = section.StudentAttendance.length;
    const studentsPresent = section.StudentAttendance.filter(
      (a) => a.present
    ).length;

    // Calculate percentages and status
    const percentage = calculatePercentage(recordedAttendances, totalStudents);
    const status = getAttendanceStatus(recordedAttendances, totalStudents);

    return {
      id: section.id,
      section: `${section.grade.grade} - Section ${section.name}`,
      grade: section.grade.grade,
      date: formattedDate,
      reportedBy: section.StudentAttendance.map((a) => a.recordedBy).join(', '), // Assuming 'recordedBy' is an array
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
      completionPercentage: calculatePercentage(
        completedSections,
        totalSections
      ),
      totalStudents,
      totalPresent,
      attendancePercentage: calculatePercentage(totalPresent, totalStudents),
      pendingSections: totalSections - completedSections,
    },
  };
}

async function getSectionCount() {
  const { orgId } = await auth();
  if (!orgId) return null;

  return prisma.section.count({
    where: { organizationId: orgId },
  });
}

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

  // console.log('attendance section ', sections);

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
            <div className="text-xl font-bold">
              {sectionCount
                ? `${sectionCount} sections available.`
                : 'No sections found.'}
            </div>
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
              {`${stats.completedSections} / ${stats.totalSections} section completed `}{' '}
              sections completed
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
              {`${stats.totalPresent} / ${stats.totalStudents} students present`}
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
                    {new Intl.DateTimeFormat('en-IN', {
                      timeZone: 'Asia/Kolkata',
                    }).format(new Date(section.date))}
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
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/attendance/attendance-dashboard/${section.id}`}
                    >
                      View{' '}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {sections.length} sections
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
