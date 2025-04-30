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
import { cn } from '@/lib/utils';
import prisma from '@/lib/db';
import {
  Activity,
  CreditCard,
  Download,
  IndianRupee,
  PercentDiamond,
} from 'lucide-react';

async function getFees(studentId: string) {
  return await prisma.fee.findMany({
    where: {
      studentId: studentId,
    },
    include: {
      feeCategory: true,
    },
  });
}

async function getStudentData(studentId: string) {
  return await prisma.student.findMany({
    where: {
      id: studentId,
    },
    select: {
      createdAt: true,
    },
  });
}

export default async function StudentFeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const studentId = id;

  const fees = await getFees(studentId);
  const studentData = await getStudentData(studentId);

  const totalFees = fees.reduce((acc, fee) => acc + fee.totalFee, 0);
  const paidFees = fees.reduce((acc, fee) => acc + fee.paidAmount, 0);
  const pendingFees = totalFees - paidFees;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Fee Dashboard</h2>
        <p className="text-muted-foreground">
          Manage and track student fee information
        </p>
      </div>

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
              }).format(studentData[0].createdAt)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.floor(
                (new Date().getTime() -
                  new Date(studentData[0].createdAt).getTime()) /
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
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    }).format(fee.totalFee)}
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
                      {new Intl.DateTimeFormat('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }).format(fee.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Due Date
                    </p>
                    <p className="text-sm mt-1">
                      {new Intl.DateTimeFormat('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }).format(fee.dueDate)}
                    </p>
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
                        ? `Paid ${new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0,
                          }).format(fee.paidAmount)}`
                        : 'Not paid yet'}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end pt-3 pb-4">
                {fee.status === 'UNPAID' ? (
                  <Button className="bg-primary hover:bg-primary/90">
                    <CreditCard className="mr-2 h-4 w-4" /> Pay Fees
                  </Button>
                ) : (
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
