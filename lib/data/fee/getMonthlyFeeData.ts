import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export async function getMonthlyFeeData(years: number[]) {
  if (years.length === 0) return [];
  const organizationId = await getOrganizationId();

  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  const payments = await prisma.feePayment.findMany({
    where: {
      organizationId,
      status: 'COMPLETED',
      paymentDate: {
        gte: new Date(`${minYear}-01-01T00:00:00.000Z`),
        lte: new Date(`${maxYear}-12-31T23:59:59.999Z`),
      },
    },
    select: {
      amount: true,
      paymentDate: true,
    },
  });

  // Aggregate by year and month in JS
  const totals = new Map<string, { amount: number; count: number }>();

  payments.forEach((payment) => {
    const date = new Date(payment.paymentDate);
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    const key = `${year}-${month}`;
    const existing = totals.get(key) || { amount: 0, count: 0 };

    totals.set(key, {
      amount: existing.amount + (payment.amount ?? 0),
      count: existing.count + 1,
    });
  });

  // Return data for all months of all requested years
  const result = [];
  for (const year of years) {
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const data = totals.get(`${year}-${monthIndex}`);
      result.push({
        year,
        month: monthIndex + 1, // 1-12 for display
        amount: data?.amount ?? 0,
        count: data?.count ?? 0,
      });
    }
  }
  return result;
}
