import { Suspense } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { getFeesSummary } from '@/lib/data/parent/getParent-dashboard-stats';

async function FeesSummaryContent() {
  const feesData = await getFeesSummary();

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-medium">Fees Summary</CardTitle>
        <IndianRupee className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-6">
        {feesData.map((student) => (
          <div key={student.studentId} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">{student.studentName}</h4>
              {student.overdueAmount > 0 && (
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Overdue
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Total Fees</div>
                <div className="text-lg font-semibold">
                  {formatCurrency(student.totalFees)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Paid</div>
                <div className="text-lg font-semibold text-green-600">
                  {formatCurrency(student.paidAmount)}
                </div>
              </div>
            </div>

            {student.pendingAmount > 0 && (
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      Pending: {formatCurrency(student.pendingAmount)}
                    </div>
                    <div className="text-xs text-orange-600 dark:text-orange-400">
                      {student.pendingFeesCount} fee(s) pending
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/fees/parent?student=${student.studentId}`}
                  >
                    <Button size="sm" variant="outline">
                      Pay Now
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {student.overdueAmount > 0 && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-red-800 dark:text-red-200">
                      Overdue: {formatCurrency(student.overdueAmount)}
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-400">
                      {student.overdueFeesCount} fee(s) overdue
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/fees/parent?student=${student.studentId}`}
                  >
                    <Button size="sm" variant="destructive">
                      Pay Urgent
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Recent Payments */}
            {student.recentPayments.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  Recent Payments
                </div>
                {student.recentPayments.slice(0, 2).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between text-xs p-2 rounded bg-green-50 dark:bg-green-950/20"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>{payment.fee.feeCategory.name}</span>
                    </div>
                    <div className="text-green-600 dark:text-green-400">
                      {formatCurrency(payment.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Link href="/dashboard/fees/parent">
        <Button variant="outline" className="w-full mt-4 group">
          View All Fees
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
        </Button>
      </Link>
    </CardContent>
  );
}

function FeesSummarySkeleton() {
  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="h-5 bg-muted rounded w-24 animate-pulse"></div>
        <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-32"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  );
}

export function FeesSummaryCard() {
  return (
    <Card className="border-0 bg-gradient-to-br from-card via-card to-emerald-50/20 dark:to-emerald-950/20">
      <Suspense fallback={<FeesSummarySkeleton />}>
        <FeesSummaryContent />
      </Suspense>
    </Card>
  );
}
