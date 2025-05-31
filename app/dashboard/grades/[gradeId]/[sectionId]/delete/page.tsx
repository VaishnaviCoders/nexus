import { deleteSection } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import prisma from '@/lib/db';
import { DeleteSectionButton } from '@/lib/SubmitButton';
import { AlertTriangle, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default async function SectionDeleteRoute({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}) {
  const { sectionId } = await params;

  const section = await prisma.section.findUnique({
    where: {
      id: sectionId,
    },
    select: {
      name: true,
      _count: {
        select: {
          students: true, // Count students in the section
          StudentAttendance: true, // Count attendance records
        },
      },
    },
  });

  if (!section) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Section Not Found</CardTitle>
            <CardDescription>
              The grade you're trying to delete doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link href="/dashboard/grades">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Grades
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const totalStudents = section._count.students;
  const totalAttendanceRecords = section._count.StudentAttendance;

  console.log('totalStudents', totalStudents);

  return (
    <div className="flex justify-center items-center w-full p-4">
      <Card className="max-w-2xl w-full border-red-200 dark:border-red-800 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-t-lg border-b border-red-200/30 dark:border-red-800/30">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">
                Delete {section.name}
              </CardTitle>
              <CardDescription className="text-base text-slate-700 dark:text-slate-300">
                This action cannot be undone. This will permanently delete{' '}
                <Badge variant="destructive" className="mx-1">
                  {section.name}
                </Badge>{' '}
                and all its associated data.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            What will be deleted:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Trash2 className="h-4 w-4 text-red-500" />
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  Students
                </span>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {totalStudents}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {totalStudents === 1 ? 'student record' : 'student records'}{' '}
                will be removed
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Trash2 className="h-4 w-4 text-red-500" />
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  Attendance
                </span>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {totalAttendanceRecords}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Attendance will be removed
              </p>
            </div>
          </div>

          {totalStudents > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    Warning
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Deleting this section will permanently remove all associated
                    student records, attendance, fees, assignments, and academic
                    history. Consider reassigning students to another section if
                    needed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <CardFooter className="justify-end flex gap-3 items-center">
          <Link href="/dashboard/grades">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <form action={deleteSection}>
            <input type="hidden" name="sectionId" value={sectionId} />
            <DeleteSectionButton />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
