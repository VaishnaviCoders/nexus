'use client';

import { useState, useEffect, useTransition, useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  Check,
  ChevronDownIcon,
  Info,
  Loader2,
  Mail,
  Phone,
  Search,
  Send,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, formatDateIN } from '@/lib/utils';
import { toast } from 'sonner';
import { WhatsAppIcon } from '@/public/icons/WhatsAppIcon';
import { sendFeeReminders } from '@/lib/data/fee/fee-reminder';
import { reminderFormSchema, ReminderFormValues } from '@/lib/schemas';

export interface FeeReminderRecipient {
  id: string;
  studentId: string;
  studentName: string;
  studentPhoneNumber?: string;
  studentWhatsappNumber?: string;
  grade: string;
  section: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  parentWhatsAppNumber?: string;
  status: 'UNPAID' | 'OVERDUE';
  amountDue: number;
  dueDate: Date;
  avatar?: string;
  organizationName?: string;
  organizationEmail?: string;
  organizationPhone?: string;
  parentId?: string | null;
  parentUserId?: string | null;
}

export interface SendReminderData {
  recipients: FeeReminderRecipient[];
  channels: ('email' | 'sms' | 'whatsapp')[];
  subject: string;
  message: string;
  scheduleDate?: Date | null;
  scheduleTime?: string | null;
  templateType:
  | 'FRIENDLY_REMINDER'
  | 'PAYMENT_DUE_TODAY'
  | 'OVERDUE_NOTICE';
}

export interface ReminderResult {
  success: boolean;
  error?: string;
  sentCount?: number;
  message?: string;
  scheduledJobId?: string;
  scheduledAt?: Date;
}

interface SendReminderDialogProps {
  initialRecipients: FeeReminderRecipient[];
}

const FeeReminderTemplates = [

  {
    id: 'friendly-reminder',
    name: 'Friendly Reminder',
    description: 'Gentle reminder before due date',
    subject: 'Friendly Reminder: Fee Payment Due for {STUDENT_NAME}',
    message: `Dear {PARENT_NAME},

This is a friendly reminder that the fee payment for {STUDENT_NAME} (Class {GRADE}-{SECTION}) is due on {DUE_DATE}. 
The total outstanding amount is {AMOUNT}.

Please make the payment at your earliest convenience to avoid any late fees.

Payment Methods:
• Online Portal: {PORTAL_LINK}
• Cash at School Office

Thank you for your cooperation.

Best regards,
{ORGANIZATION_NAME}
{ORGANIZATION_CONTACT_EMAIL}
{ORGANIZATION_CONTACT_PHONE}`,
    variables: [
      'STUDENT_NAME',
      'PARENT_NAME',
      'GRADE',
      'SECTION',
      'AMOUNT',
      'DUE_DATE',
      'ORGANIZATION_NAME',
      'ORGANIZATION_CONTACT_PHONE',
      'ORGANIZATION_CONTACT_EMAIL',
    ],
  },
  {
    id: 'payment-due-today',
    name: 'Payment Due Today',
    description: 'Urgent reminder for payments due today',
    subject: 'URGENT: Fee Payment Due Today - {STUDENT_NAME}',
    message: `Dear {PARENT_NAME},

This is to remind you that the fee payment for {STUDENT_NAME} (Class {GRADE}-{SECTION}) is due TODAY.

Amount Due: {AMOUNT}
Due Date: {DUE_DATE}

Please make immediate payment to avoid late fees.

Payment Methods:
• Online Portal: {PORTAL_LINK}
• Cash at School Office

Best regards,
{ORGANIZATION_NAME}
{ORGANIZATION_CONTACT_EMAIL}
{ORGANIZATION_CONTACT_PHONE}`,
    variables: [
      'STUDENT_NAME',
      'PARENT_NAME',
      'GRADE',
      'SECTION',
      'AMOUNT',
      'DUE_DATE',
      'ORGANIZATION_NAME',
      'ORGANIZATION_CONTACT_PHONE',
      'ORGANIZATION_CONTACT_EMAIL',
    ],
  },
  {
    id: 'overdue-notice',
    name: 'Overdue Notice',
    description: 'Formal notice for overdue payments',
    subject: 'OVERDUE: Fee Payment Required - {STUDENT_NAME}',
    message: `Dear {PARENT_NAME},

This is to inform you that the fee payment for {STUDENT_NAME} (Class {GRADE}-{SECTION}) is now OVERDUE.

Overdue Amount: {AMOUNT}
Original Due Date: {DUE_DATE}

Please clear the payment immediately to avoid any consequences as per school policy.

Payment Methods:
• Online Portal: {PORTAL_LINK}
• Cash at School Office

For any queries, please contact the school administration.

Best regards,
{ORGANIZATION_NAME}
{ORGANIZATION_CONTACT_EMAIL}
{ORGANIZATION_CONTACT_PHONE}`,
    variables: [
      'STUDENT_NAME',
      'PARENT_NAME',
      'GRADE',
      'SECTION',
      'AMOUNT',
      'DUE_DATE',
      'ORGANIZATION_NAME',
      'ORGANIZATION_CONTACT_PHONE',
      'ORGANIZATION_CONTACT_EMAIL',
    ],
  },
];
export interface EmailFeeTemplateProps {
  PARENT_NAME: string;
  STUDENT_NAME: string;
  GRADE: string;
  SECTION: string;
  AMOUNT: string;
  DUE_DATE: string;
  ORGANIZATION_NAME: string;
  ORGANIZATION_CONTACT_PHONE: string;
  ORGANIZATION_CONTACT_EMAIL: string;
  PORTAL_LINK: string;
}

