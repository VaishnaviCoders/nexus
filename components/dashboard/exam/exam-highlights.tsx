'use client';

import type React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Award, ShieldCheck, Users, FileText } from 'lucide-react';

type Exam = {
  maxMarks?: number | null;
  passingMarks?: number | null;
  performances?: Array<{
    isPassed?: boolean | null;
    obtainedMarks?: number | null;
  }> | null;
};

export default function ExamHighlights({
  exam,
  className,
}: {
  exam: Exam;
  className?: string;
}) {
  const total = exam.performances?.length ?? 0;
  const passed = exam.performances?.filter((p) => p.isPassed).length ?? 0;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  const maxMarks =
    typeof exam.maxMarks === 'number' ? exam.maxMarks : undefined;
  const passingMarks =
    typeof exam.passingMarks === 'number' ? exam.passingMarks : undefined;

  // Compute average marks if available
  const avg =
    total > 0
      ? Math.round(
          ((exam.performances ?? [])
            .map((p) => p.obtainedMarks ?? 0)
            .reduce((a, b) => a + b, 0) /
            total) *
            10
        ) / 10
      : undefined;

  return (
    <div className={cn('grid gap-4 md:grid-cols-4', className)}>
      <Metric
        icon={<Users className="size-4" />}
        label="Participants"
        value={total}
        hint="students appeared"
      />
      <Metric
        icon={<ShieldCheck className="size-4" />}
        label="Pass Rate"
        value={`${passRate}%`}
        hint="of participants"
        footer={
          <div className="mt-2">
            <Progress value={passRate} aria-label="Pass rate" />
          </div>
        }
      />
      <Metric
        icon={<Award className="size-4" />}
        label="Average Score"
        value={
          avg !== undefined ? `${avg}${maxMarks ? ` / ${maxMarks}` : ''}` : '—'
        }
        hint="mean of obtained"
      />
      <Metric
        icon={<FileText className="size-4" />}
        label="Passing Marks"
        value={passingMarks !== undefined ? passingMarks : '—'}
        hint={maxMarks ? `out of ${maxMarks}` : undefined}
      />
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  hint,
  footer,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  hint?: string;
  footer?: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-foreground/80">{icon}</span>
            {label}
          </span>
          <span className="text-lg font-semibold">{value}</span>
        </div>
        {hint ? (
          <>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">{hint}</p>
          </>
        ) : null}
        {footer}
      </CardContent>
    </Card>
  );
}
