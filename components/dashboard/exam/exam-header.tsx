'use client';

import { useMemo, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn, formatDateTimeIN } from '@/lib/utils';
import { CalendarPlus, Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { buildICS, downloadICS } from '@/lib/ics';
import { ExamWithRelations } from './StudentExamsPage';

export default function ExamHeader({ exam }: { exam: ExamWithRelations }) {
  //   const { toast } = useToast();
  const [now, setNow] = useState<Date>(new Date());

  const start = useMemo(() => new Date(exam.startDate), [exam.startDate]);
  const end = useMemo(() => new Date(exam.endDate), [exam.endDate]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = start.getTime() - now.getTime();
  const isUpcoming = diff > 0;
  const isLive = now >= start && now <= end;
  const isDone = now > end || exam.status === 'COMPLETED';

  const timeLeft = formatDiff(Math.max(0, diff));

  function onCopy() {
    navigator.clipboard
      .writeText(exam.id)
      .then(() => toast.success('Exam ID copied to clipboard.'))
      .catch(() => toast.error('Unable to copy exam ID. Please try again.'));
  }

  function onAddCalendar() {
    const ics = buildICS({
      title: exam.title,
      description: exam.description ?? '',
      start: start,
      end: end,
      location: exam.venue ?? '',
    });
    downloadICS(ics, `${exam.title.replace(/\s+/g, '-')}.ics`);
    toast('Added to calendar');
  }

  function onShare() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      navigator
        .share({
          title: exam.title,
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

  return (
    <Card className="border bg-gradient-to-br from-secondary to-background p-6 md:p-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="text-sm">
            {exam.subject.name} • {exam.subject.code}
          </Badge>
          <Badge variant={exam.status} className="text-sm">
            {exam.status}
          </Badge>
          <Badge variant="outline" className="text-sm">
            {exam.evaluationType} - {exam.mode}
          </Badge>
        </div>

        <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
          {exam.title}
        </h1>

        <p className="max-w-3xl text-muted-foreground">{exam.description}</p>

        <div className="mt-1 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          <InfoItem label="Starts" value={formatDateTimeIN(start)} />
          <InfoItem label="Ends" value={formatDateTimeIN(end)} />
          <InfoItem
            label="Duration"
            value={`${exam.durationInMinutes ?? 0} mins`}
          />
        </div>

        <Separator className="my-2" />

        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div
            className={cn(
              'rounded-md border px-4 py-2 text-sm',
              isLive
                ? 'border-amber-500/30 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200'
                : isUpcoming
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-muted bg-muted/50 text-muted-foreground'
            )}
            aria-live="polite"
          >
            {isLive ? (
              <span className="font-medium">Live now</span>
            ) : isUpcoming ? (
              <span className="font-medium">Starts in {timeLeft}</span>
            ) : (
              <span className="font-medium">Completed</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={onAddCalendar} className="gap-2">
              <CalendarPlus className="size-4" />
              Add to Calendar
            </Button>
            <Button variant="outline" onClick={onShare} className="gap-2">
              <Share2 className="size-4" />
              Share
            </Button>
            <Button
              variant="outline"
              onClick={onCopy}
              className="gap-2 bg-transparent"
            >
              <Copy className="size-4" />
              Copy Exam ID
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-card px-3 py-2">
      <div className="text-[12px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

function formatDiff(ms: number) {
  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
