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

function generateSha256(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

export const phonePayInitPayment = async (feeId: string) => {
  const user = await currentUser();
  const organizationId = await getOrganizationId();
  if (!user?.id) throw new Error('Unauthorized');

  // Validate environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_PAYMENT_MERCHANT_ID',
    'NEXT_PUBLIC_SALT_KEY',
    'NEXT_PUBLIC_SALT_INDEX',
    'NEXT_PUBLIC_PHONE_PAY_HOST_URL',
    'NEXT_PUBLIC_APP_URL',
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Missing environment variable: ${envVar}`);
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  }

  const fee = await prisma.fee.findUnique({
    where: { id: feeId },
  });

  if (!fee) throw new Error('Fee not found');
  if (fee.status === 'PAID') throw new Error('Fee already paid');

  const pendingAmount = fee.pendingAmount ?? fee.totalFee - fee.paidAmount;

  if (pendingAmount <= 0) {
    throw new Error('No outstanding amount to pay');
  }

  const platformFee = parseFloat((pendingAmount * 0.02).toFixed(2));

  const totalPayableAmount = pendingAmount + platformFee;

  const transactionId = `TXN-${randomUUID().slice(0, 10)}`;

  const payload = {
    merchantId: process.env.NEXT_PUBLIC_PAYMENT_MERCHANT_ID,
    merchantTransactionId: transactionId,
    merchantUserId: 'MUID-' + randomUUID().toString().slice(-6),
    amount: totalPayableAmount,
    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/phonepay-callback/${transactionId}`,
    redirectMode: 'REDIRECT',
    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/phonepay-callback/${transactionId}`,
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
  };

  console.log('Payment Payload:', payload);

  const dataPayload = JSON.stringify(payload);
  const dataBase64 = Buffer.from(dataPayload).toString('base64');

  const stringToHash =
    dataBase64 + '/pg/v1/pay' + process.env.NEXT_PUBLIC_SALT_KEY;

  const dataSha256 = generateSha256(stringToHash);
  const checksum = dataSha256 + '###' + process.env.NEXT_PUBLIC_SALT_INDEX;

  console.log('Checksum generated:', checksum);

  const PAY_API_URL = `${process.env.NEXT_PUBLIC_PHONE_PAY_HOST_URL}/pg/v1/pay`;

  try {
    const response = await fetch(PAY_API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': process.env.NEXT_PUBLIC_PAYMENT_MERCHANT_ID!,
      },
      body: JSON.stringify({ request: dataBase64 }),
    });

    const responseData = await response.json();
    console.log('Payment API Response:', responseData);

    if (!response.ok) {
      console.error('API Error Details:', responseData);
      throw new Error(
        `Payment API error: ${response.status} ${response.statusText}. Details: ${JSON.stringify(responseData)}`
      );
    }

    if (
      responseData.success &&
      responseData.data?.instrumentResponse?.redirectInfo?.url
    ) {
      // Only create database record AFTER successful PhonePe response
      await prisma.feePayment.create({
        data: {
          feeId: fee.id,
          amount: pendingAmount * 100, // store only actual fee, not platformFe
          status: PaymentStatus.PENDING,
          paymentMethod: PaymentMethod.UPI,
          receiptNumber: `REC-${randomUUID().slice(0, 8).toUpperCase()}`,
          transactionId: transactionId,
          note: 'Payment initiated via parent dashboard',
          payerId: user.id,
          organizationId: organizationId,
          platformFee,
          recordedBy: user.id,
        },
      });

      revalidatePath('/dashboard/fees');

      return {
        success: true,
        redirectUrl: responseData.data.instrumentResponse.redirectInfo.url,
        transactionId: transactionId,
      };
    } else {
      throw new Error(responseData.message || 'Payment initialization failed');
    }
  } catch (error) {
    console.error('Error in payFeesAction:', error);
    throw error;
  }
};

export const verifyPhonePePayment = async (transactionId: string) => {
  const merchantId = process.env.NEXT_PUBLIC_PAYMENT_MERCHANT_ID!;
  const saltKey = process.env.NEXT_PUBLIC_SALT_KEY!;
  const saltIndex = process.env.NEXT_PUBLIC_SALT_INDEX!;
  const host = process.env.NEXT_PUBLIC_PHONE_PAY_HOST_URL!;

  const organizationId = await getOrganizationId();

  const relativeUrl = `/pg/v1/status/${merchantId}/${transactionId}`;
  const fullUrl = `${host}${relativeUrl}`;
  const checksum = generateSha256(relativeUrl + saltKey) + '###' + saltIndex;

  const res = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      'X-MERCHANT-ID': merchantId,
    },
    cache: 'no-store',
  });

  const json = await res.json();
  console.log('PhonePe Status Response in verifyPhonePePayment:', json);

  if (!res.ok || !json.success) {
    throw new Error('Failed to verify payment');
  }

  console.log('Payment Verification Response:', json);

  const state = json?.data?.state;

  if (state !== 'COMPLETED') {
    console.warn('Payment not completed yet:', state);
    return { success: false, status: state ?? 'UNKNOWN' };
  }

  const paymentMethod = json?.data?.paymentInstrument?.type;

  await prisma.$transaction(async (tx) => {
    // 1) Find the pending payment record
    const payment = await tx.feePayment.findFirst({
      where: {
        transactionId,
        organizationId,
        status: PaymentStatus.PENDING,
      },
      include: { fee: true },
    });
    if (!payment) {
      throw new Error('No matching pending FeePayment record');
    }

    // 2) Mark that FeePayment COMPLETED
    await tx.feePayment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.COMPLETED,
        paymentMethod,
        paymentDate: new Date(),
      },
    });

    // 3) Recalculate all completed payments for this fee
    const completed = await tx.feePayment.findMany({
      where: { feeId: payment.feeId, status: PaymentStatus.COMPLETED },
    });
    const paidAmount = completed.reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = Math.max(payment.fee.totalFee - paidAmount, 0);

    // 4) Update the Fee record atomically
    await tx.fee.update({
      where: { id: payment.feeId },
      data: {
        paidAmount,
        pendingAmount,
        status: pendingAmount === 0 ? FeeStatus.PAID : FeeStatus.UNPAID,
      },
    });
  });

  revalidatePath('/dashboard/fees');

  return { success: true, status: 'success' };
};
