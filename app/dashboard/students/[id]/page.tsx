import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import prisma from '@/lib/db';
import {
  CalendarDays,
  MessageCircle,
  CreditCard,
  IndianRupee,
  Edit,
  Phone,
  Mail,
  FileText,
  Users,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Plus,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrencyIN, formatDateIN } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { StudentDashboardStatsCards } from '@/components/dashboard/Student/StudentDashboardStatsCards';
import { StudentAttendanceCalendar } from '@/components/dashboard/StudentAttendance/attendance-calendar';
import { getCurrentAcademicYearId } from '@/lib/academicYear';
import { getOrganizationId } from '@/lib/organization';
import { DocumentCard } from '@/components/dashboard/Student/documents/DocumentCard';
import { getStudentDocuments } from '@/lib/data/documents/get-student-documents';
import StudentAcademicPerformance from '@/components/dashboard/Student/StudentPerformance';

const getStudentAdminData = async (studentId: string) => {
  const [student, attendance, fees, parents, documents, performance] =
    await Promise.all([
      prisma.student.findUnique({
        where: { id: studentId },
        include: {
          grade: true,
          section: { include: { classTeacher: { include: { user: true } } } },
          user: true,
          organization: true,
        },
      }),
      // Attendance Rate (last 30 days)
      prisma.studentAttendance.findMany({
        where: {
          studentId,
        },
        select: {
          present: true,
        },
      }),

      prisma.fee.findMany({
        where: { studentId },
        include: {
          feeCategory: true,
          payments: {
            include: { payer: true },
            orderBy: { paymentDate: 'desc' },
          },
        },
      }),
      prisma.parentStudent.findMany({
        where: { studentId },
        include: {
          parent: true,
        },
      }),
      getStudentDocuments(studentId),

      prisma.examResult.findMany({
        where: { studentId },
        include: {
          exam: {
            include: {
              subject: true,
              examSession: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

  const total = attendance.length;
  const present = attendance.filter((a) => a.present).length;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

  const totalFees = fees.reduce((sum, fee) => sum + fee.totalFee, 0);
  const paidFees = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);

  return {
    student,
    attendanceRate,
    fees,
    parents,
    documents,
    performance,
    totalFees,
    paidFees,
    pendingFees: totalFees - paidFees,
    attendance,
  };
};

const StudentAdminRoute = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const studentId = id;

  const studentData = await getStudentAdminData(studentId);
  const {
    student,
    attendanceRate,
    attendance,
    totalFees,
    paidFees,
    pendingFees,
    parents,
    documents,
    performance,
    fees,
  } = studentData;

  const organizationId = await getOrganizationId();
  const academicYearId = await getCurrentAcademicYearId();

  const attendanceData = await prisma.studentAttendance.findMany({
    where: { studentId: studentId, academicYearId },
    orderBy: { date: 'desc' },
  });

  const holidayData = await prisma.academicCalendar.findMany({
    where: { organizationId, academicYearId },
  });

  return (
    <div className="mx-2 space-y-8 pb-8">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-20 w-20 sm:w-24 sm:h-24 border-4 border-white dark:border-slate-800 shadow-md">
                <AvatarImage
                  src={
                    student?.profileImage ||
                    student?.user.profileImage ||
                    '/placeholder.svg?height=96&width=96'
                  }
                  className='object-cover object-center"'
                  alt="Student"
                />
                <AvatarFallback className="text-lg font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {student?.firstName?.[0]}
                  {student?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Student Info */}
            <div className="space-y-3 text-center sm:text-left">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {student?.firstName} {student?.lastName}
                </h1>
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium"
                  >
                    Roll No: {student?.rollNumber}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300"
                  >
                    {student?.grade.grade} - {student?.section?.name}
                  </Badge>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row items-center gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg">
                  <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm">{student?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg">
                  <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm">{student?.phoneNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 justify-center">
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Link href={`/dashboard/students/${student?.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>

            <Button
              variant="outline"
              className="border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      <StudentDashboardStatsCards studentId={studentId} />

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <Tabs defaultValue="overview" className="w-full">
          {/* Tabs Header */}
          <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-t-xl">
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-6 lg:grid-cols-6 h-auto bg-transparent p-2 gap-1">
              <TabsTrigger
                value="overview"
                className="flex-1 data-[state=active]:bg-slate-100 data-[state=active]:dark:bg-slate-800 data-[state=active]:text-slate-900 data-[state=active]:dark:text-white data-[state=active]:shadow-none font-medium py-3 px-4 rounded-lg transition-all duration-200"
              >
                <span className="text-xs sm:text-sm">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="academic"
                className="flex-1 data-[state=active]:bg-slate-100 data-[state=active]:dark:bg-slate-800 data-[state=active]:text-slate-900 data-[state=active]:dark:text-white data-[state=active]:shadow-none font-medium py-3 px-4 rounded-lg transition-all duration-200"
              >
                <span className="text-xs sm:text-sm">Academic</span>
              </TabsTrigger>
              <TabsTrigger
                value="attendance"
                className="flex-1 data-[state=active]:bg-slate-100 data-[state=active]:dark:bg-slate-800 data-[state=active]:text-slate-900 data-[state=active]:dark:text-white data-[state=active]:shadow-none font-medium py-3 px-4 rounded-lg transition-all duration-200"
              >
                <span className="text-xs sm:text-sm">Attendance</span>
              </TabsTrigger>
              <TabsTrigger
                value="fees"
                className="flex-1 data-[state=active]:bg-slate-100 data-[state=active]:dark:bg-slate-800 data-[state=active]:text-slate-900 data-[state=active]:dark:text-white data-[state=active]:shadow-none font-medium py-3 px-4 rounded-lg transition-all duration-200"
              >
                <span className="text-xs sm:text-sm">Fees</span>
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="flex-1 data-[state=active]:bg-slate-100 data-[state=active]:dark:bg-slate-800 data-[state=active]:text-slate-900 data-[state=active]:dark:text-white data-[state=active]:shadow-none font-medium py-3 px-4 rounded-lg transition-all duration-200"
              >
                <span className="text-xs sm:text-sm">Documents</span>
              </TabsTrigger>
              <TabsTrigger
                value="parents"
                className="flex-1 data-[state=active]:bg-slate-100 data-[state=active]:dark:bg-slate-800 data-[state=active]:text-slate-900 data-[state=active]:dark:text-white data-[state=active]:shadow-none font-medium py-3 px-4 rounded-lg transition-all duration-200"
              >
                <span className="text-xs sm:text-sm">Parents</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="py-4">
            <TabsContent value="overview" className="space-y-8 mt-0">
              <div className="grid gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-1 border-slate-200/60 dark:border-slate-700/60 ">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-700 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <Users className="w-5 h-5 text-blue-600" />
                      Student Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-96 px-6 py-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                            <label className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Full Name
                            </label>
                            <p className="font-bold text-lg text-slate-900 dark:text-slate-100 mt-1">
                              {student?.firstName} {student?.lastName}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Roll Number
                              </label>
                              <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">
                                {student?.rollNumber}
                              </p>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Student ID
                              </label>
                              <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1 text-xs">
                                {student?.id}
                              </p>
                            </div>
                          </div>

                          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200/50 dark:border-green-800/50">
                            <label className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
                              <CalendarDays className="w-4 h-4" />
                              Date of Birth
                            </label>
                            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">
                              {student?.dateOfBirth
                                ? formatDateIN(student.dateOfBirth)
                                : 'N/A'}
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                              Age:{' '}
                              {student?.dateOfBirth
                                ? new Date().getFullYear() -
                                  new Date(student.dateOfBirth).getFullYear()
                                : 'N/A'}{' '}
                              years
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                              <label className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                Gender
                              </label>
                              <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">
                                {student?.gender}
                              </p>
                            </div>
                            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200/50 dark:border-orange-800/50">
                              <label className="text-sm font-medium text-orange-700 dark:text-orange-300">
                                Blood Group
                              </label>
                              <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">
                                {/* {student?.bloodGroup || 'N/A'} */}'N/A'
                              </p>
                            </div>
                          </div>

                          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg border border-indigo-200/50 dark:border-indigo-800/50">
                            <label className="text-sm font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                              <GraduationCap className="w-4 h-4" />
                              Academic Details
                            </label>
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  Class:
                                </span>
                                <Badge variant="meta" className="font-medium">
                                  {student?.grade.grade} -{' '}
                                  {student?.section?.name}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  Class Teacher:
                                </span>
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {
                                    student?.section?.classTeacher?.user
                                      ?.firstName
                                  }{' '}
                                  {
                                    student?.section?.classTeacher?.user
                                      ?.lastName
                                  }
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  Admission Date:
                                </span>
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {student?.createdAt
                                    ? formatDateIN(student.createdAt)
                                    : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-lg border border-red-200/50 dark:border-red-800/50">
                            <label className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Contact Information
                            </label>
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {student?.email}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {student?.phoneNumber}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {student?.emergencyContact}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-lg border border-teal-200/50 dark:border-teal-800/50">
                              <label className="text-sm font-medium text-teal-700 dark:text-teal-300 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Additional Information
                              </label>
                              <div className="mt-2 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-600 dark:text-slate-400">
                                    Religion:
                                  </span>
                                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {student?.religion || 'N/A'}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-600 dark:text-slate-400">
                                    Nationality:
                                  </span>
                                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {student?.nationality || 'N/A'}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-600 dark:text-slate-400">
                                    Address:
                                  </span>
                                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100 text-right max-w-32">
                                    {student?.address || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div> */}

                          <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
                            <label className="text-sm font-medium text-amber-700 dark:text-amber-300 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Status & Verification
                            </label>
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  Account Status:
                                </span>
                                <Badge variant="verified">Active</Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  Documents:
                                </span>
                                <Badge
                                  variant={
                                    documents.every((doc) => doc.verified)
                                      ? 'verified'
                                      : documents.some((doc) => doc.rejected)
                                        ? 'rejected'
                                        : 'pending'
                                  }
                                >
                                  {documents.every((doc) => doc.verified)
                                    ? 'Complete'
                                    : documents.some((doc) => doc.rejected)
                                      ? 'Issues Found'
                                      : 'Pending Review'}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  Fee Status:
                                </span>
                                <Badge
                                  variant={
                                    pendingFees === 0 ? 'verified' : 'pending'
                                  }
                                >
                                  {pendingFees === 0
                                    ? 'Up to Date'
                                    : 'Payment Due'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-slate-200/60 dark:border-slate-700/60 ">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-700 rounded-t-lg">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                        Recent Performance
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-blue-200 hover:bg-blue-50 bg-transparent"
                      >
                        <Link
                          href={`/dashboard/students/${studentId}/performance`}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View All
                        </Link>
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {performance.slice(0, 5).map((record, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-700/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover: transition-all duration-200"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm"></div>
                            <div>
                              <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                                {record.exam.subject.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {record.exam.examSession.title}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {record.obtainedMarks}/{record.exam.maxMarks}
                              </span>
                              <div className="text-xs text-slate-500">
                                {Math.round(
                                  ((record.obtainedMarks ?? 0) /
                                    record.exam.maxMarks) *
                                    100
                                )}
                                %
                              </div>
                            </div>
                            <Badge
                              variant={
                                record.isPassed ? 'default' : 'destructive'
                              }
                              className={`text-xs ${record.isPassed ? 'bg-green-100 text-green-800 border-green-200' : ''}`}
                            >
                              {record.gradeLabel ||
                                (record.isPassed ? 'Pass' : 'Fail')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="academic" className="mt-0">
              <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-700/30 rounded-lg p-6">
                <StudentAcademicPerformance />
              </div>
            </TabsContent>

            <TabsContent value="attendance" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5" />
                      Attendance
                    </div>
                    <Button asChild size={'sm'}>
                      <Link href={'/dashboard/attendance/mark'}>
                        Mark Attendance
                      </Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {attendanceData ? (
                    <StudentAttendanceCalendar
                      attendanceRecords={attendanceData}
                      academicCalendarEvents={holidayData}
                    />
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-center">
                      <CalendarDays className="w-12 h-12 mb-3 opacity-50" />
                      <p className="text-sm text-muted-foreground">
                        Detailed attendance tracking will be displayed here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fees" className="mt-0">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-slate-200/60 dark:border-slate-700/60 ">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-700 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      Fee Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6 p-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50 text-center">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-2">
                          <IndianRupee className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          Total Fees
                        </p>
                        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                          ₹{formatCurrencyIN(totalFees)}
                        </p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50 text-center">
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                          Paid <span className="max-sm:hidden">Amount</span>
                        </p>
                        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                          ₹{formatCurrencyIN(paidFees)}
                        </p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-lg border border-red-200/50 dark:border-red-800/50 text-center">
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-2">
                          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="text-sm font-medium text-red-700 dark:text-red-300">
                          Pending
                        </p>
                        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                          ₹{formatCurrencyIN(pendingFees)}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Fee Breakdown
                      </h4>
                      <ScrollArea className="h-64">
                        <div className="space-y-3 pr-4">
                          {fees.map((fee, index) => (
                            <div
                              key={index}
                              className="p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-700/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover: transition-all duration-200"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                                    {fee.feeCategory.name}
                                  </p>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Due: {formatDateIN(fee.dueDate)}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    fee.status === 'PAID'
                                      ? 'verified'
                                      : fee.status === 'OVERDUE'
                                        ? 'rejected'
                                        : 'pending'
                                  }
                                  className="font-medium"
                                >
                                  {fee.status}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">
                                  Amount: ₹{formatCurrencyIN(fee.totalFee)}
                                </span>
                                <span className="text-slate-600 dark:text-slate-400">
                                  Paid: ₹{formatCurrencyIN(fee.paidAmount)}
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${(fee.paidAmount / fee.totalFee) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200/60 dark:border-slate-700/60 ">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-700 rounded-t-lg">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        Payment History
                      </div>
                      <Badge variant="meta" className="text-xs">
                        {fees.flatMap((fee) => fee.payments).length}{' '}
                        Transactions
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ScrollArea className="h-96">
                      <div className="space-y-3 pr-4">
                        {fees
                          .flatMap((fee) =>
                            fee.payments.map((payment) => ({
                              ...payment,
                              feeCategory: fee.feeCategory.name,
                            }))
                          )
                          .sort(
                            (a, b) =>
                              new Date(b.paymentDate).getTime() -
                              new Date(a.paymentDate).getTime()
                          )
                          .slice(0, 15)
                          .map((payment, index) => (
                            <div
                              key={index}
                              className="p-4 bg-gradient-to-r from-white to-slate-50/50 dark:from-slate-800/50 dark:to-slate-700/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover: transition-all duration-200"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                                      ₹{formatCurrencyIN(payment.amount)}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {payment.feeCategory}
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  variant={
                                    payment.status === 'COMPLETED'
                                      ? 'verified'
                                      : payment.status === 'FAILED'
                                        ? 'rejected'
                                        : 'pending'
                                  }
                                  className="text-xs"
                                >
                                  {payment.status}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <CalendarDays className="w-3 h-3" />
                                  {formatDateIN(payment.paymentDate)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <CreditCard className="w-3 h-3" />
                                  {payment.paymentMethod || 'Online'}
                                </span>
                              </div>
                              {payment.transactionId && (
                                <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                                  <span className="text-slate-600 dark:text-slate-400">
                                    Transaction ID:{' '}
                                  </span>
                                  <span className="font-mono text-slate-900 dark:text-slate-100">
                                    {payment.transactionId}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Documents
                    </div>
                    {/* <Button size={'sm'}>
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button> */}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documents.map((document) => (
                      <DocumentCard
                        key={document.id}
                        studentDocument={document}
                        // onDelete={handleDeleteDocument}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parents" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2">
                {parents.map((parentStudent, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          {parentStudent.relationship}
                          {parentStudent.isPrimary}
                          {parentStudent.isPrimary && (
                            <Badge variant="COUNSELING" className="text-xs">
                              Primary
                            </Badge>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Name
                        </label>
                        <p className="font-medium">
                          {parentStudent.parent.firstName}{' '}
                          {parentStudent.parent.lastName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Email
                        </label>
                        <p className="font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {parentStudent.parent.email}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Phone
                        </label>
                        <p className="font-medium flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {parentStudent.parent.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          WhatsApp
                        </label>
                        <p className="font-medium">
                          {parentStudent.parent.whatsAppNumber}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentAdminRoute;
