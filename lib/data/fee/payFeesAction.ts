'use server';

import prisma from '@/lib/db';
import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function payFeesAction(feeId: string, amount: number) {
  const user = await currentUser();
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error('No organization found');
  }

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

      if (fee.status === 'PAID') throw new Error('Fee is already paid');

      // ✅ Create payment
      const feePayment = await ctx.feePayment.create({
        data: {
          organizationId: orgId,
          receiptNumber,
          amountPaid: amount,
          recordedBy: user.id,
          paymentDate: new Date(),
          notes: 'Payment made via UPI',
          paymentMethod: 'UPI',
          payerName: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
          payerPhone: user.phoneNumbers?.[0]?.phoneNumber ?? null,
          feeId,
        },
      });

      console.log('✅ Fee payment recorded:', feePayment.id);

      await prisma.fee.update({
        where: {
          id: feeId,
        },
        data: {
          status: 'PAID',
          paidAmount: amount,
          updatedAt: new Date(),
          pendingAmount: 0,
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
