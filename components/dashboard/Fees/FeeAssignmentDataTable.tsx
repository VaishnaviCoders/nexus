'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQueryState } from 'nuqs';
import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import {
  CalendarIcon,
  CreditCard,
  IndianRupee,
  Info,
  Plus,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { feeAssignmentSchema } from '@/lib/schemas';
import { toast } from 'sonner';
import { CreateFeeAssignmentButton } from '@/lib/SubmitButton';
import Link from 'next/link';
import { AssignFeeToStudents } from '@/lib/actions/FeeAssignmentAction';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Calendar } from '@/components/ui/calendar';

type FeeCategory = {
  id: string;
  name: string;
  description?: string | null;
};

interface FeeAssignmentProps {
  students: {
    id: string;
    firstName: string;
    lastName: string;
    rollNumber: string;
    organizationId: string;
    grade: {
      id: string;
      grade: string;
    };
    section: {
      id: string;
      gradeId: string;
      organizationId: string;
      name: string;
    };
    Fee: {
      id: string;
      totalFee: number;
      paidAmount: number;
      dueDate: Date;
      status: 'PAID' | 'UNPAID' | 'OVERDUE';
      feeCategory: FeeCategory;
    }[];
  }[];
  feeCategories: FeeCategory[];
}

const FeeAssignmentDataTable = ({
  students,
  feeCategories,
}: FeeAssignmentProps) => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedStudents(students.map((s) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const getFeeStatusColor = (status: 'PAID' | 'UNPAID' | 'OVERDUE') => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400';
      case 'UNPAID':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-500 border-gray-500';
    }
  };

  const getStatusIcon = (status: 'PAID' | 'UNPAID' | 'OVERDUE') => {
    switch (status) {
      case 'PAID':
        return <IndianRupee className="h-4 w-4 text-green-600" />;
      case 'UNPAID':
        return <CreditCard className="h-4 w-4 text-amber-600" />;
      case 'OVERDUE':
        return <CalendarIcon className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const form = useForm<z.infer<typeof feeAssignmentSchema>>({
    resolver: zodResolver(feeAssignmentSchema),
    defaultValues: {
      dueDate: new Date(),
      feeAmount: 0,
      feeCategoryId: '',
      studentIds: [],
    },
  });

  async function onSubmit(data: z.infer<typeof feeAssignmentSchema>) {
    try {
      // console.log('Assigning fees to:', selectedStudents);
      // console.log('Fee amount:', data.feeAmount);
      // console.log('Category:', data.feeCategoryId);
      // console.log('Due date:', data.dueDate);

      const payload = {
        ...data,
        studentIds: selectedStudents,
      };
      startTransition(() => {
        (async () => {
          await AssignFeeToStudents(payload);

          toast.success('Fees assigned successfully');
          form.reset();
          setIsDialogOpen(false);
          setSelectedStudents([]);
        })().catch((error) => {
          toast.error('Something went wrong');
          console.error(error);
        });
      });
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Student Fees</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={selectedStudents.length === 0}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Assign Fee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Fees</DialogTitle>
              <DialogDescription>
                Assign fees to {selectedStudents.length} selected student(s)
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="feeAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fee Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter fee amount"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is the amount of the fee to be assigned
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="feeCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fee Categories </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {feeCategories.map((category) => (
                            <SelectItem value={category.id} key={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        If don't see your category, please create it from
                        <Link
                          href="/dashboard/fees/admin/fee-categories"
                          className="text-blue-500 ml-2"
                        >
                          Create Category
                        </Link>
                        .
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            // disabled={(date) =>
                            //   date > new Date() || date > new Date('1900-01-01')
                            // }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Due date of the fee assignment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button variant="outline" className="mr-2">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Assigning...' : 'Create Fee Assignment'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={
                    students.length > 0 &&
                    selectedStudents.length === students.length
                  }
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Roll No</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Fee Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={(checked) => {
                        setSelectedStudents((prev) =>
                          checked
                            ? [...prev, student.id]
                            : prev.filter((id) => id !== student.id)
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.grade.grade}</TableCell>
                  <TableCell>{student.section.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      {student.Fee.length > 0 ? (
                        student.Fee.map((fee) => (
                          <HoverCard key={fee.id}>
                            <HoverCardTrigger asChild>
                              <div className="flex items-center gap-2 cursor-pointer">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'transition-all',
                                    getFeeStatusColor(fee.status)
                                  )}
                                >
                                  <span className="flex items-center gap-1">
                                    {getStatusIcon(fee.status)}
                                    {fee.status}
                                  </span>
                                </Badge>
                                <span className="text-xs truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
                                  {fee.feeCategory.name}
                                </span>
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80 p-0 shadow-lg">
                              <div
                                className={`${
                                  fee.status === 'PAID'
                                    ? 'bg-gradient-to-r from-green-400 to-green-100 dark:from-teal-950/30 dark:to-emerald-950/30'
                                    : fee.status === 'OVERDUE'
                                    ? 'bg-gradient-to-r from-red-400 to-red-100 dark:from-red-950/30 dark:to-red-950/30'
                                    : 'bg-gradient-to-r from-orange-100 to-orange-50 dark:from-teal-950/30 dark:to-orange-950/30'
                                } p-4 rounded-t-lg`}
                              >
                                <h4 className="font-semibold text-lg flex items-center gap-2">
                                  <Info className="h-4 w-4" />
                                  Fee Details
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {fee.feeCategory.name}
                                  {fee.feeCategory.description && (
                                    <span className="block mt-1 text-xs italic">
                                      {fee.feeCategory.description}
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div className="p-4 space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-sm text-muted-foreground">
                                    Total Fee
                                  </div>
                                  <div className="text-sm font-medium text-right">
                                    ₹{fee.totalFee.toLocaleString()}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-sm text-muted-foreground">
                                    Paid Amount
                                  </div>
                                  <div className="text-sm font-medium text-right">
                                    ₹{fee.paidAmount.toLocaleString()}
                                  </div>
                                </div>
                                {fee.status !== 'PAID' && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="text-sm text-muted-foreground">
                                      Balance
                                    </div>
                                    <div className="text-sm font-medium text-right text-red-600">
                                      ₹
                                      {(
                                        fee.totalFee - fee.paidAmount
                                      ).toLocaleString()}
                                    </div>
                                  </div>
                                )}
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-sm text-muted-foreground">
                                    Due Date
                                  </div>
                                  <div className="text-sm font-medium text-right">
                                    {new Intl.DateTimeFormat('en-US').format(
                                      fee.dueDate
                                    )}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-sm text-muted-foreground">
                                    Status
                                  </div>
                                  <div className="text-right">
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        'transition-all',
                                        getFeeStatusColor(fee.status)
                                      )}
                                    >
                                      <span className="flex items-center gap-1">
                                        {getStatusIcon(fee.status)}
                                        {fee.status}
                                      </span>
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No fees assigned
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedStudents.length} of {students.length} students selected
        </div>
      </CardFooter>
    </Card>
  );
};

export default FeeAssignmentDataTable;
