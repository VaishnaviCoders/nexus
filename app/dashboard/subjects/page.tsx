import { Suspense } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SubjectsTable } from '@/components/dashboard/subject/SubjectsTable';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddSubjectFormModal } from '@/components/dashboard/subject/AddSubjectFormModal';
import { getAllSubjectsByOrganizationId } from '@/lib/data/subjects/get-all-subjects-by-organization-id';

export default async function SubjectsPage() {
  const subjects = await getAllSubjectsByOrganizationId();

  return (
    <div className="px-2 space-y-2">
      <Card className="py-4 px-2 flex items-center justify-between">
        <div>
          <CardTitle className="text-lg">Subject Management</CardTitle>
          <CardDescription className="text-sm">
            Manage subjects for your organization
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
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>
                  Create a new subject with the required details.
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto px-1">
                <AddSubjectFormModal subjects={subjects} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading subjects...</div>}>
            <SubjectsTable initialSubjects={subjects} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
