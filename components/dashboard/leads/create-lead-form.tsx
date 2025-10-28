'use client';

import { useTransition } from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader2,
  User,
  MapPin,
  Settings,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { type createLeadFormData, createLeadSchema } from '@/lib/schemas';
import {
  LeadCommunicationPreference,
  LeadPriority,
  LeadSource,
} from '@/generated/prisma/enums';
import { createLead } from '@/lib/data/leads/create-leads';
import { useRouter } from 'next/navigation';

export function CreateLeadForm({
  organizationId,
  academicYearId,
}: {
  organizationId: string;
  academicYearId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<createLeadFormData>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      studentName: '',
      phone: '',
      enquiryFor: '',
      parentName: '',
      email: '',
      whatsappNumber: '',
      currentSchool: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      source: LeadSource.WEBSITE,
      priority: LeadPriority.MEDIUM,
      notes: '',
      requirements: [],
      budgetRange: '',
      communicationPreference: [],
      organizationId: organizationId,
      academicYearId: academicYearId,
    },
  });

  console.log('Frontend Form errors:', form.formState.errors);

  const onSubmit = async (data: createLeadFormData) => {
    startTransition(async () => {
      try {
        const result = await createLead(data);

        if (result.success) {
          toast.success('Lead created successfully.');
          router.push('/dashboard/leads');
          router.refresh();
        } else {
          toast.error(
            result.message || 'Failed to create lead. Please try again.'
          );
        }
      } catch (error) {
        toast.error('Failed to create lead. Please try again.');
      }
    });
  };

  return (
    <Card className="border-0 shadow-lg bg-white max-w-7xl mx-auto">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Basic Information
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Student and parent details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        Student Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter student's full name"
                          className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enquiryFor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        Enquiry for <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter what the enquiry is for"
                          className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        Phone Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10-digit phone number"
                          className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-slate-500">
                        We'll use this to contact you
                      </FormDescription>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="student@example.com"
                          className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-slate-500">
                        Optional but recommended
                      </FormDescription>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        Parent/Guardian Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Parent's full name"
                          className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        WhatsApp Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="WhatsApp contact number"
                          className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-slate-500">
                        For quick communication
                      </FormDescription>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Location & School Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Location & School
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Address and school details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="currentSchool"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        Current School
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Current school name"
                          className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City"
                          className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        State
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="State"
                          className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        Pincode
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Postal code"
                          className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-slate-700 font-semibold">
                        Address
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Full address"
                          className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Lead Management */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Lead Management
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Priority and source information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        Lead Source
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(LeadSource).map((source) => (
                            <SelectItem key={source} value={source}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        Priority
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(LeadPriority).map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budgetRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        Budget Range
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="50k-1L">₹50K - ₹1L</SelectItem>
                          <SelectItem value="1L-2L">₹1L - ₹2L</SelectItem>
                          <SelectItem value="2L-5L">₹2L - ₹5L</SelectItem>
                          <SelectItem value="5L+">₹5L+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requirements"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        Requirements
                      </FormLabel>
                      <div className="space-y-3 mt-3">
                        {[
                          'Transportation',
                          'Hostel',
                          'Scholarship',
                          'Day Scholar',
                        ].map((req) => (
                          <FormField
                            key={req}
                            control={form.control}
                            name="requirements"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(req)}
                                    onCheckedChange={(checked) => {
                                      const updated = checked
                                        ? [...(field.value || []), req]
                                        : field.value?.filter(
                                            (item) => item !== req
                                          ) || [];
                                      field.onChange(updated);
                                    }}
                                    className="border-slate-300 focus:ring-2 focus:ring-blue-200"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer text-slate-700">
                                  {req}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Communication Preferences */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Communication Preferences
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    How we should contact you
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="communicationPreference"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          value: LeadCommunicationPreference.EMAIL,
                          label: 'Email',
                        },
                        {
                          value: LeadCommunicationPreference.SMS,
                          label: 'SMS',
                        },
                        {
                          value: LeadCommunicationPreference.WHATSAPP,
                          label: 'WhatsApp',
                        },
                        {
                          value: LeadCommunicationPreference.PHONE_CALL,
                          label: 'Phone Call',
                        },
                      ].map((pref) => (
                        <FormField
                          key={pref.value}
                          control={form.control}
                          name="communicationPreference"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(pref.value)}
                                  onCheckedChange={(checked) => {
                                    const updated = checked
                                      ? [...(field.value || []), pref.value]
                                      : field.value?.filter(
                                          (item) => item !== pref.value
                                        ) || [];
                                    field.onChange(updated);
                                  }}
                                  className="border-slate-300 focus:ring-2 focus:ring-blue-200"
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer text-slate-700">
                                {pref.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Notes */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Additional Information
                  </h2>
                </div>
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold">
                      Additional Notes
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional information or notes about this lead..."
                        className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-500">
                      Optional field for any additional details or special
                      requirements
                    </FormDescription>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-8 border-t-2 border-slate-200">
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Lead...
                  </>
                ) : (
                  'Create Lead'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="px-8 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition-all duration-200"
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
