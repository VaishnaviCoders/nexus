'use client';

import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import Link from 'next/link';
import { studentSchema } from '@/lib/schemas';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useSWR from 'swr';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  CalendarIcon,
  ImagePlus,
  Plus,
  Trash2,
  Upload,
  User,
  FileText,
  GraduationCap,
  Users,
  Camera,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import type { Grade, Section } from '@/lib/generated/prisma';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { createStudent } from '@/lib/data/student/create-student-form-action';

interface DocumentFile {
  id: string;
  type: string;
  file: File | null;
  url: string;
  name: string;
}

export default function CreateStudentForm() {
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [pending, setPending] = useState(false);

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
      parents: [
        {
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          whatsAppNumber: '',
          relationship: 'FATHER',
        },
      ],
    },
  });

  const {
    fields: parents,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'parents',
  });
  async function uploadToCloudinary(file: File) {
    const formData = new FormData();
    const uploadPreset = 'student_uploads';
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/ddws0tfqz/upload',
      {
        method: 'POST',
        body: formData,
      }
    );
    const data = await response.json();
    return data.secure_url;
  }

  const onSubmit = async (data: z.infer<typeof studentSchema>) => {
    try {
      setPending(true);
      await createStudent(data); // ✅ parents are already inside `data`

      console.log('Frontend Student Data', data);

      toast.success('Student created successfully!');
      setProfileImage(null);
      setSelectedGradeId(null);
      setDocuments([]);
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create student');
    } finally {
      setPending(false);
    }
  };

  // const addParent = () => {
  //   setParents([
  //     ...parents,
  //     {
  //       firstName: '',
  //       lastName: '',
  //       email: '',
  //       phoneNumber: '',
  //       whatsAppNumber: '',
  //       relationship: 'MOTHER',
  //     },
  //   ]);
  // };

  // const removeParent = (index: number) => {
  //   if (parents.length > 1) {
  //     setParents(parents.filter((_, i) => i !== index));
  //   }
  // };

  // const updateParent = (index: number, field: keyof Parent, value: string) => {
  //   const updatedParents = [...parents];
  //   updatedParents[index] = { ...updatedParents[index], [field]: value };
  //   setParents(updatedParents);
  // };

  const addDocument = () => {
    const newDoc: DocumentFile = {
      id: Date.now().toString(),
      type: 'AADHAAR',
      file: null,
      url: '',
      name: '',
    };
    setDocuments([...documents, newDoc]);
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const updateDocument = (
    id: string,
    field: keyof DocumentFile,
    value: any
  ) => {
    setDocuments(
      documents.map((doc) => (doc.id === id ? { ...doc, [field]: value } : doc))
    );
  };

  const genderOptions = [
    { id: 'MALE', label: 'Male' },
    { id: 'FEMALE', label: 'Female' },
    { id: 'OTHER', label: 'Other' },
  ];

  const relationshipOptions = [
    { id: '1', value: 'FATHER', label: 'Father' },
    { id: '2', value: 'MOTHER', label: 'Mother' },
    { id: '3', value: 'GUARDIAN', label: 'Guardian' },
    { id: '4', value: 'OTHER', label: 'Other' },
  ];

  const documentTypes = [
    { value: 'AADHAAR', label: 'Aadhaar Card' },
    { value: 'PAN', label: 'PAN Card' },
    { value: 'PASSPORT', label: 'Passport' },
    { value: 'BIRTH_CERTIFICATE', label: 'Birth Certificate' },
    { value: 'TRANSFER_CERTIFICATE', label: 'Transfer Certificate' },
    { value: 'BANK_PASSBOOK', label: 'Bank Passbook' },
    { value: 'PARENT_ID', label: 'Parent ID' },
    { value: 'AGREEMENT', label: 'Agreement' },
  ];

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: grades } = useSWR<Grade[]>('/api/grade', fetcher);
  const { data: sections } = useSWR<Section[]>(
    selectedGradeId ? `/api/section/${selectedGradeId}` : null,
    fetcher
  );

  return (
    <div className="">
      <div className="">
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            Student Registration
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Create a comprehensive student profile with all necessary
            information and documents.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-3 ">
              {/* Student Information */}
              <div className="lg:col-span-2 ">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-blue-100 p-2">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-slate-900">
                          Student Information
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                          Basic details and contact information
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Name Fields */}
                    <div className="grid gap-4 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter first name"
                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 capitalize"
                                {...field}
                              />
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
                            <FormLabel className="text-sm font-medium text-slate-700">
                              Middle Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter middle name"
                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 capitalize"
                                {...field}
                              />
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
                            <FormLabel className="text-sm font-medium text-slate-700">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter last name"
                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 capitalize"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Contact Fields */}
                    <div className="grid gap-4 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter email address"
                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter phone number"
                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="whatsAppNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">
                              WhatsApp Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter WhatsApp number"
                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Academic Fields */}
                    <div className="grid gap-4 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="gradeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">
                              Grade
                            </FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedGradeId(value);
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                                  <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {grades ? (
                                  grades.length > 0 ? (
                                    grades.map((grade) => (
                                      <SelectItem
                                        key={grade.id}
                                        value={grade.id}
                                      >
                                        {grade.grade}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <div className="p-2 text-center text-sm text-muted-foreground">
                                      No grades found.
                                      <Link
                                        target="_blank"
                                        href="/dashboard/grades"
                                        className="ml-1 text-blue-500 hover:underline"
                                      >
                                        Create a grade
                                      </Link>
                                    </div>
                                  )
                                ) : (
                                  <div className="p-2 text-center text-sm text-muted-foreground">
                                    Loading grades...
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {selectedGradeId && (
                        <FormField
                          control={form.control}
                          name="sectionId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-slate-700">
                                Section
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                                    <SelectValue placeholder="Select section" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {sections ? (
                                    sections.length > 0 ? (
                                      sections.map((section) => (
                                        <SelectItem
                                          key={section.id}
                                          value={section.id}
                                        >
                                          {section.name}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <div className="p-2 text-center text-sm text-muted-foreground">
                                        No sections found.
                                        <Link
                                          target="_blank"
                                          href="/dashboard/grades"
                                          className="ml-1 text-blue-500 hover:underline"
                                        >
                                          Create a section
                                        </Link>
                                      </div>
                                    )
                                  ) : (
                                    <div className="p-2 text-center text-sm text-muted-foreground">
                                      Loading sections...
                                    </div>
                                  )}
                                </SelectContent>
                              </Select>
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
                            <FormLabel className="text-sm font-medium text-slate-700">
                              Emergency Contact
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Emergency contact number"
                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile & Additional Details */}
              <div className="space-y-8">
                {/* Additional Details */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green-100 p-2">
                        <GraduationCap className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-slate-900">
                          Additional Details
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                          Personal information
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center space-x-5 ">
                      <FormField
                        control={form.control}
                        name="profileImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex flex-col items-center space-y-4">
                                <div className="relative w-32 h-32 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const url =
                                          await uploadToCloudinary(file);
                                        setProfileImage(url);
                                        field.onChange(url);
                                      }
                                    }}
                                  />
                                  {profileImage ? (
                                    <img
                                      src={profileImage || '/placeholder.svg'}
                                      alt="Profile"
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <div className="text-center">
                                      <ImagePlus className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                                      <span className="text-sm text-slate-500">
                                        Upload photo
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
                      <FormField
                        control={form.control}
                        name="rollNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">
                              Roll Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter roll number"
                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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

                    <FormField
                      control={form.control}
                      name="gender"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700">
                            Gender
                          </FormLabel>
                          <div className="flex flex-wrap gap-4">
                            {genderOptions.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value === item.id}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            field.onChange(item.id);
                                          }
                                        }}
                                        className="border-slate-300"
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal text-slate-700">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Parents Section */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
                <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-100 p-2">
                      <Users className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-slate-900">
                        Parent/Guardian Information
                      </CardTitle>
                      <CardDescription className="text-slate-600 text-sm">
                        Add multiple parents or guardians
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size={'sm'}
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 max-sm:flex max-sm:ml-auto"
                    onClick={() =>
                      append({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phoneNumber: '',
                        whatsAppNumber: '',
                        relationship: 'MOTHER',
                      })
                    }
                  >
                    Add Parent
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {parents.map((field, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-800"
                        >
                          Parent {index + 1}
                        </Badge>
                        {parents.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <FormField
                          control={form.control}
                          name={`parents.${index}.firstName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter first name"
                                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 capitalize"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`parents.${index}.lastName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter first name"
                                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 capitalize"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`parents.${index}.relationship`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-slate-700">
                                Relationship
                              </FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                                    <SelectValue placeholder="Select grade" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {relationshipOptions.map((relation) => (
                                    <SelectItem
                                      key={relation.id}
                                      value={relation.value}
                                    >
                                      {relation.label}
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
                          name={`parents.${index}.email`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter first name"
                                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`parents.${index}.phoneNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter first name"
                                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`parents.${index}.whatsAppNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>WhatsApp Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter first name"
                                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Documents Section */}
            <Card className="border-0 shadow-sm ">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-lg">
                <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-teal-100 p-2">
                      <FileText className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-slate-900">
                        Documents
                      </CardTitle>
                      <CardDescription className="text-slate-600 text-sm">
                        Upload required documents and certificates
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addDocument}
                    className="border-teal-200 text-teal-600 hover:bg-teal-50 max-sm:flex max-sm:ml-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h1 className="text-center animate-pulse text-lg text-green-500 font-semibold bg-green-50 py-3 px-4 rounded-md ">
                  This Feature is Coming Soon
                </h1>
                {documents.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p>
                      No documents added yet. Click "Add Document" to get
                      started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {documents.map((doc, index) => (
                      <div
                        key={doc.id}
                        className="relative border border-slate-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <Badge
                            variant="secondary"
                            className="bg-teal-100 text-teal-800"
                          >
                            Document {index + 1}
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(doc.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                              Document Type
                            </label>
                            <Select
                              value={doc.type}
                              onValueChange={(value) =>
                                updateDocument(doc.id, 'type', value)
                              }
                            >
                              <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Select document type" />
                              </SelectTrigger>
                              <SelectContent>
                                {documentTypes.map((type) => (
                                  <SelectItem
                                    key={type.value}
                                    value={type.value}
                                  >
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                              Upload File
                            </label>
                            <div className="relative">
                              <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    updateDocument(doc.id, 'file', file);
                                    updateDocument(doc.id, 'name', file.name);
                                    // You can upload to cloudinary here if needed
                                    // const url = await uploadToCloudinary(file);
                                    // updateDocument(doc.id, 'url', url);
                                  }
                                }}
                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                              />
                              <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            </div>
                            {doc.name && (
                              <p className="text-xs text-slate-500 mt-1">
                                Selected: {doc.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={pending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                {pending ? 'Creating Student...' : 'Create Student'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
