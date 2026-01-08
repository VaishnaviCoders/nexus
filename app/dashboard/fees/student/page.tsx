import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrencyIN, formatDateIN } from '@/lib/utils';
import prisma from '@/lib/db';
import {
  Activity,
  CreditCard,
  IndianRupee,
  PercentDiamond,
  Receipt,
  Wallet,
} from 'lucide-react';
import { ReceiptDownloadButton } from '@/components/dashboard/Fees/ReceiptDownloadButton';
import { getCurrentUserByRole } from '@/lib/auth';
import { EmptyState } from '@/components/ui/empty-state';
import PayFeeButton from '@/components/dashboard/Fees/PayFeeButton';

async function getStudentFeesByStudentId(studentId: string) {
  return await prisma.fee.findMany({
    where: {
      studentId: studentId,
    },
    include: {
      feeCategory: true,
      organization: true,
      student: {
        include: {
          grade: true,
          section: true,
          parents: {
            include: {
              parent: true,
            },
          },
        },
      },
      payments: {
        where: { status: 'COMPLETED' },
        include: {
          payer: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export default async function StudentFeePage() {
  const currentUser = await getCurrentUserByRole();

  // ✅ Only allow students here
  if (currentUser.role !== 'STUDENT') {
    return (
      <div className="p-8 text-center text-red-600 font-semibold text-lg">
        Only students can access this page.
      </div>
    );
  }

  const student = await prisma.student.findUnique({
    where: {
      id: currentUser.studentId,
    },
    select: {
      createdAt: true,
    },
  });

  const fees = await getStudentFeesByStudentId(currentUser.studentId);

  const totalFees = fees.reduce((acc, fee) => acc + fee.totalFee, 0);
  const paidFees = fees.reduce((acc, fee) => acc + fee.paidAmount, 0);
  const pendingFees = totalFees - paidFees;
  const admissionDate = student?.createdAt;
  const monthsEnrolled = admissionDate
    ? Math.floor(
      (Date.now() - admissionDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    )
    : 0;

  return (
    <div className="space-y-3 px-2">
      <Card>
        <CardHeader>
          <CardTitle>Fee Dashboard</CardTitle>
          <CardDescription>
            Manage and track student fee information
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-border/50 transition-all hover:border-primary/20 hover:shadow-sm">
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
                {formatCurrencyIN(totalFees)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {fees.length} fee records total
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/50 transition-all hover:border-emerald-500/20 hover:shadow-sm">
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
                {formatCurrencyIN(paidFees)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((paidFees / totalFees) * 100).toFixed(1)}% of total fees
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/50 transition-all hover:border-amber-500/20 hover:shadow-sm">
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
                {formatCurrencyIN(pendingFees)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {fees.filter((fee) => fee.status === 'UNPAID').length} unpaid
              invoices
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/50 transition-all hover:border-violet-500/20 hover:shadow-sm">
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
              {formatDateIN(admissionDate)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {monthsEnrolled} months enrolled
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-medium">Fee Records</h3>
        <Badge variant="outline" className="text-xs">
          {fees.length} Records
        </Badge>
      </div>
      <Separator className="my-4" />

      {fees.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <EmptyState
            title="No Fees Records Yet"
            description="No fees have been assigned to this student.
            Please contact the administration office for more information."
            icons={[Receipt, Wallet, CreditCard]}
            action={{
              label: 'Go to Dashboard',
              href: '/dashboard',
            }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {fees.map((fee) => (
            <Card
              key={fee.id}
              className="overflow-hidden border-border/50 transition-all hover:shadow-sm"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-base capitalize">
                      Fee : {fee.feeCategory.name}
                    </CardTitle>
                    <Badge variant={fee.status} className="font-normal">
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
                    <p className="text-sm mt-1 capitalize">
                      {fee.feeCategory.name}
                    </p>
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
                  <ReceiptDownloadButton
                    record={{
                      fee: {
                        ...fee,
                        pendingAmount: fee.pendingAmount ?? 0,
                        organizationName: fee.organization.name || undefined,
                        organizationEmail: fee.organization.contactEmail || undefined,
                        organizationPhone: fee.organization.contactPhone || undefined,
                        organizationLogo: fee.organization.logo || undefined,
                      },
                      student: fee.student,
                      feeCategory: fee.feeCategory,
                      grade: fee.student.grade,
                      section: fee.student.section,
                      payments: fee.payments.map((payment) => ({
                        ...payment,
                        amountPaid: payment.amount,
                        transactionId: payment.transactionId || undefined,
                      })),
                    }}
                    variant="outline"
                  />
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
