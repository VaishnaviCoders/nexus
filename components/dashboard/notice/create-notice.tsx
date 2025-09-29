'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CalendarIcon,
  Upload,
  X,
  FileText,
  AlertCircle,
  Mail,
  Smartphone,
  SendHorizontal,
  Bell,
  MessageCircle,
  Phone,
  PhoneIcon,
  PhoneOffIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { createNoticeFormData, createNoticeSchema } from '@/lib/schemas';
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
import { createNotice } from '@/lib/data/notice/create-notice-action';
import { NoticeType, Role, NoticePriority } from '@/generated/prisma/enums';
import { Checkbox } from '@/components/ui/checkbox';
import { CloudinaryUploadResult, uploadToCloudinary } from '@/lib/cloudinary';

// https://www.diceui.com/docs/components/file-upload

export default function CreateNotice() {
  const [isPending, startTransition] = useTransition();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const form = useForm<createNoticeFormData>({
    resolver: zodResolver(createNoticeSchema),
    defaultValues: {
      title: '',
      content: '',
      summary: '',
      startDate: new Date(),
      endDate: new Date(),
      noticeType: 'GENERAL',
      priority: 'MEDIUM',
      isUrgent: false,
      emailNotification: true,
      pushNotification: false,
      whatsAppNotification: false,
      smsNotification: false,
      targetAudience: [],
      attachments: [],
    },
  });

  const isUrgent = form.watch('isUrgent');

  const onSubmit = async (data: createNoticeFormData) => {
    startTransition(async () => {
      try {
        const uploadedAttachments: CloudinaryUploadResult[] = await Promise.all(
          uploadedFiles.map(uploadToCloudinary)
        );

        await createNotice({ ...data, attachments: uploadedAttachments });
        toast.success('Notice created successfully!', {
          description: `The notice "${data.title}" has been created.`,
        });

        form.reset();
        setUploadedFiles([]);
      } catch (error) {
        console.error('Failed to create notice:', error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred';
        toast.error('Something went wrong', {
          description: errorMessage || 'Please try again later.',
        });
      }
    });
  };
  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  console.log('Frontend Form errors:', form.formState.errors);

  const audienceData: {
    id: Role;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: 'ADMIN', label: 'Admin', icon: '👑' },
    { id: 'TEACHER', label: 'Teacher', icon: '🧑‍🏫' },
    { id: 'STUDENT', label: 'Student', icon: '🎓' },
    { id: 'PARENT', label: 'Parent', icon: '👨‍👩‍👧' },
  ];

  return (
    <Card className="w-full max-w-7xl">
      <CardHeader className="space-y-1">
        <CardTitle>{'Create New Notice'}</CardTitle>
        <CardDescription>
          Fill in the details below to create a new notice for your
          organization.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-md font-medium">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter notice title..."
                          className="text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isUrgent"
                  render={({ field }) => (
                    <FormItem
                      className={`md:col-span-2 flex flex-row items-center justify-between rounded-lg border p-4 bg-red-50 border-red-300 transition-all duration-200 ${
                        isUrgent
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-red-50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          Mark as Urgent
                        </FormLabel>
                        <FormDescription>
                          Urgent notices will be highlighted and sent
                          immediately to all recipients.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="noticeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notice Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select notice type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(NoticeType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
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
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(NoticePriority).map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              <Badge variant={priority}>{priority}</Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief summary of the notice (optional)..."
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief summary that will be shown in previews and
                      notifications.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the full notice content..."
                        className="resize-none min-h-[120px]"
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The main content of your notice. You can include detailed
                      information here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Schedule & Duration */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-md font-medium">Schedule & Duration</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date *</FormLabel>
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
                                <span>Pick start date</span>
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
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date *</FormLabel>
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
                                <span>Pick end date</span>
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
                              date <
                                new Date(new Date().setHours(0, 0, 0, 0)) ||
                              (form.watch('startDate') &&
                                date < form.watch('startDate'))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Target Audience */}

            <FormField
              control={form.control}
              name="targetAudience"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Target Audience</FormLabel>
                    <FormDescription>
                      Select who should receive this notice
                    </FormDescription>
                  </div>
                  <div className="flex space-x-3 w-full ">
                    {audienceData.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="targetAudience"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
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

            <Separator />

            {/* Notifications */}
            <div className="space-y-6">
              <h3 className="text-md font-medium">Notification Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emailNotification"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-red-100 rounded-full p-3">
                          <Mail className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Email Notification
                          </FormLabel>
                          <FormDescription>Send via email</FormDescription>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pushNotification"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-amber-100 rounded-full p-3">
                          <Bell className="w-5 h-5 text-amber-500" />
                        </div>
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Push Notification
                          </FormLabel>
                          <FormDescription>
                            Send push notification
                          </FormDescription>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsAppNotification"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 rounded-full p-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="23"
                            height="23"
                            fill="#22c55e"
                            viewBox="0 0 16 16"
                          >
                            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                          </svg>
                        </div>
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">WhatsApp</FormLabel>
                          <FormDescription>Send via WhatsApp</FormDescription>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smsNotification"
                  render={({ field }) => (
                    <FormItem className="flex  flex-row items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4 ">
                        <div className="bg-blue-100 rounded-full p-3">
                          <Smartphone className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">SMS</FormLabel>
                          <FormDescription>Send via SMS</FormDescription>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* File Attachments */}

            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem className="">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Attachments</FormLabel>
                    <FormDescription>
                      Upload Notice Related Attachments{' '}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <FileUpload
                      maxFiles={4}
                      maxSize={5 * 1024 * 1024}
                      className="w-full "
                      value={uploadedFiles}
                      onValueChange={setUploadedFiles}
                      onFileReject={onFileReject}
                      multiple
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
                        {uploadedFiles.map((file, index) => (
                          <FileUploadItem key={index} value={file}>
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
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <Button disabled={isPending} className="flex-1 ">
              {isPending ? 'Submitting...' : 'Submit for Approval'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
