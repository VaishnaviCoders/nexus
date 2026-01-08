'use client';

import { useMemo, useTransition } from 'react';
import { format } from 'date-fns';
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
  MapPin,
  Users,
  FileText,
  Download,
  CheckCircle,
  Award,
  Share,
  Copy,
  CalendarPlus,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
  Clock,
  User,
  Home,
} from 'lucide-react';
import { toast } from 'sonner';
import { Prisma } from '@/generated/prisma/client';
import { ExamMode, ExamStatus } from '@/generated/prisma/enums';
import { enrollStudentToExam } from '@/lib/data/exam/enroll-student-to-exam';
import { formatDateTimeIN } from '@/lib/utils';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import HallTicketUI from './HallTicketUI';

type Exam = {
  id: string;
  title: string;
  description: string | null;
  maxMarks: number;
  passingMarks: number | null;
  startDate: Date;
  endDate: Date | null;
  status: ExamStatus;
  mode: ExamMode;
  venue: string | null;
  venueMapUrl: string | null;
  instructions: string | null;
  isResultsPublished: boolean;
  durationInMinutes: number | null;
  subject: {
    id: string;
    name: string;
    code: string;
    description: string | null;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  examSession: {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
  };
  organization: {
    name: string | null;
    logo: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    website: string | null;
  };
  grade: {
    id: string;
    grade: string;
  };
  section: {
    id: string;
    name: string;
    classTeacher: {
      id: string;
      user: {
        firstName: string;
        lastName: string;
      };
    } | null;
  };
};

type Enrollment = Prisma.ExamEnrollmentGetPayload<{}>;

type Result = Prisma.ExamResultGetPayload<{}>;

type HallTicket = Prisma.HallTicketGetPayload<{
  include: {
    organization: {
      select: {
        name: true;
        logo: true;
        contactEmail: true;
        contactPhone: true;
        website: true;
      };
    };
    student: {
      select: {
        firstName: true;
        lastName: true;
        rollNumber: true;
        profileImage: true;
        email: true;
        phoneNumber: true;
        grade: { select: { grade: true } };
        section: { select: { name: true } };
      };
    };
    examSession: {
      select: {
        title: true;
        startDate: true;
        endDate: true;
      };
    };
    exam: {
      select: {
        id: true;
        title: true;
        startDate: true;
        endDate: true;
        venue: true;
        mode: true;
        durationInMinutes: true;
        subject: { select: { name: true; code: true } };
      };
    };
  };
}>;

type ExamResultSummary = {
  obtainedMarks: number | null;
  percentage: number | null;
  isPassed: boolean | null;
  isAbsent: boolean;
};

interface ExamDetailsPageProps {
  exam: Exam;
  studentId: string;
  enrollment: Enrollment | null;
  result: Result | null;
  hallTicket: HallTicket | null;
  examResults: ExamResultSummary[];
  totalEnrolled: number;
}

export function ExamDetailsPage({
  exam,
  studentId,
  enrollment,
  result,
  hallTicket,
  examResults,
  totalEnrolled,
}: ExamDetailsPageProps) {
  const [isEnrolling, startTransition] = useTransition();

  const startDate = new Date(exam.startDate);
  const endDate = exam.endDate
    ? new Date(exam.endDate)
    : new Date(startDate.getTime() + (exam.durationInMinutes || 60) * 60000);

  function copyExamId(examId: string) {
    navigator.clipboard
      .writeText(examId)
      .then(() => toast.success('Exam ID copied to clipboard.'))
      .catch(() => toast.error('Unable to copy exam ID. Please try again.'));
  }

  function shareExam(examTitle: string) {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      navigator
        .share({
          title: examTitle,
          text: 'Check this exam details.',
          url,
        })
        .catch(() => { });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Shareable link copied to clipboard.');
    }
  }

  function addToCalendar(exam: Exam, startDate: Date, endDate: Date) {
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(exam.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(exam.description || '')}&location=${encodeURIComponent(exam.venue || '')}`;

    window.open(googleCalendarUrl, '_blank');
    toast.success('Opening calendar...');
  }

  const handleEnroll = async () => {
    startTransition(async () => {
      try {
        const enrollResult = await enrollStudentToExam(exam.id);

        if (enrollResult.error) {
          toast.error(enrollResult.error);
        } else {
          toast.success('Successfully enrolled in exam!');
        }
      } catch (error) {
        console.error('Enrollment failed:', error);
        toast.error('Failed to enroll. Please try again.');
      }
    });
  };

  const handleDownloadHallTicket = () => {
    if (hallTicket?.pdfUrl) {
      window.open(hallTicket.pdfUrl, '_blank');
      toast.success('Opening hall ticket...');
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    // If we have totalEnrolled passed from parent, use it.
    // Otherwise fall back to examResults length (for backward compatibility or if not passed)
    const total = totalEnrolled || examResults.length;

    if (total === 0) {
      return {
        totalEnrolled: 0,
        totalAttended: 0,
        totalAbsent: 0,
        attendanceRate: 0,
        passRate: 0,
        averageScore: 0,
        averagePercentage: 0,
        topScore: 0,
        topScorePercentage: 0,
        passingMarks: exam.passingMarks || Math.round(exam.maxMarks * 0.4),
      };
    }

    const attended = examResults.filter((r) => !r.isAbsent);
    const totalAttended = attended.length;
    // Calculate absent based on total enrolled minus attended
    // This handles cases where examResults might only contain results for those who took it,
    // OR if examResults is empty but we have enrollments.
    // However, if examResults IS empty, we can't really know who is absent/attended yet
    // unless the exam is over.
    // For now, if no results are published, we assume 0 attended.

    // If examResults is empty but we have totalEnrolled, it means exam hasn't happened or results aren't out.
    // So all stats based on results should be 0.
    if (examResults.length === 0) {
      return {
        totalEnrolled: total,
        totalAttended: 0,
        totalAbsent: 0,
        attendanceRate: 0,
        passRate: 0,
        averageScore: 0,
        averagePercentage: 0,
        topScore: 0,
        topScorePercentage: 0,
        passingMarks: exam.passingMarks || Math.round(exam.maxMarks * 0.4),
      };
    }

    const totalAbsent = examResults.filter((r) => r.isAbsent).length;
    const passedCount = examResults.filter((r) => r.isPassed === true).length;

    const totalMarks = attended.reduce(
      (sum, r) => sum + (r.obtainedMarks || 0),
      0
    );
    const topScore = Math.max(0, ...attended.map((r) => r.obtainedMarks || 0));

    const averageScore = totalAttended > 0 ? totalMarks / totalAttended : 0;
    const averagePercentage =
      totalAttended > 0 ? (averageScore / exam.maxMarks) * 100 : 0;

    return {
      totalEnrolled: total,
      totalAttended,
      totalAbsent,
      attendanceRate: (totalAttended / total) * 100,
      passRate: (passedCount / total) * 100,
      averageScore,
      averagePercentage,
      topScore,
      topScorePercentage: topScore > 0 ? (topScore / exam.maxMarks) * 100 : 0,
      passingMarks: exam.passingMarks || Math.round(exam.maxMarks * 0.4),
    };
  }, [examResults, exam.maxMarks, exam.passingMarks, totalEnrolled]);

  return (
    <div className="space-y-4 px-2">
      <Card className="border-b">
        <CardHeader>
          <CardTitle className="text-lg">{exam.title}</CardTitle>
          <CardDescription>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium">{exam.subject?.name}</span>
              <span>•</span>
              <span className="font-medium">{exam.subject?.code}</span>
              <Badge variant={exam.status} className="gap-2">
                <div
                  className={`${exam.status === 'LIVE' ? 'h-2 w-2 rounded-full bg-green-500 animate-pulse' : ''}`}
                ></div>
                {exam.status}
              </Badge>
              <Badge variant="outline">{exam.mode}</Badge>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  STARTS
                </div>
                <div className="font-semibold text-gray-900">
                  {format(startDate, 'd MMM, hh:mm a')}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  ENDS
                </div>
                <div className="font-semibold text-gray-900">
                  {format(endDate, 'd MMM, hh:mm a')}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  DURATION
                </div>
                <div className="font-semibold text-gray-900">
                  {exam.durationInMinutes || 60} mins
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-4">
              {enrollment ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {enrollment.status === 'ENROLLED'
                    ? 'Enrolled'
                    : enrollment.status}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                  Not Enrolled
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => addToCalendar(exam, startDate, endDate)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CalendarPlus className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareExam(exam.title)}
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyExamId(exam.id)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy ID
              </Button>
            </div>
          </div>

          {!enrollment && exam.status === 'UPCOMING' && (
            <Card className="mt-8 border-blue-200 bg-blue-50/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">
                      Enrollment Required
                    </h3>
                    <p className="text-blue-700 text-sm">
                      You need to enroll to participate in this exam and access
                      hall tickets.
                    </p>
                  </div>
                  <Button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {enrollment &&
            (exam.status === 'UPCOMING' || exam.status === 'LIVE') &&
            (hallTicket ? (
              <Card className="mt-8 border-blue-200 bg-blue-50/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">
                        Download Hall Ticket
                      </h3>
                      <p className="text-blue-700 text-sm">
                        Your hall ticket is available for this exam. Please
                        download and keep a copy handy for entry.
                      </p>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Download Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Hall Ticket</DialogTitle>
                          <DialogDescription>
                            Review your hall ticket before downloading.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <HallTicketUI data={hallTicket} />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="mt-8 border-yellow-200 bg-yellow-50/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-900 mb-1">
                        Hall Ticket Pending
                      </h3>
                      <p className="text-yellow-700 text-sm">
                        You are enrolled for this exam, but the hall ticket has
                        not been issued yet. It will be available closer to the
                        exam date.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Exam Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Participation Card */}
            <Card className="shadow-sm border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Participation
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stats.attendanceRate.toFixed(0)}%
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {stats.totalAttended}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      out of {stats.totalEnrolled} enrolled
                    </div>
                  </div>

                  <Progress
                    value={stats.attendanceRate}
                    className="h-2 bg-blue-200 dark:bg-blue-800"
                  />

                  <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {stats.totalAttended} attended
                    </span>
                    <span className="flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {stats.totalAbsent} absent
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pass Rate Card */}
            {/* /bg-gradient-to-br */}
            <Card className="shadow-sm border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Success Rate
                    </span>
                  </div>
                  <Badge
                    variant={
                      stats.passRate >= 75
                        ? 'EXCELLENT'
                        : stats.passRate >= 50
                          ? 'GOOD'
                          : 'BELOW_AVERAGE'
                    }
                    className="text-xs"
                  >
                    {stats.passRate >= 75
                      ? 'Excellent'
                      : stats.passRate >= 50
                        ? 'Good'
                        : 'Needs Improvement'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {stats.passRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      students passed
                    </div>
                  </div>

                  <Progress
                    value={stats.passRate}
                    className="h-2 bg-green-200 dark:bg-green-800"
                  />

                  <div className="text-xs text-green-600 dark:text-green-400">
                    Passing threshold: {stats.passingMarks}/{exam.maxMarks}{' '}
                    marks
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average Performance Card */}
            <Card className="shadow-sm border-orange-200 dark:border-orange-800">

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                      Class Average
                    </span>
                  </div>
                  <Badge
                    variant={
                      stats.averagePercentage >= 75
                        ? 'PASS'
                        : stats.averagePercentage >= 50
                          ? 'AVERAGE'
                          : 'ABSENT'
                    }
                    className="text-xs"
                  >
                    {stats.averagePercentage.toFixed(0)}%
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {stats.averageScore > 0
                        ? stats.averageScore.toFixed(1)
                        : '—'}
                    </div>
                    <div className="text-xs text-orange-600 dark:text-orange-400">
                      out of {exam.maxMarks} marks
                    </div>
                  </div>

                  <Progress
                    value={stats.averagePercentage}
                    className="h-2 bg-orange-200 dark:bg-orange-800"
                  />

                  <div className="text-xs text-orange-600 dark:text-orange-400">
                    {stats.averagePercentage >= 75
                      ? 'Above expectations'
                      : stats.averagePercentage >= 50
                        ? 'Meeting expectations'
                        : 'Below expectations'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performance Card */}
            <Card className="shadow-sm border-purple-200 dark:border-purple-800">

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      Highest Score
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-purple-300"
                  >
                    Top Performer
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {stats.topScore > 0 ? stats.topScore.toFixed(1) : '—'}
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400">
                      out of {exam.maxMarks} marks
                    </div>
                  </div>

                  <Progress
                    value={stats.topScorePercentage}
                    className="h-2 bg-purple-200 dark:bg-purple-800"
                  />

                  <div className="text-xs text-purple-600 dark:text-purple-400">
                    {stats.topScorePercentage >= 90
                      ? 'Outstanding performance'
                      : stats.topScorePercentage >= 75
                        ? 'Excellent performance'
                        : 'Good performance'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="venue">Venue</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Overview</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Subject:</span>
                  <span className="font-medium">
                    {exam.subject?.name} ({exam.subject?.code})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-medium">
                    {formatDateTimeIN(exam.startDate)} –{' '}
                    {formatDateTimeIN(exam.endDate)}
                  </span>
                </div>

                {exam.durationInMinutes && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {exam.durationInMinutes} minutes
                    </span>
                  </div>
                )}

                {exam.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Venue:</span>
                    <span className="font-medium">{exam.venue}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Max Marks:</span>
                  <span className="font-medium">{exam.maxMarks}</span>
                  {exam.passingMarks && (
                    <span className="text-muted-foreground">
                      (Passing: {exam.passingMarks})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Mode:</span>
                  <Badge variant="outline">{exam.mode}</Badge>
                </div>

                {exam.examSession?.title && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Session:</span>
                    <span className="font-medium">
                      {exam.examSession.title}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">{exam.status}</span>
                </div>

                {exam.description && (
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <span className="text-muted-foreground">
                        Description:
                      </span>
                      <p className="font-medium mt-1">{exam.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructions">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Instructions</h3>
              {exam.instructions ? (
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {exam.instructions}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No specific instructions provided for this exam.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="venue">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">Venue</h3>
              {exam.venue ? (
                <div className="flex items-start gap-3">
                  <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{exam.venue}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Please arrive 30 minutes before the exam starts.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Venue information will be updated soon.
                </p>
              )}
              {exam.venueMapUrl && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <Link
                      href={exam.venueMapUrl}
                      className="underline text-primary"
                      target="_blank"
                    >
                      {exam.venueMapUrl}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click this link to view the location
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <div className="space-y-6">
            {enrollment && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Hall Ticket
                  </h3>
                  {hallTicket &&
                    (exam.status === 'UPCOMING' || exam.status === 'LIVE') ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">
                            Hall Ticket Available
                          </p>
                          <p className="text-sm text-green-700">
                            Generated on{' '}
                            {format(new Date(hallTicket.generatedAt), 'PPP')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleDownloadHallTicket} size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Link href={`/dashboard/exams/${exam.id}/hall-ticket`}>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View Full Ticket
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        {exam.status === 'COMPLETED'
                          ? 'Hall ticket is no longer available'
                          : 'Hall ticket will be available closer to exam date'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Exam Results
                </h3>
                {result &&
                  exam.isResultsPublished &&
                  exam.status === 'COMPLETED' ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {result.obtainedMarks}
                        </div>
                        <div className="text-sm text-blue-700">
                          Marks Obtained
                        </div>
                        <div className="text-xs text-muted-foreground">
                          out of {exam.maxMarks}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {result.percentage?.toFixed(1)}%
                        </div>
                        <div className="text-sm text-green-700">Percentage</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {result.gradeLabel || 'N/A'}
                        </div>
                        <div className="text-sm text-purple-700">Grade</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <Badge
                        variant={result.isPassed ? 'PASS' : 'FAILED'}
                        className="px-4 py-2"
                      >
                        {result.isPassed ? 'PASSED' : 'FAILED'}
                      </Badge>
                      {result.isAbsent && (
                        <Badge variant="absent" className="px-4 py-2">
                          ABSENT
                        </Badge>
                      )}
                    </div>

                    {result.remarks && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Remarks</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {exam.status !== 'COMPLETED'
                        ? 'Results will be available after the exam is completed'
                        : !exam.isResultsPublished
                          ? 'Results are being processed and will be published soon'
                          : !enrollment
                            ? 'Enroll in the exam to view results'
                            : 'No results available'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
