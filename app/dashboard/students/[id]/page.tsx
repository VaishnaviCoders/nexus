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
import StudentPerformance from '@/components/dashboard/Student/StudentPerformance';
import { Badge } from '@/components/ui/badge';

import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrencyIN, formatDateIN } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

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
      prisma.studentDocument.findMany({
        where: { studentId },
        orderBy: { uploadedAt: 'desc' },
      }),
      prisma.performance.findMany({
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
    totalFees,
    paidFees,
    pendingFees,
    parents,
    documents,
    performance,
    fees,
  } = studentData;

  const averageGrade =
    performance.length > 0
      ? performance.reduce(
          (sum, p) => sum + (p.obtainedMarks / p.exam.maxMarks) * 100,
          0
        ) / performance.length
      : 0;
  const upcomingExams = 3; // This would come from actual exam data
  const pendingAssignments = 5; // This would come from actual assignment data

  return (
    <div className="">
      <div className="mx-2 space-y-8 pb-8">
        <div className="bg-gradient-to-r from-white via-blue-50/50 to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-8  backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex items-center space-x-8">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-700  ring-4 ring-blue-100 dark:ring-blue-900/30">
                  <AvatarImage
                    src={
                      student?.profileImage ||
                      student?.user.profileImage ||
                      '/placeholder.svg?height=96&width=96'
                    }
                    alt="Student"
                  />
                  <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {student?.firstName?.[0]}
                    {student?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white dark:border-slate-700 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                    {student?.firstName} {student?.lastName}
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-medium"
                    >
                      Roll No: {student?.rollNumber}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-indigo-200 text-indigo-700 dark:border-indigo-700 dark:text-indigo-300"
                    >
                      {student?.grade.grade} - {student?.section?.name}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                    <Mail className="w-4 h-4 text-blue-500" />
                    {student?.email}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                    <Phone className="w-4 h-4 text-green-500" />
                    {student?.phoneNumber}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                <Link href={`/dashboard/students/${student?.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>

              <Button
                variant="outline"
                className="border-indigo-200 hover:bg-indigo-50 dark:border-indigo-700 dark:hover:bg-indigo-900/20 bg-transparent"
              >
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2 border-green-200/50 dark:border-green-800/50 bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-950/10 hover:shadow-sm hover:scale-105 transition-all duration-300 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-t-lg">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Attendance Rate
              </CardTitle>
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50 shadow-sm">
                <CalendarDays className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                {Math.round(attendanceRate)}%
              </div>
              <div className="w-full bg-green-100 dark:bg-green-900/30 rounded-full h-2 mb-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${attendanceRate}%` }}
                ></div>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center font-medium">
                <CheckCircle className="w-3 h-3 mr-1" />
                {attendanceRate >= 90
                  ? 'Excellent'
                  : attendanceRate >= 75
                    ? 'Good'
                    : 'Needs Improvement'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/10 hover:shadow-sm hover:scale-105 transition-all duration-300 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-t-lg">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Average Grade
              </CardTitle>
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 shadow-sm">
                <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-1">
                {averageGrade >= 90
                  ? 'A+'
                  : averageGrade >= 80
                    ? 'A'
                    : averageGrade >= 70
                      ? 'B+'
                      : averageGrade >= 60
                        ? 'B'
                        : 'C'}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mb-2">
                {Math.round(averageGrade)}% Average
              </p>
              <div className="flex items-center text-xs text-purple-600 dark:text-purple-400 font-medium">
                <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                {averageGrade >= 80 ? 'Above Average' : 'Average Performance'}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/10 hover:shadow-sm hover:scale-105 transition-all duration-300 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-t-lg">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Upcoming Exams
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 shadow-sm">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                {upcomingExams}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                Next: Mathematics
              </p>
              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium">
                <Clock className="w-3 h-3 mr-1" />5 days remaining
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-900 dark:to-orange-950/10 hover:shadow-sm hover:scale-105 transition-all duration-300 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-t-lg">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Pending Fees
              </CardTitle>
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50 shadow-sm">
                <IndianRupee className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-1">
                ₹{formatCurrencyIN(pendingFees)}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mb-2">
                Due this month
              </p>
              <div className="flex items-center text-xs text-orange-600 dark:text-orange-400 font-medium">
                <AlertCircle className="w-3 h-3 mr-1" />
                {pendingFees > 0 ? 'Payment Required' : 'All Clear'}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className=" rounded-xl">
          <Tabs defaultValue="overview" className="space-y-0">
            <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-100 to-blue-50/30 dark:from-slate-800 dark:to-slate-700 rounded-t-xl">
              <TabsList className="grid w-full grid-cols-6 bg-transparent h-14 p-1">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="academic"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium"
                >
                  Academic
                </TabsTrigger>
                <TabsTrigger
                  value="attendance"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium"
                >
                  Attendance
                </TabsTrigger>
                <TabsTrigger
                  value="fees"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium"
                >
                  Fees
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium"
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="parents"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-medium"
                >
                  Parents
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
                                    (record.obtainedMarks /
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
                  <StudentPerformance />
                </div>
              </TabsContent>

              <TabsContent value="attendance" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-5 h-5" />
                        Attendance Management
                      </div>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Mark Attendance
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <div className="text-center">
                        <CalendarDays className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>
                          Detailed attendance tracking will be displayed here
                        </p>
                      </div>
                    </div>
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
                    <CardContent className="space-y-6 pt-6">
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
                            Paid Amount
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
                        Student Documents
                      </div>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Document
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-blue-500" />
                            <div>
                              <p className="font-medium">
                                {doc.type.replace('_', ' ')}
                              </p>
                              <p className="text-sm text-slate-500">
                                Uploaded: {formatDateIN(doc.uploadedAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.verified ? (
                              <Badge variant="verified" className="gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </Badge>
                            ) : doc.rejected ? (
                              <Badge variant="rejected" className="gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Rejected
                              </Badge>
                            ) : (
                              <Badge variant="pending" className="gap-1">
                                <Clock className="w-3 h-3" />
                                Pending
                              </Badge>
                            )}
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
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
                            {parentStudent.isPrimary && (
                              <Badge variant="default" className="text-xs">
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
    </div>
  );
};

export default StudentAdminRoute;
