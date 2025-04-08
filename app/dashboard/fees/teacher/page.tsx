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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Mail, Check, AlertTriangle } from 'lucide-react';

// Sample data
const students = [
  {
    id: '1',
    name: 'Rahul Sharma',
    rollNo: '1001',
    feeStatus: 'PAID',
    totalFee: 25000,
    paidAmount: 25000,
    pendingAmount: 0,
    email: 'rahul.s@example.com',
    parent: 'Mr. Rajesh Sharma',
  },
  {
    id: '2',
    name: 'Priya Patel',
    rollNo: '802',
    feeStatus: 'PAID',
    totalFee: 18000,
    paidAmount: 18000,
    pendingAmount: 0,
    email: 'priya.p@example.com',
    parent: 'Mr. Prakash Patel',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    rollNo: '1201',
    feeStatus: 'UNPAID',
    totalFee: 20000,
    paidAmount: 0,
    pendingAmount: 20000,
    email: 'amit.k@example.com',
    parent: 'Mrs. Anita Kumar',
  },
  {
    id: '4',
    name: 'Neha Singh',
    rollNo: '903',
    feeStatus: 'OVERDUE',
    totalFee: 22000,
    paidAmount: 0,
    pendingAmount: 22000,
    email: 'neha.s@example.com',
    parent: 'Mr. Naveen Singh',
  },
  {
    id: '5',
    name: 'Vikram Joshi',
    rollNo: '1102',
    feeStatus: 'UNPAID',
    totalFee: 19000,
    paidAmount: 5000,
    pendingAmount: 14000,
    email: 'vikram.j@example.com',
    parent: 'Mrs. Vandana Joshi',
  },
];

export default function TeacherDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter students based on search query and status filter
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.includes(searchQuery);
    const matchesStatus =
      statusFilter === 'all' || student.feeStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  const sendReminder = (studentId: string) => {
    // Here you would typically make an API call to send a reminder
    console.log(`Sending reminder to student with ID: ${studentId}`);
    alert(`Reminder sent to student with ID: ${studentId}`);
  };

  const markAsPaid = (studentId: string) => {
    // Here you would typically make an API call to mark the fee as paid
    console.log(`Marking fee as paid for student with ID: ${studentId}`);
    alert(`Fee marked as paid for student with ID: ${studentId}`);
  };

  return (
    <div className="">
      <main className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between mx-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Teacher Dashboard
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground">5</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">In your class</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Fees</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Students with paid fees
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unpaid Fees</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Students with unpaid fees
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overdue Fees
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                Students with overdue fees
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Fee Status</CardTitle>
            <CardDescription>
              View and manage fee status for students in your class
            </CardDescription>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 mt-4">
              <div className="flex-1">
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="UNPAID">Unpaid</SelectItem>
                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="search"
                    placeholder="Search by name or roll no..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total Fee</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`/placeholder.svg?height=40&width=40`}
                              alt={student.name}
                            />
                            <AvatarFallback>
                              {student.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {student.parent}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.rollNo}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(
                            student.feeStatus as PaymentStatus
                          )}
                        >
                          {student.feeStatus === 'PAID'
                            ? 'Paid'
                            : student.feeStatus === 'UNPAID'
                            ? 'Unpaid'
                            : 'Overdue'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{student.totalFee.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{student.paidAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{student.pendingAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {student.feeStatus !== 'PAID' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => sendReminder(student.id)}
                              >
                                <Mail className="h-3.5 w-3.5 mr-1" />
                                Remind
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markAsPaid(student.id)}
                              >
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Mark Paid
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
