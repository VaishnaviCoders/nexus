'use server';

import {
  EmailFeeTemplateProps,
  ReminderResult,
  SendReminderData,
} from '@/components/dashboard/Fees/SendFeesReminderDialog';
import prisma from '@/lib/db';
import {
  NotificationChannel,
  scheduledJobType,
} from '@/generated/prisma/enums';
import { inngest } from '@/lib/inngest/client';
import { getOrganizationId } from '@/lib/organization';
import { getCurrentUser } from '@/lib/user';
import { calculateNotificationCost } from '@/lib/utils';
import { Resend } from 'resend';
import { z } from 'zod';
import { FriendlyReminderTemplate } from '@/components/templates/email-templates/fees/friendly-reminder';
import { OverdueNoticeTemplate } from '@/components/templates/email-templates/fees/overdue-notice';

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
      organizationEmail: z.string().optional(),
      organizationPhone: z.string().optional(),
    })
  ),
  channels: z.array(z.enum(['email', 'sms', 'whatsapp'])),
  subject: z.string().min(1),
  message: z.string().min(1),
  scheduleDate: z.date().nullable().optional(),
  scheduleTime: z.string().nullable().optional(),
  templateType: z.enum([
    'FEE_ASSIGNMENT',
    'FRIENDLY_REMINDER',
    'PAYMENT_DUE_TODAY',
    'OVERDUE_NOTICE',
  ]),
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

// Template selector function
const getEmailTemplate = (templateType: string, props: any) => {
  switch (templateType) {
    case 'FRIENDLY_REMINDER':
      return FriendlyReminderTemplate(props);
    case 'OVERDUE_NOTICE':
      return OverdueNoticeTemplate(props);
    case 'FEE_ASSIGNMENT':
      // Create fee assignment template or use friendly reminder as fallback
      return FriendlyReminderTemplate({ ...props, isAssignment: true });
    case 'PAYMENT_DUE_TODAY':
      // Create payment due today template or use friendly reminder as fallback
      return FriendlyReminderTemplate({ ...props, isUrgent: true });
    default:
      return FriendlyReminderTemplate(props);
  }
};

// Enhanced email sending with proper template support
const sendEmail = async (
  recipientEmail: string,
  subject: string,
  templateType: string,
  templateProps: EmailFeeTemplateProps
) => {
  const resend = new Resend(process.env.RESEND_API_KEY!);

  const htmlContent = getEmailTemplate(templateType, templateProps);

  const resendResponse = await resend.emails.send({
    from: 'no-reply@shiksha.cloud',
    to: recipientEmail,
    subject: subject,
    html: htmlContent,
  });

  console.log('Email sent:', {
    to: recipientEmail,
    subject,
    templateType,
    responseId: resendResponse.data?.id,
  });

  return resendResponse;
};

const sendSMS = async (recipientPhone: string, message: string) => {
  // Implement SMS sending logic
  console.log('Sending SMS to:', recipientPhone, message);
  // Add your SMS provider integration here
  return { success: true };
};

const sendWhatsApp = async (recipientPhone: string, message: string) => {
  // Implement WhatsApp sending logic
  console.log('Sending WhatsApp to:', recipientPhone, message);
  // Add your WhatsApp provider integration here
  return { success: true };
};

