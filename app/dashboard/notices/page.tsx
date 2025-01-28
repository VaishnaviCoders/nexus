import NoticeList from '@/app/components/dashboardComponents/notice-list';

import { Button } from '@/components/ui/button';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Role } from '@prisma/client';
import Link from 'next/link';
import React, { Suspense } from 'react';
import Loading from './loading';

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const page = async () => {
  const { orgId, orgRole } = await auth();
  // await delay(5000);

  if (!orgId) return <div>Organization not found</div>;

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
        <h1 className="text-2xl font-bold ">All Notices</h1>
        <Button>
          <Link href={`/dashboard/notices/create`}>Create Notice</Link>
        </Button>
      </div>
      <Suspense fallback={<Loading />}>
        <NoticeList notices={notices} orgRole={role} />
      </Suspense>
    </div>
  );
};

export default page;
