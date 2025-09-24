'use server';

import { getNoticeRecipients } from '@/app/actions';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { sendNoticeEmails } from './sendNoticeEmails';
import { getCurrentUser } from '@/lib/user';

export const updateNoticeApprovalStatus = async (
  noticeId: string,
  shouldApprove: boolean
) => {
  const user = await getCurrentUser();

  const now = new Date();

  const updatedNotice = await prisma.notice.update({
    where: {
      id: noticeId,
    },
    data: shouldApprove
      ? {
          approvedBy:
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : 'System',
          approvedAt: now,
          publishedBy:
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : 'System',
          publishedAt: now,
          status: 'PUBLISHED',
        }
      : {
          approvedBy: null,
          approvedAt: null,
          publishedBy: null,
          publishedAt: null,
          status: 'REJECTED',
        },
    include: {
      organization: {
        select: {
          name: true,
          organizationLogo: true,
          organizationSlug: true,
          organizationType: true,
        },
      },
    },
  });

  if (shouldApprove && updatedNotice.emailNotification) {
    const recipients = await getNoticeRecipients(
      updatedNotice.organizationId,
      updatedNotice.targetAudience
    );
    // if (recipients.length > 0) {
    //   await sendNoticeEmails(updatedNotice, recipients, user);
    // }
  }

  revalidatePath('/dashboard/notices');
  return updatedNotice;
};
