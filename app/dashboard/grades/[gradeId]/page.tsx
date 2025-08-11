import { ArrowLeft, Trash2, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/db';
import { Separator } from '@/components/ui/separator';
import { AddSection } from '@/components/dashboard/class-management/AddSection';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

async function getGradeWithSections(gradeId: string) {
  const grade = await prisma.grade.findUnique({
    where: { id: gradeId },
    include: {
      section: {
        include: {
          students: true,
        },
        orderBy: {
          name: 'asc',
        },
      },
    },
  });
  return grade;
}

export default async function GradePage({
  params,
}: {
  params: Promise<{ gradeId: string }>;
}) {
  const { gradeId } = await params;
  const grade = await getGradeWithSections(gradeId);

  if (!grade) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Grade not found
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/50"
          >
            <Link href="/dashboard/grades">
              <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              Grade: {grade.grade}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage sections for {grade.grade}
            </p>
          </div>
        </div>
        <AddSection gradeId={gradeId} />
      </div>

      <Separator className="mb-6 bg-slate-200 dark:bg-slate-700" />

      <ScrollArea className="">
        {grade.section.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
              No sections created yet
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500 mt-1">
              Add a section to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {grade.section.map((section) => (
              <Card
                key={section.id}
                className="group hover:shadow-md transition-shadow duration-200 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {section.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Link
                        href={`/dashboard/grades/${gradeId}/${section.id}/delete`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{section.students.length} students</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>
                        Class Teacher:{' '}
                        {section.classTeacherId || 'Not Assigned'}
                      </span>
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-2 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400"
                    >
                      Section
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
