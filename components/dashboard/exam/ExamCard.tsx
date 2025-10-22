'use client';

import * as React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn, formatDateTimeIN } from '@/lib/utils';
import type { ExamStatus, StudentExamStatus, ExamMode, EvaluationType } from '@/generated/prisma/enums';
import { ExamResult, HallTicket } from '@/generated/prisma/client';
import type { ExamWithRelations } from './StudentExamsPage';
import { formatDistanceToNow, isAfter, isBefore } from 'date-fns';

type ExamCardProps = {
  exam: ExamWithRelations;
  onJoin?: (examId: string) => void;
  onGenerateHallTicket?: (examId: string) => void;
  onViewResult?: (examId: string) => void;
  onAddToCalendar?: (examId: string) => void;
  onEnroll?: (examId: string) => void;
};

export function ExamCard({ exam, onJoin, onGenerateHallTicket, onViewResult, onAddToCalendar, onEnroll }: ExamCardProps) {
  const [currentTime] = React.useState(new Date());

  const startDate = new Date(exam.startDate);
  const endDate = new Date(exam.endDate);

  // Get student's exam enrollment status
  const studentEnrollment = exam.examEnrollment?.[0];
  const studentStatus = studentEnrollment?.status;

  // Get hall ticket and result data
  const hallTicket = exam.hallTickets?.[0];
  const examResult = exam.examResult?.[0];

  // Status calculations
  const isUpcoming = exam.status === 'UPCOMING';
  const isLive = exam.status === 'LIVE';
  const isCompleted = exam.status === 'COMPLETED';
  const isCancelled = exam.status === 'CANCELLED';

  // Result calculations
  const isResultPublished = Boolean(exam.isResultsPublished || examResult?.isResultsPublished);
  const hasResult = Boolean(examResult && typeof examResult.obtainedMarks === 'number');
  const isPassed = examResult?.isPassed ?? undefined;
  const isAbsent = Boolean(examResult?.isAbsent || studentStatus === 'ABSENT');

  // Time-based calculations
  const canJoinOnline = exam.mode === 'ONLINE' &&
    (isLive || (currentTime >= startDate && currentTime <= endDate));

  const timeLabel = getTimeLabel(startDate, endDate, exam.status, currentTime);
  const primaryAction = getPrimaryAction({
    exam,
    hallTicket,
    examResult,
    studentStatus,
    isResultPublished,
    hasResult,
    canJoinOnline,
    onJoin,
    onViewResult,
    onGenerateHallTicket,
    onEnroll
  });

  return (
    <Card className="h-full min-h-72 flex flex-col">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="text-pretty text-base md:text-lg font-semibold leading-tight line-clamp-2">
              {exam.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {[exam.subject?.name, exam.examSession?.title].filter(Boolean).join(' • ')}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <ExamStatusBadge status={exam.status} studentStatus={studentStatus} />
            <Badge variant="meta" className="px-2.5 py-0.5">
              {formatEnumValue(exam.evaluationType)}
            </Badge>
          </div>
        </div>

        <ExamMetaInfo
          startDate={startDate}
          duration={exam.durationInMinutes}
          mode={exam.mode}
          venue={exam.venue}
        />

        <div className="flex flex-wrap items-center gap-2">
          {timeLabel && (
            <Badge variant={isUpcoming ? 'UPCOMING' : 'outline'} className="px-2.5 py-0.5">
              {timeLabel}
            </Badge>
          )}
          <ResultBadge
            isResultPublished={isResultPublished}
            hasResult={hasResult}
            isPassed={isPassed}
            isAbsent={isAbsent}
            studentStatus={studentStatus}
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <ExamDetails
          exam={exam}
          examResult={examResult}
          hasResult={hasResult}
        />
      </CardContent>

      <Separator />

      <CardFooter className="pt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isUpcoming && (
            <Button variant="ghost" size="sm" onClick={() => onAddToCalendar?.(exam.id)}>
              Add to Calendar
            </Button>
          )}
        </div>
        {renderPrimaryAction(primaryAction)}
      </CardFooter>
    </Card>
  );
}

