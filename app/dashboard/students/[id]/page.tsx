import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import prisma from '@/lib/db';
import {
  CalendarDays,
  GraduationCap,
  BookOpen,
  FileText,
  MessageCircle,
  CreditCard,
  Bell,
  IndianRupee,
  CheckCircle,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import {
  getStudentMonthlyAttendance,
  WeeklyStudentAttendance,
} from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StudentPerformance from '@/components/dashboard/Student/StudentPerformance';
import StudentAssignment from '@/components/dashboard/Student/StudentAssignment';
import { Badge } from '@/components/ui/badge';
import { getOrganizationId } from '@/lib/organization';

const getStudentDashboardData = async (studentId: string) => {
  const start = performance.now();

  const [student, attendance, weeklyAttendance, fees] = await Promise.all([
    prisma.student.findUnique({
      where: { id: studentId },
      include: { grade: true, section: true },
    }),
    getStudentMonthlyAttendance(studentId),
    WeeklyStudentAttendance(studentId),
    prisma.fee.findMany({
      where: { studentId },
      include: { feeCategory: true },
    }),
  ]);
  const end = performance.now();

  console.log('getDashboardStats took', end - start, 'ms');

  const totalFees = fees.reduce((sum, fee) => sum + fee.totalFee, 0);
  const paidFees = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);

  // let yearlyAttendanceRate = 0;
  // if (attendance && attendance.length > 0) {
  //   const totalDays = attendance.reduce((sum, month) => sum + (month.totalDays || 0), 0);
  //   const presentDays = attendance.reduce((sum, month) => sum + (month.presentDays || 0), 0);
  //   yearlyAttendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
  // }

  return {
    student,
    attendance,
    weeklyAttendance,
    fees,
    totalFees,
    paidFees,
    pendingFees: totalFees - paidFees,
  };
};

const getNotices = async (organizationId: string) => {
  const notices = await prisma.notice.findMany({
    where: {
      organizationId: organizationId,
    },
    orderBy: {
      startDate: 'asc',
    },
  });
  return notices;
};

