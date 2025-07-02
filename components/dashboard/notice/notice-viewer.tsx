'use client';

import { useState, useTransition } from 'react';
import {
  CalendarRange,
  Users,
  Bell,
  Paperclip,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Calendar,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { formatDateIN } from '@/lib/utils';
import { toast } from 'sonner';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Role } from '@/lib/generated/prisma';
import { updateNoticeApprovalStatus } from '@/lib/data/notice/update-notice-approval-status';

type Attachment = {
  name: string;
  url: string;
  type: string;
  size: number;
};

interface Notice {
  id: string;
  noticeType: string;
  title: string;
  startDate: Date;
  endDate: Date;
  content: string;
  isNoticeApproved: boolean;
  isDraft: boolean;
  isPublished: boolean;
  emailNotification: boolean;
  pushNotification: boolean;
  WhatsAppNotification: boolean;
  targetAudience: string[];
  attachments: Attachment[];
  publishedBy: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function NoticeViewer({
  notice,
  userRole,
}: {
  notice: Notice;
  userRole: Role;
}) {
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const handleApprovalAction = async (approve: boolean) => {
    startTransition(async () => {
      await updateNoticeApprovalStatus(notice.id, approve);
      toast.success(
        approve ? 'Notice has been approved' : 'Notice has been rejected'
      );
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="border-b">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="font-medium">
                {notice.noticeType}
              </Badge>
              {notice.isNoticeApproved ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  Approved
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                >
                  Pending Approval
                </Badge>
              )}
              {notice.isPublished ? (
                <Badge variant="secondary">Published</Badge>
              ) : (
                <Badge variant="outline">Draft</Badge>
              )}
            </div>
            <CardTitle className="text-2xl">{notice.title}</CardTitle>
            <CardDescription className="mt-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDateIN(notice.startDate)} -{' '}
                {formatDateIN(notice.endDate)}
              </span>
            </CardDescription>
          </div>

          {userRole === 'ADMIN' && (
            <div className="flex gap-2">
              {notice.isNoticeApproved ? (
                <Button
                  disabled={isPending}
                  onClick={() => handleApprovalAction(false)}
                  variant="outline"
                  className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {isPending ? 'Processing...' : 'Reject Notice'}
                </Button>
              ) : (
                <Button
                  disabled={isPending}
                  onClick={() => handleApprovalAction(true)}
                  variant="outline"
                  className="border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isPending ? 'Processing...' : 'Approve Notice'}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Notice Content */}
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap">{notice.content}</div>
        </div>

        <Separator />

        {/* Target Audience */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 min-w-[140px]">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Target Audience:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {notice.targetAudience.map((audience) => (
              <Badge key={audience} variant="secondary" className="capitalize">
                {audience}
              </Badge>
            ))}
          </div>
        </div>

        {/* Notification Methods */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 min-w-[140px]">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Notifications:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {notice.emailNotification && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                Email
              </Badge>
            )}
            {notice.pushNotification && (
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 hover:bg-purple-100"
              >
                Push
              </Badge>
            )}
            {notice.WhatsAppNotification && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 hover:bg-green-100"
              >
                In-App
              </Badge>
            )}
            {!notice.emailNotification &&
              !notice.pushNotification &&
              !notice.WhatsAppNotification && (
                <span className="text-sm text-muted-foreground">None</span>
              )}
          </div>
        </div>

        {/* Attachments */}
        {notice.attachments.length > 0 && (
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() => setIsAttachmentsOpen(true)}
              className="flex items-center gap-2"
            >
              <Paperclip className="h-4 w-4" />
              View Attachments ({notice.attachments.length})
            </Button>

            <Dialog
              open={isAttachmentsOpen}
              onOpenChange={setIsAttachmentsOpen}
            >
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Attachments</DialogTitle>
                  <DialogDescription>
                    Files attached to this notice
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {notice.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-md border"
                    >
                      <div className="flex items-center gap-3">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium truncate max-w-[200px]">
                            {attachment.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {getFileSize(attachment.size)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {attachment.type.startsWith('image/') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewAttachment(attachment)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Preview</span>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={attachment.url}
                            download={attachment.name}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Image Preview Dialog */}
            <Dialog
              open={!!previewAttachment}
              onOpenChange={(open) => !open && setPreviewAttachment(null)}
            >
              <DialogContent className="sm:max-w-[80vw] max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>{previewAttachment?.name}</DialogTitle>
                </DialogHeader>
                <div className="relative w-full h-[60vh]">
                  {previewAttachment && (
                    <Image
                      src={previewAttachment.url || '/placeholder.svg'}
                      alt={previewAttachment.name}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
                <DialogFooter>
                  <Button variant="secondary" asChild>
                    <a
                      href={previewAttachment?.url || '#'}
                      download={previewAttachment?.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-4 flex flex-col sm:flex-row justify-between text-sm text-muted-foreground gap-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback>{getInitials(notice.publishedBy)}</AvatarFallback>
          </Avatar>
          <span>Published by: {notice.publishedBy}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarRange className="h-4 w-4" />
          <span>Created: {formatDateIN(notice.createdAt)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
