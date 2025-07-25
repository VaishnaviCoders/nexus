'use server';

import prisma from '@/lib/db';
import {
  FeeStatus,
  PaymentMethod,
  PaymentStatus,
} from '@/lib/generated/prisma';
import { getOrganizationId } from '@/lib/organization';
import { offlinePaymentFormData, offlinePaymentSchema } from '@/lib/schemas';
import { getCurrentUserId } from '@/lib/user';
import { formatCurrencyIN } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';
import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';

export const recordOfflinePayment = async (data: offlinePaymentFormData) => {
  const userId = await getCurrentUserId();
  const organizationId = await getOrganizationId();

  const validatedData = offlinePaymentSchema.parse(data);

  const fee = await prisma.fee.findUnique({
    where: { id: validatedData.feeId },
  });

  if (!fee) throw new Error('Fee not found');

  const pendingAmount = fee.pendingAmount ?? fee.totalFee - fee.paidAmount;
  if (pendingAmount <= 0) throw new Error('Fee already paid');

  if (validatedData.amount > pendingAmount)
    throw new Error('Payment amount exceeds remaining balance');
  if (fee.status === FeeStatus.PAID)
    throw new Error('Fee is already fully paid');

  // 4. Transaction: Create payment & update fee atomically

  await prisma.$transaction(async (tx) => {
    await tx.feePayment.create({
      data: {
        feeId: fee.id,
        amount: validatedData.amount,
        status: PaymentStatus.COMPLETED,
        receiptNumber: `REC-${randomUUID().slice(0, 8).toUpperCase()}`,
        transactionId: validatedData.transactionId,
        organizationId,
        note: validatedData.note,
        paymentMethod: validatedData.method,
        platformFee: 0,
        paymentDate: new Date(),
        createdAt: new Date(),
        payerId: validatedData.payerId,
        recordedBy: userId,
      },
    });
    // Update fee summary
    const newPaidAmount = fee.paidAmount + validatedData.amount;
    const newPendingAmount = Math.max(fee.totalFee - newPaidAmount, 0);
    await tx.fee.update({
      where: { id: fee.id },
      data: {
        paidAmount: newPaidAmount,
        pendingAmount: newPendingAmount,
        status: newPendingAmount === 0 ? FeeStatus.PAID : FeeStatus.UNPAID,
      },
    });

    revalidatePath('/dashboard/fees');

    return {
      success: true,
      message: `Successfully recorded offline payment of ₹${formatCurrencyIN(validatedData.amount)}`,
    };
  });
};
