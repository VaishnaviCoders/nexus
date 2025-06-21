import { EmptyState } from '@/components/EmptyState';
import { FeeCategoryItem } from './FeeCategoryItem';
import { Activity, Pin, User } from 'lucide-react';
import { getFeeCategories } from '@/lib/data/fee/fee-categories';

export async function FeeCategoryList() {
  const categories = await getFeeCategories();

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <EmptyState
          title="No fee categories found"
          description="Create your first fee category to get started."
          icons={[User, Activity, Pin]}
          image="/EmptyStatePageNotFound.png"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {categories.map((category) => (
          <FeeCategoryItem key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
