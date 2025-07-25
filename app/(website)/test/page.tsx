'use server';

import { Feedback } from '@/components/Feedback';
import prisma from '@/lib/db';
import {
  NotificationChannel,
  NotificationStatus,
} from '@/lib/generated/prisma';
import { getOrganizationId } from '@/lib/organization';
import { calculateNotificationCost, formatCurrencyIN } from '@/lib/utils';

async function test() {
  const organization = await prisma.academicYear.findMany();
  return organization;
}

export async function getOrganizationTotalCost(
  organizationId: string
): Promise<number> {
  const result = await prisma.notificationLog.aggregate({
    where: {
      organizationId,
      status: {
        in: [NotificationStatus.SENT, NotificationStatus.DELIVERED],
      },
    },
    _sum: {
      cost: true,
    },
  });

  return Number(result._sum.cost || 0);
}

const page = async () => {
  const organizationId = await getOrganizationId();

  const data = await getOrganizationTotalCost(organizationId);

  console.log('data', data);

  const logs = await prisma.notificationLog.findMany({
    where: {
      organizationId,
    },
    select: {
      cost: true,
    },
  });

  const totalCostInRupees = logs.reduce((acc, log) => acc + log.cost, 0);

  console.log('Total Cost (₹):', totalCostInRupees);

  return (
    <div className="flex justify-center items-center h-screen">
      cost {formatCurrencyIN(totalCostInRupees)}
      <Feedback />
    </div>
  );
};

export default page;
