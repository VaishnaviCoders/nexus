import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertCircleIcon,
  IndianRupeeIcon,
  UsersIcon,
  XCircleIcon,
} from 'lucide-react';
import { formatCurrencyIN } from '@/lib/utils';
import { getAdminFeesSummary } from '@/lib/data/fee/get-admin-fee-stats';

const AdminFeesSummaryCards = async () => {
  const {
    collectedFees,
    overdueFees,
    paidStudents,
    pendingFees,
    totalFees,
    totalStudents,
    unpaidStudents,
  } = await getAdminFeesSummary();

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
            {totalFees > 0
              ? `${((collectedFees / totalFees) * 100).toFixed(
                  1
                )}% of total fees`
              : 'No fees collected yet'}
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
          <div className="flex items-baseline space-x-1 text-2xl font-bold text-red-600">
            <IndianRupeeIcon className="h-3 w-3 text-red-500 mr-1" />
            <span className="text-2xl font-bold">
              {formatCurrencyIN(overdueFees)}
            </span>
          </div>
          <div className="flex items-center mt-1">
            <AlertCircleIcon className="h-3 w-3 text-red-500 mr-1" />
            <p className="text-xs text-red-500">Requires immediate attention</p>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/50 transition-all hover:border-emerald-500/20 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Students Paid in Full
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
            {`${paidStudents.toLocaleString()}/${totalStudents.toLocaleString()} 
            students paid in full`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFeesSummaryCards;
