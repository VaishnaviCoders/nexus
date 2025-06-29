'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Check,
  Info,
  Loader2,
  Mail,
  Phone,
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
import { cn } from '@/lib/utils';
import { FeeReminderTemplates } from '@/components/Templates/FeeReminder';
import { toast } from 'sonner';
import { WhatsAppIcon } from '@/public/icons/WhatsAppIcon';
import { sendFeeReminders } from '@/lib/data/fee/fee-reminder';
// import { Card, CardContent, CardFooter } from '@/components/ui/card';

export interface FeeReminderRecipient {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  status: 'UNPAID' | 'OVERDUE';
  amountDue: number;
  dueDate: Date;
  avatar?: string;
  organizationName?: string;
  parentId?: string | null;
  parentUserId?: string | null;
}

interface FeeReminderHistory {
  id: string;
  studentId: string;
  sentAt: Date;
  channel: 'email' | 'sms' | 'whatsapp';
  subject: string;
  status: 'delivered' | 'failed' | 'pending';
  sentBy: string;
}

export interface SendReminderData {
  recipients: FeeReminderRecipient[];
  channels: ('email' | 'sms' | 'whatsapp')[];
  subject: string;
  message: string;
  scheduleDate?: Date | null;
  scheduleTime?: string | null;
}

export interface ReminderResult {
  success: boolean;
  error?: string;
  sentCount?: number;
}

// Define the schema for the form
const reminderFormSchema = z.object({
  recipients: z.array(z.string()).min(1, 'Select at least one recipient'),
  channels: z
    .array(z.enum(['email', 'sms', 'whatsapp']))
    .min(1, 'Select at least one channel'),
  templateId: z.string().min(1, 'Please select a template'),

  scheduleDate: z.date().optional(),
  scheduleTime: z.string().optional(),
  sendNow: z.boolean().default(true),
});

type ReminderFormValues = z.infer<typeof reminderFormSchema>;

interface SendReminderDialogProps {
  initialRecipients: FeeReminderRecipient[];
}

export function SendFeesReminderDialog({
  initialRecipients = [],
}: SendReminderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMessage, setPreviewMessage] = useState('');
  const [previewSubject, setPreviewSubject] = useState('');

  // Initialize the form
  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      recipients: initialRecipients.map((r) => r.id),
      channels: ['email'],
      templateId: 'friendly-reminder',
      sendNow: true,
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
    }
  }, [watchTemplateId]);

  // Replace placeholders in the message with actual values
  const getPersonalizedMessage = (
    recipient: FeeReminderRecipient,
    channel?: string
  ) => {
    let message = previewMessage
      .replace('{STUDENT_NAME}', recipient.studentName)
      .replace(
        '{ORGANIZATION_NAME}',
        recipient.organizationName || 'School Administration'
      )
      .replace(
        '{AMOUNT}',
        recipient.amountDue.toLocaleString('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0,
        })
      );
    if (channel === 'sms' && message.length > 160) {
      message = message.substring(0, 157) + '...';
    }
    return message;
  };

  // Handle form submission
  async function onSubmit(data: ReminderFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      // Get the selected recipients
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
      };

      console.log('Reminder data:', reminderData);

      //   // Send the reminders
      const result = await sendFeeReminders(reminderData);

      toast.success('Reminders sent successfully!');

      // console.log('Reminder data:', reminderData);

      //   if (result.success) {
      //     setSuccess(true);
      //     setTimeout(() => {
      //       onOpenChange(false);
      //       setSuccess(false);
      //     }, 2000);
      //   } else {
      //     setError(result.error || 'Failed to send reminders');
      //   }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
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
              className="space-y-6 overflow-auto flex-1 pr-1"
            >
              {error && (
                <Alert variant="destructive">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Recipients */}
              <FormField
                control={form.control}
                name="recipients"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Recipients ({initialRecipients.length})
                    </FormLabel>
                    <div className="border rounded-md p-4">
                      {initialRecipients.length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                          No recipients selected
                        </p>
                      ) : (
                        <ScrollArea className="h-[200px] pr-4">
                          {initialRecipients.map((recipient) => (
                            <FormField
                              key={recipient.id}
                              control={form.control}
                              name="recipients"
                              render={({ field }) => (
                                <FormItem
                                  key={recipient.id}
                                  className="flex flex-row items-center space-x-3 space-y-0 mb-4 pb-4 px-2 border-b last:border-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      className="ring-blue-500 ring-offset-2 ring-offset-white"
                                      checked={field.value?.includes(
                                        recipient.id
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              recipient.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) =>
                                                  value !== recipient.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <div className="flex flex-1 items-center gap-3">
                                    <Avatar>
                                      <AvatarImage src={recipient.avatar} />
                                      <AvatarFallback>
                                        {recipient.studentName
                                          .substring(0, 2)
                                          .toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium leading-none">
                                          {recipient.studentName}
                                        </p>
                                        <Badge
                                          variant="outline"
                                          className={cn(
                                            'font-normal',
                                            recipient.status === 'UNPAID' &&
                                              'bg-amber-50 text-amber-700 border-amber-200',
                                            recipient.status === 'OVERDUE' &&
                                              'bg-red-50 text-red-700 border-red-200'
                                          )}
                                        >
                                          {recipient.status}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <span className="mr-2">
                                          Class: {recipient.grade}
                                        </span>
                                        <span>
                                          Due: ₹
                                          {recipient.amountDue.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <Mail className="h-3 w-3 mr-1" />
                                        <span className="mr-3">
                                          {recipient.parentEmail}
                                        </span>
                                        <Phone className="h-3 w-3 mr-1" />
                                        <span>{recipient.parentPhone}</span>
                                      </div>
                                    </div>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </ScrollArea>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  <FormField
                    control={form.control}
                    name="scheduleDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'pl-3 text-left font-normal',
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
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
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
                    name="scheduleTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            placeholder="Select time"
                            {...field}
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
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
