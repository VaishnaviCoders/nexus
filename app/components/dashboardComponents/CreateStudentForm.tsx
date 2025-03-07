'use client';

import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { createStudent } from '@/app/actions';

import { studentSchema } from '@/lib/schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useSWR from 'swr';

import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon, ImagePlus } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Grade, Section } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUploadFile } from '@/hooks/use-upload-file';

export default function CreateStudentForm() {
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const { onUpload, progresses, uploadedFiles, isUploading, resetUploadState } =
    useUploadFile('studentProfileImage', { defaultUploadedFiles: [] });

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',

      email: '',
      phoneNumber: '',
      whatsAppNumber: '',

      dateOfBirth: new Date(),
      gender: 'MALE',
      rollNumber: '',

      gradeId: '',
      sectionId: '',

      motherName: '',
      fullName: '',
      emergencyContact: '',
      profileImage: '',
      parent: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        whatsAppNumber: '',
        relationship: 'FATHER',
      },
    },
  });
  console.log('Form errors:', form.formState.errors);

  const [pending, setPending] = useState(false);

  async function onSubmit(data: z.infer<typeof studentSchema>) {
    try {
      console.log('Submitting...', data);
      setPending(true);
      await createStudent(data);
      toast.success('Student created successfully!');
      form.reset();
    } catch (error) {
      toast.error('Error creating student');
      if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
        console.error(error.message);
      }
    } finally {
      setPending(false);
    }
  }

  const genderOptions = [
    { id: 'MALE', label: 'Male' },
    { id: 'FEMALE', label: 'Female' },
    { id: 'OTHER', label: 'Other' },
  ];

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: grades } = useSWR<Grade[]>('/api/grade', fetcher);
  const { data: sections } = useSWR<Section[]>(
    selectedGradeId ? `/api/section/${selectedGradeId}` : [],
    fetcher
  );

  const fileRef = form.register('profileImage', { required: true });

  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImage(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-5 ">
        <div className="grid lg:grid-cols-9 gap-5">
          <Card className="w-full mx-auto  my-3  col-span-7">
            <CardHeader>
              <CardTitle>New Student Registration</CardTitle>
              <CardDescription>
                Enter the student&apos;s information to register them in the
                system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter First Name" {...field} />
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
                        <Input placeholder="Enter Middle Name" {...field} />
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
                        <Input placeholder="Enter Last Name" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Email" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Phone Number" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="whatsAppNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Phone Number" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="gradeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Grade</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedGradeId(value); // Update state
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {grades?.map((grade) => (
                            <SelectItem key={grade.id} value={grade.id}>
                              {grade.grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!selectedGradeId ? null : (
                  <FormField
                    control={form.control}
                    name="sectionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Section</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sections?.map((section) => (
                                <SelectItem key={section.id} value={section.id}>
                                  {section.name}
                                </SelectItem>
                              )) ?? null}
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="EMERGENCY CONTACT" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full mx-auto my-3 col-span-2">
            <CardHeader>
              <CardTitle>Addition details</CardTitle>
              <CardDescription>
                Enter the student&apos;s information to register them in the
                system.
              </CardDescription>
            </CardHeader>
            <CardContent className=" ">
              <div className="grid-cols-1 md:grid-cols-3 space-y-7 ">
                <div className="flex justify-between items-center">
                  <FormField
                    control={form.control}
                    name="profileImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> Your Profile Picture</FormLabel>
                        <FormControl>
                          <div className="flex  items-center justify-center">
                            <div className="relative w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center p-2">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                  const file = event.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const imageData = reader.result as string;
                                      setImage(imageData); // To display image preview
                                      field.onChange(imageData); // Set Base64 string in form field
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer p-4"
                                aria-label="Upload profile picture"
                              />
                              {image ? (
                                <img
                                  src={image || '/placeholder.svg'}
                                  alt="Profile"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="text-center">
                                  <ImagePlus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                  <span className="text-sm text-gray-500">
                                    Upload your photo
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="rollNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter Roll Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Roll Number" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[205px] pl-3 text-left font-normal flex items-center gap-2',
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
                            disabled={(date) => date < new Date('2023-01-01')}
                            autoFocus
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
                  render={() => (
                    <FormItem>
                      <FormLabel>Select Gender</FormLabel>

                      <div className="flex space-x-3 ">
                        {genderOptions.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="gender"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={
                                        field.value === item.id.toUpperCase()
                                      }
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          field.onChange(item.id.toUpperCase());
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full mx-auto my-3">
          <CardHeader>
            <CardTitle>Parent details</CardTitle>
            <CardDescription>
              Enter the student&apos;s information to register them in the
              system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name={`parent.firstName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Parent First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`parent.lastName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Parent Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`parent.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Parent Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`parent.phoneNumber`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Parent Phone Number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`parent.whatsAppNumber`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent WhatsApp Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Parent WhatsApp Number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`parent.relationship`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FATHER">Father</SelectItem>
                        <SelectItem value="MOTHER">Mother</SelectItem>
                        <SelectItem value="GUARDIAN">Guardian</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button variant="outline"> Cancel</Button>
          <Button type="submit" disabled={pending} className="">
            {pending ? 'Creating...' : 'Create Student'}
          </Button>
        </div>

        {/* <CreateStudentButton /> */}
      </form>
    </Form>
  );
}
