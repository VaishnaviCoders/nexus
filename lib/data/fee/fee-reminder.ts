'use server';

import {
  ReminderResult,
  SendReminderData,
} from '@/components/dashboard/Fees/SendFeesReminderDialog';
import prisma from '@/lib/db';
import { NotificationChannel } from '@/lib/generated/prisma';
import { getOrganizationId } from '@/lib/organization';
import { calculateNotificationCost } from '@/lib/utils';
import { Resend } from 'resend';
import { z } from 'zod';

const reminderDataSchema = z.object({
  recipients: z.array(
    z.object({
      id: z.string(),
      studentId: z.string(),
      studentName: z.string(),
      grade: z.string(),
      section: z.string(),
      parentName: z.string(),
      parentEmail: z.string().email(),
      parentPhone: z.string(),
      parentWhatsApp: z.string().optional(),
      parentUserId: z.string().nullable().optional(),
      parentId: z.string().nullable().optional(),
      status: z.enum(['UNPAID', 'OVERDUE']),
      amountDue: z.number(),
      dueDate: z.date(),
      avatar: z.string().optional(),
      organizationName: z.string().optional(),
    })
  ),
  channels: z.array(z.enum(['email', 'sms', 'whatsapp'])),
  subject: z.string().min(1),
  message: z.string().min(1),
  scheduleDate: z.date().nullable().optional(),
  scheduleTime: z.string().nullable().optional(),
});

const toPrismaChannel = (channel: string): NotificationChannel => {
  switch (channel.toLowerCase()) {
    case 'email':
      return NotificationChannel.EMAIL;
    case 'sms':
      return NotificationChannel.SMS;
    case 'whatsapp':
      return NotificationChannel.WHATSAPP;
    default:
      throw new Error(`Unknown channel: ${channel}`);
  }
};

export async function sendFeeReminders(
  data: SendReminderData
): Promise<ReminderResult> {
  const organizationId = await getOrganizationId();
  try {
    const validated = reminderDataSchema.parse(data);

    if (validated.scheduleDate && validated.scheduleTime) {
      // TODO: Save to queue/schedule later
      console.log(
        '⏱ Scheduled Reminder:',
        validated.scheduleDate,
        validated.scheduleTime
      );
      return { success: true, sentCount: 0 };
    }

    let totalSent = 0;
    let totalFailed = 0;

    console.log(
      'Sending reminders to',
      validated.recipients.length,
      'recipients',
      validated.recipients
    );

    // Step 2: Loop through recipients and send reminders
    for (const recipient of validated.recipients) {
      for (const channel of validated.channels) {
        const prismaChannel = toPrismaChannel(channel);
        const cost = calculateNotificationCost(prismaChannel, 1); // 1 unit per recipient per channel

        const personalizedMessage = validated.message
          .replace('{STUDENT_NAME}', recipient.studentName)
          .replace(
            '{ORGANIZATION_NAME}',
            recipient.organizationName || 'School Administration'
          )
          .replace(
            '{AMOUNT}',
            recipient.amountDue.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0,
            })
          );

        // Call external APIs here based on the channel

        let status: 'SENT' | 'FAILED' = 'SENT';
        try {
          if (channel === 'email') {
            console.log(
              'Sending email to:',
              validated.subject,
              recipient.parentEmail,
              personalizedMessage
            );

            await sendEmail(
              recipient.parentEmail,
              // 'vaishnaviraykar768@gmail.com',
              validated.subject,
              personalizedMessage
            );
          } else if (channel === 'sms') {
            await sendSMS(recipient.parentPhone, personalizedMessage);
          } else if (channel === 'whatsapp') {
            await sendWhatsApp(recipient.parentPhone, personalizedMessage);
          }

          // Optionally: save to a FeeReminderHistory table in Prisma

          await prisma.notificationLog.create({
            data: {
              organizationId, // Pass this into recipient if needed
              userId: recipient.parentUserId ?? null, // You can add parent.userId if you track it
              studentId: recipient.studentId,
              parentId: recipient.parentId,
              channel: prismaChannel,
              notificationType: 'FEE_REMINDER',
              status,
              units: 1,
              cost: cost,
              sentAt: new Date(),
            },
          });

          totalSent++;
        } catch (error) {
          console.error(
            `❌ Failed to send ${channel} to ${recipient.parentName}:`,
            error
          );
          status = 'FAILED';
          totalFailed++;
        }
      }
    }

    return {
      success: totalFailed === 0,
      sentCount: totalSent,
      error: totalFailed
        ? `Failed to send ${totalFailed} reminders`
        : undefined,
    };
  } catch (error) {
    console.error('Failed to send reminders:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

const sendEmail = async (
  recipientEmail: string,
  subject: string,
  message: string
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const resendResponse = await resend.emails.send({
    from: 'no-reply@shiksha.cloud',
    to: recipientEmail,
    subject: subject,
    react: message,
  });
  console.log('Notifications sent:', { resendResponse });
};

const sendSMS = async (recipientPhone: string, message: string) => {
  // Implement SMS sending
  console.log('Sending SMS to:', recipientPhone, message);
};

const sendWhatsApp = async (recipientPhone: string, message: string) => {
  // Implement WhatsApp sending
  console.log('Sending WhatsApp to:', recipientPhone, message);
};
