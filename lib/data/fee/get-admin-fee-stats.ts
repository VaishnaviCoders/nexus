'use server';

import { getCurrentAcademicYearId } from '@/lib/academicYear';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export const getAdminFeesSummary = async () => {
  const organizationId = await getOrganizationId();
  const academicYearId = await getCurrentAcademicYearId();
  const [feeStats, overdueStats, studentCounts] = await Promise.all([
    prisma.fee.aggregate({
      where: {
        organizationId,
        academicYearId,
      },
      _sum: {
        totalFee: true,
        paidAmount: true,
        pendingAmount: true,
      },
    }),
    prisma.fee.aggregate({
      where: {
        organizationId,
        status: 'OVERDUE',
      },
      _sum: {
        pendingAmount: true,
      },
    }),
    prisma.fee.groupBy({
      by: ['studentId'],
      where: { organizationId },
      _max: { status: true },
    }),
  ]);

  const totalStudents = studentCounts.length;

  let paidStudents = 0;
  let unpaidStudents = 0;

  studentCounts.forEach((student) => {
    const status = student._max.status;
    if (status === 'PAID') paidStudents += 1;
    else unpaidStudents += 1;
  });

  return {
    totalFees: feeStats._sum.totalFee || 0,
    collectedFees: feeStats._sum.paidAmount || 0,
    pendingFees: feeStats._sum.pendingAmount || 0,
    overdueFees: overdueStats._sum.pendingAmount || 0,
    totalStudents,
    paidStudents,
    unpaidStudents,
  };
};
