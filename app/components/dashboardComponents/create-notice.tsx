'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Eye, Save, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createNotice } from '@/app/actions';
import { FileUploader } from '@/components/ui/file-uploader';

import { UploadedFilesCard } from '@/components/ui/uploaded-files-card';
import { useUploadFile } from '@/hooks/use-upload-file';
import { CreateNoticeFormSchema } from '@/lib/schemas';
import { toast } from 'sonner';
import { LoadingButton } from '@/components/loading-button';

type Attachment = {
  name: string;
  url: string;
  type: string;
  size: number;
};

const noticeTypes = [
  { value: 'holiday', label: 'Holiday' },
  { value: 'event', label: 'Event' },
  { value: 'ptm', label: 'Parent-Teacher Meeting' },
  { value: 'trip', label: 'School Trip' },
  { value: 'exam', label: 'Examination' },
  { value: 'announcement', label: 'General Announcement' },
];

const audienceOptions = [
  { id: 'all', label: 'All' },
  { id: 'students', label: 'Students' },
  { id: 'parents', label: 'Parents' },
  { id: 'teachers', label: 'Teachers' },
  { id: 'staff', label: 'Staff' },
];

export default function CreateNotice() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { onUpload, progresses, uploadedFiles, isUploading } = useUploadFile(
    'imageUploader',
    { defaultUploadedFiles: [] }
  );

  const form = useForm<z.infer<typeof CreateNoticeFormSchema>>({
    resolver: zodResolver(CreateNoticeFormSchema),
    defaultValues: {
      noticeType: '',
      title: '',
      startDate: new Date(),
      endDate: new Date(),
      content: '',
      isDraft: false,
      isPublished: false,
      emailNotification: true,
      pushNotification: true,
      inAppNotification: false,
      targetAudience: [],
      attachments: [],
    },
  });

  async function onSubmit(data: z.infer<typeof CreateNoticeFormSchema>) {
    try {
      // Ensure that attachments are correctly typed
      const attachments: Attachment[] = data.attachments || []; // Default to an empty array if attachments is undefined

      // Create a new notice with the updated attachments
      await createNotice({ ...data, attachments });
      toast.success('Notice created successfully');
      form.reset();
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    }
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Create New Notice</CardTitle>
        <CardDescription>
          Fill in the details to create a new notice for the school community.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="noticeType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notice Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a notice type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {noticeTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter notice title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
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
                            date < new Date() || date < new Date('1900-01-01')
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
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
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
                            date < new Date() || date < new Date('1900-01-01')
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
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the details of the notice"
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  {audienceOptions.map((item) => (
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
                                    ? field.onChange([...field.value, item.id])
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachments</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={field.value as any[]}
                      onValueChange={(files) => {
                        // Call onUpload to upload the files
                        onUpload(files).then((uploadedFiles) => {
                          // Ensure uploadedFiles is defined and has the expected structure
                          if (uploadedFiles) {
                            const attachments: Attachment[] = uploadedFiles.map(
                              (file) => ({
                                name: file.name,
                                url: file.url,
                                type: file.type,
                                size: file.size || 0,
                              })
                            );
                            field.onChange(attachments); // Update the form field with the attachments
                          }
                        });
                      }}
                      maxFileCount={8}
                      maxSize={4 * 1024 * 1024}
                      progresses={progresses}
                      // pass the onUpload function here for direct upload
                      // onUpload={uploadFiles}
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload any relevant documents or images
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {uploadedFiles.length > 0 ? (
              <UploadedFilesCard uploadedFiles={uploadedFiles} />
            ) : null}

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="emailNotification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Email Notification
                      </FormLabel>
                      <FormDescription>
                        Send this notice via email
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
                name="pushNotification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Push Notification
                      </FormLabel>
                      <FormDescription>
                        Send this notice as a push notification
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
                name="inAppNotification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        In-App Notification
                      </FormLabel>
                      <FormDescription>
                        Show this notice as an in-app notification
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
            </div>
            <div className="flex justify-between max-sm:flex-col max-sm:space-y-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.setValue('isPublished', false);
                  form.setValue('isDraft', true);
                }}
              >
                <Save className="mr-2 h-4 w-4" /> Save as Draft
              </Button>
              <div className="space-x-2 max-sm:flex justify-between">
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline">
                      <Eye className="mr-2 h-4 w-4" /> Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle>Notice Preview</DialogTitle>
                      <DialogDescription>
                        This is how your notice will appear to recipients.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 overflow-x-scroll">
                      <h3 className="text-lg font-semibold">
                        {form.watch('title')}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {format(form.watch('startDate'), 'PPP')} -{' '}
                        {format(form.watch('endDate'), 'PPP')}
                      </p>
                      <div className="my-4 whitespace-pre-wrap ">
                        {form.watch('content')}
                      </div>
                      {uploadedFiles.length > 0 ? (
                        <UploadedFilesCard uploadedFiles={uploadedFiles} />
                      ) : null}
                    </div>
                  </DialogContent>
                </Dialog>

                <LoadingButton
                  type="submit"
                  onClick={() => {
                    form.setValue('isPublished', true);
                    form.setValue('isDraft', false);
                  }}
                  action="create"
                  disabled={isUploading}
                >
                  <Send className="mr-2 h-4 w-4" /> Publish Notice
                </LoadingButton>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
