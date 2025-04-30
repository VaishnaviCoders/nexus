import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { EditFeeCategoryForm } from '@/components/dashboard/Fees/EditFeeCategoryForm';
import { getFeeCategory } from '@/lib/data/fee/fee-categories';

export default async function EditFeeCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await getFeeCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Fee Category</h1>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          {/* <Suspense fallback={<FeeCategoryFormSkeleton />}> */}
          <EditFeeCategoryForm category={category} />
          {/* </Suspense> */}
        </div>
      </div>
    </div>
  );
}