// Sub-components for better organization
function ExamStatusBadge({ status, studentStatus }: {
  status: ExamStatus;
  studentStatus?: StudentExamStatus;
}) {
  if (studentStatus === 'DISQUALIFIED') {
    return <Badge variant="destructive" className="px-2.5 py-0.5">Disqualified</Badge>;
  }

  if (studentStatus === 'ABSENT') {
    return <Badge variant="secondary" className="px-2.5 py-0.5">Absent</Badge>;
  }

  if (studentStatus === 'EXEMPT') {
    return <Badge variant="secondary" className="px-2.5 py-0.5">Exempt</Badge>;
  }

  return (
    <Badge variant={status} className="px-2.5 py-0.5">
      {formatEnumValue(status)}
    </Badge>
  );
}

function ExamMetaInfo({ startDate, duration, mode, venue }: {
  startDate: Date;
  duration?: number | null;
  mode: ExamMode;
  venue?: string | null;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span>{formatDateTimeIN(startDate)}</span>
      <span>•</span>
      <span>{formatDuration(duration)}</span>
      <span>•</span>
      <span>{formatEnumValue(mode)}</span>
      {mode !== 'ONLINE' && venue && (
        <>
          <span>•</span>
          <span className="truncate max-w-[10rem]" title={venue}>
            {venue}
          </span>
        </>
      )}
    </div>
  );
}

function ResultBadge({ isResultPublished, hasResult, isPassed, isAbsent, studentStatus }: {
  isResultPublished: boolean;
  hasResult: boolean;
  isPassed?: boolean;
  isAbsent?: boolean;
  studentStatus?: StudentExamStatus;
}) {
  if (studentStatus === 'ABSENT' || isAbsent) {
    return <Badge variant="secondary" className="px-2.5 py-0.5">Absent</Badge>;
  }

  if (!isResultPublished) return null;

  if (hasResult) {
    return (
      <Badge
        variant={isPassed ? 'present' : 'destructive'}
        className={cn('px-2.5 py-0.5', !isPassed && 'bg-red-100 text-red-700')}
      >
        {isPassed ? 'Passed' : 'Failed'}
      </Badge>
    );
  }

  return <Badge variant="secondary" className="px-2.5 py-0.5">Grading</Badge>;
}

function ExamDetails({ exam, examResult, hasResult }: {
  exam: ExamWithRelations;
  examResult?: ExamResult;
  hasResult: boolean;
}) {
  const marksInfo = hasResult
    ? `${examResult?.obtainedMarks}/${exam.maxMarks}${exam.passingMarks ? ` • Pass ≥ ${exam.passingMarks}` : ''}`
    : `${exam.maxMarks} max${exam.passingMarks ? ` • Pass ≥ ${exam.passingMarks}` : ''}`;

  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div className="space-y-1">
        <p className="text-muted-foreground">Marks</p>
        <p className="font-medium">{marksInfo}</p>
      </div>

      <div className="space-y-1">
        <p className="text-muted-foreground">Schedule</p>
        <p className="font-medium leading-5">
          {formatDateTimeIN(new Date(exam.startDate))}
          <br />
          <span className="text-muted-foreground">to</span> {formatDateTimeIN(new Date(exam.endDate))}
        </p>
      </div>

      {exam.supervisors?.length > 0 ? (
        <div className="space-y-1">
          <p className="text-muted-foreground">Supervisors</p>
          <p className="font-medium truncate" title={exam.supervisors.join(', ')}>
            {exam.supervisors.length} assigned
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-muted-foreground">Mode</p>
          <p className="font-medium">{formatEnumValue(exam.mode)}</p>
        </div>
      )}

      {exam.instructions ? (
        <div className="space-y-1">
          <p className="text-muted-foreground">Instructions</p>
          <p className="font-medium line-clamp-2" title={exam.instructions}>
            {exam.instructions}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-muted-foreground">Session</p>
          <p className="font-medium">{exam.examSession?.title}</p>
        </div>
      )}
    </div>
  );
}

