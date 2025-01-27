'use client';

import { useState, useTransition } from 'react';
// import { format } from 'date-fns';
import { CalendarIcon, Users, Bell, Paperclip } from 'lucide-react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Role } from '@prisma/client';
import { toggleNoticeApproval } from '@/app/actions';
import { toast } from 'sonner';
import Image from 'next/image';

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
  attachments: any;
  publishedBy: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function ViewNotice({
  notice,
  orgRole,
}: {
  notice: Notice;
  orgRole: Role;
}) {
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<Attachment | null>(null);

  const openImagePreview = (attachment: Attachment) => {
    setPreviewImage(attachment);
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  const [isPending, startTransition] = useTransition();

  const handleToggleApproval = async () => {
    startTransition(async () => {
      await toggleNoticeApproval(notice.id, notice.isNoticeApproved);
      toast.success(
        `Notice ${notice.isNoticeApproved ? 'Rejected' : ' Approved'}`
      );
    });
  };

  return (
    <Card className="w-full max-w-4xl ">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{notice.title}</CardTitle>
            <CardDescription>{notice.noticeType}</CardDescription>
          </div>
          <div className="space-x-5">
            {orgRole === 'ADMIN' ? (
              notice.isNoticeApproved ? (
                <Button
                  disabled={isPending}
                  onClick={handleToggleApproval}
                  variant="destructive"
                  className="bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
                >
                  {isPending ? 'Updating...' : 'Mark as Not Approved'}
                </Button>
              ) : (
                <Button
                  disabled={isPending}
                  onClick={handleToggleApproval}
                  variant="outline"
                  className="bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-600"
                >
                  {isPending ? 'Updating...' : 'Mark as Approve'}
                </Button>
              )
            ) : (
              <Badge
                variant={notice.isNoticeApproved ? 'secondary' : 'secondary'}
                className={cn(
                  notice.isNoticeApproved
                    ? 'text-green-500 bg-green-50 hover:bg-green-100'
                    : 'text-red-500 bg-red-50 hover:bg-red-100'
                )}
              >
                {notice.isNoticeApproved ? 'Approved' : 'Not Approve Yet'}
              </Badge>
            )}

            <Badge variant={notice.isPublished ? 'secondary' : 'secondary'}>
              {notice.isPublished ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {new Intl.DateTimeFormat('en-US').format(notice.startDate)} -{' '}
            {new Intl.DateTimeFormat('en-US').format(notice.endDate)}
          </span>
        </div>
        <div className="prose max-w-none whitespace-pre-wrap">
          {notice.content}
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Target Audience:
          </span>
          <div className="flex flex-wrap gap-2">
            {notice.targetAudience.map((audience) => (
              <Badge key={audience} variant="outline" className="capitalize">
                {audience}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Notifications:
            </span>
          </div>
          <div className="flex space-x-2">
            {notice.emailNotification && <Badge>Email</Badge>}
            {notice.pushNotification && <Badge>Push</Badge>}
            {notice.WhatsAppNotification && <Badge>In-App</Badge>}
          </div>
        </div>
        {notice.attachments.length > 0 && (
          <div>
            <Dialog
              open={isAttachmentsOpen}
              onOpenChange={setIsAttachmentsOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Paperclip className="mr-2 h-4 w-4" />
                  View Attachments ({notice.attachments.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Attachments</DialogTitle>
                  <DialogDescription>
                    Files attached to this notice
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {notice.attachments.map(
                    (attachment: Attachment, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Paperclip className="h-4 w-4" />
                        <div className="flex-grow">
                          <span>{attachment.name}</span>
                        </div>
                        {attachment.type.startsWith('image/') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openImagePreview(attachment)}
                          >
                            Preview
                          </Button>
                        )}
                      </div>
                    )
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {previewImage && (
          <Dialog open={!!previewImage} onOpenChange={closeImagePreview}>
            <DialogContent className="sm:max-w-[80vw] sm:max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>{previewImage.name}</DialogTitle>
              </DialogHeader>
              <div className="relative w-full h-[60vh]">
                <Image
                  src={previewImage.url || '/placeholder.svg'}
                  alt={previewImage.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div>
          Created At :{' '}
          {new Intl.DateTimeFormat('en-US').format(notice.createdAt)}
        </div>
        <div>Published By: {notice.publishedBy}</div>
      </CardFooter>
    </Card>
  );
}
