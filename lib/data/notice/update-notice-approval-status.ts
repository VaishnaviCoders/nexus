'use server';

import { getNoticeRecipients } from '@/app/actions';
// import { getNoticeRecipients, sendNoticeEmails } from '@/app/actions';
import prisma from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { sendNoticeEmails } from './sendNoticeEmails';

export const updateNoticeApprovalStatus = async (
  noticeId: string,
  shouldApprove: boolean
) => {
  const user = await currentUser();
  if (!user) throw new Error('Authentication required');

  const updatedNotice = await prisma.notice.update({
    where: {
      id: noticeId,
    },
    data: {
      isNoticeApproved: shouldApprove,
    },
    include: {
      Organization: {
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
    if (recipients.length > 0) {
      await sendNoticeEmails(updatedNotice, recipients, user);
    }
  }

  revalidatePath('/dashboard/notices');
  return updatedNotice;
};
