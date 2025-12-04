import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
export function DashboardCardSkeleton() {
  return (
    <Card className="">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 rounded w-20" />
          <Skeleton className="h-10 w-10 rounded  " />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-8 bg-muted rounded w-16" />
          <Skeleton className="h-2 bg-muted rounded" />
          <Skeleton className="h-3 bg-muted rounded w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardFourGridsCardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 rounded w-20" />
              <Skeleton className="h-10 w-10 rounded  " />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-8 bg-muted rounded w-16" />
              <Skeleton className="h-2 bg-muted rounded" />
              <Skeleton className="h-3 bg-muted rounded w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}



interface TableSkeletonProps {
  columns: number;
  rows?: number;
  hasAvatar?: boolean;
  hasActions?: boolean;
  searchBar?: boolean;
  filters?: number;
}

export function TableSkeleton({
  columns,
  rows = 5,
  hasAvatar = false,
  hasActions = true,
  searchBar = true,
  filters = 2,
}: TableSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Search and Filters Skeleton */}
      {searchBar && (
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          {Array.from({ length: filters }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-[140px]" />
          ))}
        </div>
      )}

      {/* Table Skeleton */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
              {hasActions && (
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    {colIndex === 0 && hasAvatar ? (
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    ) : (
                      <Skeleton className="h-4 w-full max-w-32" />
                    )}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 ml-auto" />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
