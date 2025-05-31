'use client';

import React from 'react';

import { z } from 'zod';
import { singleHolidayFormSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
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
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createSingleHolidayAction } from '@/lib/data/holiday/create-single-holiday';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const CreateSingleHolidayForm = () => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const form = useForm<z.infer<typeof singleHolidayFormSchema>>({
    resolver: zodResolver(singleHolidayFormSchema),
    defaultValues: {
      name: '',
      startDate: new Date(),
      endDate: new Date(),
      type: 'PLANNED',
      reason: '',
      isRecurring: false,
    },
  });

  const createSingleHolidayHandler = async (
    data: z.infer<typeof singleHolidayFormSchema>
  ) => {
    try {
      await createSingleHolidayAction(data);
      toast.success('Holiday created!');
    } catch (err) {
      toast.error('Error creating holiday');
    }
  };

  console.log('Form errors:', form.formState.errors);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(createSingleHolidayHandler)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Holiday Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Diwali, Winter Break" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="startDate"
            render={() => (
              <FormItem>
                <FormLabel>Date Range</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal bg-white',
                          !dateRange && 'text-muted-foreground'
                        )}
                      >
                        {dateRange?.from ? (
                          dateRange.to ? (
                            `${format(dateRange.from, 'PPP')} - ${format(
                              dateRange.to,
                              'PPP'
                            )}`
                          ) : (
                            format(dateRange.from, 'PPP')
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => {
                        setDateRange(range);
                        form.setValue('startDate', range?.from ?? new Date());
                        form.setValue(
                          'endDate',
                          range?.to ?? range?.from ?? new Date()
                        );
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select holiday type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PLANNED">Planned Holiday</SelectItem>
                    <SelectItem value="SUDDEN">Emergency/Sudden</SelectItem>
                    <SelectItem value="INSTITUTION_SPECIFIC">
                      Institution Specific
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2 ">
                <FormLabel>Is-Recurring</FormLabel>
                <FormControl className="flex items-center justify-center">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the reason for this holiday"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Add Holiday</Button>
      </form>
    </Form>
  );
};

export default CreateSingleHolidayForm;
