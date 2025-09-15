'use client';

import * as React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn, formatDateTimeIN } from '@/lib/utils';
import type { ExamStatus, ExamResult, HallTicket } from '@/generated/prisma';
import type { ExamWithRelations } from './StudentExamsPage';

type ExamCardProps = {
  exam: ExamWithRelations;
  // Optional event handlers to integrate with app logic
  onJoin?: (examId: string) => void;
  onGenerateHallTicket?: (examId: string) => void;
  onViewResult?: (examId: string) => void;
  onAddToCalendar?: (examId: string) => void;
};

export function formatHM(minutes?: number | null) {
  if (!minutes || minutes <= 0) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export function ExamCard({
  exam,
  onJoin,
  onGenerateHallTicket,
  onViewResult,
  onAddToCalendar,
}: ExamCardProps) {
  // Live time context (tick every 30s for countdown labels)
  const [now, setNow] = React.useState<Date>(new Date());
  React.useEffect(() => {
    const timerId = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timerId);
  }, []);

  const start = new Date(exam.startDate);
  const end = new Date(exam.endDate);

  const {
    minutesUntilStart,
    minutesUntilEnd,
    isWithinExamWindow,
    isPastWindow,
    isBeforeWindow,
  } = getTimeState(now, start, end);

  const statusVariant = exam.status as ExamStatus;
  const evalLabel = labelize(exam.evaluationType);

  // Narrow related data
  const hallTickets = (exam.hallTickets ?? []) as HallTicket[];
  const hallTicketUrl = hallTickets[0]?.pdfUrl;
  const hasHallTicket = Boolean(hallTicketUrl);

  const examResults = (exam.examResult ?? []) as ExamResult[];
  const publishedResult =
    examResults.find((r) => r.isResultsPublished) ?? examResults[0];
  // Consider either per-student/child-level or exam-wide publication
  const resultReady = Boolean(
    exam.isResultsPublished || examResults.some((r) => r.isResultsPublished)
  );
  const hasResultMarks = typeof publishedResult?.obtainedMarks === 'number';

  const { canJoin } = getCapabilities({
    examMode: exam.mode,
    examStatus: exam.status,
    isBeforeWindow,
    isWithinExamWindow,
    minutesUntilStart,
  });

  const primaryAction = buildPrimaryAction({
    examStatus: exam.status,
    examId: exam.id,
    examMode: exam.mode,
    canJoin,
    hallTicketUrl,
    resultReady,
    hasResult: hasResultMarks,
    onJoin,
    onViewResult,
    onGenerateHallTicket,
  });

  const showCalendar = exam.status === 'UPCOMING';

  // Header subline
  const subline = [exam.subject?.name, exam.examSession?.title]
    .filter(Boolean)
    .join(' • ');

  // Footer info (marks / pass)
  const marksInfo =
    typeof publishedResult?.obtainedMarks === 'number'
      ? `${publishedResult.obtainedMarks}/${exam.maxMarks}${typeof exam.passingMarks === 'number' ? ` • Pass ≥ ${exam.passingMarks}` : ''}`
      : `${exam.maxMarks} max${typeof exam.passingMarks === 'number' ? ` • Pass ≥ ${exam.passingMarks}` : ''}`;

  const passFlag = resultReady ? publishedResult?.isPassed : undefined;

  // Countdown label
  const timeLabel = getTimeLabel({
    status: exam.status,
    isWithinExamWindow,
    isBeforeWindow,
    isPastWindow,
    minutesUntilStart,
    minutesUntilEnd,
    end,
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
              {subline}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge variant={statusVariant} className="px-2.5 py-0.5">
              {labelize(exam.status)}
            </Badge>
            <Badge variant="meta" className="px-2.5 py-0.5">
              {evalLabel}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{formatDateTimeIN(start)}</span>
          <span aria-hidden>•</span>
          <span>{formatHM(exam.durationInMinutes)}</span>
          <span aria-hidden>•</span>
          <span>{modeToLabel(exam.mode)}</span>
          {exam.mode !== 'ONLINE' && exam.venue ? (
            <>
              <span aria-hidden>•</span>
              <span className="truncate max-w-[10rem]" title={exam.venue}>
                {exam.venue}
              </span>
            </>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* {exam.studentStatus ? (
            <Badge variant="outline" className="px-2.5 py-0.5">
              {labelize(exam.studentStatus)}
            </Badge>
          ) : null} */}
          {timeLabel ? (
            <Badge
              variant={`${exam.status === 'UPCOMING' ? 'UPCOMING' : 'outline'}`}
              className="px-2.5 py-0.5"
            >
              {timeLabel}
            </Badge>
          ) : null}
          {passFlag !== undefined ? (
            <Badge
              variant={passFlag ? 'present' : 'destructive'}
              className={cn(
                'px-2.5 py-0.5',
                passFlag ? '' : 'bg-red-100 text-red-700'
              )}
            >
              {passFlag ? 'Passed' : 'Failed'}
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Marks</p>
            <p className="font-medium">{marksInfo}</p>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground">Schedule</p>
            <p className="font-medium leading-5">
              {formatDateTimeIN(start)}
              <br />
              <span className="text-muted-foreground">to</span>{' '}
              {formatDateTimeIN(end)}
            </p>
          </div>

          {Array.isArray(exam.supervisors) && exam.supervisors.length > 0 ? (
            <div className="space-y-1">
              <p className="text-muted-foreground">Supervisors</p>
              <p
                className="font-medium truncate"
                title={exam.supervisors.join(', ')}
              >
                {exam.supervisors.length} assigned
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-muted-foreground">Mode</p>
              <p className="font-medium">{modeToLabel(exam.mode)}</p>
            </div>
          )}

          {exam.instructions ? (
            <div className="space-y-1">
              <p className="text-muted-foreground">Instructions</p>
              <p
                className="font-medium line-clamp-2"
                title={exam.instructions || undefined}
              >
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
      </CardContent>

      <Separator />

      <CardFooter className="pt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {showCalendar ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddToCalendar?.(exam.id)}
            >
              Add to Calendar
            </Button>
          ) : null}
        </div>

        {renderPrimaryAction(primaryAction)}
      </CardFooter>
    </Card>
  );
}

function labelize(s: string | number) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/_/g, ' ');
}

function modeToLabel(mode: string) {
  switch (mode) {
    case 'ONLINE':
      return 'Online';
    case 'OFFLINE':
      return 'Offline';
    case 'PRACTICAL':
      return 'Practical';
    case 'VIVA':
      return 'Viva';
    case 'TAKE_HOME':
      return 'Take Home';
    default:
      return labelize(mode);
  }
}

function fmtMin(total: number) {
  if (total <= 1) return '1m';
  if (total < 60) return `${total}m`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

type PrimaryAction =
  | {
      label: string;
      variant?:
        | 'default'
        | 'secondary'
        | 'outline'
        | 'destructive'
        | 'ghost'
        | 'link';
      disabled?: boolean;
      href: string;
    }
  | {
      label: string;
      variant?:
        | 'default'
        | 'secondary'
        | 'outline'
        | 'destructive'
        | 'ghost'
        | 'link';
      disabled?: boolean;
      onClick: () => void;
    }
  | null;

function renderPrimaryAction(action: PrimaryAction) {
  if (!action) return null;
  if ('href' in action) {
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

function getTimeState(now: Date, start: Date, end: Date) {
  const diffInMinutes = (from: Date, to: Date) =>
    Math.round((to.getTime() - from.getTime()) / 60_000);

  const minutesUntilStart = diffInMinutes(now, start);
  const minutesUntilEnd = diffInMinutes(now, end);
  const isWithinExamWindow = now >= start && now <= end;
  const isPastWindow = now > end;
  const isBeforeWindow = now < start;

  return {
    minutesUntilStart,
    minutesUntilEnd,
    isWithinExamWindow,
    isPastWindow,
    isBeforeWindow,
  };
}

function getCapabilities(args: {
  examMode: string;
  examStatus: string;
  isBeforeWindow: boolean;
  isWithinExamWindow: boolean;
  minutesUntilStart: number;
}) {
  const EARLY_JOIN_MINUTES = 10;

  const canEarlyJoin =
    args.examMode === 'ONLINE' &&
    args.isBeforeWindow &&
    args.minutesUntilStart <= EARLY_JOIN_MINUTES &&
    args.minutesUntilStart >= -1;

  const canJoinNow =
    args.examMode === 'ONLINE' &&
    (args.examStatus === 'LIVE' || args.isWithinExamWindow);

  const canJoin = canJoinNow || canEarlyJoin;
  return { canJoin };
}

function buildPrimaryAction(args: {
  examStatus: string;
  examId: string;
  examMode: string;
  canJoin: boolean;
  hallTicketUrl?: string;
  resultReady: boolean;
  hasResult: boolean;
  onJoin?: (id: string) => void;
  onViewResult?: (id: string) => void;
  onGenerateHallTicket?: (id: string) => void;
}): PrimaryAction {
  if (args.examStatus === 'CANCELLED') {
    return {
      label: 'Cancelled',
      disabled: true,
      variant: 'secondary',
      onClick: () => {},
    } as PrimaryAction;
  }

  if (args.examStatus === 'COMPLETED') {
    if (args.resultReady && args.hasResult) {
      return {
        label: 'View Result',
        onClick: () => args.onViewResult?.(args.examId),
      };
    }
    return {
      label: 'Result Pending',
      disabled: true,
      variant: 'secondary',
      onClick: () => {},
    } as PrimaryAction;
  }

  if (args.examMode === 'ONLINE') {
    if (args.canJoin) {
      return { label: 'Join Exam', onClick: () => args.onJoin?.(args.examId) };
    }
    return {
      label: 'Join available 10m before',
      disabled: true,
      variant: 'secondary',
      onClick: () => {},
    } as PrimaryAction;
  }

  // OFFLINE and others
  if (args.hallTicketUrl) {
    return { label: 'View Hall Ticket', href: args.hallTicketUrl };
  }
  return {
    label: 'Download Hall Ticket',
    variant: 'outline',
    onClick: () => args.onGenerateHallTicket?.(args.examId),
  };
}

function getTimeLabel(args: {
  status: string;
  isWithinExamWindow: boolean;
  isBeforeWindow: boolean;
  isPastWindow: boolean;
  minutesUntilStart: number;
  minutesUntilEnd: number;
  end: Date;
}) {
  if (args.status === 'LIVE' || args.isWithinExamWindow) {
    return args.minutesUntilEnd > 0
      ? `Ends in ${fmtMin(args.minutesUntilEnd)}`
      : 'Ending...';
  }
  if (args.status === 'UPCOMING' || args.isBeforeWindow) {
    return args.minutesUntilStart > 0
      ? `Starts in ${fmtMin(args.minutesUntilStart)}`
      : 'Starting soon';
  }
  if (args.status === 'COMPLETED' || args.isPastWindow) {
    return `Ended ${formatDateTimeIN(args.end)}`;
  }
  return '';
}

/*
USAGE EXAMPLE:

{filtered.map((e) => (
  <ExamCard
    key={e.id}
    exam={{
      id: e.id,
      title: e.title,
      description: e.description,
      subjectName: e.subject.name,
      gradeLabel: e.grade.name,
      sectionLabel: e.section?.name,
      evaluationType: e.evaluationType,
      mode: e.mode,
      status: e.status,
      maxMarks: e.maxMarks,
      passingMarks: e.passingMarks,
      durationInMinutes: e.durationInMinutes,
      startDate: e.startDate,
      endDate: e.endDate,
      venue: e.venue,
      venueMapUrl: e.venueMapUrl,
      supervisors: e.supervisors,
      instructions: e.instructions,
      studentStatus: e.studentStatus,
      hallTicketUrl: e.hallTicket?.pdfUrl,
      performance: e.performance
        ? {
            obtainedMarks: e.performance.obtainedMarks,
            gradeLabel: e.performance.gradeLabel,
            isPassed: e.performance.isPassed,
            isPublished: e.performance.isPublished,
          }
        : undefined,
    }}
    onJoin={(id) => console.log("[v0] Join exam:", id)}
    onGenerateHallTicket={(id) => console.log("[v0] Generate hall ticket:", id)}
    onViewResult={(id) => console.log("[v0] View result:", id)}
    onViewInstructions={(id) => console.log("[v0] View instructions:", id)}
    onAddToCalendar={(id) => console.log("[v0] Add to calendar:", id)}
    onOpenVenueMap={(url, id) => {
      console.log("[v0] Open venue map:", url, "for", id)
      window.open(url, "_blank", "noopener,noreferrer")
    }}
  />
))}

Place the card in a grid with equal heights:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {filtered.map(...)}
</div>
*/
