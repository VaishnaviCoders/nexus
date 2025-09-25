'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { sendNoticeEmails } from './sendNoticeEmails';
import { getCurrentUser } from '@/lib/user';
import { sendPushNotice } from './sendPushNotice';
import { Role } from '@/generated/prisma/enums';

export const updateNoticeApprovalStatus = async (
  noticeId: string,
  shouldApprove: boolean
) => {
  const user = await getCurrentUser();

  const approvedBy = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : 'System'
  const publishedBy = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : 'System'

  const now = new Date();

  await prisma.notice.update({
    where: {
      id: noticeId,
    },
    data: shouldApprove
      ? {
        approvedBy,
        approvedAt: now,
        publishedBy,
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
  });

  const notice = await prisma.notice.findUnique({
    where: {
      id: noticeId,
    },
    include: {
      organization: true,
      attachments: true,
    },
  });

  if (!notice) {
    throw new Error('Notice not found after update');
  }


  // If approved, send notifications
  if (shouldApprove) {
    const recipientEmailObjects = await prisma.user.findMany({
      where: {
        role: { in: notice.targetAudience as Role[] }, // Based on notice target audience  ["ADMIN" , "STUDENT"]
        isActive: true,
      },
      select: {
        email: true,

      },
    });
    const recipientEmails: string[] = recipientEmailObjects.map(user => user.email)

    console.log('recipientEmails:', recipientEmails);

    if (recipientEmails.length > 0) {
      // Email
      if (notice.emailNotification) {
        await sendNoticeEmails(notice, recipientEmails,);
      }

      // WhatsApp
      if (notice.whatsAppNotification) {
        // await sendWhatsAppMessages(updatedNotice, recipientEmails);
      }

      // Push notifications
      if (notice.pushNotification) {
        await sendPushNotice(notice, recipientEmails, user);
      }

      // SMS
      if (notice.smsNotification) {
        // await sendSMS(updatedNotice, recipientEmails);
      }
    }
  }

  revalidatePath('/dashboard/notices');
  revalidatePath(`/dashboard/notices/${noticeId}`);


  return notice
};
