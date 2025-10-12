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
// import { TeachingAssignmentStatsCards } from "@/components/dashboard/teaching-assignments/TeachingAssignmentStatsCards"
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import TeachingAssignmentsTable from '@/components/dashboard/teacher/TeachingAssignmentsTable';
import { AddTeachingAssignmentForm } from '@/components/dashboard/teacher/AddTeachingAssignmentForm';

async function getAllTeachingAssignments() {
  const organizationId = await getOrganizationId();

  const assignments = await prisma.teachingAssignment.findMany({
    where: {
      organizationId,
    },
    include: {
      teacher: {
        include: {
          user: true,
        },
      },
      subject: true,
      grade: true,
      section: true,
      academicYear: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return assignments;
}

async function getFormData() {
  const organizationId = await getOrganizationId();

  const [teachers, subjects, grades, academicYears] = await Promise.all([
    prisma.teacher.findMany({
      where: { organizationId, isActive: true },
      include: { user: true },
    }),
    prisma.subject.findMany({
      where: { organizationId },
    }),
    prisma.grade.findMany({
      where: { organizationId },
      include: {
        section: true,
      },
    }),
    prisma.academicYear.findMany({
      where: { organizationId },
      orderBy: { isCurrent: 'desc' },
    }),
  ]);

  return { teachers, subjects, grades, academicYears };
}

export default async function TeachingAssignmentsPage() {
  const assignments = await getAllTeachingAssignments();
  const formData = await getFormData();

  return (
    <div className="flex-1 space-y-4 px-2">
      {/* Header */}
      <Card className="py-4 px-2 flex items-center justify-between">
        <div>
          <CardTitle className="text-lg">Teaching Assignments</CardTitle>
          <CardDescription className="text-sm">
            Manage teacher-subject assignments across grades and sections
          </CardDescription>
        </div>
        <div className="flex justify-center items-center space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Teaching Assignment</DialogTitle>
                <DialogDescription>
                  Assign a teacher to teach a specific subject for a grade and
                  section.
                </DialogDescription>
              </DialogHeader>
              <AddTeachingAssignmentForm formData={formData} />
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* <TeachingAssignmentStatsCards assignments={assignments} /> */}
      <TeachingAssignmentsTable assignments={assignments} formData={formData} />
    </div>
  );
}
