'use client';

import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, FileText, Loader2, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { formatFileSize, uploadToCloudinary } from '@/lib/cloudinary';
import { DOCUMENT_TYPE_LABELS } from '@/types/document';
import { toast } from 'sonner';
import { DocumentUploadFormData, documentUploadSchema } from '@/lib/schemas';
import { uploadStudentDocuments } from '@/app/actions';
import { DocumentType } from '@/lib/generated/prisma';

interface DocumentUploadFormProps {
  studentId: string;
}

export function DocumentUploadForm({ studentId }: DocumentUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<DocumentUploadFormData>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      note: '',
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      setSelectedFile(file);
      form.setValue('file', file);
      form.clearErrors('file');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue('file', file);
      form.clearErrors('file');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    form.setValue('file', undefined as any);
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const onSubmit = async (data: DocumentUploadFormData) => {
    try {
      console.log('Document Upload Data:', data);
      setIsUploading(true);
      const documentUrl = await uploadToCloudinary(data.file);

      console.log('Document URL:', documentUrl);

      await uploadStudentDocuments(data, documentUrl, studentId);

      toast.success('Document uploaded successfully', {
        description: `${DOCUMENT_TYPE_LABELS[data.type]} has been uploaded and is pending verification.`,
      });

      form.reset();
      setSelectedFile(null);
    } catch (error) {
      toast.error('Upload failed', {
        description:
          'There was an error uploading your document. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className="my-2 text-start">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Document Type Selection */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Document Type
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Choose the type of document you're uploading" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(DOCUMENT_TYPE_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value} className="py-3">
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Upload Area */}
          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Document File
                </FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {!selectedFile ? (
                      <div
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                          dragActive
                            ? 'border-primary bg-primary/5 scale-[1.02]'
                            : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          id="file-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.webp"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-4">
                          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <Upload className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <p className="text-lg font-medium mb-1">
                              {dragActive
                                ? 'Drop your file here'
                                : 'Drag & drop your file here'}
                            </p>
                            <p className="text-muted-foreground mb-4">
                              or{' '}
                              <span className="text-primary font-medium">
                                browse files
                              </span>
                            </p>
                            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                              <span className="px-2 py-1 bg-muted rounded">
                                PDF
                              </span>
                              <span className="px-2 py-1 bg-muted rounded">
                                JPEG
                              </span>
                              <span className="px-2 py-1 bg-muted rounded">
                                PNG
                              </span>
                              <span className="px-2 py-1 bg-muted rounded">
                                WebP
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Card className="border-2 border-primary/20 bg-primary/5 max-sm:max-w-md">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              {getFileIcon(selectedFile) ? (
                                <img
                                  src={
                                    getFileIcon(selectedFile)! ||
                                    '/placeholder.svg'
                                  }
                                  alt="Preview"
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                  <FileText className="h-6 w-6 text-primary" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {selectedFile.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(selectedFile.size)} •{' '}
                                {selectedFile.type}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={removeFile}
                                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Note Field */}
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Additional Notes
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any relevant information about this document..."
                    className="min-h-[100px] text-base resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Uploading Document...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Document
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
