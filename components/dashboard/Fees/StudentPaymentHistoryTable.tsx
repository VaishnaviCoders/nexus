'use client';

import { useState, useEffect, useMemo } from 'react';
import { z } from 'zod';
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
  InfoIcon,
  PrinterIcon,
  BellIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { payFeesAction } from '@/lib/data/fee/payFeesAction';
import { toast } from 'sonner';
import { FeeRecord } from '@/types';
import {
  SendFeesReminderDialog,
  FeeReminderRecipient,
} from './SendFeesReminderDialog';

// Schemas
const FeeStatusSchema = z.enum(['PAID', 'UNPAID', 'OVERDUE']);
const PaymentMethodSchema = z.enum([
  'CASH',
  'UPI',
  'CARD',
  'BANK_TRANSFER',
  'CHEQUE',
  'ONLINE',
]);
const FeeSchema = z.object({
  id: z.string(),
  totalFee: z.number(),
  paidAmount: z.number(),
  pendingAmount: z.number().optional(),
  dueDate: z.date(),
  status: FeeStatusSchema,
  studentId: z.string(),
  feeCategoryId: z.string(),
  organizationId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
const StudentSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().optional(),
  fullName: z.string().optional(),
  rollNumber: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  gradeId: z.string(),
  sectionId: z.string(),
});
const FeeCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});
const GradeSchema = z.object({
  id: z.string(),
  grade: z.string(),
});
const SectionSchema = z.object({
  id: z.string(),
  name: z.string(),
});
const FeePaymentSchema = z.object({
  id: z.string(),
  amountPaid: z.number(),
  paymentDate: z.date(),
  paymentMethod: PaymentMethodSchema,
  receiptNumber: z.string(),
  transactionId: z.string().optional(),
  feeId: z.string(),
});

