import EditStudentForm from '@/components/dashboard/Student/EditStudentForm';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

async function getStudent(id: string) {
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      user: true,
      grade: true,
      section: true,
      ParentStudent: {
        include: {
          parent: true,
        },
      },
    },
  });

  return student;
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const student = await getStudent(id);

  if (!student) return notFound();

  return (
    <Suspense fallback={<StudentProfileEditSkeleton />}>
      <EditStudentForm student={student} />
    </Suspense>
  );
};

export default page;

function StudentProfileEditSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Card className="border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
