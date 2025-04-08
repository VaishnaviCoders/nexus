'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { CreditCard, Download, Receipt, Calendar } from 'lucide-react';
import { format } from 'date-fns';

// Sample student data
const studentData = {
  id: '1',
  name: 'Rahul Sharma',
  grade: '10th',
  section: 'A',
  rollNo: '1001',
  totalFees: 45000,
  paidFees: 25000,
  pendingFees: 20000,
  paymentHistory: [
    {
      id: 'p1',
      date: new Date(2023, 4, 15),
      amount: 15000,
      category: 'Annual Fee',
      receiptNo: 'REC-001',
      paymentMethod: 'Online',
    },
    {
      id: 'p2',
      date: new Date(2023, 5, 10),
      amount: 10000,
      category: 'Term Fee',
      receiptNo: 'REC-002',
      paymentMethod: 'Bank Transfer',
    },
  ],
  pendingPayments: [
    {
      id: 'pp1',
      dueDate: new Date(2023, 7, 15),
      amount: 12000,
      category: 'Exam Fee',
      status: 'UNPAID',
    },
    {
      id: 'pp2',
      dueDate: new Date(2023, 6, 5),
      amount: 8000,
      category: 'Lab Fee',
      status: 'OVERDUE',
    },
  ],
};

export default function StudentDashboard() {
  const paymentPercentage = Math.round(
    (studentData.paidFees / studentData.totalFees) * 100
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
    <div className="">
      <main className="flex flex-1 flex-col gap-4 ">
        <div className="flex items-center justify-between mx-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Student Dashboard
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Student Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Name:</span>
                  <span>{studentData.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Grade & Section:</span>
                  <span>
                    {studentData.grade} {studentData.section}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Roll Number:</span>
                  <span>{studentData.rollNo}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Fee Overview</CardTitle>
              <CardDescription>Your fee payment status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Fees:</span>
                <span>₹{studentData.totalFees.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Paid Amount:</span>
                <span className="text-green-600">
                  ₹{studentData.paidFees.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending Amount:</span>
                <span className="text-amber-600">
                  ₹{studentData.pendingFees.toLocaleString()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Payment Progress</span>
                  <span>{paymentPercentage}%</span>
                </div>
                <Progress value={paymentPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common fee-related actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Fees Online
              </Button>
              <Button className="w-full" variant="outline">
                <Receipt className="mr-2 h-4 w-4" />
                Download All Receipts
              </Button>
              <Button className="w-full" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                View Fee Schedule
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Payments</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Fee Payments</CardTitle>
                <CardDescription>Fees that are due or upcoming</CardDescription>
              </CardHeader>
              <CardContent>
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
                    {studentData.pendingPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No pending payments
                        </TableCell>
                      </TableRow>
                    ) : (
                      studentData.pendingPayments.map((payment) => (
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  Record of your previous fee payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Receipt No</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead className="text-right">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentData.paymentHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No payment history
                        </TableCell>
                      </TableRow>
                    ) : (
                      studentData.paymentHistory.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{format(payment.date, 'PPP')}</TableCell>
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
      </main>
    </div>
  );
}
