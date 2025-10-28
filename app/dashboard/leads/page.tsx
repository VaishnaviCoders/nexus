import { Suspense } from 'react';
import LeadTable from '@/components/dashboard/leads/leads-table';
import { getLeads } from '@/lib/data/leads/get-leads';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LeadDashboardStatsCards } from '@/components/dashboard/leads/lead-stats-cards';

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-20 bg-muted rounded" />
            <div className="h-8 w-8 bg-muted rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-7 w-16 bg-muted rounded mb-2" />
            <div className="h-3 w-24 bg-muted rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-6">
      <Suspense fallback={<StatsCardsSkeleton />}>
        <LeadDashboardStatsCards />
      </Suspense>
      <LeadTable leads={leads} />
    </div>
  );
}