// Form validation schema for Record Payment
const PaymentFormSchema = z.object({
  amount: z.number().positive().max(1000000, 'Amount too large'),
  method: PaymentMethodSchema,
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

interface FilterState {
  searchTerm: string;
  grade: string | null;
  section: string | null;
  category: string | null;
  status: string | null;
}

interface StudentPaymentHistoryTableProps {
  feeRecords: FeeRecord[];
}

export default function StudentPaymentHistoryTable({
  feeRecords = [],
}: StudentPaymentHistoryTableProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    grade: null,
    section: null,
    category: null,
    status: null,
  });
  const [currentTab, setCurrentTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [localFeeRecords, setLocalFeeRecords] =
    useState<FeeRecord[]>(feeRecords);

  // Sync local records with props
  useEffect(() => {
    setLocalFeeRecords(feeRecords);
  }, [feeRecords]);

  // Simulate loading effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [filters, currentTab, currentPage]);

  // Reset pagination on filter or tab change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, currentTab]);

  // Filter and pagination logic
  const { filteredRecords, totalPages, currentRecords } = useMemo(() => {
    const filtered = localFeeRecords.filter((record) => {
      const { searchTerm, grade, section, category, status } = filters;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        record.fee.id.toLowerCase().includes(searchLower) ||
        record.student.rollNumber.toLowerCase().includes(searchLower) ||
        (record.student.fullName?.toLowerCase().includes(searchLower) ??
          false) ||
        record.student.firstName.toLowerCase().includes(searchLower) ||
        record.student.lastName.toLowerCase().includes(searchLower);
      const matchesTab =
        currentTab === 'all' || record.fee.status === currentTab.toUpperCase();
      const matchesGrade = !grade || record.grade.grade === grade;
      const matchesSection = !section || record.section.name === section;
      const matchesCategory = !category || record.feeCategory.name === category;
      const matchesStatus = !status || record.fee.status === status;
      return (
        matchesSearch &&
        matchesTab &&
        matchesGrade &&
        matchesSection &&
        matchesCategory &&
        matchesStatus
      );
    });

    const total = Math.ceil(filtered.length / recordsPerPage);
    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    return {
      filteredRecords: filtered,
      totalPages: total,
      currentRecords: filtered.slice(start, end),
    };
  }, [localFeeRecords, filters, currentTab, currentPage, recordsPerPage]);

  // Filter options
  const filterOptions = useMemo(
    () => ({
      grades: Array.from(new Set(localFeeRecords.map((r) => r.grade.grade))),
      sections: Array.from(new Set(localFeeRecords.map((r) => r.section.name))),
      categories: Array.from(
        new Set(localFeeRecords.map((r) => r.feeCategory.name))
      ),
    }),
    [localFeeRecords]
  );

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      grade: null,
      section: null,
      category: null,
      status: null,
    });
  };

  const [sendFeeReminderDialogIsOpen, setSendFeeReminderDialogIsOpen] =
    useState(true);

  // Map feeRecords to initialRecipients, only for UNPAID or OVERDUE
  const initialRecipients: FeeReminderRecipient[] = feeRecords
    .filter(
      (
        record
      ): record is FeeRecord & { fee: { status: 'UNPAID' | 'OVERDUE' } } =>
        record.fee.status !== 'PAID'
    )
    .map((record) => ({
      id: record.fee.id,
      studentId: record.student.rollNumber,
      studentName: `${record.student.firstName} ${record.student.lastName}`,
      grade: record.grade.grade,
      section: record.section.name,
      parentName: record.student.firstName + ' ' + record.student.lastName, // Using student name as parent name since we don't have parent data
      parentEmail: record.student.email,
      parentPhone: record.student.phoneNumber,
      status: record.fee.status,
      amountDue: record.fee.pendingAmount ?? record.fee.totalFee,
      dueDate: record.fee.dueDate,
    }));

  return (
    <div className="flex flex-col space-y-8">
      <SendFeesReminderDialog
        open={sendFeeReminderDialogIsOpen}
        onOpenChange={setSendFeeReminderDialogIsOpen}
        initialRecipients={initialRecipients}
      />
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <FilterControls
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
          resetFilters={resetFilters}
          feeRecords={localFeeRecords}
          currentTab={currentTab}
        />
        {['all', 'paid', 'unpaid', 'overdue'].map((tab) => (
          <TabsContent key={tab} value={tab} className="m-0">
            <FeeTable
              records={currentRecords}
              isLoading={isLoading}
              recordsPerPage={recordsPerPage}
              setSelectedRecord={setSelectedRecord}
              setShowPaymentDialog={setShowPaymentDialog}
              resetFilters={resetFilters}
            />
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              recordsPerPage={recordsPerPage}
              setCurrentPage={setCurrentPage}
              setRecordsPerPage={setRecordsPerPage}
              filteredRecordsCount={filteredRecords.length}
              isLoading={isLoading}
            />
          </TabsContent>
        ))}
      </Tabs>
      <FeeDetailsDialog
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
        showPaymentDialog={showPaymentDialog}
        setShowPaymentDialog={setShowPaymentDialog}
      />
      <RecordPaymentDialog
        selectedRecord={selectedRecord}
        showPaymentDialog={showPaymentDialog}
        setShowPaymentDialog={setShowPaymentDialog}
        setSelectedRecord={setSelectedRecord}
        setLocalFeeRecords={setLocalFeeRecords}
      />
    </div>
  );
}

// Filter Controls Component
interface FilterControlsProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  filterOptions: { grades: string[]; sections: string[]; categories: string[] };
  resetFilters: () => void;
  feeRecords: FeeRecord[];
  currentTab: string;
}

