import NoticeList from '@/components/dashboard/notice/notice-list';

import prisma from '@/lib/db';

import Link from 'next/link';
import React, { Suspense } from 'react';
import Loading from './loading';
import { getOrganizationId, getOrganizationUserRole } from '@/lib/organization';
import { EmptyState } from '@/components/EmptyState';
import { Activity, Pin, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Role } from '@/generated/prisma/enums';
import { getCurrentAcademicYearId } from '@/lib/academicYear';
import { performance } from 'perf_hooks';

const page = async () => {
  const { orgRole } = await getOrganizationUserRole();

  const organizationId = await getOrganizationId();
  const academicYearData = await getCurrentAcademicYearId();

  if (!academicYearData) {
    // Handle the missing academic year here
    // You can redirect, show a message, throw an error, etc.
    throw new Error('No current academic year is set.');
  }

  const { academicYearId } = academicYearData;

  const t0 = performance.now();

  const notices = await prisma.notice.findMany({
    where: {
      organizationId,
      academicYearId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const t1 = performance.now();
  console.log(`⏱  Notices query took ${(t1 - t0).toFixed(2)} ms`);

  const roleMap: Record<string, Role> = {
    'org:admin': 'ADMIN',
    'org:teacher': 'TEACHER',
    'org:student': 'STUDENT',
    'org:parent': 'PARENT',
  };

  const role = orgRole && roleMap[orgRole] ? roleMap[orgRole] : 'STUDENT';
  // console.log('Detected Clerk Role:', role);

  return (
    <div className="w-full mx-auto ">
      <div className="flex justify-between items-center px-4 pb-5">
        <h1 className="text-xl font-bold ">All Notices ({notices.length})</h1>
        {role === 'ADMIN' || role === 'TEACHER' ? (
          <Link
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
            href={`/dashboard/notices/create`}
          >
            Create Notice
          </Link>
        ) : null}
      </div>
      {!notices || notices.length === 0 ? (
        <>
          <div className="flex items-center justify-center">
            <EmptyState
              title={cn(
                role === 'ADMIN'
                  ? 'No Notices Published Yet'
                  : role === 'TEACHER'
                    ? 'Your Class Wall Looks Empty'
                    : 'No Notices Available'
              )}
              description={cn(
                role === 'ADMIN'
                  ? 'Create your first announcement to keep everyone informed about important updates.'
                  : role === 'TEACHER'
                    ? 'Post notices to share lessons, assignments, or important class information.'
                    : role === 'STUDENT'
                      ? 'Check back later for updates from your teachers and school.'
                      : role === 'PARENT'
                        ? "Your child's school will post important notices here."
                        : 'No content available yet.'
              )}
              icons={[Newspaper, Activity, Pin]}
              image="/EmptyStatePageNotFound.png"
            />
          </div>
        </>
      ) : (
        <Suspense fallback={<Loading />}>
          <NoticeList notices={notices} orgRole={role} />
        </Suspense>
      )}
    </div>
  );
};

export default page;
