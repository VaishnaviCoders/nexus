import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import getAllChildrenByParentId from '@/lib/actions/my-children-action';
import { ChildCard } from '@/app/components/dashboardComponents/ChildCard';

const parentId = 'cm838j5oe0009vhnoehp1elg6';

async function ChildrenList({ parentId }: { parentId: string }) {
  const data = await getAllChildrenByParentId(parentId);

  if (!data || !data.students || data.students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">No children found</h3>
        <p className="text-muted-foreground mt-1">
          There are no children associated with this account.
        </p>
      </div>
    );
  }
  return (
    <>
      {data.students.map(({ student }) => (
        <ChildCard key={student.rollNumber} child={student} />
      ))}
    </>
  );
}

const page = async () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>My Children</CardTitle>
          <CardDescription>
            View and manage your children's information
          </CardDescription>
          <CardContent className="p-0">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 my-5">
              <div className="max-w-xl">
                <ChildrenList parentId={parentId} />
              </div>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default page;
