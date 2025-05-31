import { deleteGrade } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DeleteGradeButton } from '@/lib/SubmitButton';
import { AlertTriangle, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/db';
import { Badge } from '@/components/ui/badge';

export default async function DeleteGradePage({
  params,
}: {
  params: Promise<{ gradeId: string }>;
}) {
  const { gradeId } = await params;

  // Fetch grade details for better UX
  const grade = await prisma.grade.findUnique({
    where: { id: gradeId },
    select: {
      id: true,
      grade: true,
      section: {
        select: {
          id: true,
          name: true,
          _count: {
            select: { students: true }, // Count students per section
          },
        },
      },
    },
  });

  if (!grade) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Grade Not Found</CardTitle>
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

  const totalStudents = grade.section.reduce(
    (sum, section) => sum + section._count.students,
    0
  );

  return (
    <div className="flex justify-center items-center h-full p-6">
      <Card className="max-w-2xl w-full border-red-200 dark:border-red-800 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-t-lg border-b border-red-200/30 dark:border-red-800/30">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">
                Delete {grade.grade}
              </CardTitle>
              <CardDescription className="text-base text-slate-700 dark:text-slate-300">
                This action cannot be undone. This will permanently delete{' '}
                <Badge variant="destructive" className="mx-1">
                  {grade.grade}
                </Badge>{' '}
                and all its associated data.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {/* Impact Summary */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            What will be deleted:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Trash2 className="h-4 w-4 text-red-500" />
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  Sections
                </span>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {grade.section.length}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                sections will be removed
              </p>
            </div>

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
                    Deleting this grade will also remove all student records,
                    attendance data, and academic history associated with these
                    students.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <CardFooter className="flex justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
          <Link href="/dashboard/grades" className="flex-1">
            <Button variant="outline" className="w-full" type="button">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </Link>
          <form action={deleteGrade} className="flex-1">
            <input type="hidden" name="gradeId" value={gradeId} />
            <DeleteGradeButton />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
