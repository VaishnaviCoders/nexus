'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  CreditCard,
  Download,
  Receipt,
  Calendar,
  User,
  Check,
} from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    pendingPayments: {
      id: string;
      dueDate: Date;
      amount: number;
      category: string;
      status: string;
    }[];
  }[];
  paymentHistory: {
    id: string;
    date: Date;
    amount: number;
    category: string;
    receiptNo: string;
    paymentMethod: string;
    childName: string;
  }[];
}

const ParentFeeHistory = ({ parentData }: { parentData: ParentData }) => {
  const [selectedChild, setSelectedChild] = useState(parentData.children[0].id);

  const currentChild = parentData.children.find(
    (child) => child.id === selectedChild
  );

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
        <Card>
          <CardHeader>
            <CardTitle>{currentChild.name}'s Fee Overview</CardTitle>
            <CardDescription>
              Fee details for {currentChild.grade} {currentChild.section}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
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

            <div className="space-y-2">
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

            {currentChild.pendingPayments.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Pending Payments</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentChild.pendingPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No pending payments
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentChild.pendingPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {payment.category}
                          </TableCell>
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
                            <Button size="sm">Pay Now</Button>
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

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Payments</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Pending Payments</CardTitle>
              <CardDescription>
                Pending payments for all children
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  {parentData.children.flatMap((child) =>
                    child.pendingPayments.map((payment) => (
                      <TableRow key={`${child.id}-${payment.id}`}>
                        <TableCell className="font-medium">
                          {child.name}
                        </TableCell>
                        <TableCell>{payment.category}</TableCell>
                        <TableCell>{format(payment.dueDate, 'PPP')}</TableCell>
                        <TableCell>
                          ₹{payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusBadgeVariant(
                              payment.status as PaymentStatus
                            )}
                          >
                            {payment.status === 'UNPAID' ? 'Unpaid' : 'Overdue'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm">Pay Now</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No pending payments for any children
                      </TableCell>
                    </TableRow>
                  ) : (
                    parentData.children.flatMap((child) =>
                      child.pendingPayments.map((payment) => (
                        <TableRow key={`${child.id}-${payment.id}`}>
                          <TableCell className="font-medium">
                            {child.name}
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
                            <Button size="sm">Pay Now</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end">
              {parentData.children.some(
                (child) => child.pendingPayments.length > 0
              ) && (
                <Button>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay All Pending Fees
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
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
                  {parentData.paymentHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No payment history
                      </TableCell>
                    </TableRow>
                  ) : (
                    parentData.paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{format(payment.date, 'PPP')}</TableCell>
                        <TableCell className="font-medium">
                          {payment.childName}
                        </TableCell>
                        <TableCell>{payment.receiptNo}</TableCell>
                        <TableCell>{payment.category}</TableCell>
                        <TableCell>
                          ₹{payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentFeeHistory;
