'use client';

import { useState } from 'react';
import { format } from 'date-fns';
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

  inAppNotification: boolean;
  targetAudience: string[];
  attachments: any;
  publishedBy: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function ViewNotice({ notice }: { notice: Notice }) {
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{notice.title}</CardTitle>
            <CardDescription>{notice.noticeType}</CardDescription>
          </div>
          <Badge variant={notice.isPublished ? 'default' : 'secondary'}>
            {notice.isPublished ? 'Published' : 'Draft'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {format(new Date(notice.startDate), 'PPP')} -{' '}
            {format(new Date(notice.endDate), 'PPP')}
          </span>
        </div>
        <div className="prose max-w-none">{notice.content}</div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Target Audience:
          </span>
          <div className="flex flex-wrap gap-2">
            {notice.targetAudience.map((audience) => (
              <Badge key={audience} variant="outline">
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
            {notice.inAppNotification && <Badge>In-App</Badge>}
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
                {/* <div className="grid gap-4 py-4">
                  {notice.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Paperclip className="h-4 w-4" />
                      <span>{attachment}</span>
                    </div>
                  ))}
                </div> */}
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div>Created: {format(new Date(notice.createdAt), 'PPP')}</div>
        <div>Last updated: {format(new Date(notice.updatedAt), 'PPP')}</div>
      </CardFooter>
    </Card>
  );
}
