import prisma from '@/lib/db';

export async function getMonthlyFeeData(year: number) {
  const result = await prisma.feePayment.groupBy({
    by: ['paymentDate'],
    where: {
      status: 'COMPLETED',
      paymentDate: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lte: new Date(`${year}-12-31T23:59:59.999Z`),
      },
    },
    _sum: {
      amount: true,
    },
    _count: {
      id: true,
    },
  });

  // Aggregate by month in JS
  const monthlyData: Record<string, { amount: number; count: number }> = {};

  result.forEach((entry) => {
    const month = new Date(entry.paymentDate).getMonth(); // 0-indexed
    if (!monthlyData[month]) {
      monthlyData[month] = { amount: 0, count: 0 };
    }
    monthlyData[month].amount += entry._sum.amount ?? 0;
    monthlyData[month].count += entry._count.id;
  });

  // Normalize output to all 12 months
  const data = Array.from({ length: 12 }, (_, i) => ({
    year,
    month: i + 1, // 1-indexed for consistency
    amount: monthlyData[i]?.amount ?? 0,
    count: monthlyData[i]?.count ?? 0,
  }));

  new Promise((resolve) => setTimeout(resolve, 1000));
  return data;
}
