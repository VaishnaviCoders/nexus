import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

export const getTeacherStatusBadge = (
  isActive: boolean,
  employmentStatus: string
) => {
  if (!isActive) {
    return <Badge variant="secondary">Inactive</Badge>;
  }

  switch (employmentStatus) {
    case 'ACTIVE':
      return (
        <Badge variant="default" className="bg-green-500">
          Active
        </Badge>
      );
    case 'ON_LEAVE':
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-600">
          On Leave
        </Badge>
      );
    case 'PROBATION':
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-600">
          Probation
        </Badge>
      );
    case 'SUSPENDED':
      return <Badge variant="destructive">Suspended</Badge>;
    default:
      return <Badge variant="secondary">{employmentStatus}</Badge>;
  }
};
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
