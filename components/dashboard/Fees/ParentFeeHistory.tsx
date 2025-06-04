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
import FeeReceiptCard from './FeeReceiptCard';
import { payFeesAction } from '@/lib/data/fee/payFeesAction';
import { toast } from 'sonner';

interface ReceiptData {
  receiptNumber: string;
  studentName: string;
  rollNumber: string;
  feeCategory: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  payerName: string;
  organizationName: string;
}

interface ParentData {
  name: string;
  email: string;
  phone: string;
  children: {
    id: string;
    name: string;
    grade: string;
    section: string;
    rollNo: string;
    totalFees: number;
    paidFees: number;
    pendingFees: number;
    unpaidFees: {
      id: string;
      dueDate: Date;
      amount: number;
      category: string;
      status: string | 'PAID' | 'UNPAID' | 'OVERDUE';
    }[];
    paymentHistory: {
      id: string;
      date: Date;
      childName: string;
      amount: number;
      category: string;
      receiptNumber: string;
      paymentMethod: string;
      payerName: string | null;
      payerPhone: string | null;
    }[];
  }[];
}

const ParentFeeHistory = ({ parentData }: { parentData: ParentData }) => {
  const [selectedChild, setSelectedChild] = useState(parentData.children[0].id);

  console.log('Parent Data', parentData);

  const currentChild = parentData.children.find(
    (child) => child.id === selectedChild
  );

  const handlePayment = async (feeId: string) => {
    try {
      const unpaid = currentChild?.unpaidFees.find((f) => f.id === feeId);
      if (!unpaid) return toast.error('Fee not found');

      const res = await payFeesAction(unpaid.id, unpaid.amount);
      toast.success('Payment successful');
      // Optional: refresh data or revalidate
    } catch (err: any) {
      console.error('Payment failed:', err);
      toast.error('Payment failed');
    }
  };

  type PaymentStatus = 'PAID' | 'UNPAID' | 'OVERDUE';
  const getStatusBadgeVariant = (status: PaymentStatus) => {
    switch (status) {
      case 'PAID':
        return 'secondary';
      case 'UNPAID':
        return 'outline';
      case 'OVERDUE':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (!currentChild) return null;

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
                  ₹{currentChild.totalFees.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Paid Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{currentChild.paidFees.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Pending Amount</p>
                <p className="text-2xl font-bold text-amber-600">
                  ₹{currentChild.pendingFees.toLocaleString()}
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
                          <TableCell className="font-medium">
                            {currentChild.name}
                          </TableCell>
                          <TableCell>{payment.category}</TableCell>
                          <TableCell>
                            {format(payment.dueDate, 'PPP')}
                          </TableCell>
                          <TableCell>
                            ₹{payment.amount.toLocaleString()}
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
                            <Button
                              size="sm"
                              onClick={() => handlePayment(payment.id)}
                            >
                              Pay Now
                            </Button>
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

            <div className="flex justify-end gap-2">
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
            </div>
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
                      <TableCell>{format(payment.date, 'PPP')}</TableCell>
                      <TableCell className="font-medium">
                        {payment.childName}
                      </TableCell>
                      <TableCell>{payment.receiptNumber}</TableCell>
                      <TableCell>{payment.category}</TableCell>
                      <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
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
                            className={
                              ' p-0 m-0  overflow-y-scroll max-h-screen'
                            }
                          >
                            <DialogHeader className="p-2">
                              <DialogTitle>View Receipt</DialogTitle>
                              <DialogDescription>
                                View the receipt for this payment
                              </DialogDescription>
                            </DialogHeader>
                            <FeeReceiptCard
                              receiptData={currentChild.paymentHistory}
                            />
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