function FilterControls({
  filters,
  setFilters,
  filterOptions,
  resetFilters,
  feeRecords,
  currentTab,
}: FilterControlsProps) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
      <TabsList className="">
        {['all', 'paid', 'unpaid', 'overdue'].map((tab) => (
          <TabsTrigger key={tab} value={tab} className="relative">
            <div className="hidden sm:block max-sm:hidden">
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Fees
            </div>
            <div className="max-sm:block sm:hidden">
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
            <Badge
              className={cn(
                'ml-1',
                tab === 'all' && 'bg-gray-200 text-gray-700 hover:bg-gray-200',
                tab === 'paid' &&
                  'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
                tab === 'unpaid' &&
                  'bg-amber-100 text-amber-700 hover:bg-amber-100',
                tab === 'overdue' && 'bg-red-100 text-red-700 hover:bg-red-100'
              )}
            >
              {tab === 'all'
                ? feeRecords.length
                : feeRecords.filter((r) => r.fee.status === tab.toUpperCase())
                    .length}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="flex flex-wrap items-center gap-2 mx-2">
        <div className="relative flex-1 min-w-[200px]">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by ID, name, or roll number..."
            className="pl-8"
            value={filters.searchTerm}
            onChange={(e) =>
              setFilters({ ...filters, searchTerm: e.target.value })
            }
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <FilterIcon className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[220px]">
            <DropdownMenuLabel>Filter Fees</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <SelectFilter
              label="Grade"
              value={filters.grade}
              onChange={(value) => setFilters({ ...filters, grade: value })}
              options={filterOptions.grades}
              placeholder="All Grades"
            />
            <SelectFilter
              label="Section"
              value={filters.section}
              onChange={(value) => setFilters({ ...filters, section: value })}
              options={filterOptions.sections}
              placeholder="All Sections"
            />
            <SelectFilter
              label="Fee Category"
              value={filters.category}
              onChange={(value) => setFilters({ ...filters, category: value })}
              options={filterOptions.categories}
              placeholder="All Categories"
            />
            {currentTab === 'all' && (
              <SelectFilter
                label="Status"
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
                options={['PAID', 'UNPAID', 'OVERDUE']}
                placeholder="All Statuses"
              />
            )}
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <SlidersHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <PrinterIcon className="mr-2 h-4 w-4" />
              Print Report
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export to Excel
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BellIcon className="mr-2 h-4 w-4" />
              Send Reminders
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// Select Filter Component
interface SelectFilterProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: string[];
  placeholder: string;
}

function SelectFilter({
  label,
  value,
  onChange,
  options,
  placeholder,
}: SelectFilterProps) {
  return (
    <div className="p-2">
      <p className="text-xs font-medium mb-1">{label}</p>
      <Select
        value={value ?? 'all'}
        onValueChange={(val) => onChange(val === 'all' ? null : val)}
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{placeholder}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Fee Table Component
interface FeeTableProps {
  records: FeeRecord[];
  isLoading: boolean;
  recordsPerPage: number;
  setSelectedRecord: (record: FeeRecord | null) => void;
  setShowPaymentDialog: (value: boolean) => void;
  resetFilters: () => void;
}

function FeeTable({
  records,
  isLoading,
  recordsPerPage,
  setSelectedRecord,
  setShowPaymentDialog,
  resetFilters,
}: FeeTableProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  const formatDate = (date: Date) => format(date, 'dd MMM yyyy');

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <FeeTableHeader />
          </TableHeader>
          <TableBody>
            {isLoading ? (
              tableLoadingSkeletons(Math.max(records.length, 1))
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center">
                    <InfoIcon className="h-10 w-10 text-muted-foreground/50 mb-2" />
                    <p>No fee records found</p>
                    <Button
                      variant="link"
                      onClick={resetFilters}
                      className="mt-2"
                    >
                      Reset all filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <FeeTableRow
                  key={record.fee.id}
                  record={record}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  setSelectedRecord={setSelectedRecord}
                  setShowPaymentDialog={setShowPaymentDialog}
                />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Fee Table Header Component
function FeeTableHeader() {
  return (
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
  );
}

// Fee Table Row Component
interface FeeTableRowProps {
  record: FeeRecord;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
  setSelectedRecord: (record: FeeRecord | null) => void;
  setShowPaymentDialog: (value: boolean) => void;
}

function FeeTableRow({
  record,
  formatCurrency,
  formatDate,
  setSelectedRecord,
  setShowPaymentDialog,
}: FeeTableRowProps) {
  return (
    <TableRow className="group">
      <TableCell className="font-medium">{record.fee.id.slice(0, 8)}</TableCell>
      <TableCell className="whitespace-nowrap">
        <div className="font-medium">{`${record.student.firstName} ${record.student.lastName}`}</div>
        <div className="text-xs text-muted-foreground">
          {record.student.rollNumber}
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap">
        <div className="flex flex-col items-start gap-1">
          {record.grade.grade}
          <span className="text-xs text-muted-foreground">
            ({record.section.name})
          </span>
        </div>
      </TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{record.feeCategory.name}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{record.feeCategory.description ?? 'No description'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="text-right font-medium">
        <div>{formatCurrency(record.fee.totalFee)}</div>
        {record.fee.paidAmount > 0 &&
          record.fee.paidAmount < record.fee.totalFee && (
            <div className="text-xs text-muted-foreground">
              Paid: {formatCurrency(record.fee.paidAmount)}
            </div>
          )}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          {formatDate(record.fee.dueDate)}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn(
            'font-normal',
            record.fee.status === 'PAID' &&
              'bg-emerald-50 text-emerald-700 border-emerald-200',
            record.fee.status === 'UNPAID' &&
              'bg-amber-50 text-amber-700 border-amber-200',
            record.fee.status === 'OVERDUE' &&
              'bg-red-50 text-red-700 border-red-200'
          )}
        >
          {record.fee.status === 'PAID' && (
            <CheckCircle2Icon className="mr-1 h-3 w-3" />
          )}
          {record.fee.status === 'OVERDUE' && (
            <XCircleIcon className="mr-1 h-3 w-3" />
          )}
          {record.fee.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <SlidersHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedRecord(record)}>
              <FileEditIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {record.fee.status !== 'PAID' ? (
              <DropdownMenuItem
                onClick={() => {
                  setSelectedRecord(record);
                  setShowPaymentDialog(true);
                }}
              >
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Record Payment
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
  );
}

// Fee Details Dialog Component
interface FeeDetailsDialogProps {
  selectedRecord: FeeRecord | null;
  setSelectedRecord: (record: FeeRecord | null) => void;
  showPaymentDialog: boolean;
  setShowPaymentDialog: (value: boolean) => void;
}

function FeeDetailsDialog({
  selectedRecord,
  setSelectedRecord,
  showPaymentDialog,
  setShowPaymentDialog,
}: FeeDetailsDialogProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  const formatDate = (date: Date) => format(date, 'dd MMM yyyy');

  return (
    <Dialog
      open={!!selectedRecord && !showPaymentDialog}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedRecord(null);
          setShowPaymentDialog(false);
        }
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Fee Details</DialogTitle>
          <DialogDescription>
            Detailed information about fee {selectedRecord?.fee.id}
          </DialogDescription>
        </DialogHeader>
        {selectedRecord && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">
                  Student Information
                </h3>
                <Card>
                  <CardContent className="p-4">
                    <dl className="grid grid-cols-[1fr_2fr] gap-2 text-sm">
                      <dt className="font-medium text-muted-foreground">
                        Name:
                      </dt>
                      <dd>
                        {selectedRecord.student.fullName ||
                          `${selectedRecord.student.firstName} ${selectedRecord.student.lastName}`}
                      </dd>
                      <dt className="font-medium text-muted-foreground">
                        Roll Number:
                      </dt>
                      <dd>{selectedRecord.student.rollNumber}</dd>
                      <dt className="font-medium text-muted-foreground">
                        Class:
                      </dt>
                      <dd>{`${selectedRecord.grade.grade} - ${selectedRecord.section.name}`}</dd>
                      <dt className="font-medium text-muted-foreground">
                        Email:
                      </dt>
                      <dd className="truncate">
                        {selectedRecord.student.email}
                      </dd>
                      <dt className="font-medium text-muted-foreground">
                        Phone:
                      </dt>
                      <dd>{selectedRecord.student.phoneNumber}</dd>
                    </dl>
                  </CardContent>
                </Card>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Fee Information</h3>
                <Card>
                  <CardContent className="p-4">
                    <dl className="grid grid-cols-[1fr_2fr] gap-2 text-sm">
                      <dt className="font-medium text-muted-foreground">
                        Fee ID:
                      </dt>
                      <dd>{selectedRecord.fee.id}</dd>
                      <dt className="font-medium text-muted-foreground">
                        Category:
                      </dt>
                      <dd>{selectedRecord.feeCategory.name}</dd>
                      <dt className="font-medium text-muted-foreground">
                        Total Amount:
                      </dt>
                      <dd className="font-medium">
                        {formatCurrency(selectedRecord.fee.totalFee)}
                      </dd>
                      <dt className="font-medium text-muted-foreground">
                        Paid Amount:
                      </dt>
                      <dd className="text-emerald-600">
                        {formatCurrency(selectedRecord.fee.paidAmount)}
                      </dd>
                      <dt className="font-medium text-muted-foreground">
                        Pending Amount:
                      </dt>
                      <dd
                        className={
                          selectedRecord.fee.pendingAmount
                            ? 'text-amber-600'
                            : ''
                        }
                      >
                        {formatCurrency(selectedRecord.fee.pendingAmount ?? 0)}
                      </dd>

                      <dt className="font-medium text-muted-foreground">
                        Due Date:
                      </dt>
                      <dd>{formatDate(selectedRecord.fee.dueDate)}</dd>
                      <dt className="font-medium text-muted-foreground">
                        Status:
                      </dt>
                      <dd>
                        <Badge
                          variant="outline"
                          className={cn(
                            'font-normal',
                            selectedRecord.fee.status === 'PAID' &&
                              'bg-emerald-50 text-emerald-700 border-emerald-200',
                            selectedRecord.fee.status === 'UNPAID' &&
                              'bg-amber-50 text-amber-700 border-amber-200',
                            selectedRecord.fee.status === 'OVERDUE' &&
                              'bg-red-50 text-red-700 border-red-200'
                          )}
                        >
                          {selectedRecord.fee.status === 'PAID' && (
                            <CheckCircle2Icon className="mr-1 h-3 w-3" />
                          )}
                          {selectedRecord.fee.status === 'OVERDUE' && (
                            <XCircleIcon className="mr-1 h-3 w-3" />
                          )}
                          {selectedRecord.fee.status}
                        </Badge>
                      </dd>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Payment History</h3>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Receipt No.</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRecord.payments?.length ? (
                        selectedRecord.payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.receiptNumber}</TableCell>
                            <TableCell>
                              {formatDate(payment.paymentDate)}
                            </TableCell>
                            <TableCell>{payment.paymentMethod}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(payment.amountPaid)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <DownloadIcon className="h-4 w-4 mr-1" />
                                Receipt
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-6 text-muted-foreground"
                          >
                            No payment records found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              {selectedRecord.fee.status !== 'PAID' && (
                <Button onClick={() => setShowPaymentDialog(true)}>
                  <CreditCardIcon className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              )}
              <Button variant="outline">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download Details
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Record Payment Dialog Component
interface RecordPaymentDialogProps {
  selectedRecord: FeeRecord | null;
  showPaymentDialog: boolean;
  setShowPaymentDialog: (value: boolean) => void;
  setSelectedRecord: (record: FeeRecord | null) => void;
  setLocalFeeRecords: (records: FeeRecord[]) => void;
}

function RecordPaymentDialog({
  selectedRecord,
  showPaymentDialog,
  setShowPaymentDialog,
  setSelectedRecord,
  setLocalFeeRecords,
}: RecordPaymentDialogProps) {
  const [formErrors, setFormErrors] = useState<{ amount?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRecord) return;

    setIsSubmitting(true);
    setFormErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      amount: parseFloat(formData.get('amount') as string),
      method: formData.get('method') as string,
      transactionId: formData.get('transaction') as string,
      notes: formData.get('notes') as string,
    };

    try {
      const parsed = PaymentFormSchema.safeParse(data);
      if (!parsed.success) {
        const errors = parsed.error.flatten().fieldErrors;
        setFormErrors({
          amount: errors.amount?.[0],
        });
        setIsSubmitting(false);
        return;
      }

      await payFeesAction(selectedRecord.fee.id, parsed.data.amount);

      // await payFeesAction({
      //   feeId: selectedRecord.fee.id,
      //   amount: parsed.data.amount,
      //   method: parsed.data.method,
      //   transactionId: parsed.data.transactionId,
      //   notes: parsed.data.notes,
      // });

      toast.success(
        `Successfully recorded payment of ${formatCurrency(
          parsed.data.amount
        )}.`
      );

      setShowPaymentDialog(false);
      setSelectedRecord(null);
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={showPaymentDialog}
      onOpenChange={(open) => {
        setShowPaymentDialog(open);
        if (!open) setFormErrors({});
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Record a new payment for{' '}
            {selectedRecord?.student.fullName ||
              `${selectedRecord?.student.firstName} ${selectedRecord?.student.lastName}`}
          </DialogDescription>
        </DialogHeader>
        {selectedRecord && (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="font-medium text-muted-foreground">
                  Total Fee:
                </div>
                <div className="font-medium">
                  {formatCurrency(selectedRecord.fee.totalFee)}
                </div>
                <div className="font-medium text-muted-foreground">
                  Paid Amount:
                </div>
                <div className="text-emerald-600">
                  {formatCurrency(selectedRecord.fee.paidAmount)}
                </div>
                <div className="font-medium text-muted-foreground">
                  Pending Amount:
                </div>
                <div className="text-amber-600">
                  {formatCurrency(selectedRecord.fee.pendingAmount ?? 0)}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Payment Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="Enter amount"
                  defaultValue={
                    selectedRecord.fee.pendingAmount?.toString() ?? '0'
                  }
                  required
                  // readOnly
                  disabled={isSubmitting}
                />
                {formErrors.amount && (
                  <p className="text-sm text-destructive">
                    {formErrors.amount}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select
                  name="method"
                  defaultValue="CASH"
                  disabled={isSubmitting}
                  required
                >
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PaymentMethodSchema.options.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method.charAt(0) + method.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="transaction">Transaction ID (Optional)</Label>
                <Input
                  id="transaction"
                  name="transaction"
                  placeholder="Enter transaction reference"
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  name="notes"
                  placeholder="Add any additional notes"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Recording...' : 'Record Payment'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Pagination Controls Component
interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  recordsPerPage: number;
  setCurrentPage: (page: number) => void;
  setRecordsPerPage: (records: number) => void;
  filteredRecordsCount: number;
  isLoading: boolean;
}

function PaginationControls({
  currentPage,
  totalPages,
  recordsPerPage,
  setCurrentPage,
  setRecordsPerPage,
  filteredRecordsCount,
  isLoading,
}: PaginationControlsProps) {
  return (
    // now i want make this responsive for
    <CardFooter className="flex items-center justify-between border-t p-4 flex-col sm:flex-row gap-5 sm:gap-0 sm:items-center">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Showing{' '}
          <strong>{Math.min(recordsPerPage, filteredRecordsCount)}</strong> of{' '}
          <strong>{filteredRecordsCount}</strong> fee records
        </p>
        <Select
          value={recordsPerPage.toString()}
          onValueChange={(value) => setRecordsPerPage(parseInt(value))}
        >
          <SelectTrigger className="h-8 w-[110px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <div className="text-sm">
          Page <strong>{currentPage}</strong> of{' '}
          <strong>{totalPages || 1}</strong>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0 || isLoading}
        >
          Next
          <ArrowRightIcon className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </CardFooter>
  );
}

// Table Loading Skeletons
function tableLoadingSkeletons(recordsPerPage: number) {
  return Array(recordsPerPage)
    .fill(0)
    .map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell>
          <Skeleton className="h-5 w-16" />
        </TableCell>
        <TableCell>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </TableCell>
        <TableCell>
          <Skeleton className="h-5 w-12" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-5 w-24" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-5 w-16 ml-auto" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-5 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-20" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-8 w-8 ml-auto" />
        </TableCell>
      </TableRow>
    ));
}
