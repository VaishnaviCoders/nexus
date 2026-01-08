'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn, formatDateTimeIN } from '@/lib/utils';
import type { ExamStatus, StudentExamStatus, ExamMode, EvaluationType } from '@/generated/prisma/enums';
import { ExamResult, HallTicket } from '@/generated/prisma/client';
import type { ExamWithRelations } from './StudentExamsPage';
import { formatDistanceToNow, format } from 'date-fns';
import { Calendar, Clock, MapPin, Trophy, Users } from 'lucide-react';

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
  const endDate = exam.endDate
    ? new Date(exam.endDate)
    : new Date(startDate.getTime() + (exam.durationInMinutes || 0) * 60 * 1000);

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
            <Button variant="ghost" size="sm" onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCalendar?.(exam.id);
            }}>
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
    <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground/80 font-medium">
      <div className="flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5 text-primary/60" />
        {format(startDate, 'MMM d, yyyy')}
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-primary/60" />
        {formatDuration(duration)}
      </div>
      <div className="flex items-center gap-1.5">
        <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-bold border-muted-foreground/20">
          {formatEnumValue(mode)}
        </Badge>
      </div>
      {mode !== 'ONLINE' && venue && (
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-primary/60" />
          <span className="truncate max-w-[120px]" title={venue}>{venue}</span>
        </div>
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
  const startDate = new Date(exam.startDate);
  const endDate = exam.endDate
    ? new Date(exam.endDate)
    : new Date(startDate.getTime() + (exam.durationInMinutes || 0) * 60 * 1000);

  const formattedDate = format(startDate, 'dd MMM, yyyy');
  const timeRange = `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`;

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      {/* Schedule Section */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          Schedule
        </p>
        <div className="space-y-0.5">
          <p className="font-medium text-foreground">{formattedDate}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeRange}
          </p>
        </div>
      </div>

      {/* Marks Section */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Trophy className="h-3.5 w-3.5" />
          Marks
        </p>
        <div>
          {hasResult ? (
            <div className="space-y-0.5">
              <p className="font-medium text-foreground text-lg leading-tight">
                {examResult?.obtainedMarks}
                <span className="text-muted-foreground text-xs ml-1 font-normal">/ {exam.maxMarks}</span>
              </p>
              {exam.passingMarks && (
                <p className="text-[10px] text-muted-foreground">
                  Pass ≥ {exam.passingMarks}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-0.5">
              <p className="font-medium text-foreground">
                {exam.maxMarks} <span className="text-xs text-muted-foreground font-normal">Max Marks</span>
              </p>
              {exam.passingMarks && (
                <p className="text-[10px] text-muted-foreground">
                  Pass ≥ {exam.passingMarks}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info (Supervisors / Venue / Instructions) */}
      <div className="col-span-2 pt-3 border-t mt-1 flex items-center justify-between gap-4">
        {exam.mode !== 'ONLINE' && exam.venue ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate" title={exam.venue}>{exam.venue}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{exam.supervisors?.length || 0} Supervisors</span>
          </div>
        )}

        <div className="bg-secondary/50 px-2 py-0.5 rounded text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {formatEnumValue(exam.mode)}
        </div>
      </div>
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
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        args.onEnroll?.(exam.id);
      },
    };
  }

  // If enrolled and exam is completed, show result button if results are published
  if (isEnrolled && exam.status === 'COMPLETED') {
    if (args.isResultPublished && args.hasResult) {
      return {
        label: 'View Result',
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          args.onViewResult?.(exam.id);
        }
      };
    }
    if (args.isResultPublished) {
      return {
        label: 'View Result',
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          args.onViewResult?.(exam.id);
        }
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

    // Default: Show pending state if no hall ticket (instead of download)
    return {
      label: 'Hall Ticket Pending',
      variant: 'secondary' as const,
      disabled: true,
    };
  }

  // Handle online exams
  if (exam.mode === 'ONLINE') {
    if (args.canJoinOnline) {
      return {
        label: 'Join Exam',
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          args.onJoin?.(exam.id);
        }
      };
    }
    return { label: 'Join available at start time', disabled: true, variant: 'secondary' as const };
  }

  // Handle offline exams with hall ticket (LIVE state)
  if (args.hallTicket?.pdfUrl) {
    return {
      label: 'View Hall Ticket',
      href: args.hallTicket.pdfUrl,
      variant: 'default' as const,
    };
  }

  // Default: Show pending state if no hall ticket
  return {
    label: 'Hall Ticket Pending',
    variant: 'secondary' as const,
    disabled: true,
  };
}

function renderPrimaryAction(action: any) {
  if (!action) return null;

  if (action.href) {
    return (
      <Button
        size="sm"
        variant={action.variant}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open(action.href, '_blank', 'noopener,noreferrer');
        }}
      >
        {action.label}
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