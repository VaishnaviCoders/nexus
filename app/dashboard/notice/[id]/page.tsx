import ViewNotice from '@/app/components/dashboardComponents/view-notice';
import prisma from '@/lib/db';

export default async function NoticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  console.log('params', params);
  const noticeId = (await params).id;
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
      <h1 className="text-2xl font-bold mb-4">Notice Details</h1>
      <ViewNotice notice={notice} />
    </div>
  );
}
