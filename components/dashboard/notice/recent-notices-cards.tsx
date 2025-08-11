'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, ExternalLink } from 'lucide-react';
import { cn, formatDateIN } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

const getNoticeTypeColor = (type: string) => {
  switch (type) {
    case 'EXAM':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    case 'FEE':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    case 'GENERAL':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  }
};

interface Notice {
  id: string;
  noticeType: string;
  title: string;
  content: string;
  startDate: Date;
  publishedBy: string;
}

interface Props {
  recentNotices: Notice[];
  className?: string;
}

export function RecentNoticesCards({ className, recentNotices }: Props) {
  return (
    <Card className={cn('flex flex-col h-[40vh]', className)}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Bell className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Recent Notices
              </CardTitle>
              <CardDescription className="text-xs">
                Important announcements
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 text-xs"
          >
            View All <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-3 pr-2">
            {recentNotices.map((notice) => (
              <div
                key={notice.id}
                className="border rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {/* {notice.isUrgent && <Pin className="w-3 h-3 text-red-500" />} */}
                    <Badge
                      className={`${getNoticeTypeColor(
                        notice.noticeType
                      )} text-xs capitalize`}
                    >
                      {notice.noticeType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    {formatDateIN(notice.startDate)}
                  </div>
                </div>

                <h4 className="font-semibold text-sm mb-1 line-clamp-1">
                  {notice.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                  {notice.content}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    By: {notice.publishedBy}
                  </span>
                  <Link
                    className="text-xs h-6 px-2"
                    href={`/dashboard/notices/${notice.id}`}
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {recentNotices.length === 0 && (
            <div className="text-center  ">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No recent attendance records</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
