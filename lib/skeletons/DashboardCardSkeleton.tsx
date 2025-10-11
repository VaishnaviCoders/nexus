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
    <Card className="animate-pulse p-4 border-gray-50 border-2 rounded-lg">
      <div className="flex justify-between items-center pb-2">
        <div className="font-medium text-sm w-52 bg-gray-200 rounded-lg h-8"></div>

        <div className="h-8 w-8 bg-gray-200 rounded"></div>
      </div>
      <CardContent className="flex-1 space-y-6 py-1">
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-gray-300 rounded col-span-2"></div>
          </div>
          <div className="h-2 bg-gray-300 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardFourGridsCardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card
          className="animate-pulse p-4 border-gray-50 border-2 rounded-lg"
          key={i}
        >
          <div className="flex justify-between items-center pb-2">
            <div className="font-medium text-sm w-52 bg-gray-200 rounded-lg h-8"></div>

            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
          <CardContent className="flex-1 space-y-6 py-1">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-gray-300 rounded col-span-2"></div>
              </div>
              <div className="h-2 bg-gray-300 rounded"></div>
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
