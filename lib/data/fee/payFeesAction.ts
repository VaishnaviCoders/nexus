'use server';

import { createHash, randomUUID } from 'crypto';

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

  const transactionId = `TXN-${randomUUID().slice(0, 10)}`;

  const payload = {
    merchantId: process.env.NEXT_PUBLIC_PAYMENT_MERCHANT_ID,
    merchantTransactionId: transactionId,
    merchantUserId: 'MUID-' + randomUUID().toString().slice(-6),
    amount: amountToPay * 100,
    redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/status/${transactionId}`,
    redirectMode: 'REDIRECT',
    callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/status/${transactionId}`,
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
  };

  function generateSha256(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  const dataPayload = JSON.stringify(payload);
  const dataBase64 = Buffer.from(dataPayload).toString('base64');

  const fullURL = dataBase64 + '/pg/v1/pay' + process.env.NEXT_PUBLIC_SALT_KEY;
  const dataSha256 = generateSha256(fullURL);

  const checksum = dataSha256 + '###' + process.env.NEXT_PUBLIC_SALT_INDEX;

  const UAT_PAY_API_URL = `${process.env.NEXT_PUBLIC_PHONE_PAY_HOST_URL}/pg/v1/pay`;

  try {
    const response = await fetch(UAT_PAY_API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      body: JSON.stringify({ request: dataBase64 }),
    });

    console.log('Response', response);

    return {
      // redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
      transactionId: transactionId,
    };
  } catch (error) {
    console.error('Error in server action:', error);
    throw error;
  }
};

// const [payment] = await prisma.$transaction([
//   // 1. Create FeePayment record
//   prisma.feePayment.create({
//     data: {
//       feeId: fee.id,
//       amount: amountToPay,
//       status: PaymentStatus.COMPLETED,
//       paymentMethod: PaymentMethod.UPI, // or collect dynamically
//       receiptNumber: `REC-${randomUUID().slice(0, 8).toUpperCase()}`,
//       transactionId: transactionId,
//       note: 'Paid via parent dashboard',
//       payerId: user.id,
//       organizationId: organizationId,
//       platformFee,
//       recordedBy: user.id,
//     },
//   }),

//   // 2. Update Fee record
//   prisma.fee.update({
//     where: { id: fee.id },
//     data: {
//       paidAmount: totalPaid,
//       pendingAmount: isFullyPaid ? 0 : fee.totalFee - totalPaid,
//       status: isFullyPaid ? FeeStatus.PAID : FeeStatus.UNPAID,
//     },
//   }),
// ]);

// revalidatePath('/dashboard/fees/parent');

// return { success: true, paymentId: payment.id };
// };
