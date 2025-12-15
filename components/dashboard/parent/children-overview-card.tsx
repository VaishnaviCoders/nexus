import { Suspense } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, GraduationCap } from 'lucide-react';
import { formatCurrencyIN } from '@/lib/utils';
import { getChildrenOverview } from '@/lib/data/parent/getParent-dashboard-stats';

async function ChildrenOverviewContent() {
  const children = await getChildrenOverview();

  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-medium">My Children</CardTitle>
        <Users className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {children.map((child) => (
          <div
            key={child.id}
            className="flex items-center space-x-4 p-3 rounded-lg border bg-background/50 hover:bg-background/80 transition-colors"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={child.profileImage || ''} alt={child.name} className='object-cover' />
              <AvatarFallback>
                {child.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">{child.name}</p>
                <Badge
                  variant="outline"
                  className={`text-xs ${child.todayAttendance === 'PRESENT'
                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300'
                    : child.todayAttendance === 'ABSENT'
                      ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300'
                      : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300'
                    }`}
                >
                  {child.todayAttendance === 'NOT_MARKED'
                    ? 'Not Marked'
                    : child.todayAttendance}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  Grade {child.grade}-{child.section}
                </div>
                <span>Roll: {child.rollNumber}</span>
                <span>{child.attendancePercentage}% attendance</span>
              </div>

              {child.pendingFees > 0 && (
                <div className="text-xs text-orange-600 dark:text-orange-400">
                  ₹{formatCurrencyIN(child.pendingFees)} pending fees
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  );
}

function ChildrenOverviewSkeleton() {
  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="h-5 bg-muted rounded w-24 animate-pulse"></div>
        <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 p-3 animate-pulse"
          >
            <div className="h-12 w-12 bg-muted rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="h-3 bg-muted rounded w-48"></div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  );
}

export function ChildrenOverviewCard() {
  return (
    <Card className="border-0 ">
      <Suspense fallback={<ChildrenOverviewSkeleton />}>
        <ChildrenOverviewContent />
      </Suspense>
    </Card>
  );
}
