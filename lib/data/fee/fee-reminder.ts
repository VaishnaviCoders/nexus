'use server';

import {
  ReminderResult,
  SendReminderData,
} from '@/components/dashboard/Fees/SendFeesReminderDialog';
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

export async function sendFeeReminders(
  data: SendReminderData
): Promise<ReminderResult> {
  try {
    const validated = reminderDataSchema.parse(data);

    if (validated.scheduleDate && validated.scheduleTime) {
      console.log(
        'Scheduling reminder:',
        validated.scheduleDate,
        validated.scheduleTime
      );
      // Save to DB or a job queue
    }

    // Step 2: Loop through recipients and send reminders
    for (const recipient of validated.recipients) {
      for (const channel of validated.channels) {
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
        if (channel === 'email') {
          console.log(
            'Sending email to:',
            validated.subject,
            recipient.parentEmail,
            personalizedMessage
          );

          await sendEmail(
            'vaishnaviraykar768@gmail.com',
            validated.subject,
            personalizedMessage
          );
        } else if (channel === 'sms') {
          // await sendSMS(recipient.parentPhone, personalizedMessage);
          await sendSMS(recipient.parentPhone, personalizedMessage);
        } else if (channel === 'whatsapp') {
          // await sendWhatsApp(recipient.parentPhone, personalizedMessage);
        }
      }
    }
    // Optionally: save to a FeeReminderHistory table in Prisma

    return {
      success: true,
      sentCount: validated.recipients.length,
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
    from: 'onboarding@resend.dev',
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
