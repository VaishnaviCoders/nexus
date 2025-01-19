import NoticeList from '@/app/components/dashboardComponents/notice-list';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Role } from '@prisma/client';
import React from 'react';

const page = async () => {
  const { orgId, orgRole } = await auth();
  const notices = await prisma.notice.findMany({
    where: {
      organizationId: orgId,
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

  return <NoticeList notices={notices} orgRole={role} />;
};

export default page;
