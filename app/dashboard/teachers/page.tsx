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
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { AddTeacherForm } from '@/components/dashboard/teacher/AddTeacherForm';
import { TeacherManagementStatsCards } from '@/components/dashboard/teacher/TeacherManagementStatsCards';

async function getAllTeachers() {
  const organizationId = await getOrganizationId();
  const teachers = await prisma.teacher.findMany({
    where: {
      organizationId,
    },
    select: {
      id: true,
      employeeCode: true,
      isActive: true,
      employmentStatus: true,
      organizationId: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      profile: true,
      user: true,
    },
  });
  return teachers;
}
export default async function TeachersPage() {
  const teachers = await getAllTeachers();

  return (
    <div className="flex-1 space-y-4 px-2">
      {/* Header */}
      <Card className="py-4 px-2 flex items-center justify-between">
        <div>
          <CardTitle className="text-lg">Teachers</CardTitle>
          <CardDescription className="text-sm">
            Manage your teaching staff and their assignments
          </CardDescription>
        </div>
        <div className="flex justify-center items-center space-x-3">
          {/* <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button> */}

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

      <TeacherManagementStatsCards teachers={teachers} />

      <TeachersTable teachers={teachers} />
    </div>
  );
}
