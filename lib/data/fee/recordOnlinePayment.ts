'use server';

import { createHash, randomUUID, randomBytes } from 'crypto';

import {
  PaymentMethod,
  PaymentStatus,
  FeeStatus,
} from '@/generated/prisma/enums';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { revalidatePath } from 'next/cache';
import { getCurrentUserId } from '@/lib/user';

function generateSha256(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

export async function generateTransactionId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `TXN_${date}_${rand}`;
}
export const phonePayInitPayment = async (feeId: string) => {
  const userId = await getCurrentUserId();
  const organizationId = await getOrganizationId();
  const transactionId = await generateTransactionId();


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


  const payload = {
    merchantId: process.env.NEXT_PUBLIC_PAYMENT_MERCHANT_ID,
    merchantTransactionId: transactionId,
    merchantUserId: 'MUID-' + randomUUID().toString().slice(-6),
    amount: Math.round(totalPayableAmount * 100),
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
          amount: pendingAmount, // store only actual fee, not platformFe
          status: PaymentStatus.PENDING,
          paymentMethod: PaymentMethod.UPI,
          receiptNumber: `REC-${randomUUID().slice(0, 8).toUpperCase()}`,
          transactionId: transactionId,
          note: 'Payment initiated via parent dashboard',
          payerId: userId,
          organizationId: organizationId,
          platformFee,
          recordedBy: userId,
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


export const getOnlinePaymentStatus = async (transactionId: string) => {
  const userId = await getCurrentUserId();

  const payment = await prisma.feePayment.findFirst({
    where: {
      transactionId,
      payerId: userId,
    },
    include: {
      fee: {
        include: {
          feeCategory: true,
        },
      },
    },
  });

  return payment;
};

const mapPhonePePaymentMethod = (type: string | undefined): PaymentMethod => {
  if (!type) return PaymentMethod.ONLINE;
  const t = type.toUpperCase();
  if (t === 'UPI') return PaymentMethod.UPI;
  if (t === 'CARD') return PaymentMethod.CARD;
  if (t === 'NETBANKING') return PaymentMethod.ONLINE;
  return PaymentMethod.ONLINE;
};

export const verifyPhonePePayment = async (transactionId: string) => {
  const merchantId = process.env.NEXT_PUBLIC_PAYMENT_MERCHANT_ID!;
  const saltKey = process.env.NEXT_PUBLIC_SALT_KEY!;
  const saltIndex = process.env.NEXT_PUBLIC_SALT_INDEX!;
  const host = process.env.NEXT_PUBLIC_PHONE_PAY_HOST_URL!;

  // 1. Fetch the payment record first to get the organizationId
  // This allows the verification to work in server-to-server callbacks without a user session
  const payment = await prisma.feePayment.findFirst({
    where: { transactionId },
    include: { fee: true },
  });

  if (!payment) {
    console.error(`[VERIFY_PAYMENT] No matching FeePayment record for ${transactionId}`);
    return { success: false, status: 'NOT_FOUND', message: 'Payment record not found' };
  }

  // Idempotency: skip if already completed
  if (payment.status === PaymentStatus.COMPLETED) {
    return { success: true, status: 'COMPLETED', message: 'Payment already verified as successful' };
  }

  const organizationId = payment.organizationId;

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

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[VERIFY_PAYMENT] PhonePe Status API error: ${res.status}`, errorText);
    return { success: false, status: 'API_ERROR', message: 'Failed to verify payment with provider' };
  }

  const json = await res.json();
  console.log('[VERIFY_PAYMENT] PhonePe Response:', JSON.stringify(json, null, 2));

  const state = json?.data?.state;
  const paymentMethod = json?.data?.paymentInstrument?.type;

  // STRICT SUCCESS CHECK: Only 'COMPLETED' is success
  if (json.success && state === 'COMPLETED') {
    await prisma.$transaction(async (tx) => {
      // Re-verify status within transaction to be safe
      const currentPayment = await tx.feePayment.findUnique({
        where: { id: payment.id },
      });

      if (currentPayment?.status === PaymentStatus.COMPLETED) return;

      // 2) Mark that FeePayment COMPLETED
      await tx.feePayment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.COMPLETED,
          paymentMethod: mapPhonePePaymentMethod(paymentMethod),
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
    revalidatePath('/dashboard/fees/student');
    revalidatePath('/dashboard/fees/admin/assign');

    return { success: true, status: 'COMPLETED' };
  }

  // Handle FAILED state
  if (state === 'FAILED' || json.success === false) {
    await prisma.feePayment.updateMany({
      where: { transactionId, status: PaymentStatus.PENDING },
      data: { status: PaymentStatus.FAILED },
    });
    return { success: false, status: 'FAILED' };
  }

  // Handle PENDING state (or any other state like PAYMENT_INITIATED)
  // We don't update DB to FAILED yet, just return PENDING
  return {
    success: false,
    status: 'PENDING',
    message: json.message || 'Payment is still processing',
  };
};
