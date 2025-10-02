import { getCurrentAcademicYearId } from '@/lib/academicYear';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export async function getMonthlyFeeData(year: number) {
  const [academicYearId, organizationId] = await Promise.all([
    getCurrentAcademicYearId(),
    getOrganizationId(),
  ]);
  const payments = await prisma.feePayment.groupBy({
    by: ['paymentDate'],
    where: {
      organizationId,
      status: 'COMPLETED',
      fee: {
        academicYearId, // Filter by current academic year
      },
      paymentDate: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lte: new Date(`${year}-12-31T23:59:59.999Z`),
      },
    },
    _sum: {
      amount: true,
    },
    _count: {
      _all: true,
    },
  });

  // Aggregate by month in JS
  const monthlyTotals = new Map<number, { amount: number; count: number }>();

  payments.forEach((payment) => {
    const month = new Date(payment.paymentDate).getMonth(); // 0-11
    const existing = monthlyTotals.get(month) || { amount: 0, count: 0 };

    monthlyTotals.set(month, {
      amount: existing.amount + (payment._sum.amount ?? 0),
      count: existing.count + payment._count._all,
    });
  });

  // Return data for all 12 months (fill missing months with zeros)
  return Array.from({ length: 12 }, (_, monthIndex) => {
    const data = monthlyTotals.get(monthIndex);
    return {
      year,
      month: monthIndex + 1, // 1-12 for display
      amount: data?.amount ?? 0,
      count: data?.count ?? 0,
    };
  });
}
