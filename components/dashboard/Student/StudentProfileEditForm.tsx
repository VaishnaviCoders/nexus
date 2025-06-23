'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CalendarIcon, Loader2, Save, User } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
// import { useToast } from "@/hooks/use-toast"
import { cn } from '@/lib/utils';
import { StudentProfileFormData, studentProfileSchema } from '@/lib/schemas';
import { toast } from 'sonner';
import { editStudentProfileForm } from '@/lib/data/student/edit-student-form-action';
import Link from 'next/link';

interface StudentProfileEditFormProps {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string | null;
    motherName?: string | null;
    fullName?: string | null;
    dateOfBirth: Date;
    profileImage?: string | null;
    rollNumber: string;
    phoneNumber: string;
    whatsAppNumber: string;
    email: string;
    emergencyContact: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    grade: string;
    section: string;
    organization: string;
    canEditGrade: boolean;
    canEditParentDetails: boolean;
    isOwnProfile: boolean;
    isParent: boolean;
  };
}

export function StudentProfileEditForm({
  student,
}: StudentProfileEditFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<StudentProfileFormData>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      firstName: student.firstName,
      lastName: student.lastName,
      middleName: student.middleName || '',
      motherName: student.motherName || '',
      dateOfBirth: format(student.dateOfBirth, 'yyyy-MM-dd'),
      gender: student.gender,
      phoneNumber: student.phoneNumber,
      whatsAppNumber: student.whatsAppNumber,
      email: student.email,
      emergencyContact: student.emergencyContact,
      profileImage: student.profileImage || '',
    },
  });

  function onSubmit(data: StudentProfileFormData) {
    startTransition(async () => {
      try {
        const result = await editStudentProfileForm(student.id, data);

        toast.success('Student profile updated successfully');
      } catch (error) {
        toast.success('Failed to update student profile');
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 bg-gradient-to-r from-card via-card to-blue-50/20 dark:to-blue-950/20">
        <CardContent className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-6 gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={student.profileImage || ''}
                alt={student.fullName || ''}
              />
              <AvatarFallback className="text-lg">
                {student.firstName[0]}
                {student.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl font-bold">Edit Profile</CardTitle>
              <CardDescription className="text-base mt-1">
                Update your personal information and contact details
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  Grade {student.grade}-{student.section}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Roll: {student.rollNumber}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
            >
              <User className="w-3 h-3 mr-1" />
              {student.isOwnProfile ? 'Your Profile' : "Child's Profile"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>
                Basic personal details and identification information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
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
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter middle name (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional middle name or father's name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="motherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother's Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter mother's name"
                          {...field}
                          disabled={!student.canEditParentDetails}
                        />
                      </FormControl>
                      {!student.canEditParentDetails && (
                        <FormDescription className="text-amber-600">
                          Parent details cannot be modified after submission
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), 'PPP')
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
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(
                                date ? format(date, 'yyyy-MM-dd') : ''
                              )
                            }
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
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
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Read-only fields */}
              <Separator />
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <FormLabel className="text-muted-foreground">
                    Roll Number
                  </FormLabel>
                  <Input value={student.rollNumber} disabled />
                  <FormDescription>
                    Roll number cannot be changed
                  </FormDescription>
                </div>

                <div className="space-y-2">
                  <FormLabel className="text-muted-foreground">
                    Grade & Section
                  </FormLabel>
                  <Input
                    value={`Grade ${student.grade}-${student.section}`}
                    disabled
                  />
                  <FormDescription>
                    Grade and section are managed by administration
                  </FormDescription>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
              <CardDescription>
                Phone numbers, email, and emergency contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormDescription>Primary contact number</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsAppNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter WhatsApp number" {...field} />
                      </FormControl>
                      <FormDescription>
                        For WhatsApp notifications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter email address"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        For important notifications and communications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter emergency contact number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Alternative contact for emergencies
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card className="border-0 bg-gradient-to-r from-card via-card to-green-50/20 dark:to-green-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Save Changes</h3>
                  <p className="text-sm text-muted-foreground">
                    Review your information before saving
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {' '}
                  <Link href="/dashboard/settings" passHref>
                    <Button type="button" variant={'outline'} size="sm">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Go Back
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isPending} size="sm">
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
