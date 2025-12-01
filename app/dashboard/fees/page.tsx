'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Download,
  RefreshCw,
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
import { formatDateTimeIN } from '@/lib/utils';

function FeesPageContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const transactionId = searchParams.get('txn');

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          title: 'Payment Successful!',
          description: 'Your fee payment has been processed successfully.',
          badgeVariant: 'PASS' as const,
          badgeText: 'Completed',
          iconColor: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'failed':
      case 'fail':
        return {
          icon: XCircle,
          title: 'Payment Failed',
          description: 'Unfortunately, your payment could not be processed.',
          badgeVariant: 'FAILED' as const,
          badgeText: 'Failed',
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
      default:
        return {
          icon: AlertCircle,
          title: 'Payment Status Unknown',
          description: 'We could not determine the status of your payment.',
          badgeVariant: 'secondary' as const,
          badgeText: 'Unknown',
          iconColor: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card className={`${config.borderColor} ${config.bgColor}`}>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-background p-3 shadow-sm">
              <StatusIcon className={`h-12 w-12 ${config.iconColor}`} />
            </div>
          </div>
          <CardTitle className="text-2xl">{config.title}</CardTitle>
          <CardDescription className="text-base">
            {config.description}
          </CardDescription>
          <div className="flex justify-center mt-4">
            <Badge variant={config.badgeVariant} className="text-sm px-3 py-1">
              {config.badgeText}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Transaction Details</h3>

            <div className="grid gap-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                  {transactionId || 'N/A'}
                </span>
              </div>

              {/* <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium">PhonePe</span>
              </div> */}

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date & Time:</span>
                <span className="font-medium">{formatDateTimeIN(new Date())}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={config.badgeVariant}>{config.badgeText}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">What's Next?</h3>

            {status === 'success' ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Your payment has been successfully processed. You should
                  receive a confirmation email shortly.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your payment could not be processed. Please try again or
                  contact support if the issue persists.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    <Link href={'/dashboard'}>Go To Dashboard</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    asChild
                  >
                    <Link href="/support">Contact Support</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {transactionId && (
            <>
              <Separator />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Keep this transaction ID for your records: <br />
                  <span className="font-mono font-medium">{transactionId}</span>
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Additional Information Card */}
      {/* <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Payment Issues</h4>
              <p className="text-sm text-muted-foreground">
                If you're experiencing payment problems, check our FAQ or
                contact support.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/help/payments">Payment FAQ</Link>
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Technical Support</h4>
              <p className="text-sm text-muted-foreground">
                For technical issues or questions about your account.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/support">Get Support</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}

export default function FeesPage() {
  return (
    <Suspense
      fallback={
        <div className=" p-6 max-w-2xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <Card>
              <CardHeader className="space-y-4">
                <div className="h-12 w-12 bg-muted rounded-full mx-auto"></div>
                <div className="h-6 bg-muted rounded w-2/3 mx-auto"></div>
                <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <FeesPageContent />
    </Suspense>
  );
}
