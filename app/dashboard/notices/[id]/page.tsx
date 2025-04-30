import ViewNotice from '@/components/dashboard/notice/view-notice';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Role } from '@prisma/client';

export default async function NoticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { orgRole } = await auth();

  const roleMap: Record<string, Role> = {
    'org:admin': 'ADMIN',
    'org:teacher': 'TEACHER',
    'org:student': 'STUDENT',
    'org:parent': 'PARENT',
  };

  const role = orgRole && roleMap[orgRole] ? roleMap[orgRole] : 'STUDENT';

  const noticeId = id;
  const notice = await prisma.notice.findUnique({
    where: {
      id: noticeId,
    },
  });

  if (!notice) {
    return <div className="container mx-auto p-4">Notice not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 w-full max-w-4xl ">
        Notice Details
      </h1>
      <ViewNotice notice={notice} orgRole={role} />
    </div>
  );
}
