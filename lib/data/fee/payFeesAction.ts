'use server';

import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function payFeesAction(
  feeId: string,
  amount: number,
  note?: string
) {
  const user = await currentUser();
  const orgId = await getOrganizationId();

  if (!user) {
    throw new Error('No user found');
  }

  const receiptNumber = `RCP-${Date.now()}-${Math.floor(
    Math.random() * 1000
  )}-${feeId}`;

  try {
    await prisma.$transaction(async (ctx) => {
      // ✅ Check if fee exists and belongs to this org
      const fee = await ctx.fee.findFirst({
        where: {
          id: feeId,
          organizationId: orgId,
        },
      });

      if (!fee) throw new Error('Fee not found or unauthorized access');
      if (fee.status === 'PAID' && fee.pendingAmount === 0)
        throw new Error('Fee is already paid');

      // Calculate new paid and pending amounts
      const newPaidAmount = (fee.paidAmount ?? 0) + amount;
      const newPendingAmount = Math.max((fee.totalFee ?? 0) - newPaidAmount, 0);

      // Determine new status
      let newStatus: 'PAID' | 'UNPAID' | 'OVERDUE' = 'UNPAID';
      if (newPendingAmount <= 0) {
        newStatus = 'PAID';
      } else if (fee.dueDate < new Date()) {
        newStatus = 'OVERDUE';
      }

      // ✅ Create payment
      const feePayment = await ctx.feePayment.create({
        data: {
          organizationId: orgId,
          receiptNumber,
          amountPaid: amount,
          recordedBy: user.id,
          paymentDate: new Date(),
          note: note || 'Payment made via UPI',
          paymentMethod: 'UPI',
          payerId: user.id,
          feeId,
        },
      });

      console.log('✅ Fee payment recorded:', feePayment.id);

      // Update fee record
      await ctx.fee.update({
        where: { id: feeId },
        data: {
          status: newStatus,
          paidAmount: newPaidAmount,
          updatedAt: new Date(),
          pendingAmount: newPendingAmount,
        },
      });
    });

    revalidatePath('/dashboard/fees/parent');
    return { success: true, message: 'Fee payment successful' };
  } catch (error: any) {
    console.error('❌ Fee payment error:', error);
    return { success: false, message: error.message ?? 'Something went wrong' };
  }
}

export default async function fixIncorrectFeeStatuses() {
  // Find all incorrectly marked "PAID" fees
  const incorrectFees = await prisma.fee.findMany({
    where: {
      status: 'PAID',
      paidAmount: { lt: prisma.fee.fields.totalFee },
    },
  });

  for (const fee of incorrectFees) {
    const pendingAmount = fee.totalFee - fee.paidAmount;
    const now = new Date();
    let newStatus: 'UNPAID' | 'OVERDUE' = 'UNPAID';
    if (fee.dueDate < now) {
      newStatus = 'OVERDUE';
    }

    await prisma.fee.update({
      where: { id: fee.id },
      data: {
        status: newStatus,
        pendingAmount,
        updatedAt: now,
      },
    });
  }

  return { updated: incorrectFees.length };
}
