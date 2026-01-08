'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Users,
  Download,
  CheckCircle,
  Award,
  Trophy,
  XCircle,
  Target,
  TrendingUp,
  Search,
  Bell,
  FileCheck,
  Eye,
  BarChart3,
  GraduationCap,
  BookOpen,
  Calendar,
  UserCheck,
  UserX,
  ClipboardList,
} from 'lucide-react';
import { toast } from 'sonner';
import ExamResultsForm from '@/components/dashboard/exam/ExamResultsForm';
import { formatDateIN, formatDateTimeIN } from '@/lib/utils';
import type {
  AdminExamManagementPageProps,
  StudentDataWithStatus,
  ExamStatistics,
  EnrollmentFilterType,
  TabType,
} from '@/types/exam';
import { ExamStatus } from '@/generated/prisma/enums';
import { issueHallTicketsForExam } from '@/lib/data/exam/issue-hall-tickets-for-exam';
import { notifyStudentsForExamEnrollment } from '@/lib/data/exam/notify-student-for-exam';
import { enrollStudentsByAdmin } from '@/lib/data/exam/enroll-students-by-admin';

export function AdminExamManagementPage({
  exam,
  students,
  enrollments,
  results,
  hallTickets,
}: AdminExamManagementPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollmentFilter, setEnrollmentFilter] =
    useState<EnrollmentFilterType>('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [notifyDialog, setNotifyDialog] = useState(false);
  const [issueHallTicketDialog, setIssueHallTicketDialog] = useState(false);
  const [studentsToNotify, setStudentsToNotify] = useState<string[]>([]);
  const [studentsToIssueTickets, setStudentsToIssueTickets] = useState<
    string[]
  >([]);

  // Create lookup maps for O(1) access
  const enrollmentMap = useMemo(
    () => new Map(enrollments.map((e) => [e.studentId, e])),
    [enrollments]
  );

  const resultMap = useMemo(
    () => new Map(results.map((r) => [r.studentId, r])),
    [results]
  );

  const hallTicketMap = useMemo(
    () => new Map(hallTickets.map((h) => [h.studentId, h])),
    [hallTickets]
  );

  // Combine student data with their status
  const studentsData: StudentDataWithStatus[] = useMemo(() => {
    return students.map((student) => {
      const enrollment = enrollmentMap.get(student.id);
      const result = resultMap.get(student.id);
      const hallTicket = hallTicketMap.get(student.id);

      return {
        ...student,
        isEnrolled: !!enrollment,
        enrollmentStatus: enrollment?.status,
        enrollmentId: enrollment?.id,
        result,
        hallTicket,
      };
    });
  }, [students, enrollmentMap, resultMap, hallTicketMap]);

  // Calculate comprehensive statistics
  const stats: ExamStatistics = useMemo(() => {
    const enrolled = studentsData.filter((s) => s.isEnrolled);
    const notEnrolled = studentsData.filter((s) => !s.isEnrolled);

    // Only consider results from enrolled students
    const enrolledIds = new Set(enrolled.map((s) => s.id));
    const enrolledResults = results.filter((r) => enrolledIds.has(r.studentId));

    // Calculate appeared, passed, absent
    const appeared = enrolledResults.filter((r) => !r.isAbsent);
    const passed = appeared.filter((r) => r.isPassed);
    const absent = enrolledResults.filter((r) => r.isAbsent);

    const ticketsIssued = enrolled.filter((s) => s.hallTicket);

    // Calculate averages
    const totalMarks = appeared.reduce(
      (sum, r) => sum + (r.obtainedMarks || 0),
      0
    );
    const avgMarks = appeared.length > 0 ? totalMarks / appeared.length : 0;
    const avgPercent = avgMarks > 0 ? (avgMarks / exam.maxMarks) * 100 : 0;

    // Find top score
    const topScore =
      appeared.length > 0
        ? Math.max(...appeared.map((r) => r.obtainedMarks || 0))
        : 0;

    // Calculate passing marks
    const passingMarks = exam.passingMarks ?? Math.ceil(exam.maxMarks * 0.33);

    // Calculate rates
    const enrollmentRate =
      studentsData.length > 0
        ? (enrolled.length / studentsData.length) * 100
        : 0;

    const attendanceRate =
      enrolled.length > 0 ? (appeared.length / enrolled.length) * 100 : 0;

    const successRate =
      enrolled.length > 0 ? (passed.length / enrolled.length) * 100 : 0;

    return {
      totalStudents: studentsData.length,
      enrolled: enrolled.length,
      notEnrolled: notEnrolled.length,
      appeared: appeared.length,
      passed: passed.length,
      failed: appeared.length - passed.length,
      absent: absent.length,
      ticketsIssued: ticketsIssued.length,
      avgMarks: Math.round(avgMarks * 100) / 100,
      avgPercent: Math.round(avgPercent * 100) / 100,
      topScore,
      topScorePercent: topScore > 0 ? (topScore / exam.maxMarks) * 100 : 0,
      passingMarks,
      enrollmentRate,
      attendanceRate,
      successRate,
    };
  }, [studentsData, results, exam.maxMarks, exam.passingMarks]);

  // Filter students based on tab and search criteria
  const getFilteredStudents = (tab: TabType): StudentDataWithStatus[] => {
    let filtered = studentsData;

    // Apply enrollment filter
    if (enrollmentFilter === 'enrolled') {
      filtered = filtered.filter((s) => s.isEnrolled);
    } else if (enrollmentFilter === 'not-enrolled') {
      filtered = filtered.filter((s) => !s.isEnrolled);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.firstName.toLowerCase().includes(query) ||
          s.lastName.toLowerCase().includes(query) ||
          s.rollNumber.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query)
      );
    }

    // Tab-specific filtering
    if (tab === 'results') {
      filtered = filtered.filter((s) => s.isEnrolled);
    }

    return filtered;
  };

  // Get counts for selected students
  const getSelectedCounts = () => {
    const notEnrolledCount = selectedStudents.filter((id) => {
      const student = studentsData.find((s) => s.id === id);
      return !student?.isEnrolled;
    }).length;

    const needsTicketCount = selectedStudents.filter((id) => {
      const student = studentsData.find((s) => s.id === id);
      return student?.isEnrolled && !student?.hallTicket;
    }).length;

    return { notEnrolledCount, needsTicketCount };
  };

  const { notEnrolledCount, needsTicketCount } = getSelectedCounts();

  // Handlers
  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = (students: StudentDataWithStatus[]) => {
    const ids = students.map((s) => s.id);
    setSelectedStudents((prev) => (prev.length === ids.length ? [] : ids));
  };

  const handleNotifyEnrollment = () => {
    // if (selectedStudents.length === 0) {
    //   toast.error('Please select at least one student');
    //   return;
    // }

    // Filter only non-enrolled students
    const eligibleStudents = selectedStudents.filter((id) => {
      const student = studentsData.find((s) => s.id === id);
      return !student?.isEnrolled;
    });

    // if (eligibleStudents.length === 0) {
    //   toast.error('Selected students are already enrolled');
    //   return;
    // }

    setStudentsToNotify(eligibleStudents);
    setNotifyDialog(true);
  };

  const handleConfirmNotify = async () => {
    try {
      await notifyStudentsForExamEnrollment(studentsToNotify, exam.id);
      console.log('Notify students:', studentsToNotify);
      toast.success(
        `Enrollment notification sent to ${studentsToNotify.length} student(s)`
      );
      setNotifyDialog(false);
      setStudentsToNotify([]);
      setSelectedStudents([]);
    } catch (error) {
      toast.error('Failed to send notifications');
    }
  };

  const handleBulkEnroll = async () => {
    if (selectedStudents.length === 0) return;

    // Filter only non-enrolled students
    const eligibleStudents = selectedStudents.filter((id) => {
      const student = studentsData.find((s) => s.id === id);
      return !student?.isEnrolled;
    });

    if (eligibleStudents.length === 0) {
      toast.info('Selected students are already enrolled');
      return;
    }

    try {
      toast.loading('Enrolling students...');
      const result = await enrollStudentsByAdmin(exam.id, eligibleStudents);
      toast.dismiss();

      if (result.success) {
        toast.success(result.message);
        setSelectedStudents([]);
      } else {
        toast.error(result.error || 'Failed to enroll students');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('An unexpected error occurred');
    }
  };

  const handleIssueHallTickets = () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }

    // Filter only enrolled students without hall tickets
    const eligibleStudents = selectedStudents.filter((id) => {
      const student = studentsData.find((s) => s.id === id);
      return student?.isEnrolled && !student?.hallTicket;
    });

    if (eligibleStudents.length === 0) {
      toast.error(
        'Selected students are either not enrolled or already have hall tickets'
      );
      return;
    }

    setStudentsToIssueTickets(eligibleStudents);
    setIssueHallTicketDialog(true);
  };

  const handleConfirmIssueHallTickets = async () => {
    try {
      await issueHallTicketsForExam(studentsToIssueTickets, exam.id);
      console.log('Issue hall tickets for:', studentsToIssueTickets);
      toast.success(
        `Hall tickets issued to ${studentsToIssueTickets.length} student(s)`
      );
      setIssueHallTicketDialog(false);
      setStudentsToIssueTickets([]);
      setSelectedStudents([]);
    } catch (error) {
      toast.error('Failed to issue hall tickets');
    }
  };

  const handleExport = () => {
    toast.info('Export functionality coming soon');
  };

  return (
    <div className="space-y-6 px-2">
      {/* Exam Header */}
      <Card className="border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{exam.title}</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {exam.subject.name} ({exam.subject.code})
                  </CardDescription>
                </div>
              </div>

              {/* Grade & Section */}
              {exam.grade && exam.section && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Grade {exam.grade.grade} - {exam.section.name}
                  </Badge>
                  {exam.section.classTeacher?.user && (
                    <Badge variant="outline" className="gap-1.5">
                      <UserCheck className="h-3.5 w-3.5" />
                      {exam.section.classTeacher.user.firstName}{' '}
                      {exam.section.classTeacher.user.lastName}
                    </Badge>
                  )}
                </div>
              )}

              {/* Session & Status */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {exam.examSession.title}
                </Badge>
                <Badge variant={exam.status as ExamStatus}>{exam.status}</Badge>
                <Badge variant="secondary">{exam.mode}</Badge>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-blue-600 font-medium">
                  START DATE
                </div>
                <div className="font-semibold text-sm text-blue-900">
                  {formatDateTimeIN(exam.startDate)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 border border-purple-200">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-purple-600 font-medium">
                  END DATE
                </div>
                <div className="font-semibold text-sm text-purple-900">
                  {formatDateTimeIN(exam.endDate)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-xs text-orange-600 font-medium">
                  DURATION
                </div>
                <div className="font-semibold text-sm text-orange-900">
                  {exam.durationInMinutes || 60} minutes
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Enrollment Status */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Enrollment
                  </p>
                  <p className="text-xs text-blue-600">
                    {stats.enrollmentRate.toFixed(0)}% enrolled
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Enrolled</span>
                <span className="font-semibold text-blue-900">
                  {stats.enrolled}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Not Enrolled</span>
                <span className="font-semibold text-blue-900">
                  {stats.notEnrolled}
                </span>
              </div>
              <Progress
                value={stats.enrollmentRate}
                className="h-2 bg-blue-100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Attendance Rate */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700">
                    Attendance
                  </p>
                  <p className="text-xs text-green-600">
                    {stats.attendanceRate.toFixed(0)}% present
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Appeared</span>
                <span className="font-semibold text-green-900">
                  {stats.appeared}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Absent</span>
                <span className="font-semibold text-green-900">
                  {stats.absent}
                </span>
              </div>
              <Progress
                value={stats.attendanceRate}
                className="h-2 bg-green-100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-700">
                    Success Rate
                  </p>
                  <p className="text-xs text-orange-600">
                    {stats.successRate.toFixed(1)}% passed
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Passed</span>
                <span className="font-semibold text-orange-900">
                  {stats.passed}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Failed</span>
                <span className="font-semibold text-orange-900">
                  {stats.failed}
                </span>
              </div>
              <Progress
                value={stats.successRate}
                className="h-2 bg-orange-100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Top Score */}
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700">
                    Top Score
                  </p>
                  <p className="text-xs text-purple-600">
                    {stats.topScorePercent.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Highest</span>
                <span className="font-semibold text-purple-900">
                  {stats.topScore > 0 ? stats.topScore.toFixed(1) : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Average</span>
                <span className="font-semibold text-purple-900">
                  {stats.avgMarks > 0 ? stats.avgMarks.toFixed(1) : '—'}
                </span>
              </div>
              <Progress
                value={stats.topScorePercent}
                className="h-2 bg-purple-100"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="enrollment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="enrollment" className="gap-2">
            <Users className="h-4 w-4" />
            Enrollment
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileCheck className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Student Enrollment */}
        <TabsContent value="enrollment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Student Enrollment Management
              </CardTitle>
              <CardDescription>
                Manage student enrollments and hall tickets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, roll number, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={enrollmentFilter}
                  onValueChange={(v: EnrollmentFilterType) =>
                    setEnrollmentFilter(v)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="enrolled">Enrolled Only</SelectItem>
                    <SelectItem value="not-enrolled">Not Enrolled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk Actions */}
              {selectedStudents.length > 0 && (
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary rounded-lg p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {selectedStudents.length} student
                          {selectedStudents.length === 1 ? '' : 's'} selected
                        </p>
                        <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                          {notEnrolledCount > 0 && (
                            <span className="flex items-center gap-1">
                              <UserX className="h-3 w-3" />
                              {notEnrolledCount} not enrolled
                            </span>
                          )}
                          {needsTicketCount > 0 && (
                            <span className="flex items-center gap-1">
                              <FileCheck className="h-3 w-3" />
                              {needsTicketCount} need tickets
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {notEnrolledCount > 0 && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleBulkEnroll}
                          className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Enroll ({notEnrolledCount})
                        </Button>
                      )}
                      {notEnrolledCount > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNotifyEnrollment}
                          className="gap-2"
                        >
                          <Bell className="h-4 w-4" />
                          Notify ({notEnrolledCount})
                        </Button>
                      )}
                      {needsTicketCount > 0 && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleIssueHallTickets}
                          className="gap-2"
                        >
                          <FileCheck className="h-4 w-4" />
                          Issue Tickets ({needsTicketCount})
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStudents([])}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Students Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedStudents.length ===
                            getFilteredStudents('enrollment').length &&
                            getFilteredStudents('enrollment').length > 0
                          }
                          onCheckedChange={() =>
                            handleSelectAll(getFilteredStudents('enrollment'))
                          }
                        />
                      </TableHead>
                      <TableHead>Student Details</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Enrollment Status</TableHead>
                      <TableHead>Hall Ticket</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredStudents('enrollment').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                          <p className="text-muted-foreground font-medium">
                            No students found
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Try adjusting your search or filters
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredStudents('enrollment').map((student) => (
                        <TableRow
                          key={student.id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedStudents.includes(student.id)}
                              onCheckedChange={() =>
                                handleSelectStudent(student.id)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-semibold text-primary">
                                  {student.firstName[0]}
                                  {student.lastName[0]}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">
                                  {student.firstName} {student.lastName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {student.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {student.rollNumber}
                            </Badge>
                          </TableCell>
                          <TableCell className="truncate">
                            {student.isEnrolled ? (
                              <Badge variant="ENROLLED" className="gap-1.5">
                                <CheckCircle className="h-3 w-3" />
                                Enrolled
                              </Badge>
                            ) : (
                              <Badge variant="NOT_ENROLLED" className="gap-1.5">
                                <XCircle className="h-3 w-3" />
                                Not Enrolled
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="truncate">
                            {student.hallTicket ? (
                              <Badge
                                variant="HALL_TICKET_ISSUED"
                                className="gap-1.5"
                              >
                                <CheckCircle className="h-3 w-3" />
                                Issued
                              </Badge>
                            ) : (
                              <Badge
                                variant="HALL_TICKET_NOT_ISSUED"
                                className="gap-1.5"
                              >
                                <XCircle className="h-3 w-3" />
                                Not Issued
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {!student.isEnrolled ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedStudents([student.id]);
                                  handleNotifyEnrollment();
                                }}
                                className="gap-2"
                              >
                                <Bell className="h-4 w-4" />
                                Notify
                              </Button>
                            ) : !student.hallTicket ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedStudents([student.id]);
                                  handleIssueHallTickets();
                                }}
                                className="gap-2"
                              >
                                <FileCheck className="h-4 w-4" />
                                Issue
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  window.open(
                                    student.hallTicket?.pdfUrl,
                                    '_blank'
                                  )
                                }
                                className="gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Results Management */}
        <TabsContent value="results" className="space-y-4">
          <div>
            {exam.isResultsPublished && (
              <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-900">
                      Results Published
                    </p>
                    <p className="text-xs text-green-700">
                      Results are now visible to all students
                    </p>
                  </div>
                </div>
              </div>
            )}
            <ExamResultsForm
              exam={exam}
              students={students}
              existingResults={results}
              enrollments={enrollments}
            />
          </div>
        </TabsContent>

        {/* Tab 3: Report Cards */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Report Cards
              </CardTitle>
              <CardDescription>
                Generate and manage comprehensive report cards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Report Cards Coming Soon
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
                  Generate comprehensive report cards with subject-wise
                  performance, attendance, and overall grades for all students.
                </p>
                <Button disabled size="lg">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Generate Report Cards
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={notifyDialog} onOpenChange={setNotifyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle>Send Enrollment Notification</DialogTitle>
                <DialogDescription>
                  Notify {studentsToNotify.length} student
                  {studentsToNotify.length === 1 ? '' : 's'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center">
                    <Bell className="h-4 w-4 text-blue-700" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    What will happen?
                  </p>
                  <p className="text-sm text-blue-700">
                    Selected students will receive an email notification to
                    enroll for this exam. They can then access the enrollment
                    form and submit their enrollment.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setNotifyDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmNotify} className="flex-1 gap-2">
              <Bell className="h-4 w-4" />
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={issueHallTicketDialog}
        onOpenChange={setIssueHallTicketDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <DialogTitle>Issue Hall Tickets</DialogTitle>
                <DialogDescription>
                  Issue tickets to {studentsToIssueTickets.length} student
                  {studentsToIssueTickets.length === 1 ? '' : 's'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center">
                    <FileCheck className="h-4 w-4 text-green-700" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900 mb-1">
                    What will happen?
                  </p>
                  <p className="text-sm text-green-700">
                    Hall tickets will be generated as PDF documents and sent to
                    students' registered email addresses. Students can download
                    and print their hall tickets.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIssueHallTicketDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmIssueHallTickets}
              className="flex-1 gap-2"
            >
              <FileCheck className="h-4 w-4" />
              Issue Tickets
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
