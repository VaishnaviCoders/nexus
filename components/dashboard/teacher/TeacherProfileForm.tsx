'use client';

import React, { useState, useTransition } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CalendarIcon,
  Upload,
  Plus,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  FileText,
  Globe,
  Languages,
  BookOpen,
  Award,
  Shield,
  Eye,
  Trash2,
} from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { TeacherProfileFormData, teacherProfileSchema } from '@/lib/schemas';
import { toast } from 'sonner';
import { updateTeacherProfileAction } from '@/app/actions';

import { grades, subjects, languages, indianStates } from '@/constants/index';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-uploader';
import { CloudinaryUploadResult, uploadToCloudinary } from '@/lib/cloudinary';

interface TeacherProfileFormProps {
  teacher: TeacherProfileFormData & { id: string };
}

export function TeacherProfileForm({ teacher }: TeacherProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [uploadedResume, setUploadedResume] = useState<File[]>([]);

  const form = useForm<TeacherProfileFormData>({
    resolver: zodResolver(teacherProfileSchema),
    defaultValues: {
      firstName: teacher?.firstName || '',
      middleName: teacher?.middleName || '',
      lastName: teacher?.lastName || '',
      profilePhoto: teacher?.profilePhoto || '',
      contactEmail: teacher?.contactEmail || '',
      contactPhone: teacher?.contactPhone || '',
      address: teacher?.address || '',
      city: teacher?.city || '',
      state: teacher?.state || '',
      qualification: teacher?.qualification || '',
      experienceInYears: teacher?.experienceInYears || 0,
      dateOfBirth: teacher?.dateOfBirth || undefined,
      resumeUrl: teacher?.resumeUrl || '',
      specializedSubjects: teacher?.specializedSubjects || [],
      preferredGrades: teacher?.preferredGrades || [],
      bio: teacher?.bio || '',
      linkedinPortfolio: teacher?.linkedinPortfolio || '',
      languagesKnown: teacher?.languagesKnown || [],
      teachingPhilosophy: teacher?.teachingPhilosophy || '',
      certificateUrls: teacher?.certificateUrls || [],
      idProofUrl: teacher?.idProofUrl || '',
    },
  });

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({
    control: form.control,
    name: 'certificateUrls',
  });

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  function onSubmit(data: TeacherProfileFormData) {
    startTransition(async () => {
      try {
        if (uploadedResume.length > 0) {
          const result = await uploadToCloudinary(uploadedResume[0]);
          form.setValue('resumeUrl', result.url); // Update the form value
          data.resumeUrl = result.url; // Also update the data object
        }
        const result = await updateTeacherProfileAction({
          teacherId: teacher.id,
          data,
        });

        console.log('result', result);
        toast.success('Teacher profile updated successfully');
      } catch (error) {
        toast.success('Failed to update teacher profile');
      }
    });
  }

  console.log('Form errors:', form.formState.errors);

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription className="text-sm ">
                Your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={teacher.profilePhoto || ''}
                    alt="Profile"
                    className="rounded-full"
                  />
                  <AvatarFallback className="text-lg">
                    {form.watch('firstName')?.[0]}
                    {form.watch('lastName')?.[0]}
                  </AvatarFallback>
                </Avatar>
                <FormField
                  control={form.control}
                  name="profilePhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Photo</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              //   if (file) {
                              //     handleFileUpload(file, 'profilePhoto');
                              //   }
                            }}
                            className="hidden"
                            id="profile-photo"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById('profile-photo')?.click()
                            }
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Photo
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage className="text-sm" />
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
                        <Input placeholder="Enter middle name" {...field} />
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
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          disabled={true}
                          type="email"
                          placeholder="Enter email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth *</FormLabel>
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
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complete Address *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your complete address"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
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

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="w-5 h-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualification *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your educational qualifications"
                        className="min-h-[80px]"
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
                    <FormLabel className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Experience (Years) *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter years of experience"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resumeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Resume Upload
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {/* Show existing resume if available and no new file is being uploaded */}
                        {field.value && uploadedResume.length === 0 && (
                          <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <FileText className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  Current Resume
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Previously uploaded
                                </p>
                              </div>
                            </div>
                            {/* <div className="flex items-center gap-2">
                              <Button type="button" variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button type="button" variant="outline" size="sm">
                                <Trash2 className="w-4 h-4 mr-1" />
                                Remove
                              </Button>
                            </div> */}
                          </div>
                        )}
                        <FileUpload
                          maxFiles={1}
                          maxSize={5 * 1024 * 1024}
                          className="w-full "
                          value={uploadedResume}
                          onValueChange={setUploadedResume}
                          onFileReject={onFileReject}
                        >
                          <FileUploadDropzone>
                            <div className="flex flex-col items-center gap-1 text-center">
                              <div className="flex items-center justify-center rounded-full border p-2.5">
                                <Upload className="size-6 text-muted-foreground" />
                              </div>
                              <p className="font-medium text-sm">
                                Drag & drop files here
                              </p>
                              <p className="text-muted-foreground text-xs">
                                Or click to browse (max 4 files, up to 5MB each)
                              </p>
                            </div>
                            <FileUploadTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 w-fit"
                              >
                                Browse files
                              </Button>
                            </FileUploadTrigger>
                          </FileUploadDropzone>
                          <FileUploadList>
                            {uploadedResume.map((file) => (
                              <FileUploadItem key={file.name} value={file}>
                                <FileUploadItemPreview />
                                <FileUploadItemMetadata />
                                <FileUploadItemDelete asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                  >
                                    <X />
                                  </Button>
                                </FileUploadItemDelete>
                              </FileUploadItem>
                            ))}
                          </FileUploadList>
                        </FileUpload>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload your resume in PDF, DOC, or DOCX format
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Teaching Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="w-5 h-5" />
                Teaching Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Specialized Subjects */}
              <FormField
                control={form.control}
                name="specializedSubjects"
                render={() => (
                  <FormItem>
                    <FormLabel>Specialized Subjects *</FormLabel>
                    <FormDescription>
                      Select the subjects you specialize in teaching
                    </FormDescription>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {subjects.map((subject) => (
                        <FormField
                          key={subject.value}
                          control={form.control}
                          name="specializedSubjects"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={subject.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(
                                      subject.value
                                    )}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            subject,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== subject.value
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {subject.label}
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

              {/* Preferred Grades */}
              <FormField
                control={form.control}
                name="preferredGrades"
                render={() => (
                  <FormItem>
                    <FormLabel>Preferred Grades *</FormLabel>
                    <FormDescription>
                      Select the grade levels you prefer to teach
                    </FormDescription>
                    <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {grades.map((grade) => (
                        <FormField
                          key={grade.value}
                          control={form.control}
                          name="preferredGrades"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={grade.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(grade.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            grade,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== grade.value
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {grade.label}
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
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5" />
                Additional Information
              </CardTitle>
              <CardDescription className="text-sm ">
                Optional details to enhance your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/500 characters
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
                    <FormLabel>LinkedIn / Portfolio URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/in/yourprofile"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teachingPhilosophy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teaching Philosophy</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your teaching philosophy and approach..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/1000 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Languages Known */}
              <FormField
                control={form.control}
                name="languagesKnown"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      Languages Known
                    </FormLabel>
                    <FormDescription>
                      Select the languages you can speak and teach in
                    </FormDescription>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {languages.map((language) => (
                        <FormField
                          key={language.value}
                          control={form.control}
                          name="languagesKnown"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={language.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(
                                      language.value
                                    )}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            language.value,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) =>
                                                value !== language.value
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {language.label}
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
            </CardContent>
          </Card>

          {/* Documents & Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5" />
                Documents & Certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Certification Uploads */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Certifications</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendCertification({ title: '', url: '' })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Certification
                  </Button>
                </div>

                {certificationFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-end">
                    <FormField
                      control={form.control}
                      name={`certificateUrls.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Certification Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., B.Ed Certificate"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`certificateUrls.${index}.url`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Upload File</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const fakeUrl = URL.createObjectURL(file);
                                    field.onChange(fakeUrl);
                                  }
                                }}
                                className="hidden"
                                id={`cert-${index}`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  document
                                    .getElementById(`cert-${index}`)
                                    ?.click()
                                }
                              >
                                <Upload className="w-4 h-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeCertification(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* ID Proof Upload */}
              <FormField
                control={form.control}
                name="idProofUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      ID Proof Upload (Aadhaar/PAN/Passport)
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        {/* <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(file, 'idProofUpload');
                            }
                          }}
                          className="hidden"
                          id="id-proof-upload"
                        /> */}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById('id-proof-upload')?.click()
                          }
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload ID Proof
                        </Button>
                        {field.value && (
                          <Badge variant="secondary">ID Proof uploaded</Badge>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a clear copy of your government-issued ID
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
