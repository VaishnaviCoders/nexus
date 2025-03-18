import React, { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import prisma from '@/lib/db';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Hash, Mail, Phone, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import SearchStudents from '@/app/components/dashboardComponents/SearchStudents';
import StudentFilter from '@/app/components/dashboardComponents/StudentFilter';
import { auth } from '@clerk/nextjs/server';
import { searchParamsCache } from '@/lib/searchParams';
import { SearchParams } from 'nuqs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';

export const dynamic = 'force-dynamic'; // Ensures dynamic rendering

interface Props {
  searchParams: Promise<SearchParams>;
}
export default async function Students({ searchParams }: Props) {
  const { orgId } = await auth();
  if (!orgId) return null;
  const parsedParams = await searchParamsCache.parse(searchParams);

  const page = parsedParams.pageIndex | 1;

  const limit = parsedParams.limit
    ? parseInt(parsedParams.limit.toString())
    : 10;

  // const skip = (+page - 1) * +limit;

  const students = await prisma.student.findMany({
    where: {
      organizationId: orgId,
      OR: parsedParams.q
        ? [
            { firstName: { contains: parsedParams.q, mode: 'insensitive' } },
            { lastName: { contains: parsedParams.q, mode: 'insensitive' } },
            { email: { contains: parsedParams.q, mode: 'insensitive' } },
            { rollNumber: { contains: parsedParams.q, mode: 'insensitive' } },
          ]
        : undefined,
      // firstName: parsedParams.q ?? undefined,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      section: true,
      grade: true,
    },
    skip: (page - 1) * 10,
    take: 10,
  });

  const totalStudents = await prisma.student.count({
    where: {
      organizationId: orgId,
      OR: parsedParams.q
        ? [
            { firstName: { contains: parsedParams.q, mode: 'insensitive' } },
            { lastName: { contains: parsedParams.q, mode: 'insensitive' } },
            { email: { contains: parsedParams.q, mode: 'insensitive' } },
            { rollNumber: { contains: parsedParams.q, mode: 'insensitive' } },
          ]
        : undefined,
    },
  });

  const totalPages = Math.max(1, Math.ceil(totalStudents / limit));

  console.log('Parsed Search Query', parsedParams.q);

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
          <Link href="/dashboard/student-attendance">
            <Button type="button">Take Attendance</Button>
          </Link>
        </div>
      </header>
      <Separator />
      <div className="flex flex-col sm:flex-row w-full justify-between sm:items-center gap-4 my-10">
        <SearchStudents />
        <div className="flex gap-2">
          <StudentFilter />
        </div>
      </div>
      {students && students.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Suspense fallback={<StudentLoading />}>
            {students.map((student) => (
              <Card
                key={student.id}
                className="overflow-hidden transition-all hover:shadow-md"
              >
                <CardHeader className="p-0">
                  <div className="bg-muted h-12"></div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-col items-center -mt-6 mb-4">
                    <Avatar className="h-16 w-16 border-4 border-background">
                      <AvatarImage
                        src={student.profileImage || ''}
                        alt={`${student.fullName} || ${student.firstName} ${student.lastName}`}
                      />
                      <AvatarFallback className="text-lg font-medium">
                        {`${student.firstName.charAt(0)}${student.lastName.charAt(0)}`}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium text-lg mt-2">{`${student.firstName}  ${student.lastName}`}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs font-normal">
                        {student.grade.grade}
                      </Badge>
                      {student.section && (
                        <Badge
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          {student.section.name}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">
                        Roll Number:
                      </span>
                      <span className="font-medium">{student.rollNumber}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{student.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <Link
                        href={`tel:${student.phoneNumber}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        {student.phoneNumber}
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Suspense>
        </div>
      ) : (
        <div className="flex justify-center items-center  my-5">
          <EmptyState
            title="No Students Found"
            description="No students found with the given search query."
            icons={[User, Mail, Phone]}
            image="/EmptyState.png"
            action={{
              label: 'Add New Student',
              href: '/dashboard/students/create',
            }}
          />
        </div>
      )}

      {students && students.length > 0 ? (
        <Pagination className="my-5">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`?pageIndex=${Math.max(1, page - 1)}`}
                aria-disabled={page <= 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <Link legacyBehavior href={`?page=${index + 1}`}>
                  <PaginationLink isActive={index + 1 === page}>
                    {index + 1}
                  </PaginationLink>
                </Link>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={`?pageIndex=${Math.min(page + 1, totalPages)}`}
                aria-disabled={page >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
}

const StudentLoading = () => {
  return (
    <div
      role="status"
      className="max-w-sm border border-gray-300 rounded-lg p-4 cursor-not-allowed"
    >
      <div className="animate-pulse w-full bg-gray-300 h-48 rounded-lg mb-5 flex justify-center items-center">
        <svg
          className="w-8 h-8 stroke-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.5499 15.15L19.8781 14.7863C17.4132 13.4517 16.1808 12.7844 14.9244 13.0211C13.6681 13.2578 12.763 14.3279 10.9528 16.4679L7.49988 20.55M3.89988 17.85L5.53708 16.2384C6.57495 15.2167 7.09388 14.7059 7.73433 14.5134C7.98012 14.4396 8.2352 14.4011 8.49185 14.3993C9.16057 14.3944 9.80701 14.7296 11.0999 15.4M11.9999 21C12.3154 21 12.6509 21 12.9999 21C16.7711 21 18.6567 21 19.8283 19.8284C20.9999 18.6569 20.9999 16.7728 20.9999 13.0046C20.9999 12.6828 20.9999 12.3482 20.9999 12C20.9999 11.6845 20.9999 11.3491 20.9999 11.0002C20.9999 7.22883 20.9999 5.34316 19.8283 4.17158C18.6568 3 16.7711 3 12.9998 3H10.9999C7.22865 3 5.34303 3 4.17145 4.17157C2.99988 5.34315 2.99988 7.22877 2.99988 11C2.99988 11.349 2.99988 11.6845 2.99988 12C2.99988 12.3155 2.99988 12.651 2.99988 13C2.99988 16.7712 2.99988 18.6569 4.17145 19.8284C5.34303 21 7.22921 21 11.0016 21C11.3654 21 11.7021 21 11.9999 21ZM7.01353 8.85C7.01353 9.84411 7.81942 10.65 8.81354 10.65C9.80765 10.65 10.6135 9.84411 10.6135 8.85C10.6135 7.85589 9.80765 7.05 8.81354 7.05C7.81942 7.05 7.01353 7.85589 7.01353 8.85Z"
            stroke="strokeCurrent"
            strokeWidth="1.6"
            strokeLinecap="round"
          ></path>
        </svg>
      </div>
      <div className=" w-full flex justify-between items-start animate-pulse">
        <div className="block">
          <h3 className="h-3 bg-gray-300 rounded-full  w-48 mb-4"></h3>
          <p className="h-2 bg-gray-300 rounded-full w-32 mb-2.5"></p>
        </div>
      </div>
      <span className="h-2 bg-gray-300 rounded-full max-md:w-12 w-16 "></span>
    </div>
  );
};

{
  /* <Card
key={student.id}
className="overflow-hidden transition-all duration-300 hover:shadow-lg p-4"
>
<CardContent className="p-0">
  <div className="relative">
    <Image
      src={student?.profileImage || '/vercel.svg'}
      alt="student"
      width={500}
      height={500}
      className="w-full h-48 object-cover rounded-lg"
    />
    <div className="absolute top-0 right-0 bg-white bg-opacity-90 h-10 m-2 rounded-full flex justify-center items-center">
      <span className="text-sm font-semibold ">
        {student.grade.grade}
      </span>
    </div>
  </div>
  <div className="py-2">
    <h3 className="font-semibold text-lg mb-1">
      {student.firstName} {student.lastName}
    </h3>
    <p className="text-sm text-muted-foreground mb-2">
      Section {student.section?.name}
    </p>
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Award className="h-4 w-4 text-yellow-500 mr-1" />
        <span className="text-sm font-medium">
          GPA: {student.lastName || '-'}
        </span>
      </div>
      <Link href={`/dashboard/students/${student.id}`}>
        <Button variant="outline" size="sm">
          View Profile
        </Button>
      </Link>
    </div>
  </div>
</CardContent>
</Card> */
}
