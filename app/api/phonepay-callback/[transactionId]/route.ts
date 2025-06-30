import { NextResponse } from 'next/server';
import { verifyPhonePePayment } from '@/lib/data/fee/payFeesAction';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId } = await params;

    const result = await verifyPhonePePayment(transactionId);

    console.log('Route result', result);

    const status = result.success ? 'success' : 'failed';

    const redirectUrl = new URL(
      '/dashboard/fees',
      process.env.NEXT_PUBLIC_APP_URL
    );
    redirectUrl.searchParams.set('status', status);
    redirectUrl.searchParams.set('txn', transactionId);

    return NextResponse.redirect(redirectUrl.toString(), { status: 302 });
  } catch (error) {
    console.error('[PHONE_PE_STATUS_ERROR]', error);

    const fallbackUrl = new URL(
      '/dashboard/fees',
      process.env.NEXT_PUBLIC_APP_URL
    );
    fallbackUrl.searchParams.set('status', 'fail');
    fallbackUrl.searchParams.set('txn', (await params).transactionId);

    return NextResponse.redirect(fallbackUrl.toString(), { status: 302 });
  }
}
