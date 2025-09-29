'use server';
import { Resend } from 'resend';

import { Prisma } from '@/generated/prisma/client';
import NoticeEmailTemplate from '@/components/templates/email-templates/notice';

type NoticeWithOrgAndAttachments = Prisma.NoticeGetPayload<{
  include: {
    organization: true;
    attachments: true;
  };
}>;

export const sendNoticeEmails = async (
  notice: NoticeWithOrgAndAttachments,
  recipientEmails: string[]
) => {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const { data, error } = await resend.emails.send({
    from: 'no-reply@shiksha.cloud',
    to: recipientEmails,
    subject: `Notice: ${notice.title}`,
    attachments: notice.attachments.map((attachment) => ({
      contentType: attachment.fileType,
      filename: attachment.fileName,
      path: attachment.fileUrl,
    })),

    react: NoticeEmailTemplate({
      id: notice.id,
      title: notice.title,
      content: notice.content,
      summary: notice.summary ?? '',
      noticeType: notice.noticeType,
      priority: notice.priority,
      startDate: notice.startDate,
      endDate: notice.endDate,
      isUrgent: notice.isUrgent,
      targetAudience: notice.targetAudience,
      organizationName: notice.organization.name || '',
      publishedBy: notice.publishedBy || 'System',
      organizationImage: notice.organization.organizationLogo ?? '',
      createdBy: notice.createdBy || 'System',
      publishedAt: notice.createdAt,
    }),
  });

  if (error) {
    console.error('Error sending email:', error);
    return;
  }
  console.log('Email Notifications sent:', data);
};
