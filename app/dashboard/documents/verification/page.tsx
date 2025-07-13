import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DocumentVerificationPage from '@/components/dashboard/admin/DocumentVerification';

async function DocumentsData() {
  const organizationId = await getOrganizationId();

  const documents = await prisma.studentDocument.findMany({
    where: {
      isDeleted: false,
      organizationId,
    },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          rollNumber: true,
          grade: { select: { grade: true } },
          section: { select: { name: true } },
        },
      },
    },
    orderBy: {
      uploadedAt: 'desc',
    },
  });

  return <DocumentVerificationPage documents={documents} />;
}

function DocumentVerificationSkeleton() {
  return (
    <div className="">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4 lg:p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-10 w-full sm:w-48" />
              <Skeleton className="h-10 w-full sm:w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 lg:p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 p-4 border rounded-lg"
              >
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<DocumentVerificationSkeleton />}>
      <DocumentsData />
    </Suspense>
  );
}
