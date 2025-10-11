import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import TeachersTable from '@/components/dashboard/teacher/TeachersTable';
import { AddTeacherForm } from '@/components/dashboard/teacher/AddTeacherForm';
import { TeacherManagementStatsCards } from '@/components/dashboard/teacher/TeacherManagementStatsCards';
import { getAllTeachers } from '@/lib/data/teacher/get-all-teachers';
import {
  TableSkeleton,
  DashboardFourGridsCardSkeleton,
} from '@/lib/skeletons/DashboardCardSkeleton';
import { Suspense } from 'react';

// This component will handle the data fetching for stats cards
async function TeacherStatsWithData() {
  const teachers = await getAllTeachers();
  return <TeacherManagementStatsCards teachers={teachers} />;
}

// This component will handle the data fetching for the table
async function TeachersTableWithData() {
  const teachers = await getAllTeachers();
  return <TeachersTable teachers={teachers} />;
}

export default async function TeachersPage() {
  return (
    <div className="flex-1 space-y-4 px-2">
      <Card className="py-4 px-2 flex items-center justify-between">
        <div>
          <CardTitle className="text-lg">Teachers</CardTitle>
          <CardDescription className="text-sm">
            Manage your teaching staff and their assignments
          </CardDescription>
        </div>
        <div className="flex justify-center items-center space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>
                  Create a new teacher profile with all necessary information.
                </DialogDescription>
              </DialogHeader>
              <AddTeacherForm />
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      <Suspense fallback={<DashboardFourGridsCardSkeleton />}>
        <TeacherStatsWithData />
      </Suspense>

      <Suspense
        fallback={
          <TableSkeleton
            columns={7}
            rows={6}
            hasAvatar={true}
            hasActions={true}
            searchBar={true}
            filters={2}
          />
        }
      >
        <TeachersTableWithData />
      </Suspense>
    </div>
  );
}
