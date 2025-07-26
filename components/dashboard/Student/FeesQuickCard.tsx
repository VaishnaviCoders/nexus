'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CreditCard, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { cn, formatCurrencyIN, formatDateIN } from '@/lib/utils';
import {
  FeeStatus,
  PaymentMethod,
  PaymentStatus,
} from '@/generated/prisma/enums';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'text-green-600';
    case 'PENDING':
      return 'text-amber-600';
    case 'FAILED':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'PENDING':
      return <Clock className="w-4 h-4 text-amber-600" />;
    case 'FAILED':
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    default:
      return <Clock className="w-4 h-4 text-gray-600" />;
  }
};

interface Props {
  className?: string;
  feesData: {
    totalAnnualFee: number;
    paidAmount: number;
    pendingAmount: number;
    nextDueDate: Date | null;
    status: FeeStatus; // 'PAID' | 'UNPAID' | 'OVERDUE'
    recentPayments: {
      id: string;
      amount: number;
      paymentDate: Date;
      method: PaymentMethod; // 'CASH' | 'UPI' | ...
      status: 'COMPLETED'; // 'COMPLETED' | ...
      receiptNumber: string;
    }[];
  };
}

export function FeesQuickCard({ className, feesData }: Props) {
  const paymentPercentage =
    (feesData.paidAmount / feesData.totalAnnualFee) * 100;
  const daysUntilDue = feesData.nextDueDate
    ? Math.ceil(
        (feesData.nextDueDate.getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            <CardTitle className="text-lg">Fee Status</CardTitle>
          </div>
          <Badge
            variant={
              daysUntilDue !== null && daysUntilDue <= 7
                ? 'destructive'
                : 'secondary'
            }
          >
            {daysUntilDue === null
              ? 'No Due'
              : daysUntilDue > 0
                ? `${daysUntilDue} days left`
                : 'Overdue'}
          </Badge>
        </div>
        <CardDescription>Track your fee payments and dues</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Payment Progress</span>
            <span className="font-semibold">
              {paymentPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={paymentPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Paid: ₹{formatCurrencyIN(feesData.paidAmount)}</span>
            <span>Pending: ₹{formatCurrencyIN(feesData.pendingAmount)}</span>
          </div>
        </div>

        {/* Next Due */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Next Payment Due</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-bold">
            ₹{formatCurrencyIN(feesData.pendingAmount)}
          </div>
          <div className="text-xs text-slate-500">
            {feesData.nextDueDate
              ? `Due: ${formatDateIN(feesData.nextDueDate)}`
              : 'No upcoming dues'}
          </div>
        </div>

        {/* Recent Payments */}
        <div>
          <h4 className="text-sm font-medium mb-2">Recent Payments</h4>
          <div className="space-y-2">
            {feesData.recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded"
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(payment.status)}
                  <div>
                    <div className="text-sm font-medium">
                      ₹{formatCurrencyIN(payment.amount)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {payment.paymentDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {payment.method}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {feesData.pendingAmount > 0 ? (
          <Button className="w-full" size="sm">
            Pay Now
          </Button>
        ) : (
          <Button className="w-full" size="sm">
            Already Paid
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
