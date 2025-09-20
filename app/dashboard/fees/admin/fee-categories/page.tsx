import { Suspense } from 'react';

import { FeeCategoryForm } from '@/components/dashboard/Fees/FeeCategoryForm';
import { FeeCategoryList } from '@/components/dashboard/Fees/FeeCategoryList';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

export default async function FeeCategoriesPage() {
  return (
    <div className="px-2 space-y-3">
      <Card className="flex items-center justify-between p-6">
        <div>
          <CardTitle>Fee Category Management</CardTitle>
          <CardDescription>
            Manage fee categories for your organization
          </CardDescription>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 m-1">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Fee Category</h2>
            <Suspense fallback={<FeeCategoryFormSkeleton />}>
              <FeeCategoryForm />
            </Suspense>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold mb-4">Fee Categories</h2>
            <Suspense fallback={<FeeCategoryFormSkeleton />}>
              <FeeCategoryList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeeCategoryFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-5 bg-muted rounded w-32"></div>
            <div className="h-4 bg-muted rounded w-48"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
