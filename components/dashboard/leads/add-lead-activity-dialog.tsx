// components/leads/add-lead-activity-dialog.tsx
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  createLeadActivitySchema,
  type createLeadActivityFormData,
} from '@/lib/schemas';
import { LeadActivityType } from '@/generated/prisma/enums';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { createLeadActivity } from '@/lib/data/leads/create-lead-activity';

interface AddLeadActivityDialogProps {
  leadId: string;
  onActivityAdded?: () => void;
}

export function AddLeadActivityDialog({
  leadId,
  onActivityAdded,
}: AddLeadActivityDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<createLeadActivityFormData>({
    resolver: zodResolver(createLeadActivitySchema),
    defaultValues: {
      leadId,
      type: undefined,
      title: '',
      description: '',
      outcome: '',
      performedAt: new Date(),
      followUpDate: null,
      followUpNote: '',
    },
  });

  const onSubmit = async (data: createLeadActivityFormData) => {
    startTransition(async () => {
      try {
        const result = await createLeadActivity(data);
        if (result.success) {
          toast.success('Activity added successfully.');
        } else {
          toast.error(
            result.message || 'Failed to add activity. Please try again.'
          );
        }
      } catch (error) {
        toast.error('Failed to add activity. Please try again.');
      }
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Plus className="h-4 w-4" />
          Add Activity
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="start">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            {/* Header */}
            <div className="border-b px-6 py-4">
              <h2 className="text-sm font-semibold text-foreground">
                Log Lead Activity
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Track interactions and follow-ups with this lead
              </p>
            </div>

            {/* Form Content */}
            <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
              {/* Activity Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-medium">
                      Activity Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Select activity type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(LeadActivityType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-medium">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Called parent regarding admission"
                        className="h-9 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-medium">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional details..."
                        className="min-h-20 text-sm resize-none"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Outcome */}
              <FormField
                control={form.control}
                name="outcome"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-medium">
                      Outcome
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Interested, Will visit next week"
                        className="h-9 text-sm"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Activity Date */}
              <FormField
                control={form.control}
                name="performedAt"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-medium">
                      Activity Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal h-9 text-sm',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'MMM dd, yyyy')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Follow-up Date */}
              <FormField
                control={form.control}
                name="followUpDate"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-medium">
                      Follow-up Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal h-9 text-sm',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'MMM dd, yyyy')
                            ) : (
                              <span>Optional</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Follow-up Note */}
              <FormField
                control={form.control}
                name="followUpNote"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-medium">
                      Follow-up Note
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What should we do on follow-up?"
                        className="min-h-16 text-sm resize-none"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-3 flex gap-2 justify-end bg-muted/30">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending ? 'Saving...' : 'Save Activity'}
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
