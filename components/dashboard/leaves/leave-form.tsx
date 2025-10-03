'use client';

import * as React from 'react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CalendarRange, Info, Loader2, Sparkles } from 'lucide-react';

// Keep imports aligned with your project structure (matching your repaired code)
import { LeaveCreateSchema, type LeaveCreateFromData } from '@/lib/schemas';
import { LeaveType } from '@/generated/prisma/enums';
import { createLeaveAction } from '@/lib/data/leave/create-leave';
import { Card, CardContent } from '@/components/ui/card';

type LeaveFormProps = {
  triggerLabel?: string;
  currentAcademicYearId: string;
  title?: string;
  description?: string;
};

export function LeaveForm({
  triggerLabel = 'Apply For Leave',
  currentAcademicYearId,
  title = 'Apply For Leave',
  description = 'Submit a new leave request for the selected academic year.',
}: LeaveFormProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LeaveCreateFromData>({
    resolver: zodResolver(LeaveCreateSchema),
    defaultValues: {
      type: LeaveType.SICK,
      reason: '',
      emergencyContact: '',
      academicYearId: currentAcademicYearId,
    },
    mode: 'onChange',
  });

  const onSubmit = (formData: LeaveCreateFromData) => {
    startTransition(async () => {
      const res = await createLeaveAction(formData);
      toast.success('Leave created successfully');
      form.reset();
      setOpen(false);
    });
  };

  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');
  const typeValue = form.watch('type');
  const reasonValue = form.watch('reason') || '';

  const totalDays = React.useMemo(() => {
    if (!startDate || !endDate) return null;
    const diff =
      Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    return diff > 0 ? diff : null;
  }, [startDate, endDate]);

  const typeOptions = React.useMemo(() => Object.values(LeaveType), []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Sparkles className="h-4 w-4" aria-hidden />
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Premium header with icon and subtle context */}
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-muted/40">
              <CalendarRange className="h-4 w-4" aria-hidden />
            </div>
            <DialogTitle className="text-pretty">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-pretty">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Summary strip: minimal, informative, Vercel/shadcn vibes */}
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-medium">
                {typeValue}
              </Badge>
              {totalDays !== null ? (
                <Badge className="font-medium" variant={'EXAM'}>
                  {totalDays} {totalDays === 1 ? 'day' : 'days'}
                </Badge>
              ) : (
                <Badge
                  variant="GENERAL"
                  className="font-normal text-muted-foreground"
                >
                  Select dates
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>
                {form.getValues('academicYearId')
                  ? 'Academic year ready'
                  : 'Choose academic year'}
              </span>

              {/* Subtle info tooltip */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-6 w-6 items-center justify-center rounded-md border bg-background hover:bg-muted transition"
                      aria-label="More info"
                    >
                      <Info className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="end">
                    Academic Year added Automatically
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div aria-live="polite" className="sr-only">
          {totalDays
            ? `Total ${totalDays} ${totalDays === 1 ? 'day' : 'days'}`
            : ''}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-6"
          >
            {/* Dates */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-background"
                            disabled={isPending}
                          >
                            <CalendarRange
                              className="mr-2 h-4 w-4"
                              aria-hidden
                            />
                            {field.value
                              ? format(field.value, 'PPP')
                              : 'Pick a date'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(d) => field.onChange(d)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-background"
                            disabled={isPending}
                          >
                            <CalendarRange
                              className="mr-2 h-4 w-4"
                              aria-hidden
                            />
                            {field.value
                              ? format(field.value, 'PPP')
                              : 'Pick a date'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(d) => field.onChange(d)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave type</FormLabel>
                  <FormDescription>
                    Choose the category that best matches your reason.
                  </FormDescription>

                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {typeOptions.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t.charAt(0) + t.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reason */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <FormLabel>Reason</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="inline-flex h-5 w-5 items-center justify-center rounded bg-muted/50"
                              aria-label="Reason info"
                            >
                              <Info className="h-3 w-3" aria-hidden />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            Add concise, relevant details.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {reasonValue.length}/500
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Describe the reason for your leave"
                      disabled={isPending}
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Emergency contact */}
            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency contact</FormLabel>
                  <FormDescription>
                    Provide a reachable 10-digit phone number during your leave.
                  </FormDescription>

                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Phone number during leave"
                      inputMode="numeric"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />

            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-6">
                <div>
                  <p className="text-blue-700 text-sm">
                    Please ensure all information is accurate. Your leave
                    request will be reviewed by the administration. You will be
                    notified once a decision has been made.
                  </p>
                </div>
              </CardContent>
            </Card>
            {/* Action bar */}
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-muted-foreground">
                Changes are saved when you submit. Total days include start and
                end.
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  aria-disabled={isPending}
                  className="gap-2"
                >
                  {isPending && (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  )}
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default LeaveForm;
