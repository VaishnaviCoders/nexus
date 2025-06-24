'use server';

import { randomUUID } from 'crypto';
import {
  PaymentMethod,
  PaymentStatus,
  FeeStatus,
} from '@/lib/generated/prisma';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { revalidatePath } from 'next/cache';

export const payFeesAction = async (feeId: string) => {
  const user = await currentUser();
  const organizationId = await getOrganizationId();
  if (!user?.id) throw new Error('Unauthorized');

  const fee = await prisma.fee.findUnique({
    where: { id: feeId },
  });

  if (!fee) throw new Error('Fee not found');
  if (fee.status === 'PAID') throw new Error('Fee already paid');

  const amountToPay = fee.pendingAmount ?? fee.totalFee - fee.paidAmount;
  if (amountToPay <= 0) throw new Error('Nothing to pay');

  const platformFee = parseFloat((amountToPay * 0.02).toFixed(2));
  const totalPaid = parseFloat((fee.paidAmount + amountToPay).toFixed(2));
  const isFullyPaid = totalPaid >= fee.totalFee;

  const [payment] = await prisma.$transaction([
    // 1. Create FeePayment record
    prisma.feePayment.create({
      data: {
        feeId: fee.id,
        amount: amountToPay,
        status: PaymentStatus.COMPLETED,
        paymentMethod: PaymentMethod.UPI, // or collect dynamically
        receiptNumber: `REC-${randomUUID().slice(0, 8).toUpperCase()}`,
        transactionId: `TXN-${randomUUID().slice(0, 10)}`,
        note: 'Paid via parent dashboard',
        payerId: user.id,
        organizationId: organizationId,
        platformFee,
        recordedBy: user.id,
      },
    }),

    // 2. Update Fee record
    prisma.fee.update({
      where: { id: fee.id },
      data: {
        paidAmount: totalPaid,
        pendingAmount: isFullyPaid ? 0 : fee.totalFee - totalPaid,
        status: isFullyPaid ? FeeStatus.PAID : FeeStatus.UNPAID,
      },
    }),
  ]);

  revalidatePath('/dashboard/fees/parent');

  return { success: true, paymentId: payment.id };
};
