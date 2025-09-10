import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import prisma from '@/lib/db';
import ExamHeader from '@/components/dashboard/exam/exam-header';
import ExamTabs from '@/components/dashboard/exam/exam-summary';
import ExamHighlights from '@/components/dashboard/exam/exam-highlights';

async function getExamById(id: string) {
  const exam = await prisma.exam.findUnique({
    where: {
      id,
    },
    include: {
      subject: true,
      examSession: true,
    },
  });

  return exam;
}
export default async function ExamDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = await getExamById(id);

  if (!exam) return notFound();

  return (
    <div className="w-full mx-auto max-w-7xl px-2">
      <Suspense fallback={<PageSkeleton />}>
        <div className={cn('space-y-6')}>
          <ExamHeader exam={exam} />
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-pretty">Exam Highlights</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ExamHighlights exam={exam} />
            </CardContent>
          </Card>
          <ExamTabs exam={exam} />
        </div>
      </Suspense>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-28" />
        </div>
        <Skeleton className="h-10 w-80" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
