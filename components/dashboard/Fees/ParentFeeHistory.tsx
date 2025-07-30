'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Receipt, Check, View } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { FeeReceiptCard } from './FeeReceiptCard';
import { formatCurrencyIN } from '@/lib/utils';
import PayFeeButton from '@/components/PayFeeButton';
import { PaymentStatus } from '@/generated/prisma/enums';

interface ParentData {
  name: string;
  email: string;
  phone: string;
  children: ChildData[];
}

interface ChildData {
  id: string;
  name: string;
  grade: string;
  section: string;
  rollNo: string;
  totalFees: number;
  paidFees: number;
  pendingFees: number;
  unpaidFees: UnpaidFee[];
  paymentHistory: PaymentHistoryItem[];
}

interface UnpaidFee {
  id: string;
  dueDate: Date;
  amount: number;
  category: string;
  status: 'PAID' | 'UNPAID' | 'OVERDUE' | string;
}

interface PaymentHistoryItem {
  id: string;
  feeId: string;
  status: PaymentStatus;
  note: string;
  transactionId: string | null;
  amountPaid: number;
  platformFee: number | null;
  paymentDate: Date;
  studentName: string;
  category: string;
  receiptNumber: string;
  paymentMethod: string;
  payerId: string;
  recordedBy: string;
  organizationId: string;
  payer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ParentFeeHistory = ({ parentData }: { parentData: ParentData }) => {
  const [selectedChild, setSelectedChild] = useState(parentData.children[0].id);

  const currentChild = parentData.children.find(
    (child) => child.id === selectedChild
  );

  const getStatusBadgeVariant = (status: PaymentStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'verified'; // Green ✅
      case 'UNPAID':
        return 'rejected'; // Red ❌
      case 'PENDING':
        return 'pending'; // Yellow ⏳
      case 'FAILED':
        return 'rejected'; // Red ❌
      case 'REFUNDED':
        return 'meta'; // Blue 🔁
      case 'CANCELLED':
        return 'outline'; // Grey 🚫
      default:
        return 'outline'; // fallback
    }
  };

  if (!currentChild) return null;

  console.log(currentChild?.paymentHistory);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Children</CardTitle>
          <CardDescription>
            Select a child to view their fee details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {parentData.children.map((child) => (
              <Button
                key={child.id}
                variant={selectedChild === child.id ? 'default' : 'outline'}
                className="flex items-center gap-2"
                onClick={() => setSelectedChild(child.id)}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={`/placeholder.svg?height=24&width=24`}
                    alt={child.name}
                  />
                  <AvatarFallback>
                    {child.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <span>{child.name}</span>
                <span className="text-xs">
                  ({child.grade} {child.section})
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentChild && (
        <Card className="mt-3">
          <CardHeader>
            <CardTitle>{currentChild.name}'s Fee Overview</CardTitle>
            <CardDescription>
              Fee details for {currentChild.grade} {currentChild.section}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 ">
            <div className="grid gap-4 md:grid-cols-3 ">
              <div className="space-y-2">
                <p className="text-sm font-medium">Total Fees</p>
                <p className="text-2xl font-bold">
                  ₹{formatCurrencyIN(currentChild.totalFees)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Paid Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{formatCurrencyIN(currentChild.paidFees)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Pending Amount</p>
                <p className="text-2xl font-bold text-amber-600">
                  ₹{formatCurrencyIN(currentChild.pendingFees)}
                </p>
              </div>
            </div>

            <div className="space-y-2  ">
              <div className="flex items-center justify-between text-sm">
                <span>Payment Progress</span>
                <span>
                  {Math.round(
                    (currentChild.paidFees / currentChild.totalFees) * 100
                  )}
                  %
                </span>
              </div>
              <Progress
                value={Math.round(
                  (currentChild.paidFees / currentChild.totalFees) * 100
                )}
                className="h-2"
              />
            </div>

            {currentChild.unpaidFees.length > 0 ? (
              <div className="space-y-4 ">
                <h3 className="text-lg font-medium">Pending Payments</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Child</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentChild.unpaidFees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No pending payments for {currentChild.name}
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentChild.unpaidFees.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium whitespace-nowrap">
                            {currentChild.name}
                          </TableCell>
                          <TableCell className="capitalize">
                            {payment.category}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {format(payment.dueDate, 'PPP')}
                          </TableCell>
                          <TableCell className="">
                            ₹{formatCurrencyIN(payment.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant(
                                payment.status as PaymentStatus
                              )}
                            >
                              {payment.status === 'UNPAID'
                                ? 'Unpaid'
                                : 'Overdue'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <PayFeeButton feeId={payment.id} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      All fees paid
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        There are no pending payments for {currentChild.name}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* <div className="flex justify-end gap-2">
              <Button variant="outline">
                <Receipt className="mr-2 h-4 w-4" />
                Download Receipts
              </Button>
              {currentChild.pendingFees > 0 && (
                <Button>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay All Pending Fees
                </Button>
              )}
            </div> */}
          </CardContent>
        </Card>
      )}

      {currentChild?.paymentHistory.length > 0 && (
        <Card className="mt-3">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              Record of all previous fee payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Child</TableHead>
                  <TableHead>Receipt No</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentChild?.paymentHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No payment history
                    </TableCell>
                  </TableRow>
                ) : (
                  currentChild?.paymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(payment.paymentDate, 'PPP')}
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        {payment.studentName}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {payment.receiptNumber}
                      </TableCell>
                      <TableCell className="capitalize">
                        {payment.category}
                      </TableCell>
                      <TableCell>
                        ₹{formatCurrencyIN(payment.amountPaid)}
                      </TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <View />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent
                            className={' m-0  overflow-y-scroll max-h-screen'}
                          >
                            <DialogHeader className="p-2">
                              <DialogTitle>View Receipt</DialogTitle>
                              <DialogDescription>
                                View the receipt for this payment
                              </DialogDescription>
                            </DialogHeader>
                            <FeeReceiptCard receiptData={payment} />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ParentFeeHistory;
