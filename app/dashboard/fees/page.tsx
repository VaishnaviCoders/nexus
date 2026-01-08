import { Suspense } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDateTimeIN, formatCurrencyINWithSymbol } from '@/lib/utils';
import { getOnlinePaymentStatus, verifyPhonePePayment } from '@/lib/data/fee/recordOnlinePayment';
import { PaymentStatus } from '@/generated/prisma/enums';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function FeesPageContent({ searchParams }: { searchParams: SearchParams }) {
  const { txn: transactionId } = await searchParams;

  if (!transactionId || typeof transactionId !== 'string') {
    return (
      <div className="container mx-auto p-6 max-w-2xl text-center">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Transaction ID Provided</h1>
        <p className="text-muted-foreground mb-6">We couldn't find a transaction ID to check the status of your payment.</p>
        <Button asChild>
          <Link href="/dashboard/fees/student">View All Fees</Link>
        </Button>
      </div>
    );
  }

  // 1. Fetch initial status from DB
  let payment = await getOnlinePaymentStatus(transactionId);

  // 2. If PENDING, try one synchronous verify to catch immediate completions
  if (payment?.status === PaymentStatus.PENDING) {
    try {
      await verifyPhonePePayment(transactionId);
      // Re-fetch payment state
      payment = await getOnlinePaymentStatus(transactionId);
    } catch (error) {
      console.error('Synchronous verification failed on page load', error);
    }
  }

  const status = payment?.status;

  const getStatusConfig = () => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return {
          icon: CheckCircle,
          title: 'Payment Successful!',
          description: 'Your payment has been successfully recorded.',
          badgeVariant: 'PASS' as const,
          badgeText: 'Completed',
          iconColor: 'text-emerald-500',
          bgColor: 'bg-emerald-50/50',
          borderColor: 'border-emerald-100',
          glowColor: 'shadow-emerald-200/50',
        };
      case PaymentStatus.FAILED:
        return {
          icon: XCircle,
          title: 'Payment Failed',
          description: 'The transaction was unsuccessful.',
          badgeVariant: 'FAILED' as const,
          badgeText: 'Failed',
          iconColor: 'text-rose-500',
          bgColor: 'bg-rose-50/50',
          borderColor: 'border-rose-100',
          glowColor: 'shadow-rose-200/50',
        };
      case PaymentStatus.PENDING:
        return {
          icon: RefreshCw,
          title: 'Payment Processing',
          description: 'We are waiting for confirmation from your bank.',
          badgeVariant: 'secondary' as const,
          badgeText: 'Pending',
          iconColor: 'text-amber-500 animate-spin',
          badgeClass: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
          bgColor: 'bg-amber-50/50',
          borderColor: 'border-amber-100',
          glowColor: 'shadow-amber-200/50',
        };
      default:
        return {
          icon: AlertCircle,
          title: 'Status Unknown',
          description: 'We could not verify this transaction.',
          badgeVariant: 'outline' as const,
          badgeText: 'Unknown',
          iconColor: 'text-slate-400',
          bgColor: 'bg-slate-50/50',
          borderColor: 'border-slate-100',
          glowColor: 'shadow-slate-200/50',
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-2xl min-h-[80vh] flex items-center justify-center">
      <Card className={`w-full overflow-hidden border-2 transition-all duration-500 shadow-xl ${config.borderColor} ${config.bgColor} ${config.glowColor}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />

        <CardHeader className="text-center relative pb-2 pt-10">
          <div className="flex justify-center mb-6">
            <div className={`rounded-full bg-white p-4 shadow-lg border-4 ${config.borderColor} transition-transform duration-700 hover:scale-110`}>
              <StatusIcon className={`h-16 w-16 ${config.iconColor}`} />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">{config.title}</CardTitle>
          <CardDescription className="text-lg font-medium opacity-90">
            {config.description}
          </CardDescription>
          <div className="flex justify-center mt-6">
            <Badge
              variant={config.badgeVariant}
              className={`text-sm px-4 py-1.5 font-bold uppercase tracking-wider shadow-sm ${(config as any).badgeClass || ''}`}
            >
              {config.badgeText}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 relative px-6 sm:px-10 pb-10">
          <div className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-8 bg-primary rounded-full" />
              <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground/80">Transaction Information</h3>
            </div>

            <div className="grid gap-4 bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-inner">
              <div className="flex justify-between items-center group">
                <span className="text-sm font-medium text-muted-foreground">Transaction ID</span>
                <span className="font-mono text-sm bg-muted/50 px-3 py-1.5 rounded-lg border border-muted transition-colors group-hover:border-primary/20">
                  {transactionId}
                </span>
              </div>

              {payment && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Amount Paid</span>
                    <span className="font-bold text-lg text-foreground tracking-tight">
                      {formatCurrencyINWithSymbol(payment.amount + (payment.platformFee || 0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Fee Category</span>
                    <span className="font-semibold text-foreground capitalize">
                      {payment.fee.feeCategory.name}
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Date & Time</span>
                <span className="font-semibold text-foreground">
                  {formatDateTimeIN(payment?.paymentDate || payment?.createdAt || new Date())}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {status === PaymentStatus.COMPLETED ? (
              <div className="space-y-4">
                <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20 text-center">
                  <p className="text-sm font-medium text-emerald-800">
                    Your records have been updated. You can now download your official receipt.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1 shadow-lg h-12 text-base font-bold transition-transform active:scale-95" size="lg">
                    <Download className="h-5 w-5 mr-2" />
                    Download Receipt
                  </Button>
                  <Button variant="outline" className="flex-1 h-12 bg-white/50 border-emerald-200 hover:bg-emerald-50" asChild>
                    <Link href="/dashboard/fees/student">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Fees
                    </Link>
                  </Button>
                </div>
              </div>
            ) : status === PaymentStatus.PENDING ? (
              <div className="space-y-4 text-center">
                <div className="animate-pulse flex items-center justify-center gap-2 text-amber-700 font-medium">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Updating payment status...
                </div>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  If you have completed the payment, it might take a moment to reflect here. We are automatically checking with the bank.
                </p>
                <div className="flex justify-center pt-2">
                  <Button variant="outline" className="h-12 bg-white/50" asChild>
                    <Link href={`/dashboard/fees?txn=${transactionId}`}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Status
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Button className="h-12 text-base font-bold shadow-lg" asChild size="lg">
                  <Link href="/dashboard/fees/student">Try Again</Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-12 bg-white/50"
                  asChild
                >
                  <Link href="/support">Need Help? Contact Support</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground leading-relaxed">
              Secure Payment via PhonePe &bull; Transaction Encrypted
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function FeesPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-6 max-w-2xl min-h-[80vh] flex items-center justify-center">
          <div className="w-full animate-pulse space-y-6">
            <div className="h-12 bg-muted rounded-full w-24 mx-auto mb-8"></div>
            <div className="h-8 bg-muted rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-12"></div>
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded-2xl w-full"></div>
              <div className="h-12 bg-muted rounded-xl w-full"></div>
            </div>
          </div>
        </div>
      }
    >
      <FeesPageContent searchParams={searchParams} />
    </Suspense>
  );
}