export function SendFeesReminderDialog({
  initialRecipients = [],
}: SendReminderDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMessage, setPreviewMessage] = useState('');
  const [previewSubject, setPreviewSubject] = useState('');
  // Add these state variables at the top of your component
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'UNPAID' | 'OVERDUE'
  >('all');

  // Add filtered recipients calculation
  const filteredRecipients = useMemo(() => {
    return initialRecipients.filter((recipient) => {
      const matchesSearch =
        recipient.studentName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        recipient.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipient.parentEmail
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        recipient.parentPhone.includes(searchTerm);

      const matchesStatus =
        statusFilter === 'all' || recipient.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [initialRecipients, searchTerm, statusFilter]);

  // Initialize the form
  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      recipients: initialRecipients.map((r) => r.id),
      channels: ['email'],
      templateId: 'friendly-reminder',
      templateType: 'FRIENDLY_REMINDER',
      sendNow: true,
      scheduleDate: new Date(),
      scheduleTime: '10:30',
    },
  });
  // Watch form values for preview
  const watchTemplateId = form.watch('templateId');
  const watchSendNow = form.watch('sendNow');

  useEffect(() => {
    const selectedTemplate = FeeReminderTemplates.find(
      (t) => t.id === watchTemplateId
    );
    if (selectedTemplate) {
      setPreviewSubject(selectedTemplate.subject);
      setPreviewMessage(selectedTemplate.message);

      // Also update templateType when template changes
      const templateType = selectedTemplate.id
        .toUpperCase()
        .replace(/-/g, '_') as
        | 'FRIENDLY_REMINDER'
        | 'PAYMENT_DUE_TODAY'
        | 'OVERDUE_NOTICE';
      form.setValue('templateType', templateType);
    }
  }, [watchTemplateId, form]);

  // Replace placeholders in the message with actual values
  const getPersonalizedMessage = (
    recipient: FeeReminderRecipient,
    channel?: string
  ) => {
    let message = previewMessage
      .replace('{PARENT_NAME}', recipient.parentName)
      .replace('{STUDENT_NAME}', recipient.studentName)
      .replace('{GRADE}', recipient.grade)
      .replace('{SECTION}', recipient.section)
      .replace('{DUE_DATE}', formatDateIN(recipient.dueDate))

      .replace(
        '{AMOUNT}',
        recipient.amountDue.toLocaleString('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0,
        })
      )
      .replace('{PORTAL_LINK}', 'https://shiksha.cloud/dashboard/')
      .replace(
        '{ORGANIZATION_NAME}',
        recipient.organizationName || 'School Administration'
      )
      .replace(
        '{ORGANIZATION_CONTACT_EMAIL}',
        recipient.organizationEmail || 'support@shiksha.cloud'
      )
      .replace(
        '{ORGANIZATION_CONTACT_PHONE}',
        recipient.organizationPhone || 'Shiksha-Cloud : 8459324821'
      );
    if (channel === 'sms' && message.length > 160) {
      message = message.substring(0, 157) + '...';
    }
    return message;
  };

  // Handle form submission
  async function onSubmit(data: ReminderFormValues) {
    setError(null);

    startTransition(() => {
      (async () => {
        try {
          const selectedRecipients = initialRecipients.filter((r) =>
            data.recipients.includes(r.id)
          );

          const reminderData: SendReminderData = {
            recipients: selectedRecipients,
            channels: data.channels,
            subject: previewSubject,
            message: previewMessage,
            scheduleDate: data.sendNow ? null : data.scheduleDate,
            scheduleTime: data.sendNow ? null : data.scheduleTime,
            templateType: data.templateType,
          };

          const result = await sendFeeReminders(reminderData);

          console.log('Reminder data:', reminderData, result);

          // Check if the operation was successful
          if (result.success) {
            toast.success(
              result.message ||
              (data.sendNow
                ? 'Reminders sent successfully!'
                : 'Reminders scheduled successfully!')
            );
            console.log('Reminder operation successful:', reminderData, result);

            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
            }, 2000);
          } else {
            // Handle server-side errors
            const errorMessage = result.error || 'Failed to process reminders';
            setError(errorMessage);
            toast.error(errorMessage);
          }
        } catch (err) {
          setError('An unexpected error occurred');
          console.error(err);
        }
      })();
    });
  }

  return (
    <div>
      <div className="p-0">
        {success ? (
          <div className="py-6 flex flex-col items-center justify-center mx-2 px-2">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium">
              Reminders Sent Successfully!
            </h3>
            <p className="text-muted-foreground text-center mt-2">
              Your reminders have been sent to the selected recipients.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 overflow-auto  flex-1 px-2"
            >
              {error && (
                <Alert variant="destructive">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {/* Single Row: Search + Filters + Actions */}
                <div className="flex flex-col sm:flex-row gap-2 p-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search recipients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <Select
                    value={statusFilter}
                    onValueChange={(value: 'all' | 'UNPAID' | 'OVERDUE') =>
                      setStatusFilter(value)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="UNPAID">Unpaid</SelectItem>
                      <SelectItem value="OVERDUE">Overdue</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const allIds = filteredRecipients.map((r) => r.id);
                        form.setValue('recipients', allIds);
                      }}
                      disabled={filteredRecipients.length === 0}
                      className="flex-1"
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        form.setValue('recipients', []);
                        setSearchTerm('');
                        setStatusFilter('all');
                      }}
                      // disabled={form.watch('recipients')?.length === 0}
                      className="flex-1"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>

                {/* Recipients List */}
                <FormField
                  control={form.control}
                  name="recipients"
                  render={({ field }) => (
                    <FormItem>
                      <div className="border rounded-lg bg-card overflow-hidden">
                        {filteredRecipients.length === 0 ? (
                          <div className="p-8 text-center">
                            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                              <Mail className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground font-medium">
                              {initialRecipients.length === 0
                                ? 'No recipients available'
                                : 'No recipients found'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {initialRecipients.length === 0
                                ? 'Add students to send fee reminders'
                                : 'Try adjusting your search or filters'}
                            </p>
                            {(searchTerm || statusFilter !== 'all') && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={() => {
                                  setSearchTerm('');
                                  setStatusFilter('all');
                                }}
                              >
                                Clear filters
                              </Button>
                            )}
                          </div>
                        ) : (
                          <>
                            <ScrollArea className="h-[280px]">
                              <div className="p-3 space-y-2">
                                {filteredRecipients.map((recipient) => (
                                  <RecipientCard
                                    key={recipient.id}
                                    recipient={recipient}
                                    isSelected={field.value?.includes(
                                      recipient.id
                                    )}
                                    onToggle={() => {
                                      const currentValue = field.value || [];
                                      if (currentValue.includes(recipient.id)) {
                                        field.onChange(
                                          currentValue.filter(
                                            (id: string) => id !== recipient.id
                                          )
                                        );
                                      } else {
                                        field.onChange([
                                          ...currentValue,
                                          recipient.id,
                                        ]);
                                      }
                                    }}
                                  />
                                ))}
                              </div>
                            </ScrollArea>

                            {/* Footer with stats */}
                            <div className="border-t p-3 bg-muted/20">
                              <div className="flex flex-col gap-2 text-sm">
                                <div className="flex items-center gap-4 sm:flex-row sm:items-center justify-between">
                                  <span className="text-muted-foreground">
                                    <strong>{field.value?.length || 0}</strong>{' '}
                                    of{' '}
                                    <strong>{filteredRecipients.length}</strong>{' '}
                                    selected
                                  </span>

                                  {/* Selection summary by status */}
                                  {field.value && field.value.length > 0 && (
                                    <div className="flex items-center gap-2">
                                      {(() => {
                                        const selectedRecipients =
                                          initialRecipients.filter((r) =>
                                            field.value?.includes(r.id)
                                          );
                                        const unpaidCount =
                                          selectedRecipients.filter(
                                            (r) => r.status === 'UNPAID'
                                          ).length;
                                        const overdueCount =
                                          selectedRecipients.filter(
                                            (r) => r.status === 'OVERDUE'
                                          ).length;

                                        return (
                                          <>
                                            {unpaidCount > 0 && (
                                              <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                <span className="text-xs">
                                                  {unpaidCount} Unpaid
                                                </span>
                                              </div>
                                            )}
                                            {overdueCount > 0 && (
                                              <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                                <span className="text-xs">
                                                  {overdueCount} Overdue
                                                </span>
                                              </div>
                                            )}
                                          </>
                                        );
                                      })()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Communication Channels */}
              <FormField
                control={form.control}
                name="channels"
                render={() => (
                  <FormItem>
                    <FormLabel>Communication Channels</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      <FormField
                        control={form.control}
                        name="channels"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes('email')}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, 'email'])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== 'email'
                                      )
                                    );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer flex items-center">
                              <Mail className="h-4 w-4 mr-1.5" />
                              Email
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="channels"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes('sms')}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, 'sms'])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== 'sms'
                                      )
                                    );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer flex items-center">
                              <Phone className="h-4 w-4 mr-1.5 " color="blue" />
                              SMS
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="channels"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes('whatsapp')}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                      ...field.value,
                                      'whatsapp',
                                    ])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== 'whatsapp'
                                      )
                                    );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer flex items-center">
                              <WhatsAppIcon />
                              WhatsApp
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Message Template */}
              <FormField
                control={form.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Template</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FeeReminderTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Scheduling Options */}
              <FormField
                control={form.control}
                name="sendNow"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>When to Send</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) =>
                          field.onChange(value === 'now')
                        }
                        defaultValue={field.value ? 'now' : 'schedule'}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="now" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Send immediately
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="schedule" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Schedule for later{' '}
                            <Badge variant={'meta'}>Meta Feature</Badge>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Date and Time Picker (if scheduled) */}
              {!watchSendNow && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Date Picker */}
                  <FormField
                    control={form.control}
                    name="scheduleDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-3">
                        <FormLabel className="px-1">Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'justify-between  font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? format(field.value, 'PPP')
                                  : 'Select date'}
                                <ChevronDownIcon />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Time Picker */}
                  <FormField
                    control={form.control}
                    name="scheduleTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-3">
                        <FormLabel className="px-1">Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            step="60"
                            {...field}
                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {/* Message Preview */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Message Preview</h3>
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Text Preview</TabsTrigger>
                    <TabsTrigger value="personalized">
                      Personalized Preview
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="text" className="mt-2">
                    <div className="border rounded-md p-4 bg-muted/30">
                      {previewSubject && (
                        <div className="mb-2 pb-2 border-b">
                          <span className="text-sm font-medium">Subject: </span>
                          <span className="text-sm">{previewSubject}</span>
                        </div>
                      )}
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {previewMessage ? (
                          <HighlightedMessage message={previewMessage} />
                        ) : (
                          <span>No message content</span>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="personalized" className="mt-2">
                    {form.watch('recipients').length > 0 ? (
                      <div className="border rounded-md p-4 bg-muted/30">
                        {previewSubject && (
                          <div className="mb-2 pb-2 border-b">
                            <span className="text-sm font-medium">
                              Subject:{' '}
                            </span>
                            <span className="text-sm">{previewSubject}</span>
                          </div>
                        )}
                        <div className="text-sm whitespace-pre-wrap">
                          {getPersonalizedMessage(
                            initialRecipients.find(
                              (r) => r.id === form.watch('recipients')[0]
                            )!
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="border rounded-md p-4 bg-muted/30 text-center text-muted-foreground">
                        Select at least one recipient to see personalized
                        preview
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </form>
          </Form>
        )}
      </div>
      <div className="flex-grow">
        {!success && (
          <>
            <div className="flex justify-end space-x-4 mt-5">
              {/* <Button variant="outline" disabled={isPending} onClick={onClose}>
                Cancel
              </Button> */}

              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {form.watch('sendNow')
                      ? 'Send Reminders'
                      : 'Schedule Reminders'}
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function HighlightedMessage({ message }: { message: string }) {
  const formatted = message.split(/({\w+})/g).map((part, index) => {
    if (/{\w+}/.test(part)) {
      return (
        <span key={index} className="font-medium text-blue-500">
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });

  return <>{formatted}</>;
}

// Separate RecipientCard component for better organization
const RecipientCard = ({
  recipient,
  isSelected,
  onToggle,
}: {
  recipient: FeeReminderRecipient;
  isSelected: boolean;
  onToggle: () => void;
}) => (
  <div
    className={cn(
      'flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer group',
      isSelected
        ? 'border-primary bg-primary/5 shadow-sm'
        : 'border-transparent bg-muted/30 hover:bg-muted/50'
    )}
    onClick={onToggle}
  >
    {/* Custom Checkbox */}
    <div className="flex items-center h-5 mt-0.5">
      <div
        className={cn(
          'flex items-center justify-center w-4 h-4 border rounded transition-all',
          isSelected
            ? 'bg-primary border-primary shadow-sm'
            : 'border-muted-foreground/30 bg-background group-hover:border-muted-foreground/50'
        )}
      >
        {isSelected && (
          <Check className="h-3 w-3 text-primary-foreground animate-in zoom-in" />
        )}
      </div>
    </div>

    {/* Avatar */}
    <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-background">
      <AvatarImage src={recipient.avatar} />
      <AvatarFallback className="text-sm font-medium bg-primary/10">
        {recipient.studentName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>

    {/* Content */}
    <div className="flex-1 min-w-0">
      {/* Header with name and status */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">
            {recipient.studentName}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {recipient.parentName}
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            'font-medium text-xs px-2 py-0.5 flex-shrink-0',
            recipient.status === 'UNPAID' &&
            'bg-amber-50 text-amber-700 border-amber-200',
            recipient.status === 'OVERDUE' &&
            'bg-red-50 text-red-700 border-red-200'
          )}
        >
          {recipient.status}
        </Badge>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 text-xs text-muted-foreground mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
          <span>
            Class {recipient.grade}-{recipient.section}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
          <span>Due: ₹{recipient.amountDue.toLocaleString()}</span>
        </div>
      </div>

      {/* Contact Information */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
          <Mail className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate max-w-[140px]">
            {recipient.parentEmail}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
          <Phone className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate max-w-[120px]">
            {recipient.parentPhone}
          </span>
        </div>
      </div>
    </div>
  </div>
);
