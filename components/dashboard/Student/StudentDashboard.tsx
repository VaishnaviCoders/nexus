import React from 'react';
import { StudentDashboardStatsCards } from './StudentDashboardStatsCards';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import prisma from '@/lib/db';
import { getCurrentUserId } from '@/lib/user';
import StudentSubjectsRadar from './student-subjects-radar';
import { RecentNoticesCards } from '../notice/recent-notices-cards';
import { FeesQuickCard } from './FeesQuickCard';
import { FeeStatus, PaymentMethod } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, Upload, MessageSquare, Zap } from 'lucide-react';
import { getStudentNotices } from '@/lib/data/notice/get-student-notices';

export async function getFeesStatus(studentId: string) {
  const fees = await prisma.fee.findMany({
    where: { studentId },
    include: {
      payments: {
        orderBy: { paymentDate: 'desc' },
        take: 5,
      },
    },
  });

  let totalAnnualFee = 0;
  let paidAmount = 0;
  let pendingAmount = 0;
  let recentPayments: {
    id: string;
    amount: number;
    paymentDate: Date;
    method: PaymentMethod;
    status: 'COMPLETED';
    receiptNumber: string;
  }[] = [];

  let nextDueDate: Date | null = null;

  for (const fee of fees) {
    totalAnnualFee += fee.totalFee;
    paidAmount += fee.paidAmount;
    pendingAmount += fee.pendingAmount || 0;

    // Set nextDueDate to earliest due among unpaid or overdue
    if (
      (fee.status === 'UNPAID' || fee.status === 'OVERDUE') &&
      (!nextDueDate || fee.dueDate < nextDueDate)
    ) {
      nextDueDate = fee.dueDate;
    }

    for (const payment of fee.payments) {
      if (payment.status === 'COMPLETED') {
        recentPayments.push({
          id: payment.id,
          amount: payment.amount,
          paymentDate: payment.paymentDate,
          method: payment.paymentMethod,
          status: 'COMPLETED',
          receiptNumber: payment.receiptNumber,
        });
      }
    }
  }

  // Sort recent payments by date descending and limit to latest 3
  recentPayments = recentPayments
    .sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime())
    .slice(0, 3);

  const status: FeeStatus =
    pendingAmount === 0
      ? FeeStatus.PAID
      : paidAmount === 0
        ? FeeStatus.UNPAID
        : FeeStatus.OVERDUE;

  return {
    totalAnnualFee,
    paidAmount,
    pendingAmount,
    nextDueDate,
    status,
    recentPayments,
  };
}

const quickActions = [
  {
    title: 'Pay Fees',
    description: 'Online payments',
    icon: CreditCard,
    color: 'bg-green-500 hover:bg-green-600',
    action: 'payment',
    link: '/dashboard/fees/student',
  },
  {
    title: 'Download Receipt',
    description: 'Payment receipts',
    icon: Download,
    color: 'bg-blue-500 hover:bg-blue-600',
    action: 'download',
    link: '/dashboard/fees/student',
  },
  {
    title: 'Upload Documents',
    description: 'Submit documents',
    icon: Upload,
    color: 'bg-purple-500 hover:bg-purple-600',
    action: 'upload',
    link: '/dashboard/documents',
  },
  {
    title: 'Submit Complaint',
    description: 'Report issues',
    icon: MessageSquare,
    color: 'bg-red-500 hover:bg-red-600',
    action: 'complaint',
    link: '/dashboard/anonymous-complaints',
  },
];

const StudentDashboard = async () => {
  const userId = await getCurrentUserId();

  const recentNotices = await getStudentNotices();

  const student = await prisma.student.findUnique({
    where: { userId },
    select: {
      id: true,
    },
  });
  if (!student) throw new Error('Student not found');

  const feesData = await getFeesStatus(student.id);

  return (
    <div className="grid gap-4 md:gap-6">
      {/* Main Content Grid - Responsive Layout */}
      <StudentDashboardStatsCards studentId={student.id} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Left Column - Subject Performance (Takes more space on desktop) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <Card className=" border-slate-200/50 dark:border-slate-700/50">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20 rounded-t-lg border-b border-blue-200/30 dark:border-blue-800/30">
              <CardTitle className="text-lg font-semibold">
                Subject Performance
              </CardTitle>
              <CardDescription>
                Comprehensive academic performance tracking and analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <StudentSubjectsRadar />
            </CardContent>
          </Card>
          <Card className="my-2 flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <Zap className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Frequently used features
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    className="h-auto p-3 flex flex-col items-center gap-2 hover:shadow-sm transition-all bg-transparent text-center"
                  >
                    <div
                      className={`p-2 rounded-full text-white ${action.color} transition-colors`}
                    >
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium leading-tight">
                        {action.title}
                      </div>
                      <div className="text-xs text-slate-500 leading-tight">
                        {action.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Info Cards */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4 md:space-y-6 my-3">
          <RecentNoticesCards recentNotices={recentNotices} />
          <FeesQuickCard feesData={feesData} />
        </div>
      </div>

      {/* Bottom Section - Additional Widgets */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      <div className="md:col-span-1 xl:col-span-2">
        <UpcomingEventsCard />
      </div>
      <div className="md:col-span-1 xl:col-span-2">
        <QuickActionsCard />
      </div>
    </div> */}
    </div>
  );
};

export default StudentDashboard;
