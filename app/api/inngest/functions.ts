import {
  executeReminders,
  sendFeeReminders,
} from '@/lib/data/fee/fee-reminder';
import prisma from '@/lib/db';
import { inngest } from '@/lib/inngest/client';
import { Ingest } from 'svix/dist/api/ingest';

export const updateOverdueFeesAutomation = inngest.createFunction(
  { id: 'fee-status-overdue-automation' },
  { cron: '30 22 * * *' },
  async ({ step }) => {
    const affectedRows = await step.run('fetch-unpaid-overdue', async () =>
      prisma.fee.updateMany({
        where: {
          status: 'UNPAID',
          dueDate: { lt: new Date() },
        },
        data: {
          status: 'OVERDUE',
        },
      })
    );
    return {
      message: `${affectedRows.count} fees marked as OVERDUE.`,
    };
  }
);

export const updatePaymentStatus = inngest.createFunction(
  {
    id: 'payment-status-update',
  },
  { cron: '30 22 * * *' },
  async ({ step }) => {
    const affectedRows = await step.run('fetch-payment-status', async () =>
      prisma.feePayment.updateMany({
        where: {
          status: 'PENDING',
        },
        data: {
          status: 'FAILED',
        },
      })
    );
    return {
      message: `${affectedRows.count} payment Status mark as FAILED.`,
    };
  }
);

export const scheduledFeeReminder = inngest.createFunction(
  { id: 'scheduled-fee-reminder' },
  { event: 'fee/reminder.scheduled' },
  async ({ event, step }) => {
    const { data, organizationId, jobId, scheduledDateTime } = event.data;

    // Step 1: Update job status to processing
    await step.run('update-job-status', async () => {
      await prisma.scheduledJob.update({
        where: { id: jobId },
        data: {
          status: 'PROCESSING',
          updatedAt: new Date(),
        },
      });
    });

    await step.sleepUntil('wait-for-scheduledDateTime', `${scheduledDateTime}`);

    // Step 2: Execute the reminder sending logic
    const result = await step.run('send-reminders', async () => {
      console.log('📧 Starting to send reminders NOW');
      return await executeReminders(data, organizationId);
    });

    // Step 3: Update job completion status
    await step.run('complete-job', async () => {
      await prisma.scheduledJob.update({
        where: { id: jobId },
        data: {
          status: result.success ? 'COMPLETED' : 'FAILED',
          result: JSON.stringify(result),
          updatedAt: new Date(),
        },
      });
    });

    return result;
  }
);
