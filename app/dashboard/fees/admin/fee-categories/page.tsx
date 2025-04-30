import { Suspense } from 'react';
// import { FeeCategoryList } from '@/components/fee-categories/fee-category-list';
// import { FeeCategoryFormSkeleton } from '@/components/fee-categories/fee-category-form-skeleton';
// import { getOrganizations } from '@/lib/data/organizations';
import { FeeCategoryForm } from '@/components/dashboard/Fees/FeeCategoryForm';
import { FeeCategoryList } from '@/components/dashboard/Fees/FeeCategoryList';

export default async function FeeCategoriesPage() {
  return (
    <div className=" ">
      <h1 className="text-lg md:text-3xl font-bold mb-4 mx-2 ">
        Fee Category Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 m-1">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Fee Category</h2>
            {/* <Suspense fallback={<FeeCategoryFormSkeleton />}> */}
            <FeeCategoryForm />
            {/* </Suspense> */}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Fee Categories</h2>
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center">
                  Loading fee categories...
                </div>
              }
            >
              <FeeCategoryList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
