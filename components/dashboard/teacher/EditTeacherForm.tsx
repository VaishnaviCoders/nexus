'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { type CreateTeacherFormData, createTeacherSchema } from '@/lib/schemas';
import { toast } from 'sonner';
import MultipleSelector from '@/components/ui/multi-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  TeacherProfile,
  User,
  EmploymentStatus,
} from '@/generated/prisma/client';
import { grades, subjects, languages, indianStates } from '@/constants/index';
import { updateTeacherAction } from '@/app/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditTeacherFormProps {
  teacher: {
    id: string;
    employeeCode: string | null;
    isActive: boolean;
    employmentStatus: EmploymentStatus;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    profile: TeacherProfile | null;
    user: User;
  };
  onSuccess?: () => void;
}

export function EditTeacherForm({ teacher, onSuccess }: EditTeacherFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateTeacherFormData>({
    resolver: zodResolver(createTeacherSchema),
    defaultValues: {
      firstName: teacher.user.firstName || '',
      lastName: teacher.user.lastName || '',
      email: teacher.user.email || '',
      employeeCode: teacher.employeeCode || '',
      contactEmail: teacher.profile?.contactEmail || '',
      contactPhone: teacher.profile?.contactPhone || '',
      address: teacher.profile?.address || '',
      city: teacher.profile?.city || 'Pune',
      state: teacher.profile?.state || 'Maharashtra',
      dateOfBirth: teacher.profile?.dateOfBirth
        ? new Date(teacher.profile.dateOfBirth)
        : new Date(),
      qualification: teacher.profile?.qualification || '',
      experienceInYears: teacher.profile?.experienceInYears || 0,
      joinedAt: teacher.profile?.joinedAt
        ? new Date(teacher.profile.joinedAt)
        : new Date(),
      specializedSubjects: teacher.profile?.specializedSubjects || [],
      preferredGrades: teacher.profile?.preferredGrades || [],
      bio: teacher.profile?.bio || '',
      teachingPhilosophy: teacher.profile?.teachingPhilosophy || '',
      linkedinPortfolio: teacher.profile?.linkedinPortfolio || '',
      languagesKnown: teacher.profile?.languagesKnown || [],
    },
  });

  const onSubmit = async (data: CreateTeacherFormData) => {
    startTransition(async () => {
      try {
        console.log('Updating Teacher Data', data);
        await updateTeacherAction(teacher.id, data);
        toast.success('Teacher profile has been updated successfully.');
        form.reset();
        onSuccess?.();
      } catch (error) {
        toast.error('Failed to update teacher profile. Please try again.');
      }
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="teaching">Teaching</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Basic personal details and identification information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john.doe@school.edu"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This will be used for login and communications.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="employeeCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee Code</FormLabel>
                          <FormControl>
                            <Input placeholder="TCH001" {...field} />
                          </FormControl>
                          <FormDescription>
                            Unique identifier for the teacher.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">
                          Date of Birth
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full pl-3 text-left font-normal border-slate-200 focus:border-blue-500 focus:ring-blue-500',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  new Intl.DateTimeFormat('en-IN', {
                                    dateStyle: 'long',
                                  }).format(field.value)
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
                                date > new Date() ||
                                date < new Date('1900-01-01')
                              }
                              autoFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Contact details and address information for communication.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Phone Number *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Primary contact number for emergencies and
                            communications.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email Address *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter email address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="123 Main Street, Apartment 4B"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Pune, Mumbai , Nashik"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {indianStates.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Background</CardTitle>
                  <CardDescription>
                    Educational qualifications and professional experience.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="qualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Highest Qualification</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="M.Ed in Mathematics"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="experienceInYears"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience (Years)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="5"
                              min="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseInt(e.target.value) || 0
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="joinedAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Joining Date</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'w-full pl-3 text-left font-normal border-slate-200 focus:border-blue-500 focus:ring-blue-500',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    new Intl.DateTimeFormat('en-IN', {
                                      dateStyle: 'long',
                                    }).format(new Date(field.value))
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                autoFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief professional summary and background..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A brief description of the teacher's background and
                          interests.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedinPortfolio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://linkedin.com/in/johndoe"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Professional LinkedIn profile URL.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teaching" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Teaching Preferences</CardTitle>
                  <CardDescription>
                    Subject expertise, grade preferences, and teaching
                    philosophy.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="specializedSubjects"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialized Subjects</FormLabel>
                        <FormControl>
                          <MultipleSelector
                            options={subjects}
                            value={field.value.map((value) => ({
                              value,
                              label: value,
                            }))}
                            onChange={(options) =>
                              field.onChange(
                                options.map((option) => option.value)
                              )
                            }
                            placeholder="Select subjects to teach"
                            emptyIndicator="No subjects found."
                          />
                        </FormControl>
                        <FormDescription>
                          Select all subjects this teacher is qualified to
                          teach.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredGrades"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Grades</FormLabel>
                        <FormControl>
                          <MultipleSelector
                            options={grades}
                            value={field.value.map((value) => ({
                              value,
                              label: value,
                            }))}
                            onChange={(options) =>
                              field.onChange(
                                options.map((option) => option.value)
                              )
                            }
                            placeholder="Select preferred grades"
                            emptyIndicator="No grades found."
                          />
                        </FormControl>
                        <FormDescription>
                          Select grade levels this teacher prefers to teach.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="languagesKnown"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Languages Known</FormLabel>
                        <FormControl>
                          <MultipleSelector
                            options={languages}
                            value={
                              field.value?.map((value) => ({
                                value,
                                label: value,
                              })) || []
                            }
                            onChange={(options) =>
                              field.onChange(
                                options.map((option) => option.value)
                              )
                            }
                            placeholder="Select known languages"
                            emptyIndicator="No languages found."
                          />
                        </FormControl>
                        <FormDescription>
                          Languages the teacher can communicate in effectively.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="teachingPhilosophy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teaching Philosophy</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your approach to education and teaching methods..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The teacher's educational philosophy and approach to
                          teaching.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isPending}
            >
              Reset Changes
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Updating Teacher...' : 'Update Teacher'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
