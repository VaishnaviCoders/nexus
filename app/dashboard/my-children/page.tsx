import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import getAllChildrenByParentId from '@/lib/actions/my-children-action';
import { ChildCard } from '@/components/dashboard/parent/ChildCard';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { Users, UserPlus, BookOpen, GraduationCap } from 'lucide-react';

const ParentChildrenDashboard = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  const parent = await prisma.parent.findUnique({
    where: {
      userId: userId,
    },
    select: {
      id: true,
    },
  });

  if (!parent) {
    return redirect('/dashboard'); // Not a registered parent
  }

  return (
    <div className="space-y-3">
      {/* Main Content Card */}
      <Card className="border-0  backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                Student Overview
              </CardTitle>
              <CardDescription className="text-sm mt-2">
                View and manage your children's information and academic
                progress
              </CardDescription>
            </div>
            <Badge variant="secondary" className="w-fit">
              <BookOpen className="h-4 w-4 mr-1" />
              Academic Year 2025-26
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-8">
          <ChildrenList parentId={parent.id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentChildrenDashboard;

async function ChildrenList({ parentId }: { parentId: string }) {
  const data = await getAllChildrenByParentId(parentId);

  if (!data || !data.students || data.students.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {data.students.length}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {data.students.length === 1 ? 'Child' : 'Children'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Children Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {data.students.map(({ student }) => (
          <div key={student.rollNumber} className="flex">
            <ChildCard child={student} />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
        <div className="relative p-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full">
          <Users className="h-16 w-16 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <h3 className="text-2xl font-semibold text-foreground">
          No Children Found
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          It looks like there are no children associated with your parent
          account yet. Contact the school administration to link your children's
          profiles.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Button className="gap-2" size="lg">
          <UserPlus className="h-4 w-4" />
          Contact School
        </Button>
        <Button variant="outline" size="lg">
          <BookOpen className="h-4 w-4 mr-2" />
          Learn More
        </Button>
      </div>

      {/* Help Section */}
      <div className="mt-12 p-6 bg-muted/50 rounded-lg border border-dashed border-muted-foreground/20 max-w-lg">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Need Help?
        </h4>
        <p className="text-sm text-muted-foreground">
          If you believe this is an error, please contact your school's
          administration office or check if your parent account has been
          properly linked to your children's records.
        </p>
      </div>
    </div>
  );
}
