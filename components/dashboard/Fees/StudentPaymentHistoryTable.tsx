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
  FilterIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  XCircleIcon,
  InfoIcon,
  PrinterIcon,
  BellIcon,
  Eye,
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
  DialogTrigger,
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
import { ReminderHistoryButton } from './ReminderHistoryButton';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: Date) => format(new Date(date), 'dd MMM yyyy');

// Schemas
const PaymentMethodSchema = z.enum([
  'CASH',
  'UPI',
  'CARD',
  'BANK_TRANSFER',
  'CHEQUE',
  'ONLINE',
]);

const PaymentFormSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(
      1000000,
      'Amount too large (Contact your administrator for assistance)'
    ),
  method: PaymentMethodSchema,
  transactionId: z.string().optional(),
  note: z.string().optional(),
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

  return (
    <div className="flex flex-col space-y-8">
      <ReminderHistoryButton studentId="123" />
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
    </div>
  );
}

// Record Payment Dialog Component
interface RecordPaymentCardProps {
  selectedRecord: FeeRecord | null;
}

const RecordPaymentCard = ({ selectedRecord }: RecordPaymentCardProps) => {
  console.log('selectedRecord', selectedRecord?.fee.id);
  const [formErrors, setFormErrors] = useState<{ amount?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      note: formData.get('note') as string,
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

      // await payFeesAction(selectedRecord.fee.id, parsed.data.amount);

      toast.success(
        `Successfully recorded payment of ${formatCurrency(
          parsed.data.amount
        )}.`
      );
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="max-w-md">
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
                    selectedRecord.fee.pendingAmount?.toString() ?? ''
                  }
                  required
                  disabled={isSubmitting}
                  aria-invalid={!!formErrors.amount}
                  aria-describedby={
                    formErrors.amount ? 'amount-error' : undefined
                  }
                />
                {formErrors.amount && (
                  <p id="amount-error" className="text-sm text-destructive">
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
                  aria-label="Payment method"
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
                  aria-label="Transaction ID"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Input
                  id="note"
                  name="note"
                  placeholder="Add any additional note"
                  disabled={isSubmitting}
                  aria-label="Payment note"
                />
              </div>
            </div>
            <CardFooter className="w-full  flex justify-center items-center p-0 mx-0">
              <Button
                type="submit"
                disabled={isSubmitting}
                aria-label="Record payment"
                className="px-4 py-2 w-full mx-0"
              >
                {isSubmitting ? 'Recording...' : 'Record Payment'}
              </Button>
            </CardFooter>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

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
  // Map feeRecords to initialRecipients for unpaid or overdue fees
  const initialRecipients: FeeReminderRecipient[] = useMemo(
    () =>
      feeRecords
        .filter(
          (record) =>
            record.fee.status === 'UNPAID' || record.fee.status === 'OVERDUE'
        )
        .map((record) => ({
          id: record.fee.id,
          studentId: record.student.id,
          studentName: `${record.student.firstName} ${record.student.lastName}`,
          grade: record.grade.grade,
          section: record.section.name,
          parentName: `${record.student.firstName} ${record.student.lastName}`, // Placeholder; replace with actual parent data if available
          parentEmail: record.student.email || '',
          parentPhone: record.student.phoneNumber || '',
          status: record.fee.status as 'UNPAID' | 'OVERDUE',
          amountDue: record.fee.pendingAmount ?? record.fee.totalFee,
          dueDate: record.fee.dueDate,
        })),
    [feeRecords]
  );
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
      <TabsList className="flex-wrap">
        {['all', 'paid', 'unpaid', 'overdue'].map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="relative text-xs sm:text-sm"
            aria-label={`${tab.charAt(0).toUpperCase() + tab.slice(1)} Fees`}
          >
            <span className="hidden sm:inline">
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Fees
            </span>
            <span className="sm:hidden">
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </span>
            <Badge
              className={cn(
                'ml-1 text-xs',
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
            aria-label="Search fee records"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              aria-label="Filter options"
            >
              <FilterIcon className="h-4 w-4" />
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
                aria-label="Reset filters"
              >
                Reset Filters
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              aria-label="More options"
            >
              <SlidersHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2">
              <PrinterIcon className="h-4 w-4" />
              <span>Print Report</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <DownloadIcon className="h-4 w-4" />
              <span>Export to Excel</span>
            </DropdownMenuItem>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onSelect={(e) => e.preventDefault()}
                >
                  <BellIcon className="h-4 w-4" />
                  <span>Send Reminders</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Send Fee Reminders</DialogTitle>
                  <DialogDescription>
                    Send payment reminders to students or parents with
                    outstanding fees
                  </DialogDescription>
                </DialogHeader>
                <SendFeesReminderDialog initialRecipients={initialRecipients} />
              </DialogContent>
            </Dialog>
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
        <SelectTrigger className="h-8" aria-label={`Filter by ${label}`}>
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

  resetFilters: () => void;
}
function FeeTable({
  records,
  isLoading,
  recordsPerPage,
  resetFilters,
}: FeeTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <FeeTableHeader />
          </TableHeader>
          <TableBody>
            {isLoading ? (
              tableLoadingSkeletons(recordsPerPage)
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
                      aria-label="Reset all filters"
                    >
                      Reset all filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <FeeTableRow key={record.fee.id} record={record} />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
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
      <TableHead>Actions</TableHead>
    </TableRow>
  );
}
interface FeeTableRowProps {
  record: FeeRecord;
}
function FeeTableRow({ record }: FeeTableRowProps) {
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
      <TableCell>
        <Dialog>
          <DialogTrigger className="flex items-center space-x-2">
            <Eye className="mr-2 h-4 w-4" />
            View
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Fee Details</DialogTitle>
              <DialogDescription>
                Detailed information about fee {record?.fee.id}
              </DialogDescription>
            </DialogHeader>
            <FeeDetailsContent selectedRecord={record} />
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}

const FeeDetailsContent = ({
  selectedRecord,
}: {
  selectedRecord: FeeRecord | null;
}) => {
  return (
    <>
      {selectedRecord && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Student Information</h3>
              <Card>
                <CardContent className="p-4">
                  <dl className="grid grid-cols-[1fr_2fr] gap-2 text-sm">
                    <dt className="font-medium text-muted-foreground">Name:</dt>
                    <dd>{`${selectedRecord.student.firstName} ${selectedRecord.student.lastName}`}</dd>
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
                      {selectedRecord.student.email || 'N/A'}
                    </dd>
                    <dt className="font-medium text-muted-foreground">
                      Phone:
                    </dt>
                    <dd>{selectedRecord.student.phoneNumber || 'N/A'}</dd>
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
                        selectedRecord.fee.pendingAmount ? 'text-amber-600' : ''
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
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label="Download receipt"
                            >
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button aria-label="Record payment">
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    Record Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Record Payment</DialogTitle>
                    <DialogDescription>
                      Record a new payment for{' '}
                      {selectedRecord?.fee.id
                        ? `${selectedRecord.student.firstName} ${selectedRecord.student.lastName}`
                        : 'selected student'}
                    </DialogDescription>
                  </DialogHeader>

                  <RecordPaymentCard selectedRecord={selectedRecord} />
                </DialogContent>
              </Dialog>
            )}
            <Button variant="outline" aria-label="Download details">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Download Details
            </Button>
          </DialogFooter>
        </>
      )}
    </>
  );
};

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
    <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t p-4 gap-4 sm:gap-0">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-sm text-muted-foreground">
          Showing{' '}
          <strong>{Math.min(recordsPerPage, filteredRecordsCount)}</strong> of{' '}
          <strong>{filteredRecordsCount}</strong> fee records
        </p>
        <Select
          value={recordsPerPage.toString()}
          onValueChange={(value) => setRecordsPerPage(parseInt(value))}
          aria-label="Records per page"
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
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          aria-label="Previous page"
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
          aria-label="Next page"
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
  return Array.from({ length: recordsPerPage }).map((_, index) => (
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
