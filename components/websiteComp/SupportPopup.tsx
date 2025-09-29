'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  X,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import { toast } from 'sonner';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { redis } from '@/lib/redis';
import { submitSupportForm } from '@/app/actions';

// Form validation schema
const supportFormSchema = z.object({
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  contact: z.string().optional(),
});

export type SupportFormData = z.infer<typeof supportFormSchema>;

// Subject categories for the dropdown
const supportSubjects = [
  { value: 'billing', label: 'Billing & Payments' },
  { value: 'technical', label: 'Technical Issues' },
  { value: 'feature-request', label: 'Feature Request' },
  { value: 'account', label: 'Account Management' },
  { value: 'integration', label: 'Integration Support' },
  { value: 'data-import', label: 'Data Import/Export' },
  { value: 'user-management', label: 'User Management' },
  { value: 'reporting', label: 'Reports & Analytics' },
  { value: 'mobile-app', label: 'Mobile App Support' },
  { value: 'other', label: 'Other' },
];

// Suggested questions for better UX
const suggestedQuestions = [
  'How do I add new students to my organization?',
  "What's the process for setting up fee categories?",
  'I need help with grade management and reporting.',
  'How do I manage teacher assignments effectively?',
  'I encountered an error while generating reports.',
];

interface SupportPopupProps {
  userId?: string;
  organizationId?: string;
}

export function SupportPopup({ userId, organizationId }: SupportPopupProps) {
  const [activeTab, setActiveTab] = useState('support');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Extract dynamic information
  const extractedInfo = {
    url: typeof window !== 'undefined' ? window.location.href : '',
    userId: userId || 'anonymous',
    organizationId: organizationId || 'none',
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
    language: typeof navigator !== 'undefined' ? navigator.language : '',
    timezone:
      typeof Intl !== 'undefined'
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : '',
    screen:
      typeof window !== 'undefined'
        ? { width: window.innerWidth, height: window.innerHeight }
        : null,
    timestamp: new Date().toISOString(),
  };

  const form = useForm<SupportFormData>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      subject: '',
      message: '',
      priority: 'medium',
      contact: '',
    },
  });

  const onSubmit = (data: SupportFormData) => {
    startTransition(async () => {
      try {
        const payload = {
          ...data,
          meta: extractedInfo,
        };

        const submissionData = await submitSupportForm(payload);
        setIsSubmitted(true);

        console.log('Support submission:', submissionData);

        toast.success('Your message has been sent successfully!', {
          description: "We'll get back to you within 2-4 hours.",
        });
      } catch (error) {
        toast.error('Something went wrong while submitting your message');
      }
    });
  };

  const handleSuggestedQuestion = (question: string) => {
    form.setValue('message', question);
    form.setValue('subject', 'technical'); // Default to technical for suggested questions
  };

  return (
    <div className="overflow-y-auto w-full">
      {' '}
      {isSubmitted ? (
        <div className="px-6 py-12 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Message Sent Successfully!
          </h3>
          <p className="text-muted-foreground mb-4">
            Thank you for reaching out. We've received your message and will
            respond within 24 hours.
          </p>
          <div className="text-sm text-muted-foreground">
            Reference ID: {extractedInfo.timestamp.slice(-8)}
          </div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2  mt-4">
            <TabsTrigger value="support" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </TabsTrigger>
            <TabsTrigger value="meeting" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule a Meeting
            </TabsTrigger>
          </TabsList>

          <TabsContent value="support" className="px-6 pb-6 mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">
                  How can we help you today?
                </h3>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a subject category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {supportSubjects.map((subject) => (
                                  <SelectItem
                                    key={subject.value}
                                    value={subject.value}
                                  >
                                    {subject.label}
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
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {extractedInfo.userId === 'anonymous' && (
                      <FormField
                        control={form.control}
                        name="contact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Number </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Add Your Contact Number ."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your issue or question in detail..."
                              className="min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isPending ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </Form>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Need ideas? Try asking about:
                  </span>
                </div>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="block w-full text-left text-sm text-primary  hover:underline transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Debug info for development */}
              {/* <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                <div className="font-medium mb-1">Extracted Information:</div>
                <div>User ID: {extractedInfo.userId}</div>
                <div>Organization ID: {extractedInfo.organizationId}</div>
                <div>Current URL: {extractedInfo.url}</div>
              </div> */}
            </div>
          </TabsContent>

          <TabsContent value="meeting" className="px-6 pb-6 mt-6">
            <div className="text-center py-12 ">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Schedule a Meeting</h3>
              <p className="text-muted-foreground mb-6">
                Book a personalized demo or consultation with our team.
              </p>
              <Button className="cursor-not-allowed">Coming Soon </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
