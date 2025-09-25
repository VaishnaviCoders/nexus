import { executeReminders } from '@/lib/data/fee/fee-reminder';
import prisma from '@/lib/db';
import { inngest } from '@/lib/inngest/client';
import { getISTDate } from '@/lib/utils';

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

export const updateExamStatuses = inngest.createFunction(
  { id: 'exam-status-updater' },
  { cron: '*/15 * * * *' }, // every 15 minutes
  async ({ step }) => {
    const now = new Date();

    // 1. Mark as UPCOMING (future exams not cancelled)
    const upcoming = await step.run('set-upcoming', async () =>
      prisma.exam.updateMany({
        where: {
          status: { notIn: ['CANCELLED', 'UPCOMING'] },
          startDate: { gt: now },
        },
        data: { status: 'UPCOMING' },
      })
    );

    // 2. Mark as LIVE (currently ongoing exams)
    const live = await step.run('set-live', async () =>
      prisma.exam.updateMany({
        where: {
          status: { notIn: ['CANCELLED', 'LIVE'] },
          startDate: { lte: now },
          endDate: { gte: now },
        },
        data: { status: 'LIVE' },
      })
    );

    // 3. Mark as COMPLETED (past exams)
    const completed = await step.run('set-completed', async () =>
      prisma.exam.updateMany({
        where: {
          status: { notIn: ['CANCELLED', 'COMPLETED'] },
          endDate: { lt: now },
        },
        data: { status: 'COMPLETED' },
      })
    );

    return {
      message: `Updated Exam statuses → UPCOMING: ${upcoming.count}, LIVE: ${live.count}, COMPLETED: ${completed.count}`,
    };
  }
);

// Notice

export const updateNoticeStatuses = inngest.createFunction(
  {
    id: 'notice-status-updater',
  },
  {
    // Cron in UTC equivalent of 11:59 PM IST → 18:29 UTC
    cron: '29 18 * * *',
  },
  async ({ step }) => {
    const nowIST = getISTDate();

    // 1. Mark PUBLISHED notices as EXPIRED if endDate has passed
    const expiredNotices = await step.run('mark-expired', async () =>
      prisma.notice.updateMany({
        where: {
          status: 'PUBLISHED',
          endDate: { lt: nowIST },
        },
        data: { status: 'EXPIRED' },
      })
    );

    // // 2. Optional: mark DRAFT notices as PUBLISHED if startDate reached
    // const publishedNotices = await step.run('auto-publish', async () =>
    //   prisma.notice.updateMany({
    //     where: {
    //       status: 'DRAFT',
    //       startDate: { lte: now },
    //     },
    //     data: { status: 'PUBLISHED' },
    //   })
    // );

    //  PUBLISHED: ${publishedNotices.count}
    return {
      message: `Notice statuses updated → EXPIRED: ${expiredNotices.count}`,
    };
  }
);
