'use client';

import React from 'react';
import { Button } from './ui/button';
import { CreditCard } from 'lucide-react';
import { payFeesAction } from '@/lib/data/fee/payFeesAction';

type PayFeeButtonProps = {
  feeId: string;
};

const PayFeeButton = ({ feeId }: PayFeeButtonProps) => {
  const handleClick = async () => {
    console.log('Clicked fee ID:', feeId);
    // Add your UPI logic, modal, or checkout here
    await payFeesAction(feeId);
  };

  return (
    <Button className="bg-primary hover:bg-primary/90" onClick={handleClick}>
      <CreditCard className="mr-2 h-4 w-4" /> Pay Fees
    </Button>
  );
};

export default PayFeeButton;
