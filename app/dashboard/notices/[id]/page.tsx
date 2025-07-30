import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import NoticeViewer from '@/components/dashboard/notice/notice-viewer';
import { Role } from '@/app/generated/prisma/enums';

type Attachment = {
  name: string;
  url: string;
  type: string;
  size: number;
};

type NoticeWithAttachments = {
  id: string;
  noticeType: string;
  title: string;
  startDate: Date;
  endDate: Date;
  content: string;
  isNoticeApproved: boolean;
  isDraft: boolean;
  isPublished: boolean;
  emailNotification: boolean;
  pushNotification: boolean;
  WhatsAppNotification: boolean;
  targetAudience: string[];
  attachments: Attachment[];
  publishedBy: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
};

export default async function NoticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { orgRole } = await auth();

  // Map Clerk roles to application roles
  const roleMap: Record<string, Role> = {
    'org:admin': 'ADMIN',
    'org:teacher': 'TEACHER',
    'org:student': 'STUDENT',
    'org:parent': 'PARENT',
  };

  const userRole = orgRole && roleMap[orgRole] ? roleMap[orgRole] : 'STUDENT';

  // Fetch notice data
  const rawNotice = await prisma.notice.findUnique({
    where: { id },
  });

  if (!rawNotice) {
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

  const notice: NoticeWithAttachments = {
    ...rawNotice,
    attachments: Array.isArray(rawNotice.attachments)
      ? (rawNotice.attachments as Attachment[])
      : [],
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Notice Details</h1>
      <NoticeViewer notice={notice} userRole={userRole} />
    </div>
  );
}
