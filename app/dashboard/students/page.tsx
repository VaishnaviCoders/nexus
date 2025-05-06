import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import prisma from '@/lib/db';

import { Separator } from '@/components/ui/separator';

import StudentFilter from '@/app/components/dashboardComponents/StudentFilter';
import { searchParamsCache } from '@/lib/searchParams';
import { SearchParams } from 'nuqs';

import { getOrganizationId } from '@/lib/organization';
import StudentsGridList from '@/components/dashboard/Student/StudentsGridList';

export const dynamic = 'force-dynamic'; // Ensures dynamic rendering

type PageProps = {
  searchParams: Promise<SearchParams>;
};

interface FilterStudentsProps {
  search: string;
  gradeId?: string;
  sectionId?: string;
}

const FilterStudents = async ({
  search = '',
  gradeId,
  sectionId,
}: FilterStudentsProps) => {
  const orgId = await getOrganizationId();
  // console.log('FilterStudents inputs:', { orgId, search, gradeId, sectionId });

  // Initialize where clause with organizationId
  const where: any = {
    organizationId: orgId,
  };

  // Add search filter if provided and non-empty
  if (search && search.trim() !== '') {
    where.AND = [
      {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
          { rollNumber: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      },
    ];
  }

  // Add grade filter only if provided and not 'all'
  if (gradeId && gradeId !== 'all') {
    where.gradeId = gradeId;
  }

  // Add section filter only if provided and not 'all'
  if (sectionId && sectionId !== 'all') {
    where.sectionId = sectionId;
  }

  try {
    const students = await prisma.student.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        fullName: true,
        rollNumber: true,
        phoneNumber: true,
        email: true,
        profileImage: true,
        dateOfBirth: true,
        grade: {
          select: {
            id: true,
            grade: true,
          },
        },
        section: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      take: 100, // Limit results for performance
    });

    // console.log('Fetched students count:', students.length);
    // console.log('Where clause:', JSON.stringify(where, null, 2));
    return students;
  } catch (error) {
    console.error('Error filtering students:', error);
    throw new Error('Failed to fetch students');
  } finally {
    await prisma.$disconnect();
  }
};

export default async function Students({ searchParams }: PageProps) {
  const orgId = await getOrganizationId();

  const { rawSearchParams } = await searchParams;
  console.log('Raw searchParams:', JSON.stringify(rawSearchParams));

  const { search, sectionId, gradeId } = await searchParamsCache.parse(
    searchParams
  );

  console.log('Parsed searchParams:', { search, gradeId, sectionId });

  const students = await FilterStudents({
    search,
    gradeId,
    sectionId,
  });

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
          <Link href="/dashboard/attendance">
            <Button type="button">Take Attendance</Button>
          </Link>
        </div>
      </header>
      <Separator />

      <StudentFilter organizationId={orgId} />
      <StudentsGridList students={students} />
    </div>
  );
}
