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
  AlertTriangle,
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
import { formatBytes, formatDateIN } from '@/lib/utils';
import { toast } from 'sonner';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Role } from '@/generated/prisma/enums';
import { updateNoticeApprovalStatus } from '@/lib/data/notice/update-notice-approval-status';
import { Prisma } from '@/generated/prisma/client';

export type NoticeWithAttachments = Prisma.NoticeGetPayload<{
  include: { attachments: true };
}>;

interface PreviewAttachment {
  fileName: string;
  fileUrl: string;
  fileType: string;
}

export default function NoticeViewer({
  notice,
  userRole,
}: {
  notice: NoticeWithAttachments;
  userRole: Role;
}) {
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false);
  const [previewAttachment, setPreviewAttachment] =
    useState<PreviewAttachment | null>(null);
  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const handleApprovalAction = async (approve: boolean) => {
    setAction(approve ? 'approve' : 'reject');
    startTransition(async () => {
      try {
        await updateNoticeApprovalStatus(notice.id, approve);
        toast.success(
          approve ? 'Notice has been approved' : 'Notice has been rejected'
        );
      } catch (error) {
        toast.error('An error occurred. Please try again.');
      } finally {
        setAction(null);
      }
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

  const isImageFile = (fileType: string) => fileType.startsWith('image/');

  const handleImagePreview = (attachment: PreviewAttachment) => {
    setPreviewAttachment({
      fileName: attachment.fileName,
      fileUrl: attachment.fileUrl,
      fileType: attachment.fileType,
    });
  };

  return (
    <Card className="w-full shadow-sm ">
      <CardHeader className="border-b bg-gray-50/50">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge
                variant={notice.noticeType}
                className="font-medium text-xs uppercase tracking-wide"
              >
                {notice.noticeType}
              </Badge>

              <Badge className="text-xs" variant={notice.priority}>
                {notice.priority}
              </Badge>

              {notice.isUrgent && (
                <Badge variant={notice.priority}>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  URGENT
                </Badge>
              )}

              <Badge
                className={`text-xs ${notice.approvedBy ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
              >
                {notice.approvedBy ? 'Approved' : 'Pending Approval'}
              </Badge>

              <Badge className="text-xs" variant={notice.status}>
                {notice.status}
              </Badge>
            </div>

            {/* Title and Description */}
            <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-900 leading-tight mb-2">
              {notice.title}
            </CardTitle>

            <CardDescription className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDateIN(notice.startDate)} -{' '}
                {formatDateIN(notice.endDate)}
              </span>
            </CardDescription>
          </div>

          {/* Admin Actions */}
          {userRole === 'ADMIN' && notice.status === 'PENDING_REVIEW' && (
            <div className="flex gap-2">
              <Button
                disabled={isPending}
                onClick={() => handleApprovalAction(true)}
                size="sm"
                className="bg-green-100 hover:bg-green-200 text-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {isPending && action === 'approve'
                  ? 'Processing...'
                  : 'Approve & Publish'}
              </Button>
              <Button
                disabled={isPending}
                onClick={() => handleApprovalAction(false)}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircle className="mr-2 h-4 w-4" />
                {isPending && action === 'reject' ? 'Processing...' : 'Reject'}
              </Button>
            </div>
          )}

          {userRole === 'ADMIN' && notice.status === 'PUBLISHED' && (
            <Button
              disabled={isPending}
              onClick={() => handleApprovalAction(false)}
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <XCircle className="mr-2 h-4 w-4" />
              {isPending ? 'Processing...' : 'Revoke Approval'}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Notice Content */}
        <div className="prose prose-gray max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {notice.content}
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {notice.summary}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Target Audience */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Notice For
            </span>
          </div>
          <div className="flex flex-wrap gap-2 ml-6">
            {notice.targetAudience.map((audience) => (
              <Badge
                key={audience}
                variant="secondary"
                className="capitalize text-xs bg-blue-50 text-blue-700"
              >
                {audience}
              </Badge>
            ))}
          </div>
        </div>
        {/* Notification Methods */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Notification Methods
            </span>
          </div>
          <div className="flex flex-wrap gap-2 ml-6">
            {notice.emailNotification && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 text-xs"
              >
                Email
              </Badge>
            )}
            {notice.pushNotification && (
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 text-xs"
              >
                Push
              </Badge>
            )}
            {notice.whatsAppNotification && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 text-xs"
              >
                WhatsApp
              </Badge>
            )}
            {notice.smsNotification && (
              <Badge
                variant="outline"
                className="bg-orange-50 text-orange-700 text-xs"
              >
                SMS
              </Badge>
            )}
            {!notice.emailNotification &&
              !notice.pushNotification &&
              !notice.whatsAppNotification &&
              !notice.smsNotification && (
                <span className="text-sm text-gray-500">None selected</span>
              )}
          </div>
        </div>

        {/* Attachments */}
        {notice.attachments.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Attachments
              </span>
            </div>
            <div className="ml-6">
              <Button
                variant="outline"
                onClick={() => setIsAttachmentsOpen(true)}
                className="text-sm"
              >
                <Paperclip className="h-4 w-4 mr-2" />
                View All Attachments ({notice.attachments.length})
              </Button>
            </div>

            {/* Attachments Dialog */}
            <Dialog
              open={isAttachmentsOpen}
              onOpenChange={setIsAttachmentsOpen}
            >
              <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Attachments</DialogTitle>
                  <DialogDescription>
                    Files attached to this notice
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-4">
                  {notice.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-gray-50/50"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Paperclip className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {attachment.fileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatBytes(attachment.fileSize)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-2">
                        {isImageFile(attachment.fileType) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleImagePreview(attachment)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <a
                            href={attachment.fileUrl}
                            download={attachment.fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4" />
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
              <DialogContent className="sm:max-w-4xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="truncate">
                    {previewAttachment?.fileName}
                  </DialogTitle>
                </DialogHeader>
                <div className="relative w-full h-[60vh] bg-gray-50 rounded-lg overflow-hidden">
                  {previewAttachment && (
                    <Image
                      src={previewAttachment.fileUrl}
                      alt={previewAttachment.fileName}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" asChild>
                    <a
                      href={previewAttachment?.fileUrl || '#'}
                      download={previewAttachment?.fileName}
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

      <CardFooter className="border-t bg-gray-50/50 px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-gray-200">
                {getInitials(notice.publishedBy || notice.createdBy)}
              </AvatarFallback>
            </Avatar>
            <span>Published by: {notice.publishedBy || notice.createdBy}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4" />
            <span>Created: {formatDateIN(notice.createdAt)}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
