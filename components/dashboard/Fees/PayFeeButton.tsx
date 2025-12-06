'use client';

import React, { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { phonePayInitPayment } from '@/lib/data/fee/recordOnlinePayment';
import { useRouter } from 'next/navigation';

type PayFeeButtonProps = {
  feeId: string;
};

const PayFeeButton = ({ feeId }: PayFeeButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const result = await phonePayInitPayment(feeId);

        if (!result || typeof result !== 'object') {
          throw new Error('Invalid server response. Please try again.');
        }

        const { success, redirectUrl, transactionId } = result;

        if (!success) {
          throw new Error('Payment initialization failed. Please try again.');
        }

        if (!redirectUrl || typeof redirectUrl !== 'string') {
          throw new Error('Payment gateway URL is missing.');
        }

        console.log('Payment initialized:', {
          transactionId,
          redirectUrl,
        });

        // Ensure redirect happens after logs flush
        setTimeout(() => {
          router.push(redirectUrl);
        }, 50);
      } catch (error) {
        console.error('Payment error:', error);
        alert(error instanceof Error ? error.message : 'Payment failed');
      } finally {
        console.log('PayFeeButton click flow completed');
      }
    });
  };

  return (
    <Button
      className="bg-primary hover:bg-primary/90"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="mr-2 h-4 w-4" />
      )}
      {isPending ? 'Processing...' : 'Pay Now'}
    </Button>
  );
};

export default PayFeeButton;
