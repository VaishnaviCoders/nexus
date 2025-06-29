import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export const getFeeCategoryDistribution = async () => {
  const orgId = await getOrganizationId();

  const result = await prisma.fee.groupBy({
    by: ['feeCategoryId'],
    where: {
      organizationId: orgId,
    },
    _sum: {
      paidAmount: true,
      pendingAmount: true,
    },
  });

  const categories = await prisma.feeCategory.findMany({
    where: {
      id: { in: result.map((r) => r.feeCategoryId) },
      organizationId: orgId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  const data = result.map((r) => {
    const category = categories.find((c) => c.id === r.feeCategoryId);
    return {
      name: category?.name ?? 'Unknown',
      paidAmount: r._sum.paidAmount ?? 0,
      pendingAmount: r._sum.pendingAmount ?? 0,
    };
  });

  return data;
};
