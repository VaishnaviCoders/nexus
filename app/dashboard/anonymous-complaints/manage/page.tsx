import { Suspense } from 'react';
// import { ComplaintManagementDashboard } from '@/components/complaints/complaint-management-dashboard';
// import { getComplaintsWithFilters } from '@/lib/actions/complaint-actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ComplaintManagementDashboard } from '@/components/dashboard/anonymousComplaints/manage/complaint-management-dashboard';
import { getComplaintsWithFilters } from '@/lib/data/complaints/complaint-actions';

interface SearchParams {
  status?: string;
  severity?: string;
  category?: string;
  search?: string;
  page?: string;
  sort?: string;
  order?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function ComplaintManagementContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const {
    status,
    severity,
    category,
    search,
    page = '1',
    sort = 'submittedAt',
    order = 'desc',
  } = searchParams;

  const filters = {
    status: status || undefined,
    severity: severity || undefined,
    category: category || undefined,
    search: search || undefined,
    page: parseInt(page),
    sort,
    order: order as 'asc' | 'desc',
  };

  const complaintsData = await getComplaintsWithFilters(filters);

  return (
    <ComplaintManagementDashboard
      initialData={complaintsData}
      filters={filters}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function ComplaintManagePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className=" bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <Card>
        <CardHeader>
          <CardTitle>Complaint Management</CardTitle>
          <CardDescription>
            Manage and track all anonymous complaints with comprehensive tools
            and analytics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSkeleton />}>
            <ComplaintManagementContent searchParams={resolvedSearchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
