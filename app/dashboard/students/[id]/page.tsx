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
} from 'lucide-react';
import Link from 'next/link';
import {
  getStudentMonthlyAttendance,
  WeeklyStudentAttendance,
} from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StudentPerformance from '@/components/dashboard/Student/StudentPerformance';
import StudentAssignment from '@/components/dashboard/Student/StudentAssignment';
import { StudentAttendanceChart } from '@/components/dashboard/Student/StudentAttendanceChart';

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

// async function getPendingFeeByStudentId(studentId: string) {
//   const pendingFeesData = await prisma.fee.aggregate({
//     _sum: {
//       totalFee: true,
//       paidAmount: true,
//     },
//     where: {
//       studentId: studentId,
//       status: 'UNPAID',
//     },
//   });

//   const remainingBalance =
//     (pendingFeesData._sum.totalFee || 0) -
//     (pendingFeesData._sum.paidAmount || 0);
//   return {
//     totalPendingFees: pendingFeesData._sum.totalFee,
//     totalPaidAmount: pendingFeesData._sum.paidAmount,
//     remainingBalance: remainingBalance,
//   };
// }

const StudentIdRoute = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const studentId = id;

  const {
    student,
    attendance,
    weeklyAttendance,
    totalFees,
    paidFees,
    pendingFees,
  } = await getStudentDashboardData(studentId);

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

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Attendance Rate
                  </CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">95%</div>
                  <Progress value={85} className="mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Current GPA
                  </CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.8</div>
                  <p className="text-xs text-muted-foreground">Out of 4.0</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Upcoming Exams
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    Next: Math (May 15)
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Assignments
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">Due this week</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Yearly Attendance</CardTitle>
                </CardHeader>
                <CardContent className="pl-2"></CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Academic Performance</CardTitle>
                  <CardDescription>Subject-wise scores</CardDescription>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <StudentAttendanceChart data={attendance} />
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

          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Summer Break</h3>
                  <p className="text-sm text-muted-foreground">
                    School closes from June 15 to July 15
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Annual Sports Day</h3>
                  <p className="text-sm text-muted-foreground">
                    Scheduled for May 30, 2023
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Bell className="mr-2 h-4 w-4" /> View All Announcements
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
