'use client';

import { useState, useMemo } from 'react';
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
  MapIcon,
  MapPinCheckIcon,
  Home,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Exam,
  ExamEnrollment,
  ExamResult,
  HallTicket,
  Subject,
  ExamSession,
} from '@/generated/prisma';
import { enrollStudentToExam } from '@/lib/data/exam/enroll-student-to-exam';
import { formatDateTimeIN } from '@/lib/utils';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

function onCopy(examId: string) {
  navigator.clipboard
    .writeText(examId)
    .then(() => toast.success('Exam ID copied to clipboard.'))
    .catch(() => toast.error('Unable to copy exam ID. Please try again.'));
}

function onShare(examTitle: string) {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  if (navigator.share) {
    navigator
      .share({
        title: examTitle,
        text: 'Check this exam details.',
        url,
      })
      .catch(() => {
        // ignore cancel
      });
  } else {
    navigator.clipboard.writeText(url);
    toast.success('Shareable link copied to clipboard.');
  }
}

function onAddCalendar(exam: any, start: Date, end: Date) {
  // Simple calendar event creation - in production you'd use a proper ICS library
  const event = {
    title: exam.title,
    start: start.toISOString(),
    end: end.toISOString(),
    description: exam.description || '',
    location: exam.venue || '',
  };

  // Create a simple calendar URL for Google Calendar
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

  window.open(googleCalendarUrl, '_blank');
  toast.success('Opening calendar...');
}

// Define the complete exam type with includes
type ExamWithIncludes = Exam & {
  subject: {
    id: string;
    name: string;
    code: string;
    description: string | null;
  };
  examSession: {
    id: string;
    title: string;
    description: string | null;
    startDate: Date;
    endDate: Date;
  };
  examResult: ExamResult[];
  examEnrollment: ExamEnrollment[];
  hallTickets: HallTicket[];
  _count: {
    examEnrollment: number;
    examResult: number;
  };
};

interface ExamDetailsPageProps {
  exam: ExamWithIncludes;
  studentId: string;
  enrolledStudentsCount: number;
  studentEnrollment: ExamEnrollment | null;
  studentResult: ExamResult | null;
  studentHallTicket: HallTicket | null;
  allExamResults: Array<{
    obtainedMarks: number | null;
    isPassed: boolean | null;
    isAbsent: boolean;
    percentage: number | null;
  }>;
}

