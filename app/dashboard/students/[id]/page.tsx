// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Download,
  GraduationCap,
  BookOpen,
  FileText,
  MessageCircle,
  CreditCard,
  Bell,
  IndianRupee,
} from 'lucide-react';
import { ChartComponent } from '../Chart';
import { ProgressCircle } from '@/components/Charts/ProgressCircle';
import Link from 'next/link';
import {
  getStudentMonthlyAttendance,
  WeeklyStudentAttendance,
} from '@/app/actions';

const performanceData = [
  { subject: 'Math', score: 85 },
  { subject: 'Science', score: 92 },
  { subject: 'English', score: 78 },
  { subject: 'History', score: 88 },
  { subject: 'Art', score: 95 },
];

async function getStudentData(studentId: string) {
  const data = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
    include: {
      grade: true,
      section: true,
    },
  });
  return data;
}

async function getFees(studentId: string) {
  return await prisma.fee.findMany({
    where: {
      studentId: studentId,
    },
    include: {
      feeCategory: true,
    },
  });
}

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
  const studentId = (await params).id;

  const [data, studentMonthlyAttendanceData, weeklyStudentAttendance, fees] =
    await Promise.all([
      getStudentData(studentId),
      getStudentMonthlyAttendance(studentId),
      WeeklyStudentAttendance(studentId),
      getFees(studentId),
    ]);

  // console.log('Attendance data', studentMonthlyAttendanceData);
  // console.log('weeklyStudentAttendance', weeklyStudentAttendance);

  // const fees = await getFees(studentId);
  const totalFees = fees.reduce((acc, fee) => acc + fee.totalFee, 0);
  const paidFees = fees.reduce((acc, fee) => acc + fee.paidAmount, 0);
  const pendingFees = totalFees - paidFees;

  // const pendingFees = await getPendingFeeByStudentId(studentId);

  // console.log(pendingFees);
  return (
    <div>
      <div className="mx-2 space-y-8">
        <div className="flex justify-between items-center mx-2">
          <div className="flex items-center space-x-4">
            {/* <Avatar className="w-10 h-10 md:w-16 md:h-16">
              <AvatarImage
                src={
                  data?.profileImage || '/placeholder.svg?height=80&width=80'
                }
                alt="Student"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar> */}
            <div>
              <h1 className="text-lg font-bold">
                {data?.firstName} {data?.lastName}
              </h1>
              <p className="text-gray-500">
                {data?.grade.grade} - {data?.section?.name}
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
                  <CardTitle className="text-rsm font-medium">
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
                <CardContent className="pl-2">
                  {/* <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={attendanceData}>
                      <XAxis dataKey="month" stroke="#888888" />
                      <YAxis stroke="#888888" />
                      <Bar
                        dataKey="present"
                        fill="#adfa1d"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="absent"
                        fill="#f43f5e"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="leave"
                        fill="#fbbf24"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer> */}
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Academic Performance</CardTitle>
                  <CardDescription>Subject-wise scores</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={performanceData}>
                      <XAxis dataKey="subject" stroke="#888888" />
                      <YAxis stroke="#888888" />
                      <Line type="monotone" dataKey="score" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer> */}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <ChartComponent data={studentMonthlyAttendanceData} />
            {/* <Card>
              <CardHeader>
                <CardTitle>Attendance Details</CardTitle>
                <CardDescription>Monthly attendance summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {attendanceData.map((month) => (
                    <div key={month.month} className="flex items-center">
                      <div className="w-20">{month.month}</div>
                      <div className="flex-1">
                        <Progress
                          value={
                            (month.present /
                              (month.present + month.absent + month.leave)) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                      <div className="w-20 text-right">
                        {month.present} days
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}

            <Button>
              <Download className="mr-2 h-4 w-4" /> Download Attendance Report
            </Button>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4 ">
            <div className="flex items-start md:space-x-5 max-md:space-y-5 justify-center w-full max-md:flex-col">
              {' '}
              <Card className="w-full min-h-[280px]">
                <CardHeader>
                  <CardTitle>Academic Performance</CardTitle>
                  <CardDescription>
                    Subject-wise grades and overall rank
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center space-x-4">
                  <ProgressCircle
                    value={45}
                    width={100}
                    height={100}
                    className="flex justify-center items-center"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      45%
                    </span>
                  </ProgressCircle>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      45/100
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Participation Rate Analysis
                    </p>
                  </div>
                  <ProgressCircle
                    value={75}
                    width={100}
                    height={100}
                    className="flex justify-center items-center"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      75%
                    </span>
                  </ProgressCircle>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      75/100
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Performance
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="w-full min-h-[280px]">
                <CardHeader>
                  <CardTitle>Academic Performance</CardTitle>
                  <CardDescription>
                    Subject-wise grades and overall rank
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {performanceData.map((subject) => (
                      <div key={subject.subject} className="flex items-center">
                        <div className="w-32">{subject.subject}</div>
                        <div className="flex-1">
                          <Progress value={subject.score} className="h-2" />
                        </div>
                        <div className="w-20 text-right">{subject.score}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" /> Download Performance Report
            </Button>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Math Problem Set</h3>
                      <p className="text-sm text-muted-foreground">
                        Due: May 20, 2023
                      </p>
                    </div>
                    <Button variant="outline">Submit</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Science Lab Report</h3>
                      <p className="text-sm text-muted-foreground">
                        Due: May 25, 2023
                      </p>
                    </div>
                    <Button variant="outline">Submit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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

          <Card>
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentIdRoute;