export async function sendFeeReminders(
  data: SendReminderData
): Promise<ReminderResult> {
  const organizationId = await getOrganizationId();
  const user = await getCurrentUser();
  const createdBy = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

  try {
    const validated = reminderDataSchema.parse(data);

    if (validated.scheduleDate && validated.scheduleTime) {
      const scheduleResult = await scheduleReminder(
        validated,
        organizationId,
        createdBy
      );
      return scheduleResult;
    }

    return await executeReminders(validated, organizationId, createdBy);
  } catch (error) {
    console.error('Failed to send reminders:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function scheduleReminder(
  data: SendReminderData,
  organizationId: string,
  createdBy: string
): Promise<ReminderResult> {
  try {
    if (!data.scheduleDate || !data.scheduleTime) {
      return {
        success: false,
        error: 'Schedule date and time must be provided',
      };
    }

    const dateOnly = data.scheduleDate.toISOString().split('T')[0];
    const timeOnly = data.scheduleTime;
    const isoString = `${dateOnly}T${timeOnly}:00+05:30`;
    const scheduledDateTime = new Date(isoString);

    const currentTime = new Date();
    const minFutureTime = new Date(currentTime.getTime() + 2 * 60 * 1000);

    if (scheduledDateTime <= minFutureTime) {
      return {
        success: false,
        error: `Scheduled time must be at least 2 minutes in the future. Got: ${scheduledDateTime.toISOString()}`,
      };
    }

    const scheduledJob = await prisma.scheduledJob.create({
      data: {
        organizationId,
        type: scheduledJobType.FEE_REMINDER,
        scheduledAt: scheduledDateTime,
        data: JSON.stringify(data),
        status: 'PENDING',
        createdBy,
        channels: data.channels.map(toPrismaChannel),
      },
    });

    await inngest.send({
      name: 'fee/reminder.scheduled',
      data: {
        data,
        scheduledDateTime,
        organizationId,
        jobId: scheduledJob.id,
      },
    });

    return {
      success: true,
      sentCount: 0,
      scheduledJobId: scheduledJob.id,
      scheduledAt: scheduledDateTime,
      message: `Reminder scheduled for ${scheduledDateTime.toLocaleString()}`,
    };
  } catch (error) {
    console.error('Failed to schedule reminder:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to schedule reminder',
    };
  }
}

export async function executeReminders(
  validated: SendReminderData,
  organizationId: string,
  createdBy?: string
) {
  let totalSent = 0;
  let totalFailed = 0;
  const errors: string[] = [];

  for (const recipient of validated.recipients) {
    for (const channel of validated.channels) {
      const prismaChannel = toPrismaChannel(channel);
      const cost = calculateNotificationCost(prismaChannel, 1);

      try {
        // Prepare template props for email
        const templateProps = {
          PARENT_NAME: recipient.parentName,
          STUDENT_NAME: recipient.studentName,
          GRADE: recipient.grade,
          SECTION: recipient.section,
          AMOUNT: recipient.amountDue.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
          }),
          DUE_DATE: recipient.dueDate.toLocaleDateString('en-IN'),
          ORGANIZATION_NAME:
            recipient.organizationName || 'School Administration',
          ORGANIZATION_CONTACT_EMAIL:
            recipient.organizationEmail || 'support@shiksha.cloud',
          ORGANIZATION_CONTACT_PHONE:
            recipient.organizationPhone || 'Shiksha-Cloud : 8459324821',
          ORGANIZATION_CONTACT_INFO: [
            recipient.organizationName,
            recipient.organizationEmail &&
              `Email: ${recipient.organizationEmail}`,
            recipient.organizationPhone &&
              `Phone: ${recipient.organizationPhone}`,
          ]
            .filter(Boolean)
            .join('\n'),
          PORTAL_LINK: 'https://www.shiksha.cloud/dashboard/',
          // REMOVE THIS: message: validated.message,
        };

        // Personalize subject
        const personalizedSubject = validated.subject
          .replace(/{STUDENT_NAME}/g, recipient.studentName)
          .replace(/{PARENT_NAME}/g, recipient.parentName)
          .replace(/{GRADE}/g, recipient.grade)
          .replace(/{SECTION}/g, recipient.section)
          .replace(/{DUE_DATE}/g, recipient.dueDate.toLocaleDateString('en-IN'))
          .replace(
            /{AMOUNT}/g,
            recipient.amountDue.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0,
            })
          );

        // Personalize message for SMS/WhatsApp
        const personalizedMessage = validated.message
          .replace(/{PARENT_NAME}/g, recipient.parentName)
          .replace(/{STUDENT_NAME}/g, recipient.studentName)
          .replace(/{GRADE}/g, recipient.grade)
          .replace(/{SECTION}/g, recipient.section)
          .replace(/{DUE_DATE}/g, recipient.dueDate.toLocaleDateString('en-IN'))
          .replace(
            /{AMOUNT}/g,
            recipient.amountDue.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0,
            })
          )
          .replace(/{PORTAL_LINK}/g, 'https://www.shiksha.cloud/dashboard/')
          .replace(
            /{ORGANIZATION_NAME}/g,
            recipient.organizationName || 'School Administration'
          )
          .replace(
            /{ORGANIZATION_CONTACT_EMAIL}/g,
            recipient.organizationEmail || 'support@shiksha.cloud'
          )
          .replace(
            /{ORGANIZATION_CONTACT_PHONE}/g,
            recipient.organizationPhone || 'Shiksha-Cloud : 8459324821'
          );

        // Send via appropriate channel
        if (channel === 'email') {
          await sendEmail(
            recipient.parentEmail,
            personalizedSubject,
            validated.templateType,
            templateProps
          );
        } else if (channel === 'sms') {
          await sendSMS(recipient.parentPhone, personalizedMessage);
        } else if (channel === 'whatsapp') {
          await sendWhatsApp(
            recipient.parentWhatsAppNumber ||
              recipient.studentWhatsappNumber ||
              '',
            personalizedMessage
          );
        }

        // Log successful notification
        await prisma.notificationLog.create({
          data: {
            organizationId,
            userId: recipient.parentUserId ?? null,
            studentId: recipient.studentId,
            parentId: recipient.parentId,
            channel: prismaChannel,
            notificationType: 'FEE_REMINDER',
            status: 'SENT',
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

        // Log failed notification
        await prisma.notificationLog.create({
          data: {
            organizationId,
            userId: recipient.parentUserId ?? null,
            studentId: recipient.studentId,
            parentId: recipient.parentId,
            channel: prismaChannel,
            notificationType: 'FEE_REMINDER',
            status: 'FAILED',
            errorMessage:
              error instanceof Error ? error.message : 'Unknown error',
            units: 1,
            cost: cost,
            sentAt: new Date(),
          },
        });

        totalFailed++;
        errors.push(
          `Failed to send ${channel} to ${recipient.parentName}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
  }

  return {
    success: totalFailed === 0,
    sentCount: totalSent,
    error:
      totalFailed > 0
        ? `Failed to send ${totalFailed} reminders. ${errors.join('; ')}`
        : undefined,
    message:
      totalFailed === 0
        ? `Successfully sent ${totalSent} reminders`
        : undefined,
  };
}
