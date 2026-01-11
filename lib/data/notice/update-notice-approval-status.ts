'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { sendNoticeEmails } from './sendNoticeEmails';
import { getCurrentUser } from '@/lib/user';
import { sendPushNotice } from './sendPushNotice';
import { NotificationChannel, NotificationStatus, NotificationType, Role } from '@/generated/prisma/enums';
import { calculateNotificationCost } from '@/lib/utils';

export const updateNoticeApprovalStatus = async (
  noticeId: string,
  shouldApprove: boolean
) => {
  try {
    const user = await getCurrentUser();

    const now = new Date();

    const actor = user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : "System";

    const notice = await prisma.notice.update({
      where: { id: noticeId },
      data: shouldApprove
        ? { approvedBy: actor, approvedAt: now, publishedBy: actor, publishedAt: now, status: "PUBLISHED" }
        : { approvedBy: null, approvedAt: null, publishedBy: null, publishedAt: null, status: "REJECTED" },
      include: { organization: true, attachments: true },
    });


    if (!notice) {
      throw new Error('Notice not found after update');
    }

    if (!shouldApprove) {
      revalidatePath('/dashboard/notices');
      revalidatePath(`/dashboard/notices/${noticeId}`);
      return notice;
    }

    // If approved, send notifications
    const recipients = await prisma.user.findMany({
      where: {
        role: { in: notice.targetAudience as Role[] }, // Based on notice target audience  ["ADMIN" , "STUDENT"]
        isActive: true,
      },
      select: {
        email: true,
        id: true
      },
    })

    const recipientEmails = recipients.map(user => user.email);

    console.log('recipientEmails:', recipientEmails);


    type NotificationTask = {
      type: 'email' | 'push' | 'whatsapp' | 'sms';
      promise: Promise<any>;
    };
    if (recipientEmails.length > 0) {
      const notifications: NotificationTask[] = [];

      if (notice.emailNotification) {
        notifications.push({
          type: 'email',
          promise: sendNoticeEmails(notice, recipientEmails)
        });
      }

      if (notice.pushNotification) {
        notifications.push({
          type: 'push',
          promise: sendPushNotice(notice, recipientEmails, user)
        });
      }

      if (notice.whatsAppNotification) {
        // notifications.push({
        //   type: 'whatsapp',
        //   promise: sendWhatsAppMessages(notice, recipientEmails)
        // });
      }

      if (notice.smsNotification) {
        // notifications.push({
        //   type: 'sms',
        //   promise: sendSMS(notice, recipientEmails)
        // });
      }

      // Execute all notifications in parallel
      const results = await Promise.allSettled(
        notifications.map(n => n.promise)
      );

      // Log results for each notification type
      results.forEach((result, index) => {
        const notificationType = notifications[index].type;
        if (result.status === 'fulfilled') {
          console.log(`${notificationType} notifications sent successfully`);
        } else {
          console.error(`${notificationType} notifications failed:`, result.reason);
        }
      });


      await Promise.all(
        results.map((result, index) =>
          prisma.notificationLog.createMany({
            data: recipients.map((recipient) => {
              const channel = notifications[index].type.toUpperCase() as NotificationChannel;
              return {
                title: "Notice",
                message: "Notice sent successfully",
                organizationId: notice.organizationId,
                noticeId: notice.id,
                userId: recipient.id,
                channel,
                notificationType: NotificationType.NOTICE,
                status: result.status === "fulfilled" ? NotificationStatus.SENT : NotificationStatus.FAILED,
                errorMessage: result.status === "rejected" ? String(result.reason) : null,
                cost: calculateNotificationCost(channel, 1), // ✅ add per-user cost
              };
            }),
          })
        )
      );
    }

    revalidatePath('/dashboard/notices');
    revalidatePath(`/dashboard/notices/${noticeId}`);

    return notice

  } catch (error) {
    console.error('Error updating notice approval status:', error);
    throw error;
  }
};
