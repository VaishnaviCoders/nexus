import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

import StudentFilter from '@/components/dashboard/Student/StudentFilter';
import { searchParamsCache } from '@/lib/searchParams';
import { SearchParams } from 'nuqs';

import { getOrganizationId } from '@/lib/organization';

import FilterStudents from '@/lib/data/student/FilterStudents';

export const revalidate = 30; // or 'force-cache' if data doesn't change often

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Students({ searchParams }: PageProps) {
  const orgId = await getOrganizationId();

  const { search, sectionId, gradeId } = await searchParamsCache.parse(
    searchParams
  );

  const students = await FilterStudents({ search, gradeId, sectionId });
  return (
    <div className="p-4 ">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Students </h1>
        <div className="flex gap-2">
          <Link href="/dashboard/students/create">
            <Button type="button" variant="outline">
              Add New Student
            </Button>
          </Link>
          <Link href="/dashboard/attendance/mark">
            <Button type="button">Take Attendance</Button>
          </Link>
        </div>
      </header>
      <Separator />

      <StudentFilter organizationId={orgId} initialStudents={students} />
    </div>
  );
}
