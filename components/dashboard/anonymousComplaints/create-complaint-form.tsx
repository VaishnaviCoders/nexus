'use client';

import type React from 'react';

import { useState, useRef, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Upload,
  X,
  AlertTriangle,
  Shield,
  CheckCircle2,
  Camera,
  Users,
  MessageSquare,
  ImageIcon,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { z } from 'zod';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { createAnonymousComplaintAction } from '@/lib/data/complaints/create-anonymous-complaint';
import { getAllUsersWithRoleAction } from '@/lib/data/complaints/get-all-users-with-role';

interface MentionedPerson {
  id: string;
  name: string;
  role?: string;
  department?: string;
}

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

export const anonymousComplaintSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], {
    required_error: 'Please select severity level',
  }),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  isAnonymous: z.boolean().default(true),
  evidenceUrls: z.array(z.string()).optional(),
});

export default function CreateAnonymousComplaintForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [mentionedPeople, setMentionedPeople] = useState<MentionedPerson[]>([]);
  const [evidenceFiles, setEvidenceFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Mention functionality
  const [showMentionPopover, setShowMentionPopover] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof anonymousComplaintSchema>>({
    resolver: zodResolver(anonymousComplaintSchema),
    defaultValues: {
      category: '',
      severity: 'MEDIUM',
      subject: '',
      description: '',
      evidenceUrls: [],
    },
  });

  // Mock data for mention suggestions - simulating large organization
  const mockPeople = useMemo(() => {
    const departments = [
      'Computer Science',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'English',
      'History',
      'Administration',
    ];
    const roles = [
      'Professor',
      'Associate Professor',
      'Assistant Professor',
      'Lecturer',
      'TA',
      'Student',
      'Admin Staff',
      'Department Head',
    ];
    const firstNames = [
      'John',
      'Jane',
      'Michael',
      'Sarah',
      'David',
      'Lisa',
      'Robert',
      'Emily',
      'James',
      'Maria',
      'William',
      'Jennifer',
      'Richard',
      'Patricia',
      'Charles',
      'Linda',
    ];
    const lastNames = [
      'Smith',
      'Johnson',
      'Williams',
      'Brown',
      'Jones',
      'Garcia',
      'Miller',
      'Davis',
      'Rodriguez',
      'Martinez',
      'Hernandez',
      'Lopez',
      'Gonzalez',
      'Wilson',
      'Anderson',
      'Thomas',
    ];

    const people: MentionedPerson[] = [];

    // Generate 300+ people
    for (let i = 0; i < 350; i++) {
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const role = roles[Math.floor(Math.random() * roles.length)];
      const department =
        departments[Math.floor(Math.random() * departments.length)];

      people.push({
        id: `person-${i + 1}`,
        name: `${firstName} ${lastName}`,
        role,
        department,
      });
    }

    return people;
  }, []);

  // Filter people based on search
  const filteredPeople = useMemo(() => {
    if (!mentionSearch) return mockPeople.slice(0, 10); // Show first 10 by default

    return mockPeople
      .filter(
        (person) =>
          person.name.toLowerCase().includes(mentionSearch.toLowerCase()) ||
          person.role?.toLowerCase().includes(mentionSearch.toLowerCase()) ||
          person.department?.toLowerCase().includes(mentionSearch.toLowerCase())
      )
      .slice(0, 10); // Limit to 10 results for performance
  }, [mentionSearch, mockPeople]);

  const onSubmit = async (data: z.infer<typeof anonymousComplaintSchema>) => {
    setIsUploading(true);

    try {
      // Upload files to your storage service
      const uploadedUrls = await Promise.all(
        evidenceFiles.map(async (fileObj) => {
          // Replace with your actual upload logic
          return await uploadToCloudinary(fileObj.file);
        })
      );

      const complaintData = {
        ...data,
        evidenceUrls: uploadedUrls,
      };

      const trackingId = await createAnonymousComplaintAction(complaintData);
      setTrackingId(trackingId);
      setSubmitted(true);

      return trackingId;
    } catch (error) {
      console.error('Error submitting complaint:', error);
      // Handle error appropriately
    } finally {
      setIsUploading(false);
    }
  };

  async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    const uploadPreset = 'anonymous_complaint_uploads';
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/ddws0tfqz/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile: UploadedFile = {
          file,
          preview: event.target?.result as string,
          id: Math.random().toString(36).substr(2, 9),
        };

        setEvidenceFiles((prev) => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (e.target) {
      e.target.value = '';
    }
  };

  const removeFile = (id: string) => {
    setEvidenceFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleDescriptionChange = (value: string) => {
    form.setValue('description', value);

    // Check for @ mentions
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart || 0;
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);

      // Check if we're still in a mention (no spaces after @)
      if (!textAfterAt.includes(' ') && textAfterAt.length >= 0) {
        setMentionSearch(textAfterAt);
        setCursorPosition(cursorPos);
        setShowMentionPopover(true);
      } else {
        setShowMentionPopover(false);
        setMentionSearch('');
      }
    } else {
      setShowMentionPopover(false);
      setMentionSearch('');
    }
  };

  const addMention = (person: MentionedPerson) => {
    const currentDescription = form.getValues('description');
    const textarea = textareaRef.current;

    if (!textarea) return;

    // Find the @ symbol before cursor
    const textBeforeCursor = currentDescription.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const beforeAt = currentDescription.substring(0, lastAtIndex);
      const afterCursor = currentDescription.substring(cursorPosition);

      const newDescription = `${beforeAt}@${person.name} ${afterCursor}`;
      form.setValue('description', newDescription);

      // Add to mentioned people if not already added
      if (!mentionedPeople.find((p) => p.id === person.id)) {
        setMentionedPeople((prev) => [...prev, person]);
      }
    }

    setShowMentionPopover(false);
    setMentionSearch('');
  };

  // Format description with blue mentions
  const formatDescriptionWithMentions = (text: string) => {
    if (!mentionedPeople.length) return text;

    let formattedText = text;
    mentionedPeople.forEach((person) => {
      const mentionRegex = new RegExp(`@${person.name}`, 'g');
      formattedText = formattedText.replace(
        mentionRegex,
        `<span class="text-blue-600 font-medium">@${person.name}</span>`
      );
    });

    return formattedText;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {submitted ? (
            <div className="mx-auto max-w-2xl">
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Complaint Submitted Successfully
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Your complaint has been received and will be reviewed
                    promptly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">
                      Important
                    </AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Please save your tracking ID to monitor the progress of
                      your complaint.
                    </AlertDescription>
                  </Alert>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                    <div className="text-center">
                      <div className="text-sm font-medium text-slate-600 mb-2">
                        Your Tracking ID
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {trackingId}
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        Keep this ID safe for future reference
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmitted(false);
                        form.reset();
                        setMentionedPeople([]);
                        setEvidenceFiles([]);
                      }}
                      className="flex-1"
                    >
                      Submit Another Complaint
                    </Button>
                    <Button
                      onClick={() =>
                        router.push(
                          `/dashboard/anonymous-complaints/track/${trackingId}`
                        )
                      }
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Track Complaint
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left Column - Information */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                    File Your Complaint
                  </h1>
                  <p className="text-slate-600">
                    Report incidents safely and anonymously. Your voice matters
                    and will be heard.
                  </p>
                </div>

                <Card className="border-0 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      POSH Complaints
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-red-700">
                      For sexual harassment complaints, we provide specialized
                      support and follow POSH guidelines strictly.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-800">
                      How it works
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-blue-700">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        Fill out the form with incident details
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        Mention people using @ symbol if needed
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        Upload evidence (optional)
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        Receive tracking ID for updates
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Form */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900 flex items-center gap-4">
                      Complaint Details
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600 animate-pulse" />
                        <span className="text-sm text-green-600">
                          Secure & Anonymous
                        </span>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Provide detailed information to help us address your
                      concern effectively.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        {/* Category and Severity */}
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="border-slate-300">
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="sexual-harassment">
                                      🚨 Sexual Harassment (POSH)
                                    </SelectItem>
                                    <SelectItem value="bullying">
                                      😔 Bullying/Intimidation
                                    </SelectItem>
                                    <SelectItem value="discrimination">
                                      ⚖️ Discrimination
                                    </SelectItem>
                                    <SelectItem value="academic-misconduct">
                                      📚 Academic Misconduct
                                    </SelectItem>
                                    <SelectItem value="faculty-behavior">
                                      👨‍🏫 Faculty Inappropriate Behavior
                                    </SelectItem>
                                    <SelectItem value="infrastructure">
                                      🏢 Infrastructure Issues
                                    </SelectItem>
                                    <SelectItem value="administration">
                                      📋 Administrative Issues
                                    </SelectItem>
                                    <SelectItem value="safety">
                                      🛡️ Safety Concerns
                                    </SelectItem>
                                    <SelectItem value="other">
                                      📝 Other
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="severity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Severity *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="border-slate-300">
                                      <SelectValue placeholder="Select severity" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="LOW">
                                      🟢 Low - Minor issue
                                    </SelectItem>
                                    <SelectItem value="MEDIUM">
                                      🟡 Medium - Moderate concern
                                    </SelectItem>
                                    <SelectItem value="HIGH">
                                      🟠 High - Serious issue
                                    </SelectItem>
                                    <SelectItem value="CRITICAL">
                                      🔴 Critical - Urgent attention needed
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Severity Badge */}
                        {form.watch('severity') && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600">
                              Severity Level:
                            </span>
                            <Badge
                              className={getSeverityColor(
                                form.watch('severity')
                              )}
                            >
                              {form.watch('severity').toUpperCase()}
                            </Badge>
                          </div>
                        )}

                        {/* Subject */}
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Brief, descriptive title of the incident"
                                  className="border-slate-300"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Description with Mentions */}
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Detailed Description *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Popover open={showMentionPopover}>
                                    <PopoverTrigger asChild>
                                      <div className="relative">
                                        <Textarea
                                          ref={textareaRef}
                                          placeholder="Describe the incident in detail. Use @ to mention people involved (e.g., @Dr. Smith)"
                                          className="min-h-[150px] border-slate-300 pr-10"
                                          value={field.value}
                                          onChange={(e) => {
                                            field.onChange(e.target.value);
                                            handleDescriptionChange(
                                              e.target.value
                                            );
                                          }}
                                        />
                                        <MessageSquare className="absolute top-3 right-3 h-4 w-4 text-slate-400" />
                                      </div>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-80 p-0"
                                      align="start"
                                    >
                                      <Command>
                                        <CommandInput
                                          placeholder="Search people..."
                                          value={mentionSearch}
                                          onValueChange={setMentionSearch}
                                        />
                                        <CommandList>
                                          <CommandEmpty>
                                            No people found.
                                          </CommandEmpty>
                                          <CommandGroup>
                                            {filteredPeople.map((person) => (
                                              <CommandItem
                                                key={person.id}
                                                onSelect={() =>
                                                  addMention(person)
                                                }
                                                className="flex items-center gap-2 cursor-pointer"
                                              >
                                                <Users className="h-4 w-4 text-slate-400" />
                                                <div className="flex flex-col">
                                                  <span className="font-medium">
                                                    {person.name}
                                                  </span>
                                                  <span className="text-xs text-slate-500">
                                                    •{person.role}
                                                  </span>
                                                </div>
                                              </CommandItem>
                                            ))}
                                          </CommandGroup>
                                        </CommandList>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </FormControl>
                              <FormDescription>
                                Type @ to mention people. Mentioned names will
                                appear in blue.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* File Upload */}
                        <FormField
                          control={form.control}
                          name="evidenceUrls"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Evidence (Optional)</FormLabel>
                              <FormControl>
                                <div className="space-y-4">
                                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                    <input
                                      ref={fileInputRef}
                                      type="file"
                                      multiple
                                      accept="image/*,.pdf,.doc,.docx"
                                      onChange={handleFileUpload}
                                      className="hidden"
                                    />
                                    <Camera className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                                    <p className="text-sm text-slate-600 mb-2">
                                      Upload images, documents, or other
                                      evidence
                                    </p>
                                    <p className="text-xs text-slate-500 mb-3">
                                      Max file size: 10MB. Supported formats:
                                      JPG, PNG, PDF, DOC, DOCX
                                    </p>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() =>
                                        fileInputRef.current?.click()
                                      }
                                      className="border-slate-300"
                                    >
                                      <Upload className="mr-2 h-4 w-4" />
                                      Choose Files
                                    </Button>
                                  </div>

                                  {/* Uploaded Files Preview */}
                                  {evidenceFiles.length > 0 && (
                                    <div className="space-y-3">
                                      <Label className="text-sm font-medium text-slate-700">
                                        Uploaded Evidence (
                                        {evidenceFiles.length})
                                      </Label>
                                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {evidenceFiles.map((fileObj) => (
                                          <div
                                            key={fileObj.id}
                                            className="relative group border border-slate-200 rounded-lg overflow-hidden bg-slate-50"
                                          >
                                            {fileObj.file.type.startsWith(
                                              'image/'
                                            ) ? (
                                              <div className="aspect-square relative">
                                                <img
                                                  src={
                                                    fileObj.preview ||
                                                    '/placeholder.svg'
                                                  }
                                                  alt={fileObj.file.name}
                                                  className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                              </div>
                                            ) : (
                                              <div className="aspect-square flex items-center justify-center bg-slate-100">
                                                <ImageIcon className="h-8 w-8 text-slate-400" />
                                              </div>
                                            )}

                                            <div className="p-2">
                                              <p
                                                className="text-xs text-slate-600 truncate"
                                                title={fileObj.file.name}
                                              >
                                                {fileObj.file.name}
                                              </p>
                                              <p className="text-xs text-slate-500">
                                                {(
                                                  fileObj.file.size /
                                                  1024 /
                                                  1024
                                                ).toFixed(2)}{' '}
                                                MB
                                              </p>
                                            </div>

                                            <button
                                              type="button"
                                              onClick={() =>
                                                removeFile(fileObj.id)
                                              }
                                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                              <X className="h-3 w-3" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* POSH Warning */}
                        {form.watch('category') === 'sexual-harassment' && (
                          <Alert className="border-red-200 bg-red-50">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <AlertTitle className="text-red-800">
                              POSH Complaint
                            </AlertTitle>
                            <AlertDescription className="text-red-700">
                              This complaint will be handled according to POSH
                              guidelines with utmost confidentiality and care.
                              You may also contact our dedicated POSH committee
                              directly.
                            </AlertDescription>
                          </Alert>
                        )}

                        <Button
                          type="submit"
                          disabled={isUploading}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          size="lg"
                        >
                          {isUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Submitting...
                            </>
                          ) : (
                            'Submit Complaint Securely'
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
