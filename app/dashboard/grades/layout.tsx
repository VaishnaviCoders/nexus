'use server';
import { GradesLayoutClient } from '@/components/dashboard/class-management/grades-layout-client';
import prisma from '@/lib/db';
import type React from 'react';
import { Suspense } from 'react';

export default async function GradesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const grades = await prisma.grade.findMany({
    select: {
      id: true,
      grade: true,
      _count: {
        select: {
          section: true, // Count of sections per grade
        },
      },
      section: {
        select: {
          _count: {
            select: {
              students: true, // Count of students per section
            },
          },
        },
      },
    },
  });

  // Transform data into GradeWithCounts format
  const gradesWithCounts = grades.map((grade) => ({
    id: grade.id,
    grade: grade.grade,
    sectionCount: grade._count.section,
    studentCount: grade.section.reduce(
      (acc, section) => acc + section._count.students,
      0
    ),
  }));

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 ">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Suspense fallback={<GradeListingSkeleton />}>
            <GradesLayoutClient initialGrades={gradesWithCounts} />
          </Suspense>
        </div>

        {/* Main Content */}
        <main className="lg:col-span-3 bg dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

function GradeListingSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-6">
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="w-20 h-6 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
        <div className="w-full h-10 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <div className="w-16 h-5 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
              <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
