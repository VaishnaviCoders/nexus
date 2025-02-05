import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React from 'react';

import {
  Activity,
  CreditCard,
  Download,
  IndianRupee,
  PercentDiamond,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import prisma from '@/lib/db';

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

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const studentId = (await params).id;
  const fees = await getFees(studentId);
  const studentData = await getStudentData(studentId);

  const totalFees = fees.reduce((acc, fee) => acc + fee.totalFee, 0);
  const paidFees = fees.reduce((acc, fee) => acc + fee.paidAmount, 0);
  const pendingFees = totalFees - paidFees;

  return (
    <div className="">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card
          x-chunk="dashboard-01-chunk-0 "
          className=" hover:border-[#4EFFCA] hover:animate-pulse"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <IndianRupee className="custom_color h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center space-x-3">
              <IndianRupee className="custom_color h-4 w-4" />
              {totalFees}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Fees</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center space-x-3">
              <IndianRupee className="custom_color h-4 w-4" />
              {paidFees}
            </div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fee</CardTitle>
            <PercentDiamond className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center space-x-3">
              <IndianRupee className="custom_color h-4 w-4" />
              {pendingFees}
            </div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Admission Date
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.DateTimeFormat('en-IN').format(
                studentData[0].createdAt
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>
      {fees.map((fee) => (
        <Card key={fee.id} className="hover:shadow-md transition-shadow my-5">
          <CardHeader className="">
            <CardTitle className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div> Fee Id: {fee.id} </div>
              <div>
                <Badge
                  className={cn(
                    fee.status === 'PAID'
                      ? 'bg-green-50 text-green-500 hover:bg-green-50'
                      : fee.status === 'UNPAID'
                        ? 'bg-red-50 text-red-500 hover:bg-red-50'
                        : ''
                  )}
                >
                  {fee.status}
                </Badge>
              </div>
            </CardTitle>

            <CardDescription>{fee.feeCategory.description}</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Date
                </p>
                <p className="text-base">
                  {new Intl.DateTimeFormat('en-IN').format(fee.createdAt)}
                </p>
              </div>
              <div className="">
                <p className="text-sm font-medium text-muted-foreground">
                  Last Date
                </p>
                <p className="text-base">
                  {' '}
                  {new Intl.DateTimeFormat('en-IN').format(fee.dueDate)}
                </p>
              </div>
              <div className="">
                <p className="text-sm font-medium text-muted-foreground">
                  Category
                </p>
                <p className="text-base">{fee.feeCategory.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Amount
                </p>
                <p className="text-base font-semibold">
                  {new Intl.NumberFormat('en-IN').format(fee.totalFee)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            {fee.status === 'UNPAID' ? (
              <Button>
                <CreditCard className="mr-2 h-4 w-4" /> Pay Fees
              </Button>
            ) : (
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default page;
