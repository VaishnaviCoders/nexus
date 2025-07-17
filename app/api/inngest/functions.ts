import prisma from '@/lib/db';
import { inngest } from '@/lib/inngest/client';

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