const StudentIdRoute = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const organizationId = await getOrganizationId();

  const notices = await getNotices(organizationId);
  const studentId = id;

  const {
    student,
    attendance,
    weeklyAttendance,
    totalFees,
    paidFees,
    pendingFees,
  } = await getStudentDashboardData(studentId);

  const attendanceRate = 95;
  const gpa = 3.8;
  const upcomingExams = 3;
  const pendingAssignments = 2;

  return (
    <div>
      <div className="mx-2 space-y-8">
        <div className="flex justify-between items-center mx-2">
          <div className="flex items-center space-x-4">
            <Avatar className="w-10 h-10 md:w-16 md:h-16">
              <AvatarImage
                src={
                  student?.profileImage || '/placeholder.svg?height=80&width=80'
                }
                alt="Student"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-bold">
                {student?.firstName} {student?.lastName}
              </h1>
              <p className="text-gray-500">
                {student?.grade.grade} - {student?.section?.name}
              </p>
            </div>
          </div>
          <Button>Edit Profile</Button>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2 border-green-200/50 dark:border-green-800/50 bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-950/10 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-t-lg">
              <CardTitle className="text-sm font-medium">
                Attendance Rate
              </CardTitle>
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                <CalendarDays className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {attendanceRate}%
              </div>
              <Progress value={attendanceRate} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                Excellent attendance
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/10 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-t-lg">
              <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {gpa}
              </div>
              <p className="text-xs text-muted-foreground">Out of 4.0</p>
              <div className="mt-2 flex items-center text-xs text-purple-600 dark:text-purple-400">
                <TrendingUp className="w-3 h-3 mr-1" />
                Above average
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/10 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-t-lg">
              <CardTitle className="text-sm font-medium">
                Upcoming Exams
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {upcomingExams}
              </div>
              <p className="text-xs text-muted-foreground">
                Next: Math (May 15)
              </p>
              <div className="mt-2 flex items-center text-xs text-blue-600 dark:text-blue-400">
                <Clock className="w-3 h-3 mr-1" />2 days remaining
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-900 dark:to-orange-950/10 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-t-lg">
              <CardTitle className="text-sm font-medium">
                Pending Assignments
              </CardTitle>
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50">
                <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {pendingAssignments}
              </div>
              <p className="text-xs text-muted-foreground">Due this week</p>
              <div className="mt-2 flex items-center text-xs text-orange-600 dark:text-orange-400">
                <AlertCircle className="w-3 h-3 mr-1" />
                Action required
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="overflow-x-auto whitespace-nowrap flex">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="communication" className="hidden md:block">
              Communication
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid gap-6 lg:grid-cols-7">
              <Card className="lg:col-span-4 border-slate-200/50 dark:border-slate-700/50">
                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-t-lg border-b border-blue-200/30 dark:border-blue-800/30">
                  <CardTitle className="text-lg font-semibold">
                    Weekly Attendance Overview
                  </CardTitle>
                  <CardDescription>
                    Your attendance pattern for the current month
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
                    <div className="text-center">
                      <CalendarDays className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Attendance chart will be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-3 border-slate-200/50 dark:border-slate-700/50">
                <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-t-lg border-b border-emerald-200/30 dark:border-emerald-800/30">
                  <CardTitle className="text-lg font-semibold">
                    Subject Performance
                  </CardTitle>
                  <CardDescription>
                    Recent test scores and grades
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {[
                      {
                        subject: 'Mathematics',
                        score: 92,
                        grade: 'A',
                        color: 'bg-blue-500',
                      },
                      {
                        subject: 'Science',
                        score: 88,
                        grade: 'A-',
                        color: 'bg-emerald-500',
                      },
                      {
                        subject: 'English',
                        score: 85,
                        grade: 'B+',
                        color: 'bg-amber-500',
                      },
                      {
                        subject: 'History',
                        score: 90,
                        grade: 'A',
                        color: 'bg-purple-500',
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${item.color}`}
                          ></div>
                          <span className="font-medium text-sm">
                            {item.subject}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {item.score}%
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {item.grade}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            {/* <StudentAttendanceChart data={attendance} /> */}
          </TabsContent>

          <TabsContent value="performance" className="space-y-4 ">
            <StudentPerformance />
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <StudentAssignment />
          </TabsContent>

          <TabsContent value="communication" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Teacher Remarks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-semibold">Math Teacher</h3>
                    <p className="text-sm text-muted-foreground">
                      sammy has shown significant improvement in problem-solving
                      skills. Keep up the good work!
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="font-semibold">Science Teacher</h3>
                    <p className="text-sm text-muted-foreground">
                      sammy&#39;s curiosity in class is commendable. He asks
                      insightful questions and participates actively.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button>
              <MessageCircle className="mr-2 h-4 w-4" /> Contact Teacher
            </Button>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Fees Overview{' '}
                <Link
                  href={`/dashboard/students/${studentId}/fees`}
                  className="ml-5 text-blue-500 text-sm"
                >
                  View All
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Fees:</span>
                  <span className="font-semibold flex items-center space-x-3 ">
                    <IndianRupee className="custom_color h-4 w-4" />
                    {new Intl.NumberFormat('en-IN').format(totalFees)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Paid:</span>
                  <span className="font-semibold flex items-center space-x-3 ">
                    <IndianRupee className="custom_color h-4 w-4" />
                    {new Intl.NumberFormat('en-IN').format(paidFees)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Due:</span>
                  <span className="font-semibold flex items-center space-x-3 text-red-500">
                    <IndianRupee className="custom_color h-4 w-4" />
                    {new Intl.NumberFormat('en-IN').format(pendingFees)}
                  </span>
                </div>
              </div>

              <Button className="w-full mt-4">
                <CreditCard className="mr-2 h-4 w-4" />{' '}
                {pendingFees === 0 ? 'Fees Already Paid' : 'Pay Fees'}
              </Button>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-900 dark:to-amber-950/20 border-amber-200/50 dark:border-amber-800/30 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                Recent Notices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {notices.map((notice, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-l-4 border-amber-500"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {notice.title}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Intl.DateTimeFormat('en-in').format(
                          notice.startDate
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {notice.content}
                    </p>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full border-amber-200 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-950/20"
              >
                <Bell className="mr-2 h-4 w-4" />
                View All Announcements
              </Button>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Button variant="outline">School Calendar</Button>
                <Button variant="outline">Exam Schedule</Button>
                <Button variant="outline">Library Catalog</Button>
                <Button variant="outline">Student Handbook</Button>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default StudentIdRoute;
