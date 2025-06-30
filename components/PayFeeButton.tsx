'use client';

import React, { useTransition } from 'react';
import { Button } from './ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { phonePayInitPayment } from '@/lib/data/fee/payFeesAction';
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
        console.log('Clicked fee ID:', feeId);

        const result = await phonePayInitPayment(feeId);
        console.log('Payment action result:', result);
        if (result.success && result.redirectUrl) {
          // Redirect to PhonePe payment page
          router.push(result.redirectUrl);
        } else {
          console.error('No redirect URL received');
          alert('Failed to initialize payment. Please try again.');
        }
      } catch (error) {
        console.error('Payment error:', error);
        alert(error instanceof Error ? error.message : 'Payment failed');
      } finally {
        console.log('Payment button clicked');
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
