import prisma from '@/lib/db';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import NoticeViewer from '@/components/dashboard/notice/notice-viewer';
import { getCurrentUserByRole } from '@/lib/auth';

export default async function NoticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch notice data
  const notice = await prisma.notice.findUnique({
    where: { id },
    include: {
      attachments: true,
    },
  });

  const { role } = await getCurrentUserByRole();

  if (!notice) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Notice not found</AlertTitle>
          <AlertDescription>
            The notice you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <NoticeViewer notice={notice} userRole={role} />;
}
