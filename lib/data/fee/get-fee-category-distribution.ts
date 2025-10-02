'use server';
import { getCurrentAcademicYearId } from '@/lib/academicYear';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export const getFeeCategoryDistribution = async () => {
  const organizationId = await getOrganizationId();
  const academicYearId = await getCurrentAcademicYearId();

  const result = await prisma.fee.groupBy({
    by: ['feeCategoryId'],
    where: {
      organizationId,
      academicYearId,
    },
    _sum: {
      paidAmount: true,
      pendingAmount: true,
    },
  });

  const categories = await prisma.feeCategory.findMany({
    where: {
      id: { in: result.map((r) => r.feeCategoryId) },
      organizationId,
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