// Helper functions
function formatEnumValue(value: string) {
  return value.toLowerCase().replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

function formatDuration(minutes?: number | null) {
  if (!minutes || minutes <= 0) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

function getTimeLabel(start: Date, end: Date, status: string, now: Date) {
  if (status === 'LIVE' || (now >= start && now <= end)) {
    return `Ends ${formatDistanceToNow(end, { addSuffix: true })}`;
  }
  if (status === 'UPCOMING' || now < start) {
    return `Starts ${formatDistanceToNow(start, { addSuffix: true })}`;
  }
  if (status === 'COMPLETED' || now > end) {
    return `Ended ${formatDateTimeIN(end)}`;
  }
  return '';
}

function getPrimaryAction(args: {
  exam: ExamWithRelations;
  hallTicket?: HallTicket;
  examResult?: ExamResult;
  studentStatus?: StudentExamStatus;
  isResultPublished: boolean;
  hasResult: boolean;
  canJoinOnline: boolean;
  onJoin?: (id: string) => void;
  onViewResult?: (id: string) => void;
  onGenerateHallTicket?: (id: string) => void;
  onEnroll?: (id: string) => void;
}) {
  const { exam, studentStatus } = args;

  // Handle student-specific status first
  if (studentStatus === 'DISQUALIFIED') {
    return { label: 'Disqualified', disabled: true, variant: 'destructive' as const };
  }

  if (studentStatus === 'ABSENT') {
    return { label: 'Marked Absent', disabled: true, variant: 'secondary' as const };
  }

  if (studentStatus === 'EXEMPT') {
    return { label: 'Exempt', disabled: true, variant: 'secondary' as const };
  }

  // Handle exam status
  if (exam.status === 'CANCELLED') {
    return { label: 'Cancelled', disabled: true, variant: 'secondary' as const };
  }

  // Check if student is enrolled
  const isEnrolled = !!studentStatus;

  // If not enrolled and exam is upcoming, show enroll button
  if (!isEnrolled && exam.status === 'UPCOMING') {
    return {
      label: 'Enroll Now',
      variant: 'default' as const,
      onClick: () => args.onEnroll?.(exam.id),
    };
  }

  // If enrolled and exam is completed, show result button if results are published
  if (isEnrolled && exam.status === 'COMPLETED') {
    if (args.isResultPublished && args.hasResult) {
      return {
        label: 'View Result',
        onClick: () => args.onViewResult?.(exam.id)
      };
    }
    if (args.isResultPublished) {
      return {
        label: 'View Result',
        onClick: () => args.onViewResult?.(exam.id)
      };
    }
    return { label: 'Result Pending', disabled: true, variant: 'secondary' as const };
  }

  // If enrolled and exam is upcoming, check for hall ticket
  if (isEnrolled && exam.status === 'UPCOMING') {
    // Handle offline exams with hall ticket
    if (args.hallTicket?.pdfUrl) {
      return {
        label: 'View Hall Ticket',
        href: args.hallTicket.pdfUrl,
        variant: 'default' as const,
      };
    }

    // Default: generate hall ticket for offline exams
    return {
      label: 'Download Hall Ticket',
      variant: 'outline' as const,
      onClick: () => args.onGenerateHallTicket?.(exam.id),
    };
  }

  // Handle online exams
  if (exam.mode === 'ONLINE') {
    if (args.canJoinOnline) {
      return { label: 'Join Exam', onClick: () => args.onJoin?.(exam.id) };
    }
    return { label: 'Join available at start time', disabled: true, variant: 'secondary' as const };
  }

  // Handle offline exams with hall ticket
  if (args.hallTicket?.pdfUrl) {
    return {
      label: 'View Hall Ticket',
      href: args.hallTicket.pdfUrl,
      variant: 'default' as const,
    };
  }

  // Default: generate hall ticket for offline exams
  return {
    label: 'Download Hall Ticket',
    variant: 'outline' as const,
    onClick: () => args.onGenerateHallTicket?.(exam.id),
  };
}

function renderPrimaryAction(action: any) {
  if (!action) return null;

  if (action.href) {
    return (
      <Button asChild size="sm" variant={action.variant}>
        <Link href={action.href} target="_blank" rel="noopener noreferrer">
          {action.label}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant={action.variant}
      onClick={action.onClick}
      disabled={action.disabled}
    >
      {action.label}
    </Button>
  );
}