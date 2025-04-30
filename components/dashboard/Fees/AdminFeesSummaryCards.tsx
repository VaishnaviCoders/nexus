import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DownloadIcon,
  IndianRupeeIcon,
  PlusIcon,
  UsersIcon,
  XCircleIcon,
} from 'lucide-react';
import { getFeesSummary } from '@/app/actions';

const AdminFeesSummaryCards = async () => {
  const {
    collectedFees,
    overdueFees,
    paidStudents,
    pendingFees,
    totalFees,
    totalStudents,
    unpaidStudents,
  } = await getFeesSummary();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden border-border/50 transition-all hover:border-primary/20 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Collection
          </CardTitle>
          <div className="rounded-md bg-primary/10 p-1">
            <IndianRupeeIcon className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-1">
            <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">
              {collectedFees.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {((collectedFees / totalFees) * 100).toFixed(1)}% of total fees
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/50 transition-all hover:border-amber-500/20 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Collection
          </CardTitle>
          <div className="rounded-md bg-amber-500/10 p-1">
            <IndianRupeeIcon className="h-4 w-4 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-1">
            <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">
              {pendingFees.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {unpaidStudents} students with pending fees
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/50 transition-all hover:border-red-500/20 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
          <div className="rounded-md bg-red-500/10 p-1">
            <XCircleIcon className="h-4 w-4 text-red-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-1">
            <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">
              {overdueFees.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Fees past due date requiring action
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/50 transition-all hover:border-emerald-500/20 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Student Payment Status
          </CardTitle>
          <div className="rounded-md bg-emerald-500/10 p-1">
            <UsersIcon className="h-4 w-4 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {paidStudents}/{totalStudents}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {((paidStudents / totalStudents) * 100).toFixed(1)}% students paid
            in full
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFeesSummaryCards;
