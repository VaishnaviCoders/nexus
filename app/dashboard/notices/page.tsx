import NoticeList from '@/components/dashboard/notice/notice-list';

import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Role } from '@prisma/client';
import Link from 'next/link';
import React, { Suspense } from 'react';
import Loading from './loading';
import { OrganizationSwitcher } from '@clerk/nextjs';

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const page = async () => {
  const { orgId, orgRole } = await auth();
  console.log('orgId', orgId);
  // await delay(5000);

  if (!orgId)
    return (
      <div>
        <h1>Organization not found , Select a organization from the sidebar</h1>{' '}
        <OrganizationSwitcher />
      </div>
    );

  const notices = await prisma.notice.findMany({
    where: {
      organizationId: orgId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!notices || notices.length === 0) return <div>No Notices Found</div>;

  const roleMap: Record<string, Role> = {
    'org:admin': 'ADMIN',
    'org:teacher': 'TEACHER',
    'org:student': 'STUDENT',
    'org:parent': 'PARENT',
  };

  const role = orgRole && roleMap[orgRole] ? roleMap[orgRole] : 'STUDENT';
  // console.log('Detected Clerk Role:', role);

  return (
    <div className="w-full mx-auto">
      <div className="flex justify-between items-center px-4 pb-5">
        <h1 className="text-xl font-bold ">All Notices</h1>
        {role === 'ADMIN' || role === 'TEACHER' ? (
          <Link
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
            href={`/dashboard/notices/create`}
          >
            Create Notice
          </Link>
        ) : null}
      </div>
      <Suspense fallback={<Loading />}>
        <NoticeList notices={notices} orgRole={role} />
      </Suspense>
    </div>
  );
};

export default page;
