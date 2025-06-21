import { Suspense } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getNoticesSummary } from '@/lib/data/parent/getParent-dashboard-stats';

async function NoticesSummaryContent() {
  const notices = await getNoticesSummary();

  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-medium">Recent Notices</CardTitle>
        <Bell className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {notices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No recent notices</p>
          </div>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              className="p-4 rounded-lg border bg-background/50 hover:bg-background/80 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-sm font-medium line-clamp-2">
                    {notice.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {notice.noticeType}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {notice.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Valid until: {new Date(notice.endDate).toLocaleDateString()}
                </div>
                <Link href={`/dashboard/notices/${notice.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                  >
                    Read More
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {notices.length > 0 && (
        <Link href="/dashboard/notices">
          <Button variant="outline" className="w-full mt-4 group">
            View All Notices
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </Link>
      )}
    </CardContent>
  );
}

function NoticesSummarySkeleton() {
  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="h-5 bg-muted rounded w-28 animate-pulse"></div>
        <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2 mb-3"></div>
            <div className="h-3 bg-muted rounded w-full"></div>
          </div>
        ))}
      </div>
    </CardContent>
  );
}

export function NoticesSummaryCard() {
  return (
    <Card className="border-0 bg-gradient-to-br from-card via-card to-purple-50/20 dark:to-purple-950/20">
      <Suspense fallback={<NoticesSummarySkeleton />}>
        <NoticesSummaryContent />
      </Suspense>
    </Card>
  );
}
