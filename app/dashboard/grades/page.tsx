import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Plus, BookOpen, Users } from 'lucide-react';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export const dynamic = 'force-dynamic';

const Page = async () => {
  const organizationId = await getOrganizationId();

  const grades = await prisma.grade.findMany({
    where: {
      organizationId: organizationId,
    },
    include: {
      section: {
        include: {
          students: true,
        },
      },
    },
  });

  const totalStudents = grades.reduce(
    (acc, grade) =>
      acc +
      grade.section.reduce(
        (sectionAcc, section) => sectionAcc + section.students.length,
        0
      ),
    0
  );

  const totalSections = grades.reduce(
    (acc, grade) => acc + grade.section.length,
    0
  );

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl space-y-6">
        {/* Welcome Card */}
        <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full w-fit">
              <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              {grades.length === 0
                ? 'Welcome to Class Management'
                : 'Select a Grade'}
            </CardTitle>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
              {grades.length === 0
                ? 'Get started by creating your first grade to organize students into classes and sections.'
                : 'Choose a grade from the sidebar to view and manage its sections and students.'}
            </p>
          </CardHeader>

          {grades.length > 0 && (
            <CardContent className="pt-0">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                        Total Grades
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {grades.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                      <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                        Total Sections
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {totalSections}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                        Total Students
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {totalStudents}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 text-sm sm:text-base"
                >
                  <GraduationCap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Select Grade from Sidebar
                </Button>
              </div>
            </CardContent>
          )}

          {grades.length === 0 && (
            <CardContent className="pt-0 text-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 text-sm sm:text-base"
              >
                <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Create Your First Grade
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Quick Tips */}

        <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span>
                  Create grades to organize students by academic level (e.g.,
                  Grade 1, Grade 2, etc.)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span>
                  Add sections within each grade to manage class divisions
                  (e.g., Section A, B, C)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span>
                  Enroll students into specific sections for better organization
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span>
                  Track attendance, fees, and academic progress for each student
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
