import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import StudentFilter from '@/components/dashboard/Student/StudentFilter';
import { searchParamsCache } from '@/lib/searchParams';
import { SearchParams } from 'nuqs';

import { getOrganization } from '@/lib/organization';

import FilterStudents from '@/lib/data/student/FilterStudents';
import { redirect } from 'next/navigation';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Students({ searchParams }: PageProps) {
  const [{ orgId, orgRole }, searchParamsParsed] = await Promise.all([
    getOrganization(),
    searchParamsCache.parse(searchParams),
  ]);

  const { search, sectionId, gradeId } = searchParamsParsed;

  const students = await FilterStudents({ search, gradeId, sectionId });

  if (orgRole === 'org:student' || orgRole === 'org:parent')
    redirect('/dashboard');

  return (
    <div className="px-2 space-y-3 ">
      <Card className="py-4 px-2 flex items-center justify-between   ">
        {/* //max-sm:flex-col max-sm:items-start max-sm:space-y-3 */}
        <div>
          <CardTitle>Students Management </CardTitle>
          <CardDescription>
            Add, edit, and track student information
          </CardDescription>
        </div>
        <div className="flex justify-center items-center space-x-3">
          <div className="hidden sm:block">
            <Link href="/dashboard/attendance/mark">
              <Button type="button">Take Attendance</Button>
            </Link>
          </div>
          <Link href="/dashboard/students/create">
            <Button type="button" variant="outline">
              Add New Student
            </Button>
          </Link>
        </div>
      </Card>

      <StudentFilter
        organizationId={orgId}
        initialStudents={students}
        initialGradeId={gradeId || 'all'}
        initialSectionId={sectionId || 'all'}
        initialSearch={search || ''}
      />
    </div>
  );
}
