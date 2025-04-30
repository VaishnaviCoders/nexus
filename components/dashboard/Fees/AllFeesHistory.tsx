'use client';

import { cn } from '@/lib/utils';

import { useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CreditCardIcon,
  DownloadIcon,
  FileEditIcon,
  FilterIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  XCircleIcon,
} from 'lucide-react';

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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data for the dashboard
const mockSummary = {
  totalFees: 1250000,
  collectedFees: 875000,
  pendingFees: 375000,
  totalStudents: 250,
  paidStudents: 175,
  unpaidStudents: 75,
  overdueFees: 125000,
};

const mockFeeRecords = [
  {
    id: 'FEE-001',
    studentId: 'STU-1001',
    studentName: 'Rahul Sharma',
    category: 'Tuition Fee',
    amount: 25000,
    status: 'PAID',
    dueDate: '2023-10-15',
    paidDate: '2023-10-10',
    class: '10th',
  },
  {
    id: 'FEE-002',
    studentId: 'STU-1002',
    studentName: 'Priya Patel',
    category: 'Library Fee',
    amount: 5000,
    status: 'UNPAID',
    dueDate: '2023-10-20',
    paidDate: null,
    class: '12th',
  },
  {
    id: 'FEE-003',
    studentId: 'STU-1003',
    studentName: 'Amit Kumar',
    category: 'Tuition Fee',
    amount: 25000,
    status: 'PAID',
    dueDate: '2023-10-15',
    paidDate: '2023-10-05',
    class: '11th',
  },
  {
    id: 'FEE-004',
    studentId: 'STU-1004',
    studentName: 'Sneha Gupta',
    category: 'Exam Fee',
    amount: 7500,
    status: 'OVERDUE',
    dueDate: '2023-09-30',
    paidDate: null,
    class: '9th',
  },
  {
    id: 'FEE-005',
    studentId: 'STU-1005',
    studentName: 'Vikram Singh',
    category: 'Sports Fee',
    amount: 3000,
    status: 'PAID',
    dueDate: '2023-10-10',
    paidDate: '2023-10-08',
    class: '10th',
  },
  {
    id: 'FEE-006',
    studentId: 'STU-1006',
    studentName: 'Neha Verma',
    category: 'Tuition Fee',
    amount: 25000,
    status: 'UNPAID',
    dueDate: '2023-10-25',
    paidDate: null,
    class: '12th',
  },
  {
    id: 'FEE-007',
    studentId: 'STU-1007',
    studentName: 'Rajesh Khanna',
    category: 'Lab Fee',
    amount: 8000,
    status: 'PAID',
    dueDate: '2023-10-05',
    paidDate: '2023-10-01',
    class: '11th',
  },
  {
    id: 'FEE-008',
    studentId: 'STU-1008',
    studentName: 'Ananya Mishra',
    category: 'Tuition Fee',
    amount: 25000,
    status: 'OVERDUE',
    dueDate: '2023-09-25',
    paidDate: null,
    class: '9th',
  },
];

const mockClasses = ['All Classes', '9th', '10th', '11th', '12th'];
const mockCategories = [
  'All Categories',
  'Tuition Fee',
  'Exam Fee',
  'Library Fee',
  'Lab Fee',
  'Sports Fee',
];
const mockStatuses = ['All Statuses', 'PAID', 'UNPAID', 'OVERDUE'];

export default function AllFeesHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Filter fee records based on search and filters
  const filteredFeeRecords = mockFeeRecords.filter((record) => {
    const matchesSearch =
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass =
      selectedClass === 'All Classes' || record.class === selectedClass;
    const matchesCategory =
      selectedCategory === 'All Categories' ||
      record.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All Statuses' || record.status === selectedStatus;

    return matchesSearch && matchesClass && matchesCategory && matchesStatus;
  });

  return (
    <div className="flex flex-col space-y-8 ">
      {/* Fee Records */}
      <div>
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All Fees</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search fees..."
                  className="w-full sm:w-[250px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter Fees</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground mt-2">
                    Class
                  </DropdownMenuLabel>
                  {mockClasses.map((cls) => (
                    <DropdownMenuCheckboxItem
                      key={cls}
                      checked={selectedClass === cls}
                      onCheckedChange={() => setSelectedClass(cls)}
                    >
                      {cls}
                    </DropdownMenuCheckboxItem>
                  ))}

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    Category
                  </DropdownMenuLabel>
                  {mockCategories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={selectedCategory === category}
                      onCheckedChange={() => setSelectedCategory(category)}
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  ))}

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    Status
                  </DropdownMenuLabel>
                  {mockStatuses.map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={selectedStatus === status}
                      onCheckedChange={() => setSelectedStatus(status)}
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="icon">
                <SlidersHorizontalIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Fee ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeeRecords.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No fee records found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFeeRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {record.id}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {record.studentName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {record.studentId}
                            </div>
                          </TableCell>
                          <TableCell>{record.class}</TableCell>
                          <TableCell>{record.category}</TableCell>
                          <TableCell className="text-right">
                            ₹{record.amount.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                              {new Date(record.dueDate).toLocaleDateString(
                                'en-IN',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                'font-normal',
                                record.status === 'PAID'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : record.status === 'UNPAID'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-red-50 text-red-700 border-red-200'
                              )}
                            >
                              {record.status === 'PAID' && (
                                <CheckCircle2Icon className="mr-1 h-3 w-3" />
                              )}
                              {record.status === 'OVERDUE' && (
                                <XCircleIcon className="mr-1 h-3 w-3" />
                              )}
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <SlidersHorizontalIcon className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <FileEditIcon className="mr-2 h-4 w-4" />
                                  Edit Fee
                                </DropdownMenuItem>
                                {record.status !== 'PAID' ? (
                                  <DropdownMenuItem>
                                    <CreditCardIcon className="mr-2 h-4 w-4" />
                                    Mark as Paid
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem>
                                    <DownloadIcon className="mr-2 h-4 w-4" />
                                    Download Receipt
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  Delete Fee
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t p-4">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{filteredFeeRecords.length}</strong> of{' '}
                  <strong>{mockFeeRecords.length}</strong> fee records
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="paid" className="m-0">
            {/* Similar table structure for paid fees */}
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                Paid fees content would appear here with the same structure
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unpaid" className="m-0">
            {/* Similar table structure for unpaid fees */}
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                Unpaid fees content would appear here with the same structure
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overdue" className="m-0">
            {/* Similar table structure for overdue fees */}
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                Overdue fees content would appear here with the same structure
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
