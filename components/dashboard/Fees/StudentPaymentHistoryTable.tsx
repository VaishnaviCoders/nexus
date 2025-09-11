'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
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
  MailIcon,
  EyeIcon,
  Send,
} from 'lucide-react';
import { cn, formatCurrencyIN, formatDateIN } from '@/lib/utils';
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
import { toast } from 'sonner';
import { FeeRecord } from '@/types';
import {
  SendFeesReminderDialog,
  FeeReminderRecipient,
} from './SendFeesReminderDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { recordOfflinePayment } from '@/lib/data/fee/recordOfflinePayment';
import { PaymentMethod } from '@/generated/prisma';
import { offlinePaymentSchema, offlinePaymentFormData } from '@/lib/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  selectedRecord: FeeRecord;
}

const RecordPaymentCard = ({ selectedRecord }: RecordPaymentCardProps) => {
  const [isPending, startTransition] = useTransition();

  const maxPayableAmount =
    selectedRecord.fee.pendingAmount ??
    (selectedRecord
      ? selectedRecord.fee.totalFee - selectedRecord.fee.paidAmount
      : 0);

  const form = useForm<offlinePaymentFormData>({
    resolver: zodResolver(offlinePaymentSchema),
    defaultValues: {
      feeId: selectedRecord?.fee.id || '', // Use selectedRecord.id for the form's feeId
      amount: maxPayableAmount > 0 ? maxPayableAmount : 0, // Initialize with max payable or 0
      method: PaymentMethod.CASH, // Default to CASH
      transactionId: '',
      note: '',
      payerId: selectedRecord.student.userId,
    },
  });

  async function onSubmit(data: offlinePaymentFormData) {
    // Additional client-side validation for amount against maxPayableAmount
    if (data.amount > maxPayableAmount) {
      form.setError('amount', {
        type: 'manual',
        message: `Amount cannot exceed ${formatCurrencyIN(maxPayableAmount)}.`,
      });
      toast.error('Validation Error', {
        description: `Payment amount exceeds the pending amount.`,
      });
      return;
    }

    startTransition(async () => {
      try {
        // Ensure feeId is present before calling recordOfflinePayment
        if (!selectedRecord?.fee.id) {
          toast.error('Failed to record payment', {
            description:
              'Fee record ID is missing. Please select a valid record.',
          });
          return;
        }

        await recordOfflinePayment(data);
        toast.success('Payment recorded successfully!');
        // Optionally reset form or navigate
        form.reset();
      } catch (error) {
        console.error('Payment recording failed:', error);
        toast.error('Failed to record payment', {
          description:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred.',
        });
      }
    });
  }

  if (!selectedRecord) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center text-muted-foreground">
          No fee record selected. Please select a record to proceed with
          payment.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="grid gap-4 ">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="amount">Payment Amount</FormLabel>
                    <FormControl>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        max={maxPayableAmount}
                        {...field}
                        // Display empty string for 0 to avoid showing "0" initially
                        value={field.value === 0 ? '' : field.value}
                        disabled={isPending || maxPayableAmount <= 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="method">Payment Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger id="method">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PaymentMethod).map((method) => (
                          <SelectItem key={method} value={method}>
                            {method.charAt(0) +
                              method.slice(1).toLowerCase().replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="transaction">
                      Transaction ID (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="transaction"
                        placeholder="Enter transaction reference"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="note">Note (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        id="note"
                        placeholder="Add any additional note"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="payerId">Payer ID (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        id="payerId"
                        placeholder="Enter payer ID"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      if the payer ID is unknown. Ask Who is Paying USER ID
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="w-full flex justify-center items-center p-0 mx-0">
                <Button
                  type="submit"
                  disabled={isPending || maxPayableAmount <= 0}
                  className="px-4 py-2 w-full mx-0"
                >
                  {isPending ? 'Recording...' : 'Record Payment'}
                </Button>
              </CardFooter>
            </div>
          </form>
        </Form>
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

  const initialRecipients: FeeReminderRecipient[] = useMemo(() => {
    return feeRecords
      .filter((record) => ['UNPAID', 'OVERDUE'].includes(record.fee.status))
      .map((record) => {
        const primaryParent = record.student.parents?.find(
          (ps) => ps.isPrimary
        )?.parent;

        const parentId = primaryParent?.id ?? undefined;
        const parentUserId = primaryParent?.userId ?? undefined;

        const parentName = primaryParent
          ? `${primaryParent.firstName} ${primaryParent.lastName}`
          : `${record.student.firstName} ${record.student.lastName}`;

        const parentEmail = primaryParent?.email ?? record.student.email;
        const parentPhone =
          primaryParent?.phoneNumber ?? record.student.phoneNumber;
        const parentWhatsApp =
          primaryParent?.whatsAppNumber ?? record.student.phoneNumber;

        const status = record.fee.status as 'UNPAID' | 'OVERDUE';

        return {
          id: record.fee.id,
          studentId: record.student.id,
          studentName: `${record.student.firstName} ${record.student.lastName}`,
          grade: record.grade.grade,
          section: record.section.name,
          parentName,
          parentEmail,
          parentPhone,
          parentId,
          parentUserId,
          parentWhatsApp,
          status,
          amountDue: record.fee.pendingAmount ?? record.fee.totalFee,
          dueDate: record.fee.dueDate,
        };
      });
  }, [feeRecords]);

  return (
    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 mb-4">
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className=" flex items-center space-x-2 max-sm:w-full">
              {' '}
              <Send /> Send Reminders
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Send Fee Reminders</DialogTitle>
              <DialogDescription>
                Send payment reminders to students or parents with outstanding
                fees
              </DialogDescription>
            </DialogHeader>
            <SendFeesReminderDialog initialRecipients={initialRecipients} />
          </DialogContent>
        </Dialog>

        {/* <DropdownMenu>
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
        </DropdownMenu> */}
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
      <TableHead>Student Name</TableHead>
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
      <TableCell className="whitespace-nowrap">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="capitalize">{record.feeCategory.name}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{record.feeCategory.description ?? 'No description'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="text-right font-medium whitespace-nowrap">
        <div>{formatCurrencyIN(record.fee.totalFee)}</div>
        {record.fee.paidAmount > 0 &&
          record.fee.paidAmount < record.fee.totalFee && (
            <div className="text-xs text-muted-foreground">
              Paid: {formatCurrencyIN(record.fee.paidAmount)}
            </div>
          )}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          {formatDateIN(record.fee.dueDate)}
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
          <DialogTrigger className="flex items-center space-x-2" asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
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
  function downloadFeeDetails(record: FeeRecord) {
    const data = JSON.stringify(record, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fee-details-${record.fee.id}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  function downloadFeeDetailsAsPDF(record: FeeRecord) {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Fee Details Report', 14, 20);

    // Student Information
    doc.setFontSize(12);
    doc.text('Student Information:', 14, 30);
    autoTable(doc, {
      margin: { top: 35 },
      head: [['Field', 'Value']],
      body: [
        ['Name', `${record.student.firstName} ${record.student.lastName}`],
        ['Roll Number', record.student.rollNumber],
        ['Class', `${record.grade.grade} - ${record.section.name}`],
        ['Email', record.student.email || 'N/A'],
        ['Phone', record.student.phoneNumber || 'N/A'],
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
    });

    // Fee Information
    let finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Fee Information:', 14, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Field', 'Value']],
      body: [
        ['Fee ID', record.fee.id],
        ['Category', record.feeCategory.name],
        ['Total Amount', record.fee.totalFee.toLocaleString()],
        ['Paid Amount', record.fee.paidAmount.toLocaleString()],
        ['Pending Amount', (record.fee.pendingAmount ?? 0).toLocaleString()],
        ['Due Date', new Date(record.fee.dueDate).toLocaleDateString()],
        ['Status', record.fee.status],
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
    });

    // Payment History
    if (record.payments && record.payments.length > 0) {
      finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text('Payment History:', 14, finalY);

      autoTable(doc, {
        startY: finalY + 5,
        head: [
          [
            'Receipt No.',
            'Payer',
            'Amount',
            'Date',
            'Method',
            'Transaction ID',
            'Payment Status',
          ],
        ],
        body: record.payments.map((payment) => [
          payment.receiptNumber,
          payment.payer
            ? `${payment.payer.firstName} ${payment.payer.lastName}`
            : 'N/A',
          payment.amountPaid.toLocaleString(),
          new Date(payment.paymentDate).toLocaleDateString(),
          payment.paymentMethod,
          payment.transactionId || 'N/A',
          payment.status,
        ]),
        styles: { fontSize: 9 },
      });
    }

    // Save
    doc.save(`fee-details-${record.fee.id}.pdf`);
  }

  return (
    <>
      {selectedRecord && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Information */}
            <div className="grid gap-4 grid-cols-1">
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
              {selectedRecord.payments?.length > 0 && (
                <ScrollArea className="max-h-72">
                  <h3 className="text-sm font-medium mb-2">
                    Payment Information
                  </h3>
                  {selectedRecord.payments.map((payment) => (
                    <Card key={payment.id} className="mb-4">
                      <CardContent className="p-4">
                        <dl className="grid grid-cols-[1fr_2fr] gap-2 text-sm">
                          <dt className="font-medium text-muted-foreground">
                            Receipt No:
                          </dt>
                          <dd>{payment.receiptNumber}</dd>

                          <dt className="font-medium text-muted-foreground">
                            Payer:
                          </dt>
                          <dd>{`${payment.payer.firstName} ${payment.payer.lastName}`}</dd>

                          <dt className="font-medium text-muted-foreground">
                            Payment Status:
                          </dt>
                          <dd
                            className={cn(
                              payment.status === 'COMPLETED' &&
                                'text-emerald-600',
                              payment.status === 'PENDING' && 'text-yellow-600',
                              payment.status === 'FAILED' && 'text-red-600',
                              payment.status === 'UNPAID' && 'text-gray-600',
                              payment.status === 'REFUNDED' &&
                                'text-purple-600',
                              payment.status === 'CANCELLED' && 'text-gray-500'
                            )}
                          >
                            {payment.status}
                          </dd>

                          <dt className="font-medium text-muted-foreground">
                            Amount Paid:
                          </dt>
                          <dd>
                            {payment.status === 'COMPLETED'
                              ? formatCurrencyIN(payment.amountPaid)
                              : formatCurrencyIN(0)}
                          </dd>

                          <dt className="font-medium text-muted-foreground">
                            Payment Date:
                          </dt>
                          <dd className="truncate">
                            {formatDateIN(payment.paymentDate) || 'N/A'}
                          </dd>

                          <dt className="font-medium text-muted-foreground">
                            Method:
                          </dt>
                          <dd>{payment.paymentMethod || 'N/A'}</dd>
                          <dt className="font-medium text-muted-foreground">
                            Transaction ID:
                          </dt>
                          <dd>{payment.transactionId || 'N/A'}</dd>
                        </dl>
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
              )}
            </div>
            {/* Fee Information */}
            <div>
              <h3 className="text-sm font-medium mb-2">Fee Information</h3>
              <Card>
                <CardContent className="p-4">
                  <dl className="grid grid-cols-[1fr_2fr] gap-2 text-sm">
                    <dt className="font-medium text-muted-foreground">
                      Fee ID:
                    </dt>
                    <dd className=" text-base font-semibold">
                      {selectedRecord.fee.id}
                    </dd>
                    <dt className="font-medium text-muted-foreground">
                      Category:
                    </dt>
                    <dd>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {selectedRecord.feeCategory.name}
                        </span>
                        {selectedRecord.feeCategory.description && (
                          <span className="text-xs text-muted-foreground">
                            {selectedRecord.feeCategory.description}
                          </span>
                        )}
                      </div>
                    </dd>
                    <dt className="font-medium text-muted-foreground">
                      Total Amount:
                    </dt>
                    <dd className="font-medium text-lg">
                      {formatCurrencyIN(selectedRecord.fee.totalFee)}
                    </dd>
                    <dt className="font-medium text-muted-foreground">
                      Paid Amount:
                    </dt>
                    <dd className="text-emerald-600 font-medium">
                      {formatCurrencyIN(selectedRecord.fee.paidAmount)}
                    </dd>
                    <dt className="font-medium text-muted-foreground">
                      Pending Amount:
                    </dt>
                    <dd
                      className={cn(
                        'font-medium',
                        selectedRecord.fee.pendingAmount &&
                          selectedRecord.fee.pendingAmount > 0
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      )}
                    >
                      {formatCurrencyIN(selectedRecord.fee.pendingAmount ?? 0)}
                    </dd>
                    <dt className="font-medium text-muted-foreground">
                      Due Date:
                    </dt>
                    <dd
                      className={cn(
                        selectedRecord.fee.status === 'OVERDUE' &&
                          'text-red-600 font-medium'
                      )}
                    >
                      {formatDateIN(selectedRecord.fee.dueDate)}
                    </dd>
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
                    <dt className="font-medium text-muted-foreground">
                      Created:
                    </dt>
                    <dd className="text-xs text-muted-foreground">
                      {formatDateIN(selectedRecord.fee.createdAt)}
                    </dd>
                    <dt className="font-medium text-muted-foreground">
                      Last Updated:
                    </dt>
                    <dd className="text-xs text-muted-foreground">
                      {formatDateIN(selectedRecord.fee.updatedAt)}
                    </dd>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Payment History */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Payment History</h3>
              {selectedRecord.payments?.length && (
                <span className="text-xs text-muted-foreground">
                  {selectedRecord.payments.length} payment
                  {selectedRecord.payments.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <Card>
              <CardContent className="p-0  overflow-x-auto">
                <Table className="">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt No.</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Method
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Payer
                      </TableHead>

                      <TableHead className="text-right">Amount</TableHead>
                      {/* <TableHead className="text-right">Actions</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRecord.payments?.length ? (
                      selectedRecord.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {payment.receiptNumber}
                              </span>
                              <span className="text-xs text-muted-foreground font-mono">
                                {payment.id}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatDateIN(payment.paymentDate)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="secondary" className="text-xs">
                              {payment.paymentMethod}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {payment.payer ? (
                              <div className="flex flex-col">
                                <span className="text-sm">
                                  {payment.payer.firstName}{' '}
                                  {payment.payer.lastName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {payment.payer.email}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                N/A
                              </span>
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            <span
                              className={cn(
                                'font-medium',
                                payment.status === 'COMPLETED' &&
                                  'text-emerald-600',
                                payment.status === 'PENDING' &&
                                  'text-yellow-600',
                                payment.status === 'UNPAID' &&
                                  'text-yellow-600',
                                payment.status === 'FAILED' && 'text-red-600',
                                payment.status === 'REFUNDED' &&
                                  'text-purple-600',
                                payment.status === 'CANCELLED' &&
                                  'text-gray-500'
                              )}
                            >
                              {formatCurrencyIN(payment.amountPaid)}
                            </span>
                          </TableCell>
                          {/* <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label="Download receipt"
                              >
                                <DownloadIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label="View payment details"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell> */}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-muted-foreground"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <CreditCardIcon className="h-8 w-8 text-muted-foreground/50" />
                            <span>No payment records found</span>
                            <span className="text-xs">
                              Payments will appear here once recorded
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          {selectedRecord.payments?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Payment Summary</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">
                        {selectedRecord.payments.length}
                      </div>
                      <div className="text-muted-foreground">
                        Total Payments
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrencyIN(selectedRecord.fee.paidAmount)}
                      </div>
                      <div className="text-muted-foreground">Amount Paid</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600">
                        {formatCurrencyIN(
                          selectedRecord.fee.pendingAmount ?? 0
                        )}
                      </div>
                      <div className="text-muted-foreground">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {Math.round(
                          (selectedRecord.fee.paidAmount /
                            selectedRecord.fee.totalFee) *
                            100
                        )}
                        %
                      </div>
                      <div className="text-muted-foreground">Completion</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Payment Progress</span>
                      <span>
                        {formatCurrencyIN(selectedRecord.fee.paidAmount)} /{' '}
                        {formatCurrencyIN(selectedRecord.fee.totalFee)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((selectedRecord.fee.paidAmount / selectedRecord.fee.totalFee) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="gap-2 grid grid-cols-2 ">
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
            <Button
              variant="outline"
              aria-label="Download details"
              onClick={() => downloadFeeDetailsAsPDF(selectedRecord)}
            >
              <DownloadIcon className="h-4 w-4 mr-2" />
              Download Details
            </Button>
            <Button variant="outline" aria-label="Print receipt">
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </Button>
            {selectedRecord.fee.status !== 'PAID' && (
              <Button variant="outline" aria-label="Send reminder">
                <MailIcon className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
            )}
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
          <strong>{filteredRecordsCount}</strong> Fee Records
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