export function ExamDetailsPage({
  exam,
  studentId,
  enrolledStudentsCount,
  studentEnrollment,
  studentResult,
  studentHallTicket,
  allExamResults,
}: ExamDetailsPageProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isHallTicketDownloading, setIsHallTicketDownloading] = useState(false);

  const startDate = new Date(exam.startDate);
  const endDate = exam.endDate
    ? new Date(exam.endDate)
    : new Date(startDate.getTime() + (exam.durationInMinutes || 60) * 60000);

  const getStatusConfig = (status: string) => {
    const configs = {
      UPCOMING: {
        variant: 'secondary' as const,
        className: 'bg-blue-50 text-blue-700 border-blue-200',
        text: 'UPCOMING',
      },
      LIVE: {
        variant: 'destructive' as const,
        className: 'bg-red-50 text-red-700 border-red-200',
        text: 'LIVE',
      },
      COMPLETED: {
        variant: 'default' as const,
        className: 'bg-green-50 text-green-700 border-green-200',
        text: 'COMPLETED',
      },
    };
    return configs[status as keyof typeof configs] || configs.UPCOMING;
  };

  const getModeConfig = (mode: string) => {
    return mode === 'ONLINE'
      ? {
          className: 'bg-purple-50 text-purple-700 border-purple-200',
          text: 'EXAM - ONLINE',
        }
      : {
          className: 'bg-gray-50 text-gray-700 border-gray-200',
          text: 'EXAM - OFFLINE',
        };
  };

  const statusConfig = getStatusConfig(exam.status);
  const modeConfig = getModeConfig(exam.mode);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      const result = await enrollStudentToExam(studentId, exam.id);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Successfully enrolled in exam!');
        // The page will revalidate automatically due to revalidatePath in the action
      }
    } catch (error) {
      console.error('Enrollment failed:', error);
      toast.error('Failed to enroll. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleDownloadHallTicket = () => {
    if (studentHallTicket?.pdfUrl) {
      window.open(studentHallTicket.pdfUrl, '_blank');
      toast.success('Opening hall ticket...');
    }
  };

  // Memoized calculations for better performance
  const examStats = useMemo(() => {
    if (allExamResults.length === 0) {
      return {
        passRate: 0,
        averageScore: 0,
        attendedCount: 0,
        absentCount: 0,
        attendanceRate: 0,
        averagePercentage: 0,
        passingMarks: exam.passingMarks || Math.round(exam.maxMarks * 0.4),
        topScore: 0,
        topScorePercentage: 0,
      };
    }

    const passedCount = allExamResults.filter((r) => r.isPassed).length;
    const attendedCount = allExamResults.filter((r) => !r.isAbsent).length;
    const absentCount = allExamResults.filter((r) => r.isAbsent).length;
    const totalMarks = allExamResults.reduce(
      (sum, result) => sum + (result.obtainedMarks || 0),
      0
    );
    const maxMarks = Math.max(
      ...allExamResults.map((r) => r.obtainedMarks || 0)
    );

    return {
      passRate: (passedCount / allExamResults.length) * 100,
      averageScore: totalMarks / allExamResults.length,
      attendedCount,
      absentCount,
      attendanceRate: (attendedCount / allExamResults.length) * 100,
      averagePercentage:
        totalMarks > 0
          ? (totalMarks / allExamResults.length / exam.maxMarks) * 100
          : 0,
      passingMarks: exam.passingMarks || Math.round(exam.maxMarks * 0.4),
      topScore: maxMarks,
      topScorePercentage: maxMarks > 0 ? (maxMarks / exam.maxMarks) * 100 : 0,
    };
  }, [allExamResults, exam.maxMarks, exam.passingMarks]);

  const {
    passRate,
    averageScore,
    attendedCount,
    absentCount,
    attendanceRate,
    averagePercentage,
    passingMarks,
    topScore,
    topScorePercentage,
  } = examStats;

  const hallTicketDownload = () => {};

  return (
    <div className="space-y-4 ">
      <Card className="border-b">
        <CardHeader>
          <CardTitle className="text-lg">{exam.title}</CardTitle>
          <CardDescription>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium">{exam.subject?.name}</span>
              <span>•</span>
              <span className="font-medium">{exam.subject?.code}</span>
              <Badge className={statusConfig.className} variant="outline">
                {statusConfig.text}
              </Badge>
              <Badge className={modeConfig.className} variant="outline">
                {modeConfig.text}
              </Badge>
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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {studentEnrollment ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {studentEnrollment.status === 'ENROLLED'
                    ? 'Enrolled'
                    : studentEnrollment.status}
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
                onClick={() => onAddCalendar(exam, startDate, endDate)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CalendarPlus className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare(exam.title)}
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCopy(exam.id)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Exam ID
              </Button>
            </div>
          </div>

          {!studentEnrollment && exam.status === 'UPCOMING' && (
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
          {studentEnrollment && exam.status === 'UPCOMING' && (
            <Card className="mt-8 border-blue-200 bg-blue-50/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">
                      Download HallTicket
                    </h3>
                    <p className="text-blue-700 text-sm">
                      Your hall ticket is available for this exam. Please
                      download and keep a copy handy for entry.
                    </p>
                  </div>
                  <Button
                    onClick={hallTicketDownload}
                    disabled={isHallTicketDownloading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isHallTicketDownloading
                      ? 'Downloading ...'
                      : 'Download Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
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
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Participation
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {attendanceRate.toFixed(0)}%
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {attendedCount}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      out of {enrolledStudentsCount} enrolled
                    </div>
                  </div>

                  <Progress
                    value={attendanceRate}
                    className="h-2 bg-blue-200 dark:bg-blue-800"
                  />

                  <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {attendedCount} attended
                    </span>
                    <span className="flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {absentCount} absent
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pass Rate Card */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
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
                      passRate >= 75
                        ? 'default'
                        : passRate >= 50
                          ? 'secondary'
                          : 'destructive'
                    }
                    className="text-xs"
                  >
                    {passRate >= 75
                      ? 'Excellent'
                      : passRate >= 50
                        ? 'Good'
                        : 'Needs Improvement'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {passRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      students passed
                    </div>
                  </div>

                  <Progress
                    value={passRate}
                    className="h-2 bg-green-200 dark:bg-green-800"
                  />

                  <div className="text-xs text-green-600 dark:text-green-400">
                    Passing threshold: {passingMarks}/{exam.maxMarks} marks
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average Performance Card */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
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
                      averagePercentage >= 75
                        ? 'default'
                        : averagePercentage >= 50
                          ? 'secondary'
                          : 'destructive'
                    }
                    className="text-xs"
                  >
                    {averagePercentage.toFixed(0)}%
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {averageScore > 0 ? averageScore.toFixed(1) : '—'}
                    </div>
                    <div className="text-xs text-orange-600 dark:text-orange-400">
                      out of {exam.maxMarks} marks
                    </div>
                  </div>

                  <Progress
                    value={averagePercentage}
                    className="h-2 bg-orange-200 dark:bg-orange-800"
                  />

                  <div className="text-xs text-orange-600 dark:text-orange-400">
                    {averagePercentage >= 75
                      ? 'Above expectations'
                      : averagePercentage >= 50
                        ? 'Meeting expectations'
                        : 'Below expectations'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performance Card */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
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
                      {topScore > 0 ? topScore.toFixed(1) : '—'}
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400">
                      out of {exam.maxMarks} marks
                    </div>
                  </div>

                  <Progress
                    value={topScorePercentage}
                    className="h-2 bg-purple-200 dark:bg-purple-800"
                  />

                  <div className="text-xs text-purple-600 dark:text-purple-400">
                    {topScorePercentage >= 90
                      ? 'Outstanding performance'
                      : topScorePercentage >= 75
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
                {/* Subject */}
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Subject:</span>
                  <span className="font-medium">
                    {exam.subject?.name} ({exam.subject?.code})
                  </span>
                </div>

                {/* Date & Time */}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-medium">
                    {formatDateTimeIN(exam.startDate)} –{' '}
                    {formatDateTimeIN(exam.endDate)}
                  </span>
                </div>

                {/* Duration */}
                {exam.durationInMinutes && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {exam.durationInMinutes} minutes
                    </span>
                  </div>
                )}

                {/* Venue */}
                {exam.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Venue:</span>
                    <span className="font-medium">{exam.venue}</span>
                  </div>
                )}

                {/* Max & Passing Marks */}
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

                {/* Mode */}
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Mode:</span>
                  <Badge variant="outline">{exam.mode}</Badge>
                </div>

                {/* Session */}
                {exam.examSession?.title && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Session:</span>
                    <span className="font-medium">
                      {exam.examSession.title}
                    </span>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">{exam.status}</span>
                </div>

                {/* Description */}
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
              {exam.venueMapUrl ? (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <Link
                      href={exam.venueMapUrl}
                      className="underline text-primary"
                      target="_blank"
                    >
                      {' '}
                      {exam.venueMapUrl}{' '}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click This link or copy
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Venue information will be updated soon.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <div className="space-y-6">
            {/* Hall Ticket Section */}
            {studentEnrollment && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Hall Ticket
                  </h3>
                  {studentHallTicket &&
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
                            {format(
                              new Date(studentHallTicket.generatedAt),
                              'PPP'
                            )}
                          </p>
                        </div>
                      </div>
                      <Button onClick={handleDownloadHallTicket} size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
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

            {/* Results Section */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Exam Results
                </h3>
                {studentResult &&
                exam.isResultsPublished &&
                exam.status === 'COMPLETED' ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {studentResult.obtainedMarks}
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
                          {studentResult.percentage?.toFixed(1)}%
                        </div>
                        <div className="text-sm text-green-700">Percentage</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {studentResult.gradeLabel || 'N/A'}
                        </div>
                        <div className="text-sm text-purple-700">Grade</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <Badge
                        variant={studentResult.isPassed ? 'pass' : 'failed'}
                        className="px-4 py-2"
                      >
                        {studentResult.isPassed ? 'PASSED' : 'FAILED'}
                      </Badge>
                      {studentResult.isAbsent && (
                        <Badge variant="absent" className="px-4 py-2">
                          ABSENT
                        </Badge>
                      )}
                    </div>

                    {studentResult.remarks && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Remarks</h4>
                        <p className="text-sm text-muted-foreground">
                          {studentResult.remarks}
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
                          : !studentEnrollment
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
