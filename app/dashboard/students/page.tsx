import React, { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

import StudentFilter from '@/components/dashboard/Student/StudentFilter';
import { searchParamsCache } from '@/lib/searchParams';
import { SearchParams } from 'nuqs';

import { getOrganizationId, getOrganizationUserRole } from '@/lib/organization';

import FilterStudents from '@/lib/data/student/FilterStudents';
import { Skeleton } from '@/components/ui/skeleton';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';

export const revalidate = 30; // or 'force-cache' if data doesn't change often

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Students({ searchParams }: PageProps) {
  const orgId = await getOrganizationId();

  const { search, sectionId, gradeId } =
    await searchParamsCache.parse(searchParams);

  const students = await FilterStudents({ search, gradeId, sectionId });

  const { orgRole } = await getOrganizationUserRole();

  if (orgRole === 'org:student' || orgRole === 'org:parent')
    redirect('/dashboard');
  return (
    <div className="p-4 space-y-3 ">
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

      <Separator />

      <Suspense fallback={<Skeleton className="container mx-auto h-56" />}>
        <StudentFilter organizationId={orgId} initialStudents={students} />
      </Suspense>
    </div>
  );
}
