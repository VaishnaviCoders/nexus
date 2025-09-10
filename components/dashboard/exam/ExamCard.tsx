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
import { ExamWithRelations } from './StudentExamsPage';
import { ExamMode, ExamStatus } from '@/generated/prisma';

type ExamCardProps = {
  exam: ExamWithRelations;
  // Optional event handlers to integrate with app logic
  onJoin?: (examId: string) => void;
  onGenerateHallTicket?: (examId: string) => void;
  onViewResult?: (examId: string) => void;
  onViewInstructions?: (examId: string) => void;
  onAddToCalendar?: (examId: string) => void;
  onOpenVenueMap?: (url: string, examId: string) => void;
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
  onViewInstructions,
  onAddToCalendar,
  onOpenVenueMap,
}: ExamCardProps) {
  // Live time context
  const [now, setNow] = React.useState<Date>(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const start = exam.startDate;
  const end = exam.endDate;

  const minutesBetween = (from: Date, to: Date) =>
    Math.round((to.getTime() - from.getTime()) / 60_000);
  const minsToStart = minutesBetween(now, start);
  const minsToEnd = minutesBetween(now, end);
  const isInWindow = now >= start && now <= end;
  const isPast = now > end;
  const isBefore = now < start;

  // Allow joining online within X minutes before start
  const JOIN_EARLY_MIN = 10;
  const canEarlyJoin =
    exam.mode === ExamMode.ONLINE &&
    isBefore &&
    minsToStart <= JOIN_EARLY_MIN &&
    minsToStart >= -1;
  const canJoinNow =
    exam.mode === ExamMode.ONLINE &&
    (exam.status === ExamStatus.LIVE || isInWindow);
  const canJoin = canJoinNow || canEarlyJoin;

  // Status badge mapping aligned with your Badge variants (LIVE, UPCOMING, OPEN, COMPLETED, CANCELLED)
  const statusVariant = exam.status as ExamStatus; // valid keys exist in your badge variants

  // Evaluation type styling: use "meta" variant as subtle pill
  const evalLabel = labelize(exam.evaluationType);

  // Student-context actions
  const hallTicketUrl = (
    Array.isArray((exam as any).hallTickets)
      ? (exam as any).hallTickets?.[0]?.pdfUrl
      : undefined
  ) as string | undefined;
  const hasHallTicket = !!hallTicketUrl;
  const perf: any = (exam as any).performance ?? undefined;
  const resultReady = perf?.isPublished === true;
  const hasResult = resultReady && typeof perf?.obtainedMarks === 'number';

  // Primary Action decision tree
  let primaryAction: {
    label: string;
    onClick?: () => void;
    href?: string;
    disabled?: boolean;
    variant?:
      | 'default'
      | 'secondary'
      | 'outline'
      | 'destructive'
      | 'ghost'
      | 'link';
  } | null = null;

  if (exam.status === ExamStatus.CANCELLED) {
    primaryAction = {
      label: 'Cancelled',
      disabled: true,
      variant: 'secondary',
    };
  } else if (exam.status === ExamStatus.COMPLETED) {
    if (resultReady) {
      primaryAction = {
        label: 'View Result',
        onClick: () => onViewResult?.(exam.id),
      };
    } else {
      primaryAction = {
        label: 'Result Pending',
        disabled: true,
        variant: 'secondary',
      };
    }
  } else if (exam.mode === ExamMode.ONLINE) {
    if (canJoin) {
      primaryAction = { label: 'Join Exam', onClick: () => onJoin?.(exam.id) };
    } else {
      primaryAction = {
        label: `Join Available ${JOIN_EARLY_MIN}m before`,
        disabled: true,
        variant: 'secondary',
      };
    }
  } else {
    // OFFLINE / others
    if (hasHallTicket && hallTicketUrl) {
      primaryAction = { label: 'View Hall Ticket', href: hallTicketUrl };
    } else {
      primaryAction = {
        label: 'Generate Hall Ticket',
        onClick: () => onGenerateHallTicket?.(exam.id),
        variant: 'outline',
      };
    }
  }

  // Secondary actions
  const showVenue = !!exam.venueMapUrl;
  const showCalendar = true;

  // Header subline
  const subline = [exam.subject?.name, exam.examSession?.title]
    .filter(Boolean)
    .join(' • ');

  // Footer info (marks / pass)
  const marksInfo =
    typeof perf?.obtainedMarks === 'number'
      ? `${perf.obtainedMarks}/${exam.maxMarks}${typeof exam.passingMarks === 'number' ? ` • Pass ≥ ${exam.passingMarks}` : ''}`
      : `${exam.maxMarks} max${typeof exam.passingMarks === 'number' ? ` • Pass ≥ ${exam.passingMarks}` : ''}`;

  const passFlag = perf?.isPublished ? perf?.isPassed : undefined;

  // Countdown label
  let timeLabel = '';
  if (exam.status === ExamStatus.LIVE || isInWindow) {
    timeLabel = minsToEnd > 0 ? `Ends in ${fmtMin(minsToEnd)}` : 'Ending...';
  } else if (exam.status === ExamStatus.UPCOMING || isBefore) {
    timeLabel =
      minsToStart > 0 ? `Starts in ${fmtMin(minsToStart)}` : 'Starting soon';
  } else if (exam.status === ExamStatus.COMPLETED || isPast) {
    timeLabel = `Ended ${formatDateTimeIN(end)}`;
  }

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
          {exam.mode !== ExamMode.ONLINE && exam.venue ? (
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
            <Badge variant="secondary" className="px-2.5 py-0.5">
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
          {showVenue ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                exam.venueMapUrl && onOpenVenueMap?.(exam.venueMapUrl, exam.id)
              }
            >
              Venue
            </Button>
          ) : null}

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

        {primaryAction ? (
          primaryAction.href ? (
            <Button asChild size="sm" variant={primaryAction.variant}>
              <Link
                href={primaryAction.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {primaryAction.label}
              </Link>
            </Button>
          ) : (
            <Button
              size="sm"
              variant={primaryAction.variant}
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
            >
              {primaryAction.label}
            </Button>
          )
        ) : null}
      </CardFooter>
    </Card>
  );
}

function labelize(s: string | number) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/_/g, ' ');
}

function modeToLabel(mode: ExamMode) {
  switch (mode) {
    case ExamMode.ONLINE:
      return 'Online';
    case ExamMode.OFFLINE:
      return 'Offline';
    case ExamMode.PRACTICAL:
      return 'Practical';
    case ExamMode.VIVA:
      return 'Viva';
    case ExamMode.TAKE_HOME:
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
