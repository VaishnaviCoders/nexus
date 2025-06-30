import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn, formatCurrencyIN, formatDateIN } from '@/lib/utils';
import prisma from '@/lib/db';
import {
  Activity,
  CreditCard,
  Download,
  IndianRupee,
  PercentDiamond,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import PayFeeButton from '@/components/PayFeeButton';
import { ReceiptDownloadButton } from '@/components/ReceiptDownloadButton';

async function getStudentFromUser(userId: string) {
  return await prisma.student.findUnique({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      createdAt: true,
    },
  });
}

async function getFees(studentId: string) {
  return await prisma.fee.findMany({
    where: {
      studentId: studentId,
    },
    include: {
      feeCategory: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export default async function StudentFeePage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  const student = await getStudentFromUser(userId);

  if (!student) {
    return redirect('/dashboard'); // Or show access denied
  }

  const fees = await getFees(student.id);

  const totalFees = fees.reduce((acc, fee) => acc + fee.totalFee, 0);
  const paidFees = fees.reduce((acc, fee) => acc + fee.paidAmount, 0);
  const pendingFees = totalFees - paidFees;

  return (
    <div className="space-y-3 px-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Fee Dashboard</CardTitle>
          <CardDescription className="text-base ">
            Manage and track student fee information
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-border/50 transition-all hover:border-primary/20 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <div className="rounded-md bg-primary/10 p-1">
              <IndianRupee className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-1">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">
                {totalFees.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {fees.length} fee records total
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/50 transition-all hover:border-emerald-500/20 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Fees</CardTitle>
            <div className="rounded-md bg-emerald-500/10 p-1">
              <CreditCard className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-1">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">
                {paidFees.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((paidFees / totalFees) * 100).toFixed(1)}% of total fees
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/50 transition-all hover:border-amber-500/20 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fee</CardTitle>
            <div className="rounded-md bg-amber-500/10 p-1">
              <PercentDiamond className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-1">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">
                {pendingFees.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {fees.filter((fee) => fee.status === 'UNPAID').length} unpaid
              invoices
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/50 transition-all hover:border-violet-500/20 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Admission Date
            </CardTitle>
            <div className="rounded-md bg-violet-500/10 p-1">
              <Activity className="h-4 w-4 text-violet-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.DateTimeFormat('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }).format(student.createdAt)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.floor(
                (new Date().getTime() - new Date(student.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24 * 30)
              )}{' '}
              months enrolled
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Fee Records</h3>
          <Badge variant="outline" className="text-xs">
            {fees.length} Records
          </Badge>
        </div>
        <Separator className="my-4" />

        <div className="space-y-4">
          {fees.map((fee) => (
            <Card
              key={fee.id}
              className="overflow-hidden border-border/50 transition-all hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-base">
                      Fee ID: {fee.id}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={cn(
                        'font-normal',
                        fee.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200'
                          : fee.status === 'UNPAID'
                            ? 'bg-red-50 text-red-700 hover:bg-red-50 border-red-200'
                            : ''
                      )}
                    >
                      {fee.status}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {formatCurrencyIN(fee.totalFee)}
                  </div>
                </div>
                <CardDescription className="mt-1.5">
                  {fee.feeCategory.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Issue Date
                    </p>
                    <p className="text-sm mt-1">
                      {formatDateIN(fee.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Due Date
                    </p>
                    <p className="text-sm mt-1">{formatDateIN(fee.dueDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Category
                    </p>
                    <p className="text-sm mt-1">{fee.feeCategory.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Payment Status
                    </p>
                    <p className="text-sm mt-1">
                      {fee.status === 'PAID'
                        ? `Paid ${formatCurrencyIN(fee.paidAmount)}`
                        : 'Not paid yet'}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end pt-3 pb-4">
                {fee.status !== 'PAID' ? (
                  <PayFeeButton feeId={fee.id} />
                ) : (
                  <ReceiptDownloadButton paymentId={fee.id} variant="outline" />
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
